from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46916"
    task: str  = "classification"
    target: str = "MobileHomePolicy"
    openml_id: int = 46916
    openml_name = "coil2000_insurance_policies"
