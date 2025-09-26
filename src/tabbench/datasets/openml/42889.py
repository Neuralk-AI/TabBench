from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-42889"
    task: str  = "classification"
    target: str = "Class"
    openml_id: int = 42889
    openml_name = "shill-bidding"
