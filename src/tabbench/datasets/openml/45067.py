from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-45067"
    task: str  = "classification"
    target: str = "class"
    openml_id: int = 45067
    openml_name = "okcupid_stem"
