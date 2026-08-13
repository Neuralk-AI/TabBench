from pathlib import Path
from typing import Protocol

import numpy as np
import pandas as pd


class ClassificationModel(Protocol):
    """Classification model interface benchmarked by TabBench."""

    @property
    def classes(self) -> np.ndarray:
        """Class labels, ascending, in the column order used by predict_proba."""
        ...

    @property
    def requires_cuda(self) -> bool:
        """Whether this model can only run on a CUDA device."""
        ...

    def fit(self, X: pd.DataFrame, y: pd.Series) -> "ClassificationModel": ...

    def predict(self, X: pd.DataFrame) -> np.ndarray: ...

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray: ...

    @classmethod
    def load(cls, path: Path) -> "ClassificationModel": ...
