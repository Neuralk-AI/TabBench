from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-45578"
    task: str  = "classification"
    target: str = "medianHouseValue"
    openml_id: int = 45578
    openml_name = "California-Housing-Classification"
