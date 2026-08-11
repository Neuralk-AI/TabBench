from pathlib import Path
from typing import Protocol

import numpy as np
import pandas as pd


class Model(Protocol):
    """General interface for models benchmarked by TabBench."""

    def fit(self, X: pd.DataFrame, y: pd.Series) -> "Model": ...

    def predict(self, X: pd.DataFrame) -> np.ndarray: ...

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray: ...

    @classmethod
    def load(cls, path: Path) -> "Model": ...
