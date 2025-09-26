from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-44186"
    task: str  = "classification"
    target: str = "UPSELLING"
    openml_id: int = 44186
    openml_name = "KDDCup09_upselling"
