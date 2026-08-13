import numpy as np
import pandas as pd

from tabbench.engine.models.knn import KNN


def test_init_forwards_params_to_estimator():
    model = KNN(n_neighbors=3)

    assert model.estimator.n_neighbors == 3


def test_fit_predict_roundtrip():
    model = KNN(n_neighbors=1)

    X = pd.DataFrame({"a": [0, 0, 1, 1], "b": [0, 1, 0, 1]})
    y = pd.Series(["low", "low", "high", "high"])
    model.fit(X, y)

    predictions = model.predict(X)
    assert set(predictions) <= {"low", "high"}
    assert len(predictions) == len(X)

    probabilities = model.predict_proba(X)
    assert probabilities.shape == (len(X), 2)
    assert np.allclose(probabilities.sum(axis=1), 1.0)
