from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-1444"
    task: str  = "classification"
    target: str = "def"
    openml_id: int = 1444
    openml_name = "PizzaCutter3"
