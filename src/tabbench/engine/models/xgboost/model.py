import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier


class XGBoost:
    """Gradient-boosted trees classifier, delegating to XGBoost."""

    def __init__(self, **params) -> None:
        self.estimator = XGBClassifier(**params)
        # XGBClassifier.classes_ is always np.arange(n_classes); encode/decode labels
        # ourselves so `classes` and predict() expose the original class labels.
        self.label_encoder = LabelEncoder()

    @property
    def classes(self) -> np.ndarray:
        return self.label_encoder.classes_

    def fit(self, X: pd.DataFrame, y: pd.Series) -> "XGBoost":
        self.estimator.fit(X, self.label_encoder.fit_transform(y))
        return self

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        return self.label_encoder.inverse_transform(self.estimator.predict(X))

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        return self.estimator.predict_proba(X)
