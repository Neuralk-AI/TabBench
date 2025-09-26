from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-40649"
    task: str  = "classification"
    target: str = "class"
    openml_id: int = 40649
    openml_name = "GAMETES_Heterogeneity_20atts_1600_Het_0.4_0.2_50_EDM-2_001"
