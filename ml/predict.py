"""Optional inference helper for the gameplay difficulty model."""
from pathlib import Path


def predict(features: dict, model_path: str = "ml/models/difficulty_model.joblib") -> int:
    try:
        import joblib
    except ImportError as error:
        raise RuntimeError("Install joblib to use the optional model.") from error
    bundle = joblib.load(Path(model_path))
    values = [[float(features[name]) for name in bundle["features"]]]
    return int(bundle["model"].predict(values)[0])
