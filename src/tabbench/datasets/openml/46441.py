from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46441"
    task: str  = "classification"
    target: str = "credit_score"
    openml_id: int = 46441
    openml_name = "Credit_Score_Classification"
