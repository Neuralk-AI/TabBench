from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-1459"
    task: str  = "classification"
    target: str = "Class"
    openml_id: int = 1459
    openml_name = "artificial-characters"
