from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46947"
    task: str  = "classification"
    target: str = "Revenue"
    openml_id: int = 46947
    openml_name = "online_shoppers_intention"
