from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46953"
    task: str  = "regression"
    target: str = "MEDIAN_PXC50"
    openml_id: int = 46953
    openml_name = "QSAR-TID-11"
