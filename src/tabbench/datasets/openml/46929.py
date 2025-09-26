from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46929"
    task: str  = "classification"
    target: str = "FinancialDistressNextTwoYears"
    openml_id: int = 46929
    openml_name = "GiveMeSomeCredit"
