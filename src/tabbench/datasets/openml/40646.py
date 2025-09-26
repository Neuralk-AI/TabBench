from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-40646"
    task: str  = "classification"
    target: str = "class"
    openml_id: int = 40646
    openml_name = "GAMETES_Epistasis_2-Way_20atts_0.1H_EDM-1_1"
