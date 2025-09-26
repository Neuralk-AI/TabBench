from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46"
    task: str  = "classification"
    target: str = "Class"
    openml_id: int = 46
    openml_name = "splice"
