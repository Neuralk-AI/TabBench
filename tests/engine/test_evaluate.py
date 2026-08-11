import importlib

import numpy as np
import pandas as pd
import yaml

from tabbench.engine import ClassificationMetrics, Dataset, dump_results, evaluate

evaluate_module = importlib.import_module("tabbench.engine.evaluate")
compute_metrics = evaluate_module.compute_metrics


class FakeModel:
    def fit(self, X, y):
        self.classes_ = sorted(y.unique())
        return self

    def predict(self, X):
        return np.full(len(X), self.classes_[0])

    def predict_proba(self, X):
        n_classes = len(self.classes_)
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


def test_compute_metrics_uses_positive_class_probability_for_binary_targets():
    y_test = ["a", "b", "a", "b"]
    y_pred = ["a", "b", "a", "a"]
    y_proba = np.array([[0.9, 0.1], [0.2, 0.8], [0.7, 0.3], [0.6, 0.4]])

    accuracy, roc_auc = compute_metrics(y_test, y_pred, y_proba)

    assert accuracy == 0.75
    assert 0.0 <= roc_auc <= 1.0


def test_compute_metrics_uses_macro_ovr_for_multiclass_targets():
    y_test = ["a", "b", "c", "a", "b", "c"]
    y_pred = ["a", "b", "c", "a", "b", "a"]
    y_proba = np.full((6, 3), 1 / 3)

    accuracy, roc_auc = compute_metrics(y_test, y_pred, y_proba)

    assert accuracy == 5 / 6
    assert 0.0 <= roc_auc <= 1.0


def test_evaluate_computes_roc_auc_for_binary_targets():
    dataset = make_dataset(["a", "b"] * 10)

    result = evaluate(FakeModel(), dataset)

    assert result.openml_id == 1
    assert result.openml_name == "fake"
    assert 0.0 <= result.accuracy <= 1.0
    assert result.roc_auc is not None


def test_evaluate_computes_macro_roc_auc_for_multiclass_targets():
    dataset = make_dataset(["a", "b", "c"] * 10)

    result = evaluate(FakeModel(), dataset)

    assert 0.0 <= result.roc_auc <= 1.0


def test_evaluate_exposes_split_and_encoding_choices():
    dataset = make_dataset(["a", "b"] * 10)

    result = evaluate(
        FakeModel(), dataset, test_size=0.5, seed=1, stratify=False, encode=False
    )

    assert 0.0 <= result.accuracy <= 1.0


def test_dump_results_writes_timestamped_yaml_file(tmp_path, monkeypatch):
    monkeypatch.setattr(evaluate_module, "OUT_DIR", tmp_path)
    results = [
        ClassificationMetrics(openml_id=1, openml_name="fake", accuracy=0.9, roc_auc=0.95)
    ]
    model_config = {"model": "logistic_regression", "params": {"C": 1.0}}
    model_config_path = tmp_path / "config.yaml"

    output_path = dump_results(results, model_config, model_config_path)

    assert output_path.parent == tmp_path
    assert output_path.name.endswith("_logistic_regression.yaml")
    dumped = yaml.safe_load(output_path.read_text())
    assert dumped["model_config"] == model_config
    assert dumped["model_config_path"] == str(model_config_path)
    assert dumped["results"] == [
        {"openml_id": 1, "openml_name": "fake", "accuracy": 0.9, "roc_auc": 0.95}
    ]
