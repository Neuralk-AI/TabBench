from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-44150"
    task: str  = "classification"
    target: str = "lable"
    openml_id: int = 44150
    openml_name = "VulNoneVul"
