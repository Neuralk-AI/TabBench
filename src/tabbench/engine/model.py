from dataclasses import dataclass
from pathlib import Path
from typing import Any, Protocol

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
    """A model's yaml config.

    Attributes
    ----------
    name: str
        Model display name.
    target: str
        Model dotted path (e.g., engine.models.lightgbm.LightGBM).
    requires_cuda: bool
        Whether a CUDA device is required to benchmark this model.
    params: dict[str, Any]
        Dictionary of keyword parameters that will be passed to the constructor.
    """

    name: str
    target: str
    requires_cuda: bool
    params: dict[str, Any]

    @classmethod
    def load(cls, path: Path) -> "ModelConfig":
        """Parse a model's yaml config file.

        Raises
        ------
        RuntimeError
            If the file isn't valid yaml, isn't a mapping, or is missing a
            required key. Hand-written configs are a supported entry point, so
            every failure names the offending file.
        """
        try:
            yaml_dict = yaml.safe_load(path.read_text())
        except yaml.YAMLError as error:
            raise RuntimeError(f"Invalid model config {path}: {error}") from None

        if not isinstance(yaml_dict, dict):
            raise RuntimeError(
                f"Invalid model config {path}: expected a yaml mapping, "
                f"got {type(yaml_dict).__name__}"
            )

        missing_keys = [key for key in ("model", "target") if key not in yaml_dict]
        if missing_keys:
            raise RuntimeError(
                f"Invalid model config {path}: missing key(s) {missing_keys}"
            )

        return cls(
            name=yaml_dict["model"],
            target=yaml_dict["target"],
            requires_cuda=bool(yaml_dict.get("requires_cuda", False)),
            params=yaml_dict.get("params") or {},
        )
