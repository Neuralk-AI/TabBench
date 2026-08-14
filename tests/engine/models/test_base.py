import subprocess
import sys

import numpy as np
import pandas as pd
import pytest
from sklearn.linear_model import LogisticRegression

from tabbench.engine import (
    ModelConfig,
    available_baselines,
    load_model,
    resolve_config_path,
)


def test_model_config_load_parses_yaml_fields(tmp_path):
    path = tmp_path / "logistic_regression.yaml"
    path.write_text(
        "model: logistic_regression\n"
        "target: sklearn.linear_model.LogisticRegression\n"
        "params:\n  C: 0.5\n"
    )

    config = ModelConfig.load(path)

    assert config.name == "logistic_regression"
    assert config.target == "sklearn.linear_model.LogisticRegression"
    assert config.params == {"C": 0.5}


def test_model_config_load_defaults_params(tmp_path):
    path = tmp_path / "minimal.yaml"
    path.write_text("model: minimal\ntarget: some.module.Class\n")

    config = ModelConfig.load(path)

    assert config.params == {}


def test_load_model_resolves_target_and_forwards_params():
    config = ModelConfig(
        name="logistic_regression",
        target="sklearn.linear_model.LogisticRegression",
        params={"C": 0.5},
    )

    model = load_model(config)

    assert isinstance(model, LogisticRegression)
    assert model.C == 0.5


@pytest.mark.parametrize(
    ("target", "params", "expected_missing"),
    [
        pytest.param(
            "pathlib.Path",
            {},
            ["fit", "predict", "predict_proba"],
            id="not_an_estimator",
        ),
        pytest.param(
            "sklearn.linear_model.LinearRegression",
            {},
            ["predict_proba"],
            id="regressor",
        ),
        pytest.param(
            "sklearn.svm.SVC",
            {},
            ["predict_proba"],
            id="classifier_that_cannot_produce_probabilities",
        ),
    ],
)
def test_load_model_raises_when_target_is_not_a_classification_model(
    target, params, expected_missing
):
    """The mistakes a free-text dotted path invites: something that isn't an
    estimator at all, a regressor reached by picking the wrong class from the right
    module, and a classifier that cannot score probabilities as configured.
    """
    config = ModelConfig(name="wrong", target=target, params=params)

    with pytest.raises(RuntimeError) as excinfo:
        load_model(config)

    message = str(excinfo.value)
    assert target in message
    # the exact list, so a partially conforming target isn't reported as wholly broken
    assert f"no {', '.join(expected_missing)}" in message


def test_load_model_accepts_svc_once_it_can_produce_probabilities():
    """SVC keeps predict_proba behind an available_if descriptor, so it reads as
    absent until probability=True. Rejecting the default and accepting this makes it
    a params mistake to fix rather than an unsupported model.
    """
    config = ModelConfig(
        name="svc", target="sklearn.svm.SVC", params={"probability": True}
    )

    assert callable(load_model(config).predict_proba)


def test_load_model_accepts_a_target_whose_classes_is_not_set_until_fit():
    """classes_ only exists after fit(), so load-time validation must not require it
    -- checking for it here would reject every conforming estimator.
    """
    config = ModelConfig(
        name="logistic_regression",
        target="sklearn.linear_model.LogisticRegression",
        params={},
    )

    model = load_model(config)

    assert not hasattr(model, "classes_")


def test_load_model_raises_on_unresolvable_target():
    config = ModelConfig(
        name="broken",
        target="tabbench.engine.models.does_not_exist.model.Nope",
        params={},
    )

    with pytest.raises(ModuleNotFoundError):
        load_model(config)


def test_resolve_config_path_returns_packaged_path_for_baseline_name():
    path = resolve_config_path("logistic_regression")

    assert path.name == "config.yaml"
    assert path.parent.name == "logistic_regression"


def test_resolve_config_path_raises_for_unknown_baseline():
    with pytest.raises(RuntimeError, match="unknown_model"):
        resolve_config_path("unknown_model")


def test_resolve_config_path_returns_custom_path_when_file_exists(tmp_path):
    custom = tmp_path / "custom.yaml"
    custom.write_text("model: custom\ntarget: some.module.Class\nparams: {}\n")

    assert resolve_config_path(str(custom)) == custom


def test_resolve_config_path_raises_for_missing_yaml_file(tmp_path):
    missing = tmp_path / "does_not_exist.yaml"

    with pytest.raises(RuntimeError, match="does_not_exist.yaml"):
        resolve_config_path(str(missing))


def test_available_baselines_all_resolve_to_a_packaged_yaml():
    names = available_baselines()

    assert names  # sanity: discovery actually found something
    for name in names:
        assert resolve_config_path(name).is_file()


@pytest.mark.parametrize("name", available_baselines())
def test_packaged_baseline_name_matches_its_directory(name):
    """A baseline is discovered by directory name but reported by its "model" key,
    and dump_results names the run directory from the latter. Pin them together so
    the two can't drift.
    """
    assert ModelConfig.load(resolve_config_path(name)).name == name


@pytest.mark.parametrize("name", available_baselines())
def test_packaged_baseline_satisfies_the_classification_contract(name):
    """Every packaged target must honour ClassificationModel on a string-labelled
    multiclass target, whether it is one of ours or an upstream class pointed at
    directly. This is what lets most baselines carry no TabBench code at all.
    """
    model = load_model(ModelConfig.load(resolve_config_path(name)))

    n_rows, labels = 15, ["low", "medium", "high"]
    X = pd.DataFrame({"a": np.arange(n_rows) % 3, "b": np.arange(n_rows) % 5})
    y = pd.Series(labels * (n_rows // len(labels)))
    model.fit(X, y)

    # classes_ : original labels, ascending
    assert list(model.classes_) == sorted(labels)

    # predict : shape (n,), values drawn from the original labels
    predictions = model.predict(X)
    assert predictions.shape == (n_rows,)
    assert set(predictions) <= set(labels)

    # predict_proba : shape (n, n_classes), rows summing to 1, columns in classes_ order
    probabilities = model.predict_proba(X)
    assert probabilities.shape == (n_rows, len(labels))
    assert np.allclose(probabilities.sum(axis=1), 1.0)


@pytest.mark.parametrize("name", available_baselines())
def test_load_and_fit_never_imports_torch(name):
    """Regression test: loading and fitting a packaged baseline must not import
    torch into the process. torch bundles its own OpenMP runtime, which segfaults
    on macOS once xgboost/lightgbm's (Homebrew-linked) OpenMP runtime does real
    work in the same process -- see the comment on load_model in base.py.
    Runs in a subprocess so it reflects a real, fresh interpreter rather than
    whatever other tests have already imported into this pytest session.
    """
    script = f"""
import sys
import pandas as pd
from tabbench.engine import ModelConfig, load_model, resolve_config_path

config = ModelConfig.load(resolve_config_path({name!r}))
model = load_model(config)
X = pd.DataFrame({{"a": [0, 0, 1, 1], "b": [0, 1, 0, 1]}})
y = pd.Series(["low", "low", "high", "high"])
model.fit(X, y)
assert "torch" not in sys.modules, "loading/fitting {name} must not import torch"
"""
    result = subprocess.run([sys.executable, "-c", script], capture_output=True)
    assert result.returncode == 0, result.stderr.decode()
