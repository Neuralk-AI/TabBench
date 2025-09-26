from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46917"
    task: str  = "regression"
    target: str = "ConcreteCompressiveStrength"
    openml_id: int = 46917
    openml_name = "concrete_compressive_strength"
