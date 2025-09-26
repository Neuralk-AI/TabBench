from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46912"
    task: str  = "classification"
    target: str = "MoleculeElicitsResponse"
    openml_id: int = 46912
    openml_name = "Bioresponse"
