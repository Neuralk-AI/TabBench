from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-44124"
    task: str  = "classification"
    target: str = "binaryClass"
    openml_id: int = 44124
    openml_name = "kdd_ipums_la_97-small"
