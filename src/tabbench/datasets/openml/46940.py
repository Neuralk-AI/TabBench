from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46940"
    task: str  = "classification"
    target: str = "Response"
    openml_id: int = 46940
    openml_name = "Marketing_Campaign"
