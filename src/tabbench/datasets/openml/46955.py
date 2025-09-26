from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46955"
    task: str  = "classification"
    target: str = "ObjectType"
    openml_id: int = 46955
    openml_name = "SDSS17"
