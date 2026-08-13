import numpy as np
import pandas as pd

from tabbench.engine import KNN


def test_load_reads_params_from_yaml(tmp_path):
    path = tmp_path / "knn.yaml"
    path.write_text("model: knn\nparams:\n  n_neighbors: 3\n")

    model = KNN.load(path)

    assert model.estimator.n_neighbors == 3


def test_fit_predict_roundtrip(tmp_path):
    path = tmp_path / "knn.yaml"
    path.write_text("model: knn\nparams:\n  n_neighbors: 1\n")
    model = KNN.load(path)

    X = pd.DataFrame({"a": [0, 0, 1, 1], "b": [0, 1, 0, 1]})
    y = pd.Series(["low", "low", "high", "high"])
    model.fit(X, y)

    predictions = model.predict(X)
    assert set(predictions) <= {"low", "high"}
    assert len(predictions) == len(X)

    probabilities = model.predict_proba(X)
    assert probabilities.shape == (len(X), 2)
    assert np.allclose(probabilities.sum(axis=1), 1.0)
