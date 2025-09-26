from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-41027"
    task: str  = "classification"
    target: str = "class"
    openml_id: int = 41027
    openml_name = "jungle_chess_2pcs_raw_endgame_complete"
