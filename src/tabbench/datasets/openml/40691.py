from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-40691"
    task: str  = "classification"
    target: str = "class"
    openml_id: int = 40691
    openml_name = "wine-quality-red"
