from dataclasses import dataclass
from pathlib import Path
from typing import Protocol

import numpy as np
import pandas as pd
import yaml


class ClassificationModel(Protocol):
    """Classification model interface benchmarked by TabBench.

    Constructed as `cls(**params)` from a ModelConfig's params -- no separate
    loading contract needed.
    """

    @property
    def classes(self) -> np.ndarray:
        """Class labels, ascending, in the column order used by predict_proba."""
        ...

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
