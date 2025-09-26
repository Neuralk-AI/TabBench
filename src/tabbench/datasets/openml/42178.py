from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-42178"
    task: str  = "classification"
    target: str = "Churn"
    openml_id: int = 42178
    openml_name = "telco-customer-churn"
