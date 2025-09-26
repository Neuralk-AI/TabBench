from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46597"
    task: str  = "classification"
    target: str = "NObeyesdad"
    openml_id: int = 46597
    openml_name = "Estimation_of_Obesity_Levels"
