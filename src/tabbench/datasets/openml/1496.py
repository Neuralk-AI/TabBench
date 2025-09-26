from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-1496"
    task: str  = "classification"
    target: str = "Class"
    openml_id: int = 1496
    openml_name = "ringnorm"
