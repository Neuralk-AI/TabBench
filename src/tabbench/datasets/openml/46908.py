from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46908"
    task: str  = "classification"
    target: str = "AirPressureSystemFailure"
    openml_id: int = 46908
    openml_name = "APSFailure"
