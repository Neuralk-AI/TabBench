from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-43892"
    task: str  = "classification"
    target: str = "income96gt17"
    openml_id: int = 43892
    openml_name = "national-longitudinal-survey-binary"
