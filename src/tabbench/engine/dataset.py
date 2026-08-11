from dataclasses import dataclass

import openml
import pandas as pd

from tabbench.constants import YamlKeys

SUPPORTED_TASK = "classification"


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
    task : str
        Task type. Currently always "classification".
    target : str
        Name of the target column.
    """

    X: pd.DataFrame
    y: pd.Series
    openml_id: int
    openml_name: str
    description: str
    task: str
    target: str


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

    task = yaml_dict[YamlKeys.TASK]
    if task != SUPPORTED_TASK:
        raise RuntimeError(
            f"Invalid dataset entry {yaml_dict!r}: task {task!r} "
            f"is not {SUPPORTED_TASK!r}"
        )

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
