import importlib

import numpy as np
import pandas as pd
import torch
import yaml

from tabbench.engine import Dataset
from tabbench.run import main

run_module = importlib.import_module("tabbench.run")
evaluate_module = importlib.import_module("tabbench.engine.evaluate")


class FakeModel:
    @property
    def classes(self):
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


def test_main_reports_ok_status_on_success(tmp_path, monkeypatch):
    setup_run(
        tmp_path, monkeypatch, FakeModel(), cuda_available=False, requires_cuda=False
    )

    main(model="dummy", test_size=0.5, seed=0, stratify=False)

    run_dir = next(tmp_path.glob("*_dummy"))
    summary = yaml.safe_load((run_dir / "summary.yaml").read_text())
    assert summary["results"][0]["status"] == "ok"
    assert list(run_dir.glob("*.parquet"))
