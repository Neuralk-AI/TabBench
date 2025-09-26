from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-43812"
    task: str  = "classification"
    target: str = "Target"
    openml_id: int = 43812
    openml_name = "Performance-Prediction"
