from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-43039"
    task: str  = "classification"
    target: str = "Action"
    openml_id: int = 43039
    openml_name = "internet-firewall"
