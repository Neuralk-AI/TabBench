from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46907"
    task: str  = "regression"
    target: str = "price"
    openml_id: int = 46907
    openml_name = "Another-Dataset-on-used-Fiat-500"
