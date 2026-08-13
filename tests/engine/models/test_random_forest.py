import numpy as np
import pandas as pd

from tabbench.engine.models.random_forest import RandomForest


def test_init_forwards_params_to_estimator():
    model = RandomForest(n_estimators=5)

    assert model.estimator.n_estimators == 5


def test_fit_predict_roundtrip():
    model = RandomForest(n_estimators=5)

    X = pd.DataFrame({"a": [0, 0, 1, 1], "b": [0, 1, 0, 1]})
    y = pd.Series(["low", "low", "high", "high"])
    model.fit(X, y)

    predictions = model.predict(X)
    assert set(predictions) <= {"low", "high"}
    assert len(predictions) == len(X)

    probabilities = model.predict_proba(X)
    assert probabilities.shape == (len(X), 2)
    assert np.allclose(probabilities.sum(axis=1), 1.0)
