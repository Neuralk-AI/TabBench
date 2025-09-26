from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46950"
    task: str  = "classification"
    target: str = "company_bankrupt"
    openml_id: int = 46950
    openml_name = "polish_companies_bankruptcy"
