from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46939"
    task: str  = "classification"
    target: str = "appetency"
    openml_id: int = 46939
    openml_name = "kddcup09_appetency"
