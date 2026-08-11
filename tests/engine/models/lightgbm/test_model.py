import numpy as np
import pandas as pd

from tabbench.engine import LightGBM


def test_load_reads_params_from_yaml(tmp_path):
    path = tmp_path / "lightgbm.yaml"
    path.write_text("model: lightgbm\nparams:\n  n_estimators: 5\n")

    model = LightGBM.load(path)

    assert model.estimator.n_estimators == 5


def test_fit_predict_roundtrip(tmp_path):
    path = tmp_path / "lightgbm.yaml"
    path.write_text("model: lightgbm\nparams:\n  n_estimators: 5\n")
    model = LightGBM.load(path)

    X = pd.DataFrame({"a": [0, 0, 1, 1], "b": [0, 1, 0, 1]})
    y = pd.Series(["low", "low", "high", "high"])
    model.fit(X, y)

    predictions = model.predict(X)
    assert set(predictions) <= {"low", "high"}
    assert len(predictions) == len(X)

    probabilities = model.predict_proba(X)
    assert probabilities.shape == (len(X), 2)
    assert np.allclose(probabilities.sum(axis=1), 1.0)
