from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46958"
    task: str  = "classification"
    target: str = "SiteType"
    openml_id: int = 46958
    openml_name = "splice"
