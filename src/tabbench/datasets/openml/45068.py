from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-45068"
    task: str  = "classification"
    target: str = "class"
    openml_id: int = 45068
    openml_name = "adult"
