from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-1043"
    task: str  = "classification"
    target: str = "label"
    openml_id: int = 1043
    openml_name = "ada_agnostic"
