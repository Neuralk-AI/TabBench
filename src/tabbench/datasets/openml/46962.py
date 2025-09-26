from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46962"
    task: str  = "classification"
    target: str = "Bankrupt"
    openml_id: int = 46962
    openml_name = "taiwanese_bankruptcy_prediction"
