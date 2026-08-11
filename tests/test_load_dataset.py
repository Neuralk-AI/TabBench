import pandas as pd
import pytest

from tabbench.engine import Dataset, TaskType, load_dataset

VALID_ENTRY = {
    "openml_id": 3,
    "openml_name": "kr-vs-kp",
    "description": "Predict whether White can win a chess endgame.",
    "task": "classification",
    "target": "class",
}


class FakeOpenMLDataset:
    def __init__(self, df):
        self._df = df

    def get_data(self):
        return self._df, None, None, None


def test_load_dataset_returns_populated_dataset(monkeypatch):
    df = pd.DataFrame({"a": [1, 2], "b": [3, 4], "class": ["won", "lost"]})
    monkeypatch.setattr(
        "tabbench.engine.dataset.openml.datasets.get_dataset",
        lambda openml_id: FakeOpenMLDataset(df),
    )

    dataset = load_dataset(VALID_ENTRY)

    assert isinstance(dataset, Dataset)
    assert list(dataset.X.columns) == ["a", "b"]
    assert list(dataset.y) == ["won", "lost"]
    assert dataset.task is TaskType.CLASSIFICATION
    assert dataset.openml_id == 3
    assert dataset.openml_name == "kr-vs-kp"
    assert dataset.target == "class"


def test_load_dataset_raises_runtime_error_on_invalid_task(monkeypatch):
    def fail_if_called(openml_id):
        raise AssertionError(
            "openml.datasets.get_dataset should not be called for invalid input"
        )

    monkeypatch.setattr(
        "tabbench.engine.dataset.openml.datasets.get_dataset", fail_if_called
    )

    invalid_entry = {**VALID_ENTRY, "task": "clustering"}

    with pytest.raises(RuntimeError, match="clustering"):
        load_dataset(invalid_entry)


def test_load_dataset_raises_runtime_error_on_missing_key(monkeypatch):
    def fail_if_called(openml_id):
        raise AssertionError(
            "openml.datasets.get_dataset should not be called for invalid input"
        )

    monkeypatch.setattr(
        "tabbench.engine.dataset.openml.datasets.get_dataset", fail_if_called
    )

    invalid_entry = {
        key: value for key, value in VALID_ENTRY.items() if key != "target"
    }

    with pytest.raises(RuntimeError, match="target"):
        load_dataset(invalid_entry)
