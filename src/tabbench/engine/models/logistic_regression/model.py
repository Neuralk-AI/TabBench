from dataclasses import dataclass
from pathlib import Path

import numpy as np
import pandas as pd
import yaml
from sklearn.linear_model import LogisticRegression as SklearnLogisticRegression


@dataclass
class LogisticRegression:
    """Logistic regression classifier, delegating to scikit-learn."""

    estimator: SklearnLogisticRegression

    def fit(self, X: pd.DataFrame, y: pd.Series) -> "LogisticRegression":
        self.estimator.fit(X, y)
        return self

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        return self.estimator.predict(X)

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        return self.estimator.predict_proba(X)

    @classmethod
    def load(cls, path: Path) -> "LogisticRegression":
        """Build a LogisticRegression from the params section of a yaml config file."""
        yaml_dict = yaml.safe_load(path.read_text()) or {}
        params = yaml_dict.get("params") or {}
        return cls(estimator=SklearnLogisticRegression(**params))
