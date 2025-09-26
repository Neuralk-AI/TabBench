from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46941"
    task: str  = "classification"
    target: str = "RiskLevel"
    openml_id: int = 46941
    openml_name = "maternal_health_risk"
