from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-1046"
    task: str  = "classification"
    target: str = "state"
    openml_id: int = 1046
    openml_name = "mozilla4"
