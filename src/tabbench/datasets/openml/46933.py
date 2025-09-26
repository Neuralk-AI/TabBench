from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46933"
    task: str  = "classification"
    target: str = "CompoundActivity"
    openml_id: int = 46933
    openml_name = "hiva_agnostic"
