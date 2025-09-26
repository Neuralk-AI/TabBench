from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-43672"
    task: str  = "classification"
    target: str = "target"
    openml_id: int = 43672
    openml_name = "Heart-Disease-Dataset-(Comprehensive)"
