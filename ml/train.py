"""Train the optional difficulty model from collected gameplay sessions.

This is an ML-ready development script. It does not diagnose or predict disease.
"""
from pathlib import Path
import csv

FEATURES = [
    "accuracy", "responseTime", "mistakes", "hintsUsed",
    "completion", "previousScore", "recentAverage", "currentDifficulty",
]
TARGET = "nextDifficulty"


def load_rows(path: Path):
    with path.open(newline="", encoding="utf-8") as file:
        return list(csv.DictReader(file))


def main():
    data_path = Path("ml/data/game_sessions.csv")
    if not data_path.exists():
        raise SystemExit("No gameplay dataset found. Collect real sessions before training.")
    rows = load_rows(data_path)
    if len(rows) < 20:
        raise SystemExit("At least 20 labelled gameplay sessions are recommended before training.")
    try:
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.model_selection import train_test_split
        from sklearn.metrics import accuracy_score
        import joblib
    except ImportError as error:
        raise SystemExit("Install scikit-learn and joblib to train the optional model.") from error

    x = [[float(row[name]) for name in FEATURES] for row in rows]
    y = [int(row[TARGET]) for row in rows]
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42, stratify=y)
    model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight="balanced")
    model.fit(x_train, y_train)
    print(f"Holdout accuracy: {accuracy_score(y_test, model.predict(x_test)):.3f}")
    output = Path("ml/models/difficulty_model.joblib")
    output.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump({"model": model, "features": FEATURES}, output)
    print(f"Saved model to {output}")


if __name__ == "__main__":
    main()
