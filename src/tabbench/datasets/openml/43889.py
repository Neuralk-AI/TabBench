from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-43889"
    task: str  = "classification"
    target: str = "ugpagt3"
    openml_id: int = 43889
    openml_name = "law-school-admission-bianry"
