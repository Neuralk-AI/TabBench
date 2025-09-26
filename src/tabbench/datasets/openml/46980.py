from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46980"
    task: str  = "classification"
    target: str = "LET_IS"
    openml_id: int = 46980
    openml_name = "MIC"
