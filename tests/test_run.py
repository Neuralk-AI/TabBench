import importlib
import subprocess
import sys

import numpy as np
import pandas as pd
import pytest
import torch
import yaml

from tabbench.engine import Dataset
from tabbench.run import main

run_module = importlib.import_module("tabbench.run")
evaluate_module = importlib.import_module("tabbench.engine.evaluate")


class FakeModel:
    @property
    def classes_(self):
        return self._classes

    def fit(self, X, y):
        self._classes = np.array(sorted(y.unique()))
        return self

    def predict(self, X):
        return np.full(len(X), self._classes[0])

    def predict_proba(self, X):
        n_classes = len(self._classes)
        return np.full((len(X), n_classes), 1 / n_classes)


def fake_load_dataset(yaml_dict):
    return Dataset(
        X=pd.DataFrame({"a": [0, 1, 0, 1], "b": [1, 0, 1, 0]}),
        y=pd.Series(["x", "y", "x", "y"]),
        openml_id=yaml_dict["openml_id"],
        openml_name=yaml_dict["openml_name"],
        description=yaml_dict["description"],
        task=yaml_dict["task"],
        target=yaml_dict["target"],
    )


def setup_run(tmp_path, monkeypatch, model, cuda_available, requires_cuda):
    datasets_file = tmp_path / "datasets.yaml"
    datasets_file.write_text(
        yaml.dump(
            [
                {
                    "openml_id": 1,
                    "openml_name": "fake",
                    "description": "fake dataset",
                    "task": "classification",
                    "target": "label",
                }
            ]
        )
    )
    config_path = tmp_path / "config.yaml"
    config_path.write_text(
        yaml.dump(
            {
                "model": "dummy",
                "target": "irrelevant.module.Class",
                "requires_cuda": requires_cuda,
                "params": {},
            }
        )
    )
    monkeypatch.setattr(run_module, "DATASETS_FILE", datasets_file)
    monkeypatch.setattr(run_module, "load_dataset", fake_load_dataset)
    monkeypatch.setattr(run_module, "resolve_config_path", lambda model_arg: config_path)
    monkeypatch.setattr(run_module, "load_model", lambda config: model)
    monkeypatch.setattr(torch.cuda, "is_available", lambda: cuda_available)
    monkeypatch.setattr(evaluate_module, "OUT_DIR", tmp_path)


def test_main_reports_wrong_device_without_evaluating(tmp_path, monkeypatch):
    setup_run(
        tmp_path, monkeypatch, FakeModel(), cuda_available=False, requires_cuda=True
    )

    main(model="dummy", test_size=0.2, seed=0, stratify=True)

    run_dir = next(tmp_path.glob("*_dummy"))
    summary = yaml.safe_load((run_dir / "summary.yaml").read_text())
    assert summary["results"][0]["openml_id"] == 1
    assert summary["results"][0]["status"] == "wrong_device"
    assert "CUDA" in summary["results"][0]["error_message"]
    assert not list(run_dir.glob("*.parquet"))


def test_main_does_not_load_datasets_when_the_device_is_wrong(tmp_path, monkeypatch):
    """A run that cannot execute must not still fetch every dataset from OpenML. The
    failure record needs only the id and name, which the yaml entry already carries.
    """
    setup_run(
        tmp_path, monkeypatch, FakeModel(), cuda_available=False, requires_cuda=True
    )

    def fail_if_called(yaml_dict):
        raise AssertionError("load_dataset must not be called on the wrong device")

    monkeypatch.setattr(run_module, "load_dataset", fail_if_called)

    main(model="dummy", test_size=0.2, seed=0, stratify=True)

    run_dir = next(tmp_path.glob("*_dummy"))
    summary = yaml.safe_load((run_dir / "summary.yaml").read_text())
    assert summary["results"][0]["openml_id"] == 1
    assert summary["results"][0]["openml_name"] == "fake"
    assert summary["results"][0]["status"] == "wrong_device"


def test_main_reports_ok_status_on_success(tmp_path, monkeypatch):
    setup_run(
        tmp_path, monkeypatch, FakeModel(), cuda_available=False, requires_cuda=False
    )

    main(model="dummy", test_size=0.5, seed=0, stratify=False)

    run_dir = next(tmp_path.glob("*_dummy"))
    summary = yaml.safe_load((run_dir / "summary.yaml").read_text())
    assert summary["results"][0]["status"] == "ok"
    assert list(run_dir.glob("*.parquet"))


@pytest.mark.parametrize(
    ("model_arg", "expected"),
    [
        pytest.param("xgbost", "Unknown baseline model 'xgbost'", id="typo_in_baseline"),
        pytest.param("missing.yaml", "Config file not found", id="missing_config_file"),
    ],
)
def test_unresolvable_model_exits_cleanly_without_a_traceback(model_arg, expected):
    """--model is validated while arguments are parsed, so an unusable value is an
    argparse error rather than a traceback raised part-way into a run.
    """
    result = subprocess.run(
        [sys.executable, "-m", "tabbench.run", "--model", model_arg],
        capture_output=True,
    )

    stderr = result.stderr.decode()
    assert result.returncode == 2  # argparse's exit code for a usage error
    assert "Traceback" not in stderr
    assert expected in stderr


def test_model_help_lists_the_packaged_baselines():
    result = subprocess.run(
        [sys.executable, "-m", "tabbench.run", "--help"], capture_output=True
    )

    assert result.returncode == 0
    assert "xgboost" in result.stdout.decode()
