from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-44091"
    task: str  = "classification"
    target: str = "quality"
    openml_id: int = 44091
    openml_name = "wine"
