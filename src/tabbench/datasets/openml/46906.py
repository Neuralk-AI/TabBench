from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46906"
    task: str  = "classification"
    target: str = "classes"
    openml_id: int = 46906
    openml_name = "anneal"
