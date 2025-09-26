from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-185"
    task: str  = "classification"
    target: str = "Hall_of_Fame"
    openml_id: int = 185
    openml_name = "baseball"
