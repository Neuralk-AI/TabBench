from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46927"
    task: str  = "classification"
    target: str = "attended"
    openml_id: int = 46927
    openml_name = "Fitness_Club"
