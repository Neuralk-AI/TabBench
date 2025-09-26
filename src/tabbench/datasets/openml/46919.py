from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46919"
    task: str  = "classification"
    target: str = "DefaultOnPaymentNextMonth"
    openml_id: int = 46919
    openml_name = "credit_card_clients_default"
