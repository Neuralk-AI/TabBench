from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-40499"
    task: str  = "classification"
    target: str = "Class"
    openml_id: int = 40499
    openml_name = "texture"
