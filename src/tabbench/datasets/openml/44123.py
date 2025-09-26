from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-44123"
    task: str  = "classification"
    target: str = "binaryClass"
    openml_id: int = 44123
    openml_name = "house_16H"
