from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46922"
    task: str  = "classification"
    target: str = "EarlyReadmission"
    openml_id: int = 46922
    openml_name = "Diabetes130US"
