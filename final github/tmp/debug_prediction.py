
import joblib
import numpy as np
import os
import sys

# Add backend to path to import logic if feasible, 
# but better to just replicate the build_features logic to be sure.

QUARTER_MAP = {"Quarter1": 1, "Quarter2": 2, "Quarter3": 3, "Quarter4": 4}
DAY_MAP = {
    "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4,
    "Friday": 5, "Saturday": 6, "Sunday": 7,
}

def load_model_data(path):
    data = joblib.load(path)
    return {
        "model": data["model"],
        "encoders": data["label_encoders"]
    }

def encode_label(encoders, column, value):
    try:
        le = encoders[column]
        if value in le.classes_:
            return int(le.transform([value])[0])
        classes_lower = [c.lower() for c in le.classes_]
        if value.lower() in classes_lower:
            idx = classes_lower.index(value.lower())
            return int(le.transform([le.classes_[idx]])[0])
        return 0
    except:
        return 0

def build_features(data: dict, encoders: dict) -> list:
    features = [
        encode_label(encoders, 'quarter', data["quarter"]),
        encode_label(encoders, 'department', data["department"]),
        encode_label(encoders, 'day', data["day"]),
        data["team"],
        data["targeted_productivity"],
        data["smv"],
        data["over_time"],
        data["incentive"],
        data["idle_time"],
        data["wip"],
        data["idle_men"],
        data["no_of_style_change"],
        data["no_of_workers"],
        data["month"],
        data["day_of_month"],
    ]
    return features

def debug():
    backend_dir = r"c:\Users\DELL\Desktop\last\backend"
    model_dir = os.path.join(backend_dir, "models")
    
    print(f"Loading models from {model_dir}...")
    try:
        sewing_data = load_model_data(os.path.join(model_dir, "model_sewing.pkl"))
        model_sewing = sewing_data["model"]
        encoders_sewing = sewing_data["encoders"]
        print("Models loaded successfully")
    except Exception as e:
        print(f"Failed to load models: {e}")
        import traceback
        traceback.print_exc()
        return

    sample_data = {
        "quarter": "Quarter1",
        "department": "Sewing",
        "day": "Monday",
        "team": 1,
        "targeted_productivity": 0.8,
        "smv": 11.2,
        "over_time": 0,
        "incentive": 0,
        "idle_time": 0,
        "wip": 1000,
        "idle_men": 0,
        "no_of_style_change": 0,
        "no_of_workers": 50,
        "month": 1,
        "day_of_month": 1,
    }

    print(f"Building features for data: {sample_data}")
    features = build_features(sample_data, encoders_sewing)
    X = np.array([features])
    print(f"Feature vector shape: {X.shape}")
    print(f"Feature vector: {X}")

    print("Running prediction...")
    try:
        pred = model_sewing.predict(X)
        print(f"Prediction result: {pred[0]}")
    except Exception as e:
        print(f"Prediction failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug()
