from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46910"
    task: str  = "classification"
    target: str = "SubscribeTermDeposit"
    openml_id: int = 46910
    openml_name = "bank-marketing"
