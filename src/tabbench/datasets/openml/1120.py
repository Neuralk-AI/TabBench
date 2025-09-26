from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-1120"
    task: str  = "classification"
    target: str = "class:"
    openml_id: int = 1120
    openml_name = "MagicTelescope"
