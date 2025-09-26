from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-1589"
    task: str  = "classification"
    target: str = "class"
    openml_id: int = 1589
    openml_name = "svmguide3"
