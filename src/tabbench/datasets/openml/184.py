from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-184"
    task: str  = "classification"
    target: str = "game"
    openml_id: int = 184
    openml_name = "kropt"
