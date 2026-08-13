import numpy as np
import pandas as pd

from tabbench.engine.models.logistic_regression import LogisticRegression


def test_init_forwards_params_to_estimator():
    model = LogisticRegression(C=0.5, max_iter=200)

    assert model.estimator.C == 0.5
    assert model.estimator.max_iter == 200


def test_fit_predict_roundtrip():
    model = LogisticRegression(max_iter=1000)

    X = pd.DataFrame({"a": [0, 0, 1, 1], "b": [0, 1, 0, 1]})
    y = pd.Series(["low", "low", "high", "high"])
    model.fit(X, y)

    predictions = model.predict(X)
    assert set(predictions) <= {"low", "high"}
    assert len(predictions) == len(X)

    probabilities = model.predict_proba(X)
    assert probabilities.shape == (len(X), 2)
    assert np.allclose(probabilities.sum(axis=1), 1.0)
