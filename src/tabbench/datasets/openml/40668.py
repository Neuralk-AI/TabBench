from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-40668"
    task: str  = "classification"
    target: str = "class"
    openml_id: int = 40668
    openml_name = "connect-4"
