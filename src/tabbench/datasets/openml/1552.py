from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-1552"
    task: str  = "classification"
    target: str = "Class"
    openml_id: int = 1552
    openml_name = "autoUniv-au7-1100"
