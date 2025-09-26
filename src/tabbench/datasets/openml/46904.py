from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46904"
    task: str  = "regression"
    target: str = "scaled-sound-pressure"
    openml_id: int = 46904
    openml_name = "airfoil_self_noise"
