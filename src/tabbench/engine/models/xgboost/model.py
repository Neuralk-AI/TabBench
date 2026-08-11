from dataclasses import dataclass, field
from pathlib import Path

import numpy as np
import pandas as pd
import yaml
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier


@dataclass
class XGBoost:
    """Gradient-boosted trees classifier, delegating to XGBoost."""

    estimator: XGBClassifier
    # XGBClassifier.classes_ is always np.arange(n_classes); encode/decode labels
    # ourselves so `classes` and predict() expose the original class labels.
    label_encoder: LabelEncoder = field(default_factory=LabelEncoder)

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

    @classmethod
    def load(cls, path: Path) -> "XGBoost":
        """Build an XGBoost from the params section of a yaml config file."""
        yaml_dict = yaml.safe_load(path.read_text()) or {}
        params = yaml_dict.get("params") or {}
        return cls(estimator=XGBClassifier(**params))
