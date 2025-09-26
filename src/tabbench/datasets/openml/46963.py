from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46963"
    task: str  = "classification"
    target: str = "WebsiteType"
    openml_id: int = 46963
    openml_name = "website_phishing"
