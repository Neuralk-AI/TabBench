import numpy as np
import pandas as pd
from catboost import CatBoostClassifier as _CatBoostClassifier


class CatBoost:
    """Gradient-boosted trees classifier, delegating to CatBoost."""

    def __init__(self, **params) -> None:
        self.estimator = _CatBoostClassifier(**params)

    @property
    def classes(self) -> np.ndarray:
        return self.estimator.classes_

    def fit(self, X: pd.DataFrame, y: pd.Series) -> "CatBoost":
        self.estimator.fit(X, y)
        return self

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        # For multiclass targets, CatBoost's predict() returns shape (n, 1) instead of
        # sklearn's (n,) convention; ravel() is a no-op for the binary (n,) case.
        return self.estimator.predict(X).ravel()

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        return self.estimator.predict_proba(X)
