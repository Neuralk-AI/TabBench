from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-41705"
    task: str  = "classification"
    target: str = "algorithm"
    openml_id: int = 41705
    openml_name = "ASP-POTASSCO-classification"
