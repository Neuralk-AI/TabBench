from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-43895"
    task: str  = "classification"
    target: str = "PerformanceRating"
    openml_id: int = 43895
    openml_name = "ibm-employee-performance"
