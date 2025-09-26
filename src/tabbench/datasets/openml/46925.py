from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46925"
    task: str  = "classification"
    target: str = "LeaveOrNot"
    openml_id: int = 46925
    openml_name = "Employee"
