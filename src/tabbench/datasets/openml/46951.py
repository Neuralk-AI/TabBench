from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46951"
    task: str  = "classification"
    target: str = "SeedType"
    openml_id: int = 46951
    openml_name = "Pumpkin_Seeds"
