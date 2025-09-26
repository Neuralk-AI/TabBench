from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46954"
    task: str  = "regression"
    target: str = "LC50"
    openml_id: int = 46954
    openml_name = "QSAR_fish_toxicity"