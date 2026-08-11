from dataclasses import dataclass
from enum import Enum

import openml
import pandas as pd


class TaskType(Enum):
    """The kind of prediction task a dataset is used for."""

    CLASSIFICATION = "classification"
    REGRESSION = "regression"


@dataclass
class Dataset:
    """A loaded tabular dataset paired with its benchmark metadata.

    Attributes
    ----------
    X : pd.DataFrame
        Feature columns.
    y : pd.Series
        Target column values.
    openml_id : int
        OpenML dataset ID.
    openml_name : str
        OpenML dataset name.
    description : str
        Short description of the prediction task.
    task : TaskType
        Task type.
    target : str
        Name of the target column.
    """

    X: pd.DataFrame
    y: pd.Series
    openml_id: int
    openml_name: str
    description: str
    task: TaskType
    target: str


class YamlKeys(str, Enum):
    """Keys expected in a dataset entry of openml.yaml."""

    OPENML_ID = "openml_id"
    OPENML_NAME = "openml_name"
    DESCRIPTION = "description"
    TASK = "task"
    TARGET = "target"


def load_dataset(yaml_dict: dict) -> Dataset:
    """Fetch a dataset from OpenML and split it into features and target.

    Parameters
    ----------
    yaml_dict : dict
        A single entry of openml.yaml, with keys openml_id, openml_name,
        description, task, target.

    Raises
    ------
    RuntimeError
        If yaml_dict is missing a required key or has an invalid task.
    """
    missing_keys = [key for key in YamlKeys if key not in yaml_dict]
    if missing_keys:
        raise RuntimeError(
            f"Invalid dataset entry {yaml_dict!r}: missing key(s) {missing_keys}"
        )

    try:
        task = TaskType(yaml_dict[YamlKeys.TASK])
    except ValueError:
        valid_tasks = [t.value for t in TaskType]
        raise RuntimeError(
            f"Invalid dataset entry {yaml_dict!r}: task {yaml_dict[YamlKeys.TASK]!r} is not one of {valid_tasks}"
        ) from None

    openml_dataset = openml.datasets.get_dataset(yaml_dict[YamlKeys.OPENML_ID])
    df, *_ = openml_dataset.get_data()
    target = yaml_dict[YamlKeys.TARGET]

    return Dataset(
        X=df.drop(columns=target),
        y=df[target],
        openml_id=yaml_dict[YamlKeys.OPENML_ID],
        openml_name=yaml_dict[YamlKeys.OPENML_NAME],
        description=yaml_dict[YamlKeys.DESCRIPTION],
        task=task,
        target=target,
    )
