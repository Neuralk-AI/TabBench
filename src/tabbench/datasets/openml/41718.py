from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-41718"
    task: str  = "classification"
    target: str = "Class"
    openml_id: int = 41718
    openml_name = "FOREX_audjpy-hour-High"
