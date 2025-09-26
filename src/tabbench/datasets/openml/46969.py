from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46969"
    task: str  = "classification"
    target: str = "Malware"
    openml_id: int = 46969
    openml_name = "NATICUSdroid"
