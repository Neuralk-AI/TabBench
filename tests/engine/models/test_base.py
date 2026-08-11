import pytest

from tabbench.engine import LogisticRegression, load_model


def test_load_model_dispatches_to_registered_class(tmp_path):
    path = tmp_path / "logistic_regression.yaml"
    path.write_text("model: logistic_regression\nparams:\n  C: 0.5\n")

    model = load_model(path)

    assert isinstance(model, LogisticRegression)
    assert model.estimator.C == 0.5


def test_load_model_raises_runtime_error_on_unknown_model(tmp_path):
    path = tmp_path / "unknown.yaml"
    path.write_text("model: does_not_exist\nparams: {}\n")

    with pytest.raises(RuntimeError, match="does_not_exist"):
        load_model(path)
