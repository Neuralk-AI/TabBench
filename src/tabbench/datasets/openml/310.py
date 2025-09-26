from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-310"
    task: str  = "classification"
    target: str = "class"
    openml_id: int = 310
    openml_name = "mammography"
