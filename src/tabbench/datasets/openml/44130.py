from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-44130"
    task: str  = "classification"
    target: str = "label"
    openml_id: int = 44130
    openml_name = "eye_movements"
