import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression as SklearnLogisticRegression


class LogisticRegression:
    """Logistic regression classifier, delegating to scikit-learn."""

    def __init__(self, **params) -> None:
        self.estimator = SklearnLogisticRegression(**params)

    @property
    def classes(self) -> np.ndarray:
        return self.estimator.classes_

    def fit(self, X: pd.DataFrame, y: pd.Series) -> "LogisticRegression":
        self.estimator.fit(X, y)
        return self

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        return self.estimator.predict(X)

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        return self.estimator.predict_proba(X)
