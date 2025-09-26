from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-1509"
    task: str  = "classification"
    target: str = "Class"
    openml_id: int = 1509
    openml_name = "walking-activity"
