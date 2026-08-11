import numpy as np
import pandas as pd

from tabbench.engine import LogisticRegression


def test_load_reads_params_from_yaml(tmp_path):
    path = tmp_path / "logistic_regression.yaml"
    path.write_text("model: logistic_regression\nparams:\n  C: 0.5\n  max_iter: 200\n")

    model = LogisticRegression.load(path)

    assert model.estimator.C == 0.5
    assert model.estimator.max_iter == 200


def test_fit_predict_roundtrip(tmp_path):
    path = tmp_path / "logistic_regression.yaml"
    path.write_text("model: logistic_regression\nparams:\n  max_iter: 1000\n")
    model = LogisticRegression.load(path)

    X = pd.DataFrame({"a": [0, 0, 1, 1], "b": [0, 1, 0, 1]})
    y = pd.Series(["low", "low", "high", "high"])
    model.fit(X, y)

    predictions = model.predict(X)
    assert set(predictions) <= {"low", "high"}
    assert len(predictions) == len(X)

    probabilities = model.predict_proba(X)
    assert probabilities.shape == (len(X), 2)
    assert np.allclose(probabilities.sum(axis=1), 1.0)
