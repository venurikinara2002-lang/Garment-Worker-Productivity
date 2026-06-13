from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator, Field
from typing import Optional
import joblib
import numpy as np
import os
import pandas as pd

app = FastAPI(title="Garments AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models and encoders
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")

def load_model_data(path):
    data = joblib.load(path)
    return {
        "model": data["model"],
        "encoders": data["label_encoders"]
    }

sewing_data = load_model_data(os.path.join(MODEL_DIR, "model_sewing.pkl"))
finishing_data = load_model_data(os.path.join(MODEL_DIR, "model_finishing.pkl"))

model_sewing = sewing_data["model"]
model_finishing = finishing_data["model"]
encoders_sewing = sewing_data["encoders"]
encoders_finishing = finishing_data["encoders"]

print("Models and Encoders loaded successfully")


class PredictRequest(BaseModel):
    quarter: str
    department: str
    day: str
    team: Optional[int] = Field(default=1)
    targeted_productivity: float
    smv: float
    over_time: float
    incentive: float
    idle_time: float
    wip: float
    idle_men: int
    no_of_style_change: int
    no_of_workers: float
    month: Optional[int] = Field(default=1)
    day_of_month: Optional[int] = Field(default=1)

    @validator('department')
    def validate_department(cls, v):
        if v.lower() not in ['sewing', 'finishing']:
            raise ValueError('Department must be either Sewing or Finishing')
        return v.capitalize()

    @validator('targeted_productivity')
    def validate_productivity(cls, v):
        if v < 0 or v > 1.0:
            raise ValueError('Targeted productivity must be between 0 and 1.0')
        return v

    def validate_limits(self):
        dept = self.department.lower()
        if dept == "sewing":
            if self.smv > 51: raise ValueError("SMV for Sewing cannot exceed 51")
            if self.wip > 23122: raise ValueError("WIP for Sewing cannot exceed 23,122")
            if self.over_time > 25920: raise ValueError("Overtime for Sewing cannot exceed 25,920")
            if self.incentive > 138: raise ValueError("Incentive for Sewing cannot exceed 138")
            if self.idle_time > 150: raise ValueError("Idle time for Sewing cannot exceed 150")
            if self.idle_men > 40: raise ValueError("Idle men for Sewing cannot exceed 40")
            if self.no_of_style_change > 2: raise ValueError("Style changes for Sewing cannot exceed 2")
            if self.no_of_workers > 60: raise ValueError("Number of workers for Sewing cannot exceed 60")
        elif dept == "finishing":
            if self.smv > 5: raise ValueError("SMV for Finishing cannot exceed 5")
            if self.wip > 1194: raise ValueError("WIP for Finishing cannot exceed 1,194")
            if self.over_time > 15000: raise ValueError("Overtime for Finishing cannot exceed 15,000")
            if self.incentive > 3600: raise ValueError("Incentive for Finishing cannot exceed 3,600")
            if self.no_of_workers > 28: raise ValueError("Number of workers for Finishing cannot exceed 28")
            # Enforce defaults for Finishing
            # self.idle_time = 0 
            # self.idle_men = 0
            # self.no_of_style_change = 0
            # Note: Pydantic models are immutable by default in some versions or we might want to handle this in the logic
        return self


def encode_label(encoders, column, value):
    """Helper to encode a label using the stored LabelEncoder."""
    try:
        le = encoders[column]
        # Return the index if found, or default to 0 if not (should not happen with valid UI)
        if value in le.classes_:
            return int(le.transform([value])[0])
        # Case insensitive check
        classes_lower = [c.lower() for c in le.classes_]
        if value.lower() in classes_lower:
            idx = classes_lower.index(value.lower())
            return int(le.transform([le.classes_[idx]])[0])
        return 0
    except:
        return 0


def build_features(data: dict, encoders: dict, feature_names: list) -> list:
    """Build feature vector based on provided feature names."""
    
    mapping = {
        'quarter_encoded': encode_label(encoders, 'quarter', data["quarter"]),
        'department_encoded': encode_label(encoders, 'department', data["department"]),
        'day_encoded': encode_label(encoders, 'day', data["day"]),
        'team': data["team"],
        'targeted_productivity': data["targeted_productivity"],
        'smv': data["smv"],
        'over_time': data["over_time"],
        'incentive': data["incentive"],
        'idle_time': data["idle_time"],
        'wip': data["wip"],
        'idle_men': data["idle_men"],
        'no_of_style_change': data["no_of_style_change"],
        'no_of_workers': data["no_of_workers"],
        'month': data["month"],
        'day_of_month': data["day_of_month"],
    }
    
    features = [mapping[f] if f in mapping else 0 for f in feature_names]
    return features


def classify_prediction(pred: float, target: float) -> str:
    ratio = pred / target if target > 0 else 0
    if ratio < 0.7:
        return "Low"
    elif ratio < 0.9:
        return "Moderate"
    else:
        return "High"


def get_feature_importances(model, feature_names: list) -> list:
    """Return top 6 feature importances if available."""
    try:
        importances = model.feature_importances_
        paired = sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True)
        top6 = paired[:6]
        return [{"feature": f, "importance": float(imp)} for f, imp in top6]
    except AttributeError:
        return []


FEATURE_NAMES = [
    "quarter", "department", "day", "team", "targeted_productivity",
    "smv", "over_time", "incentive", "idle_time", "wip",
    "idle_men", "no_of_style_change", "no_of_workers", "month", "day_of_month",
]


@app.post("/predict")
def predict(req: PredictRequest):
    # Enforce department-specific limits
    try:
        req.validate_limits()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    data = req.dict()
    
    # Enforce Finishing defaults
    if req.department.lower() == "finishing":
        data["idle_time"] = 0.0
        data["idle_men"] = 0
        data["no_of_style_change"] = 0
    
    # Select model and its corresponding encoders
    if req.department.lower() == "sewing":
        primary_model = model_sewing
        primary_encoders = encoders_sewing
        secondary_model = model_finishing
        secondary_encoders = encoders_finishing
        secondary_dept = "Finishing"
    else:
        primary_model = model_finishing
        primary_encoders = encoders_finishing
        secondary_model = model_sewing
        secondary_encoders = encoders_sewing
        secondary_dept = "Sewing"

    # Build features for both (using their own encoders and feature sets)
    # Check if models have feature_names_in_ attribute
    primary_feat_names = getattr(primary_model, 'feature_names_in_', FEATURE_NAMES)
    secondary_feat_names = getattr(secondary_model, 'feature_names_in_', FEATURE_NAMES)

    X_primary = np.array([build_features(data, primary_encoders, primary_feat_names)])
    X_secondary = np.array([build_features(data, secondary_encoders, secondary_feat_names)])

    pred_primary = float(np.clip(primary_model.predict(X_primary)[0], 0, 1))
    pred_secondary = float(np.clip(secondary_model.predict(X_secondary)[0], 0, 1))

    prediction = pred_primary
    status = classify_prediction(prediction, req.targeted_productivity)

    # Department comparison
    dept_comparison = {
        req.department: round(pred_primary, 4),
        secondary_dept: round(pred_secondary, 4),
    }

    # Feature importances for primary model
    importances = get_feature_importances(primary_model, FEATURE_NAMES)

    return {
        "prediction": round(prediction, 4),
        "status": status,
        "extras": {
            "targeted_productivity": req.targeted_productivity,
            "dept_comparison": dept_comparison,
            "feature_importances": importances,
        },
    }


@app.get("/health")
def health():
    return {"status": "ok"}
