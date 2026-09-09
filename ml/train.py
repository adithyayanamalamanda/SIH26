"""
Machine Learning Model Training Script for Adaptive Difficulty Prediction.

Model: RandomForestClassifier
Purpose: Predict the recommended next difficulty level based on cognitive gameplay metrics.
Safety Notice: This model personalizes gameplay difficulty only. It does NOT diagnose medical conditions.
"""

import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "sample_synthetic_dataset.csv")
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "random_forest_adaptive.joblib")

FEATURES = [
    "accuracy", "response_time", "mistakes", "hints_used",
    "completion", "previous_score", "recent_average", "current_difficulty"
]
TARGET = "recommendedDifficulty"

def train_model():
    print(f"Loading development dataset from: {DATA_PATH}")
    # Skip comment lines starting with #
    df = pd.read_csv(DATA_PATH, comment="#")

    print(f"Total training samples: {len(df)}")
    X = df[FEATURES]
    y = df[TARGET]

    # Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

    print("Training RandomForestClassifier...")
    clf = RandomForestClassifier(
        n_estimators=50,
        max_depth=5,
        random_state=42
    )
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Test Accuracy: {acc * 100:.1f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, zero_division=0))

    # Feature Importances
    print("Feature Importances:")
    for feat, imp in sorted(zip(FEATURES, clf.feature_importances_), key=lambda x: x[1], reverse=True):
        print(f"  - {feat}: {imp:.4f}")

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump({
        "model": clf,
        "features": FEATURES,
        "classes": clf.classes_
    }, MODEL_PATH)
    print(f"\nTrained model successfully serialized to: {MODEL_PATH}")

if __name__ == "__main__":
    train_model()
