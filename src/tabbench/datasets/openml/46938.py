from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46938"
    task: str  = "classification"
    target: str = "bad_client_target"
    openml_id: int = 46938
    openml_name = "Is-this-a-good-customer"
