from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46931"
    task: str  = "regression"
    target: str = "charges"
    openml_id: int = 46931
    openml_name = "healthcare_insurance_expenses"
