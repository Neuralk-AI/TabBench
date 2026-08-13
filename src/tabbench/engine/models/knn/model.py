from dataclasses import dataclass
from pathlib import Path

import numpy as np
import pandas as pd
import yaml
from sklearn.neighbors import KNeighborsClassifier


@dataclass
class KNN:
    """K-nearest-neighbors classifier, delegating to scikit-learn."""

    estimator: KNeighborsClassifier

    @property
    def classes(self) -> np.ndarray:
        return self.estimator.classes_

    def fit(self, X: pd.DataFrame, y: pd.Series) -> "KNN":
        self.estimator.fit(X, y)
        return self

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        return self.estimator.predict(X)

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        return self.estimator.predict_proba(X)

    @classmethod
    def load(cls, path: Path) -> "KNN":
        """Build a KNN from the params section of a yaml config file."""
        yaml_dict = yaml.safe_load(path.read_text()) or {}
        params = yaml_dict.get("params") or {}
        return cls(estimator=KNeighborsClassifier(**params))
