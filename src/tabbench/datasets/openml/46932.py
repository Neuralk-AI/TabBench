from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46932"
    task: str  = "classification"
    target: str = "RiskPerformance"
    openml_id: int = 46932
    openml_name = "heloc"
