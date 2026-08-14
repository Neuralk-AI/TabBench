import importlib
import math
import warnings
from dataclasses import asdict

import numpy as np
import pandas as pd
import pytest
import yaml

from tabbench.engine import (
    ClassificationMetrics,
    ClassificationResults,
    Dataset,
    ModelConfig,
    Status,
    dump_results,
    evaluate,
)

evaluate_module = importlib.import_module("tabbench.engine.evaluate")
_compute_metrics = evaluate_module._compute_metrics


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


class FitRaisesModel(FakeModel):
    def fit(self, X, y):
        raise RuntimeError("boom")


class PredictRaisesModel(FakeModel):
    def predict(self, X):
        raise RuntimeError("boom")


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


def test_compute_metrics_macro_averages_only_the_classes_the_split_can_score():
    """A class missing from the test split can't be scored, and used to turn every
    macro metric into NaN. Average over the classes that were scoreable instead, so a
    rare class missing the split doesn't erase the whole dataset's numbers.
    """
    # "c" is a known class but absent from y_test: perfect scores on "a" and "b".
    y_test = np.array(["a", "b", "a", "b"])
    y_pred = np.array(["a", "b", "a", "b"])
    y_proba = np.array(
        [[0.8, 0.1, 0.1], [0.1, 0.8, 0.1], [0.7, 0.2, 0.1], [0.2, 0.7, 0.1]]
    )
    classes = np.array(["a", "b", "c"])

    metrics = _compute_metrics(y_test, y_pred, y_proba, classes)

    assert metrics.accuracy == 1.0
    assert metrics.tpr == 1.0  # mean over a and b, not NaN
    assert metrics.fpr == 0.0
    assert metrics.tnr == 1.0
    assert metrics.fnr == 0.0
    assert metrics.roc_auc == 1.0


def test_compute_metrics_reports_nan_when_no_class_can_be_scored():
    """NaN is still the honest answer when nothing is scoreable -- a single-class test
    split -- and it must stay NaN rather than becoming a fabricated number.
    """
    y_test = np.array(["a", "a"])
    y_pred = np.array(["a", "a"])
    y_proba = np.array([[0.9, 0.1], [0.8, 0.2]])
    classes = np.array(["a", "b"])

    metrics = _compute_metrics(y_test, y_pred, y_proba, classes)

    assert metrics.accuracy == 1.0
    assert math.isnan(metrics.tpr)  # no true "b" instances to recover
    assert math.isnan(metrics.roc_auc)


def test_compute_metrics_does_not_warn_on_an_unscoreable_class():
    """The old arithmetic reached NaN through a 0/0 RuntimeWarning. Unscoreable
    classes are now expected and marked deliberately, so nothing should warn.
    """
    y_test = np.array(["a", "b", "a", "b"])
    y_pred = np.array(["a", "b", "a", "b"])
    y_proba = np.array(
        [[0.8, 0.1, 0.1], [0.1, 0.8, 0.1], [0.7, 0.2, 0.1], [0.2, 0.7, 0.1]]
    )
    classes = np.array(["a", "b", "c"])

    with warnings.catch_warnings():
        warnings.simplefilter("error")
        _compute_metrics(y_test, y_pred, y_proba, classes)


def test_evaluate_returns_metrics_and_predictions():
    dataset = make_dataset(["a", "b"] * 10)

    result = evaluate(FakeModel(), dataset, test_size=0.2, seed=0, stratify=True)

    assert result.status == Status.OK
    assert result.openml_id == 1
    assert result.openml_name == "fake"
    assert isinstance(result.metrics, ClassificationMetrics)
    assert 0.0 <= result.metrics.accuracy <= 1.0
    assert 0.0 <= result.metrics.roc_auc <= 1.0
    assert list(result.predictions.columns) == ["y_true", "y_pred", "proba_a", "proba_b"]
    assert len(result.predictions) == 4


@pytest.mark.parametrize(
    "model", [FitRaisesModel(), PredictRaisesModel()], ids=["fit", "predict"]
)
def test_evaluate_propagates_a_failing_model(model):
    """evaluate() measures and does not decide what a failure means. Turning one into
    a recorded row is the sweep's job, so a caller using evaluate() directly -- from a
    notebook, say -- sees the real exception instead of a result full of NaN.
    """
    dataset = make_dataset(["a", "b"] * 10)

    with pytest.raises(RuntimeError, match="boom"):
        evaluate(model, dataset, test_size=0.2, seed=0, stratify=True)


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
            openml_id=1,
            openml_name="fake",
            status=Status.OK,
            error_message="",
            metrics=metrics,
            predictions=predictions,
        )
    ]
    model_config = ModelConfig(
        name="logistic_regression",
        target="sklearn.linear_model.LogisticRegression",
        requires_cuda=False,
        params={"C": 1.0},
    )
    model_config_path = tmp_path / "config.yaml"

    run_dir = dump_results(results, model_config, model_config_path)

    assert run_dir.parent == tmp_path
    assert run_dir.name.endswith("_logistic_regression")
    summary = yaml.safe_load((run_dir / "summary.yaml").read_text())
    assert summary["model_config"] == asdict(model_config)
    assert summary["model_config_path"] == str(model_config_path)
    assert summary["results"] == [
        {
            "openml_id": 1,
            "openml_name": "fake",
            "status": "ok",
            "error_message": "",
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


def test_dump_results_skips_predictions_file_for_non_ok_results(tmp_path, monkeypatch):
    monkeypatch.setattr(evaluate_module, "OUT_DIR", tmp_path)
    ok_result = ClassificationResults(
        openml_id=1,
        openml_name="fake-ok",
        status=Status.OK,
        error_message="",
        metrics=ClassificationMetrics(
            accuracy=0.9, roc_auc=0.95, tpr=0.8, fpr=0.1, tnr=0.9, fnr=0.2, mcc=0.7
        ),
        predictions=pd.DataFrame({"y_true": ["a"], "y_pred": ["a"]}),
    )
    failed_result = ClassificationResults.failure(
        2, "fake-failed", Status.FAILURE, error_message="RuntimeError: boom"
    )
    model_config = ModelConfig(
        name="logistic_regression",
        target="tabbench.engine.models.logistic_regression.model.LogisticRegression",
        requires_cuda=False,
        params={"C": 1.0},
    )

    run_dir = dump_results([ok_result, failed_result], model_config, tmp_path / "c.yaml")

    summary = yaml.safe_load((run_dir / "summary.yaml").read_text())
    statuses = {r["openml_id"]: r["status"] for r in summary["results"]}
    assert statuses == {1: "ok", 2: "failure"}
    assert (run_dir / "1_fake-ok.parquet").exists()
    assert not (run_dir / "2_fake-failed.parquet").exists()
