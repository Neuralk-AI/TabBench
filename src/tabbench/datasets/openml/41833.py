from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-41833"
    task: str  = "classification"
    target: str = "Class"
    openml_id: int = 41833
    openml_name = "FOREX_cadjpy-hour-High"
