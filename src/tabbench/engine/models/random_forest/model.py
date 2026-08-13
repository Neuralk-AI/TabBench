import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier


class RandomForest:
    """Random forest classifier, delegating to scikit-learn."""

    def __init__(self, **params) -> None:
        self.estimator = RandomForestClassifier(**params)

    @property
    def classes(self) -> np.ndarray:
        return self.estimator.classes_

    def fit(self, X: pd.DataFrame, y: pd.Series) -> "RandomForest":
        self.estimator.fit(X, y)
        return self

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        return self.estimator.predict(X)

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        return self.estimator.predict_proba(X)
