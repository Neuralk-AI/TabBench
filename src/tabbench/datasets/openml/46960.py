from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46960"
    task: str  = "classification"
    target: str = "AcademicOutcome"
    openml_id: int = 46960
    openml_name = "students_dropout_and_academic_success"
