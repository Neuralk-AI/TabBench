from dataclasses import dataclass
from pathlib import Path

import numpy as np
import pandas as pd
import yaml
from sklearn.ensemble import RandomForestClassifier


@dataclass
class RandomForest:
    """Random forest classifier, delegating to scikit-learn."""

    estimator: RandomForestClassifier

    @property
    def classes(self) -> np.ndarray:
        return self.estimator.classes_

    @property
    def requires_cuda(self) -> bool:
        return False

    def fit(self, X: pd.DataFrame, y: pd.Series) -> "RandomForest":
        self.estimator.fit(X, y)
        return self

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        return self.estimator.predict(X)

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        return self.estimator.predict_proba(X)

    @classmethod
    def load(cls, path: Path) -> "RandomForest":
        """Build a RandomForest from the params section of a yaml config file."""
        yaml_dict = yaml.safe_load(path.read_text()) or {}
        params = yaml_dict.get("params") or {}
        return cls(estimator=RandomForestClassifier(**params))
