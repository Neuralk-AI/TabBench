from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-372"
    task: str  = "classification"
    target: str = "Actual_Time"
    openml_id: int = 372
    openml_name = "internet_usage"
