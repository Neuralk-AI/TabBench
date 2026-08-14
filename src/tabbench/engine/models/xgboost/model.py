import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier


class XGBoost:
    """XGBClassifier, with non-integer class labels encoded and decoded around it.

    XGBClassifier rejects any target whose unique values aren't 0..n_classes-1
    ("Invalid classes inferred from unique values of `y`"), so the string targets
    most OpenML classification datasets use need encoding before fit and decoding
    after predict.

    XGBClassifier.fit() reads back self.classes_ and validates it against the y it was handed, 
    so a subclass overriding classes_ to expose the original labels makes the parent reject its
    own input.
    """

    def __init__(self, **params) -> None:
        self.estimator = XGBClassifier(**params)
        self.label_encoder = LabelEncoder()

    @property
    def classes_(self) -> np.ndarray:
        return self.label_encoder.classes_

    def fit(self, X: pd.DataFrame, y: pd.Series) -> "XGBoost":
        self.estimator.fit(X, self.label_encoder.fit_transform(y))
        return self

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        return self.label_encoder.inverse_transform(self.estimator.predict(X))

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        return self.estimator.predict_proba(X)
