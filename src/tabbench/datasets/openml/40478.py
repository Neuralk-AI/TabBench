from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-40478"
    task: str  = "classification"
    target: str = "Class"
    openml_id: int = 40478
    openml_name = "thyroid-dis"
