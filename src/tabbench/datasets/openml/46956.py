from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46956"
    task: str  = "classification"
    target: str = "HighEnergySeismicBump"
    openml_id: int = 46956
    openml_name = "seismic-bumps"
