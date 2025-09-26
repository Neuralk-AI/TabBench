from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-44528"
    task: str  = "classification"
    target: str = "Delay"
    openml_id: int = 44528
    openml_name = "airlines_seed_0_nrows_2000_nclasses_10_ncols_100_stratify_True"
