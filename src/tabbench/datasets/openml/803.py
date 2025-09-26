from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-803"
    task: str  = "classification"
    target: str = "binaryClass"
    openml_id: int = 803
    openml_name = "delta_ailerons"
