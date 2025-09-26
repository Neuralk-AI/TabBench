from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-1220"
    task: str  = "classification"
    target: str = "click"
    openml_id: int = 1220
    openml_name = "Click_prediction_small"
