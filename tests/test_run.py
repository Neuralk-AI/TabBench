import importlib
import subprocess
import sys
import types

import numpy as np
import pandas as pd
import pytest
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


def stub_torch(cuda_available):
    """Stand in for torch, so importing this module doesn't pull the real one.

    torch bundles its own OpenMP runtime, which segfaults on macOS once the one
    xgboost and lightgbm link against does threaded work in the same process -- and
    pytest imports every test module into that one process. Stubbing also keeps torch
    off the list of things the suite needs installed to run at all.
    """
    torch = types.ModuleType("torch")
    torch.cuda = types.SimpleNamespace(is_available=lambda: cuda_available)
    torch.manual_seed = lambda seed: None
    return torch


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
    monkeypatch.setitem(sys.modules, "torch", stub_torch(cuda_available))
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


def test_main_reports_wrong_device_when_torch_is_not_installed(tmp_path, monkeypatch):
    """torch is only needed to ask about CUDA, so a CPU-only install must report a
    CUDA-only model as unrunnable here rather than ending a sweep over the others.
    """
    setup_run(
        tmp_path, monkeypatch, FakeModel(), cuda_available=False, requires_cuda=True
    )
    # None in sys.modules makes `import torch` raise ImportError, as if uninstalled.
    monkeypatch.setitem(sys.modules, "torch", None)

    main(model="dummy", test_size=0.2, seed=0, stratify=True)

    run_dir = next(tmp_path.glob("*_dummy"))
    summary = yaml.safe_load((run_dir / "summary.yaml").read_text())
    assert summary["results"][0]["status"] == "wrong_device"
    assert summary["results"][0]["error_message"] == (
        "dummy requires CUDA but torch is not installed"
    )


def test_main_reports_ok_status_on_success(tmp_path, monkeypatch):
    setup_run(
        tmp_path, monkeypatch, FakeModel(), cuda_available=False, requires_cuda=False
    )

    main(model="dummy", test_size=0.5, seed=0, stratify=False)

    run_dir = next(tmp_path.glob("*_dummy"))
    summary = yaml.safe_load((run_dir / "summary.yaml").read_text())
    assert summary["results"][0]["status"] == "ok"
    assert list(run_dir.glob("*.parquet"))


def setup_multi_dataset_run(tmp_path, monkeypatch, load_dataset, n=3):
    """A run over n datasets, with load_dataset supplied by the caller."""
    setup_run(
        tmp_path, monkeypatch, FakeModel(), cuda_available=False, requires_cuda=False
    )
    datasets_file = tmp_path / "datasets.yaml"
    datasets_file.write_text(
        yaml.dump(
            [
                {
                    "openml_id": i,
                    "openml_name": f"ds{i}",
                    "description": "fake dataset",
                    "task": "classification",
                    "target": "label",
                }
                for i in range(1, n + 1)
            ]
        )
    )
    monkeypatch.setattr(run_module, "DATASETS_FILE", datasets_file)
    monkeypatch.setattr(run_module, "load_dataset", load_dataset)


def read_results(tmp_path):
    run_dir = next(tmp_path.glob("*_dummy"))
    summary = yaml.safe_load((run_dir / "summary.yaml").read_text())
    return run_dir, {r["openml_id"]: r for r in summary["results"]}


def test_main_records_an_unreachable_dataset_and_keeps_going(tmp_path, monkeypatch):
    """A dataset that cannot be fetched is the likeliest failure in a long sweep, and
    it must not take the datasets around it down with it.
    """

    def load_dataset(entry):
        if entry["openml_id"] == 2:
            raise ConnectionError("openml.org timed out")
        return fake_load_dataset(entry)

    setup_multi_dataset_run(tmp_path, monkeypatch, load_dataset)

    main(model="dummy", test_size=0.5, seed=0, stratify=False)

    _, results = read_results(tmp_path)
    assert [results[i]["status"] for i in (1, 2, 3)] == ["ok", "failure", "ok"]
    assert (
        results[2]["error_message"]
        == "load_dataset: ConnectionError: openml.org timed out"
    )


def test_main_records_the_stage_a_failure_happened_at(tmp_path, monkeypatch):
    """The stage separates a model that dislikes one dataset from an engine bug, which
    fails at the same stage for every dataset.
    """

    class FitRaises(FakeModel):
        def fit(self, X, y):
            raise RuntimeError("boom")

    setup_multi_dataset_run(tmp_path, monkeypatch, fake_load_dataset, n=1)
    monkeypatch.setattr(run_module, "load_model", lambda config: FitRaises())

    main(model="dummy", test_size=0.5, seed=0, stratify=False)

    _, results = read_results(tmp_path)
    assert results[1]["status"] == "failure"
    assert results[1]["error_message"] == "evaluate: RuntimeError: boom"


def test_main_writes_completed_results_when_the_sweep_is_interrupted(
    tmp_path, monkeypatch
):
    """KeyboardInterrupt is deliberately not caught per dataset, so it is what proves
    finished work still reaches disk when a long run is cut short.
    """

    def load_dataset(entry):
        if entry["openml_id"] == 2:
            raise KeyboardInterrupt
        return fake_load_dataset(entry)

    setup_multi_dataset_run(tmp_path, monkeypatch, load_dataset)

    with pytest.raises(KeyboardInterrupt):
        main(model="dummy", test_size=0.5, seed=0, stratify=False)

    run_dir, results = read_results(tmp_path)
    assert list(results) == [1]  # dataset 1 finished before the interrupt
    assert results[1]["status"] == "ok"
    assert (run_dir / "1_ds1.parquet").exists()


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
