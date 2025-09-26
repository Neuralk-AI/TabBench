from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-41972"
    task: str  = "classification"
    target: str = "Class"
    openml_id: int = 41972
    openml_name = "Indian_pines"
