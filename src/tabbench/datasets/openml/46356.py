from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46356"
    task: str  = "classification"
    target: str = "target"
    openml_id: int = 46356
    openml_name = "GermanCreditData"
