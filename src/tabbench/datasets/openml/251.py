from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-251"
    task: str  = "classification"
    target: str = "Class"
    openml_id: int = 251
    openml_name = "BNG(breast-w)"
