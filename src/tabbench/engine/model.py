from dataclasses import dataclass
from pathlib import Path
from typing import Protocol

import numpy as np
import pandas as pd
import yaml


class ClassificationModel(Protocol):
    """Contract a model must satisfy to be benchmarked by TabBench.

    This is scikit-learn's classifier contract -- BaseEstimator plus
    ClassifierMixin -- narrowed to the members TabBench calls. An estimator
    already following it satisfies this protocol without an adapter.

    Instances are built as cls(**params) from a ModelConfig's params.

    Methods
    -------
    fit(X, y)
        Fit on a feature frame and a target series. Returns self.
    predict(X)
        Predicted labels, shape (n_samples,), drawn from the values seen in y.
    predict_proba(X)
        Class probabilities, shape (n_samples, n_classes), rows summing to 1,
        columns ordered to match classes_.

    Attributes
    ----------
    classes_ : np.ndarray
        Class labels seen during fit, ascending. Set by fit -- the trailing
        underscore is scikit-learn's convention for a fitted attribute.
    """

    @property
    def classes_(self) -> np.ndarray: ...

    def fit(self, X: pd.DataFrame, y: pd.Series) -> "ClassificationModel": ...

    def predict(self, X: pd.DataFrame) -> np.ndarray: ...

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray: ...


@dataclass
class ModelConfig:
    """A model's yaml config: display name, dotted class path, and constructor
    hyperparameters.
    """

    name: str
    target: str
    params: dict

    @classmethod
    def load(cls, path: Path) -> "ModelConfig":
        """Parse a model's yaml config file."""
        yaml_dict = yaml.safe_load(path.read_text())
        return cls(
            name=yaml_dict["model"],
            target=yaml_dict["target"],
            params=yaml_dict.get("params") or {},
        )
