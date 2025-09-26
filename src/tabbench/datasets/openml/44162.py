from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-44162"
    task: str  = "classification"
    target: str = "is_recid"
    openml_id: int = 44162
    openml_name = "compass"
