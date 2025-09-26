from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-41875"
    task: str  = "classification"
    target: str = "Class"
    openml_id: int = 41875
    openml_name = "FOREX_audchf-day-High"
