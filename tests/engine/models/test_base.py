import subprocess
import sys

import pytest

from tabbench.engine import (
    ModelConfig,
    available_baselines,
    load_model,
    resolve_config_path,
)
from tabbench.engine.models.logistic_regression import LogisticRegression


def test_model_config_load_parses_yaml_fields(tmp_path):
    path = tmp_path / "logistic_regression.yaml"
    path.write_text(
        "model: logistic_regression\n"
        "target: tabbench.engine.models.logistic_regression.model.LogisticRegression\n"
        "requires_cuda: false\n"
        "params:\n  C: 0.5\n"
    )

    config = ModelConfig.load(path)

    assert config.name == "logistic_regression"
    assert config.target == (
        "tabbench.engine.models.logistic_regression.model.LogisticRegression"
    )
    assert config.requires_cuda is False
    assert config.params == {"C": 0.5}


def test_model_config_load_defaults_requires_cuda_and_params(tmp_path):
    path = tmp_path / "minimal.yaml"
    path.write_text("model: minimal\ntarget: some.module.Class\n")

    config = ModelConfig.load(path)

    assert config.requires_cuda is False
    assert config.params == {}


def test_load_model_resolves_target_and_forwards_params():
    config = ModelConfig(
        name="logistic_regression",
        target="tabbench.engine.models.logistic_regression.model.LogisticRegression",
        requires_cuda=False,
        params={"C": 0.5},
    )

    model = load_model(config)

    assert isinstance(model, LogisticRegression)
    assert model.estimator.C == 0.5


def test_load_model_raises_on_unresolvable_target():
    config = ModelConfig(
        name="broken",
        target="tabbench.engine.models.does_not_exist.model.Nope",
        requires_cuda=False,
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
