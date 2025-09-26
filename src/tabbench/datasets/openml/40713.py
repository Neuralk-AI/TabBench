from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-40713"
    task: str  = "classification"
    target: str = "class"
    openml_id: int = 40713
    openml_name = "dis"
