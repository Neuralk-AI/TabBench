from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-255"
    task: str  = "classification"
    target: str = "Contraceptive_method_used"
    openml_id: int = 255
    openml_name = "BNG(cmc)"
