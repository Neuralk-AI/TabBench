from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-45553"
    task: str  = "classification"
    target: str = "RiskPerformance"
    openml_id: int = 45553
    openml_name = "FICO-HELOC-cleaned"
