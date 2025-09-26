from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46930"
    task: str  = "classification"
    target: str = "Contaminated"
    openml_id: int = 46930
    openml_name = "hazelnut-spread-contaminant-detection"
