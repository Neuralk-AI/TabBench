from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-44089"
    task: str  = "classification"
    target: str = "SeriousDlqin2yrs"
    openml_id: int = 44089
    openml_name = "credit"
