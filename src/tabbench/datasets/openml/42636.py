from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-42636"
    task: str  = "classification"
    target: str = "y"
    openml_id: int = 42636
    openml_name = "Long"
