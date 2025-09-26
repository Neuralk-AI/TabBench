from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46905"
    task: str  = "classification"
    target: str = "ResourceApproved"
    openml_id: int = 46905
    openml_name = "Amazon_employee_access"
