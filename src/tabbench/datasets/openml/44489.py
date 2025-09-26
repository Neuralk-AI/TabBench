from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-44489"
    task: str  = "classification"
    target: str = "class"
    openml_id: int = 44489
    openml_name = "wilt_seed_1_nrows_2000_nclasses_10_ncols_100_stratify_True"
