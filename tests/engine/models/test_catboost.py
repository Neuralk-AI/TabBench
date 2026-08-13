import numpy as np
import pandas as pd

from tabbench.engine.models.catboost import CatBoost


def test_init_forwards_params_to_estimator():
    model = CatBoost(iterations=5, verbose=0, allow_writing_files=False)

    assert model.estimator.get_params()["iterations"] == 5


def test_fit_predict_roundtrip():
    model = CatBoost(iterations=5, verbose=0, allow_writing_files=False)

    X = pd.DataFrame({"a": [0, 0, 1, 1], "b": [0, 1, 0, 1]})
    y = pd.Series(["low", "low", "high", "high"])
    model.fit(X, y)

    predictions = model.predict(X)
    assert set(predictions) <= {"low", "high"}
    assert len(predictions) == len(X)

    probabilities = model.predict_proba(X)
    assert probabilities.shape == (len(X), 2)
    assert np.allclose(probabilities.sum(axis=1), 1.0)


def test_predict_returns_1d_array_for_multiclass_targets():
    # CatBoost's own predict() returns shape (n, 1) instead of (n,) for 3+ classes.
    model = CatBoost(iterations=5, verbose=0, allow_writing_files=False)

    X = pd.DataFrame({"a": [0, 1, 2, 0, 1, 2], "b": [2, 0, 1, 2, 0, 1]})
    y = pd.Series(["low", "medium", "high", "low", "medium", "high"])
    model.fit(X, y)

    predictions = model.predict(X)
    assert predictions.shape == (len(X),)
