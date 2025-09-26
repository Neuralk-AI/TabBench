from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-45547"
    task: str  = "classification"
    target: str = "cardio"
    openml_id: int = 45547
    openml_name = "Cardiovascular-Disease-dataset"
