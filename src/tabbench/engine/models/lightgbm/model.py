import numpy as np
import pandas as pd
from lightgbm import LGBMClassifier


class LightGBM:
    """Gradient-boosted trees classifier, delegating to LightGBM."""

    def __init__(self, **params) -> None:
        self.estimator = LGBMClassifier(**params)

    @property
    def classes(self) -> np.ndarray:
        return self.estimator.classes_

    def fit(self, X: pd.DataFrame, y: pd.Series) -> "LightGBM":
        self.estimator.fit(X, y)
        return self

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        return self.estimator.predict(X)

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        return self.estimator.predict_proba(X)
