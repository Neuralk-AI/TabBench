from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46935"
    task: str  = "classification"
    target: str = "LookingForJobChange"
    openml_id: int = 46935
    openml_name = "HR_Analytics_Job_Change_of_Data_Scientists"
