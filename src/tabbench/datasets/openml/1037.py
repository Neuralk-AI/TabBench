from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-1037"
    task: str  = "classification"
    target: str = "label"
    openml_id: int = 1037
    openml_name = "ada_prior"
