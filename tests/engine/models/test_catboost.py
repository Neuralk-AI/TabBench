import numpy as np
import pandas as pd

from tabbench.engine import CatBoost


def test_load_reads_params_from_yaml(tmp_path):
    path = tmp_path / "catboost.yaml"
    path.write_text(
        "model: catboost\nparams:\n  iterations: 5\n  verbose: 0\n"
        "  allow_writing_files: false\n"
    )

    model = CatBoost.load(path)

    assert model.estimator.get_params()["iterations"] == 5


def test_fit_predict_roundtrip(tmp_path):
    path = tmp_path / "catboost.yaml"
    path.write_text(
        "model: catboost\nparams:\n  iterations: 5\n  verbose: 0\n"
        "  allow_writing_files: false\n"
    )
    model = CatBoost.load(path)

    X = pd.DataFrame({"a": [0, 0, 1, 1], "b": [0, 1, 0, 1]})
    y = pd.Series(["low", "low", "high", "high"])
    model.fit(X, y)

    predictions = model.predict(X)
    assert set(predictions) <= {"low", "high"}
    assert len(predictions) == len(X)

    probabilities = model.predict_proba(X)
    assert probabilities.shape == (len(X), 2)
    assert np.allclose(probabilities.sum(axis=1), 1.0)


def test_predict_returns_1d_array_for_multiclass_targets(tmp_path):
    # CatBoost's own predict() returns shape (n, 1) instead of (n,) for 3+ classes.
    path = tmp_path / "catboost.yaml"
    path.write_text(
        "model: catboost\nparams:\n  iterations: 5\n  verbose: 0\n"
        "  allow_writing_files: false\n"
    )
    model = CatBoost.load(path)

    X = pd.DataFrame({"a": [0, 1, 2, 0, 1, 2], "b": [2, 0, 1, 2, 0, 1]})
    y = pd.Series(["low", "medium", "high", "low", "medium", "high"])
    model.fit(X, y)

    predictions = model.predict(X)
    assert predictions.shape == (len(X),)
