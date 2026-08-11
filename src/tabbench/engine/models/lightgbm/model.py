from dataclasses import dataclass
from pathlib import Path

import numpy as np
import pandas as pd
import yaml
from lightgbm import LGBMClassifier


@dataclass
class LightGBM:
    """Gradient-boosted trees classifier, delegating to LightGBM."""

    estimator: LGBMClassifier

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

    @classmethod
    def load(cls, path: Path) -> "LightGBM":
        """Build a LightGBM from the params section of a yaml config file."""
        yaml_dict = yaml.safe_load(path.read_text()) or {}
        params = yaml_dict.get("params") or {}
        return cls(estimator=LGBMClassifier(**params))
