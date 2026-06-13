import joblib
import os

MODEL_DIR = "models"
for m_name in ["model_sewing.pkl", "model_finishing.pkl"]:
    path = os.path.join(MODEL_DIR, m_name)
    if os.path.exists(path):
        data = joblib.load(path)
        model = data['model']
        print(f"Model: {m_name}")
        print(f"  n_features_in_: {model.n_features_in_}")
        if hasattr(model, 'feature_names_in_'):
            print(f"  feature_names_in_: {model.feature_names_in_}")
        else:
            print("  feature_names_in_: NOT FOUND")
