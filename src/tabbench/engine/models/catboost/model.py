from dataclasses import dataclass
from pathlib import Path

import numpy as np
import pandas as pd
import yaml
from catboost import CatBoostClassifier as _CatBoostClassifier


@dataclass
class CatBoost:
    """Gradient-boosted trees classifier, delegating to CatBoost."""

    estimator: _CatBoostClassifier

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

    @classmethod
    def load(cls, path: Path) -> "CatBoost":
        """Build a CatBoost from the params section of a yaml config file."""
        yaml_dict = yaml.safe_load(path.read_text()) or {}
        params = yaml_dict.get("params") or {}
        return cls(estimator=_CatBoostClassifier(**params))
