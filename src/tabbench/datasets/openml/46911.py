from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46911"
    task: str  = "classification"
    target: str = "churn"
    openml_id: int = 46911
    openml_name = "Bank_Customer_Churn"
