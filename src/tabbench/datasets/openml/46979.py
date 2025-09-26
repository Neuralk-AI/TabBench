from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46979"
    task: str  = "classification"
    target: str = "defects"
    openml_id: int = 46979
    openml_name = "jm1"
