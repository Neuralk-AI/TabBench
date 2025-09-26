from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-45040"
    task: str  = "classification"
    target: str = "Diagnosis"
    openml_id: int = 45040
    openml_name = "Intersectional-Bias-Assessment"
