from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46944"
    task: str  = "classification"
    target: str = "price_range"
    openml_id: int = 46944
    openml_name = "Mobile_Price"
