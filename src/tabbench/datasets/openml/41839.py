from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-41839"
    task: str  = "classification"
    target: str = "Class"
    openml_id: int = 41839
    openml_name = "FOREX_cadjpy-day-High"
