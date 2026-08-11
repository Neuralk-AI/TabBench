import importlib

import numpy as np
import pandas as pd
import yaml

from tabbench.engine import (
    ClassificationMetrics,
    ClassificationResults,
    Dataset,
    dump_results,
    evaluate,
)

evaluate_module = importlib.import_module("tabbench.engine.evaluate")
_compute_metrics = evaluate_module._compute_metrics


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


def make_dataset(labels):
    n = len(labels)
    return Dataset(
        X=pd.DataFrame({"a": range(n), "b": range(n, 2 * n)}),
        y=pd.Series(labels),
        openml_id=1,
        openml_name="fake",
        description="fake dataset",
        task="classification",
        target="label",
    )


def test_compute_metrics_for_binary_targets():
    y_test = np.array(["a", "b", "a", "b"])
    y_pred = np.array(["a", "b", "a", "a"])
    y_proba = np.array([[0.9, 0.1], [0.2, 0.8], [0.7, 0.3], [0.6, 0.4]])
    classes = np.array(["a", "b"])

    metrics = _compute_metrics(y_test, y_pred, y_proba, classes)

    assert metrics.accuracy == 0.75
    assert 0.0 <= metrics.roc_auc <= 1.0
    assert metrics.tpr == 0.5
    assert metrics.fpr == 0.0
    assert metrics.tnr == 1.0
    assert metrics.fnr == 0.5


def test_compute_metrics_macro_averages_for_multiclass_targets():
    y_test = np.array(["a", "b", "c", "a", "b", "c"])
    y_pred = np.array(["a", "b", "c", "a", "b", "a"])
    y_proba = np.full((6, 3), 1 / 3)
    classes = np.array(["a", "b", "c"])

    metrics = _compute_metrics(y_test, y_pred, y_proba, classes)

    assert metrics.accuracy == 5 / 6
    assert 0.0 <= metrics.roc_auc <= 1.0


def test_evaluate_returns_metrics_and_predictions():
    dataset = make_dataset(["a", "b"] * 10)

    result = evaluate(FakeModel(), dataset, test_size=0.2, seed=0, stratify=True)

    assert result.openml_id == 1
    assert result.openml_name == "fake"
    assert isinstance(result.metrics, ClassificationMetrics)
    assert 0.0 <= result.metrics.accuracy <= 1.0
    assert 0.0 <= result.metrics.roc_auc <= 1.0
    assert list(result.predictions.columns) == ["y_true", "y_pred", "proba_a", "proba_b"]
    assert len(result.predictions) == 4


def test_evaluate_computes_macro_roc_auc_for_multiclass_targets():
    dataset = make_dataset(["a", "b", "c"] * 10)

    result = evaluate(FakeModel(), dataset, test_size=0.2, seed=0, stratify=True)

    assert 0.0 <= result.metrics.roc_auc <= 1.0


def test_evaluate_respects_test_size_seed_and_stratify():
    dataset = make_dataset(["a", "b"] * 10)

    result = evaluate(FakeModel(), dataset, test_size=0.5, seed=1, stratify=False)

    assert len(result.predictions) == 10


def test_dump_results_writes_summary_and_predictions(tmp_path, monkeypatch):
    monkeypatch.setattr(evaluate_module, "OUT_DIR", tmp_path)
    metrics = ClassificationMetrics(
        accuracy=0.9, roc_auc=0.95, tpr=0.8, fpr=0.1, tnr=0.9, fnr=0.2, mcc=0.7
    )
    predictions = pd.DataFrame(
        {"y_true": ["a"], "y_pred": ["a"], "proba_a": [0.9], "proba_b": [0.1]}
    )
    results = [
        ClassificationResults(
            openml_id=1, openml_name="fake", metrics=metrics, predictions=predictions
        )
    ]
    model_config = {"model": "logistic_regression", "params": {"C": 1.0}}
    model_config_path = tmp_path / "config.yaml"

    run_dir = dump_results(results, model_config, model_config_path)

    assert run_dir.parent == tmp_path
    assert run_dir.name.endswith("_logistic_regression")
    summary = yaml.safe_load((run_dir / "summary.yaml").read_text())
    assert summary["model_config"] == model_config
    assert summary["model_config_path"] == str(model_config_path)
    assert summary["results"] == [
        {
            "openml_id": 1,
            "openml_name": "fake",
            "metrics": {
                "accuracy": 0.9,
                "roc_auc": 0.95,
                "tpr": 0.8,
                "fpr": 0.1,
                "tnr": 0.9,
                "fnr": 0.2,
                "mcc": 0.7,
            },
        }
    ]
    dumped_predictions = pd.read_parquet(run_dir / "1_fake.parquet")
    pd.testing.assert_frame_equal(dumped_predictions, predictions)
