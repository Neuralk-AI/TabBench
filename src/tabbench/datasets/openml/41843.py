from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-41843"
    task: str  = "classification"
    target: str = "Class"
    openml_id: int = 41843
    openml_name = "FOREX_audusd-hour-High"
