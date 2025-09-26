from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-42464"
    task: str  = "classification"
    target: str = "class"
    openml_id: int = 42464
    openml_name = "Waterstress"
