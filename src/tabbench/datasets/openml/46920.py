from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46920"
    task: str  = "classification"
    target: str = "satisfaction"
    openml_id: int = 46920
    openml_name = "customer_satisfaction_in_airline"
