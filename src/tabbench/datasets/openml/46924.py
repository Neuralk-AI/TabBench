from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46924"
    task: str  = "classification"
    target: str = "ArrivedLate"
    openml_id: int = 46924
    openml_name = "E-CommereShippingData"
