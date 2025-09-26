from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-43582"
    task: str  = "classification"
    target: str = "Outcome"
    openml_id: int = 43582
    openml_name = "Pima-Indians-Diabetes"
