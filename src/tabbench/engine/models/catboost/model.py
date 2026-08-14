import numpy as np
import pandas as pd
from catboost import CatBoostClassifier


class CatBoost(CatBoostClassifier):
    """CatBoostClassifier, with its multiclass predict() reshaped to scikit-learn's."""

    def predict(self, X: pd.DataFrame, **kwargs) -> np.ndarray:
        # For multiclass targets, CatBoost's predict() returns shape (n, 1) instead of
        # sklearn's (n,) convention; ravel() is a no-op for the binary (n,) case.
        return super().predict(X, **kwargs).ravel()
