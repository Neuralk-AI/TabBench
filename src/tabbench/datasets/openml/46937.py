from dataclasses import dataclass

from neuralk_foundry_ce.datasets.base import OpenMLDataConfig


@dataclass
class DataConfig(OpenMLDataConfig):
    name: str  = "openml-46937"
    task: str  = "classification"
    target: str = "AcceptCoupon"
    openml_id: int = 46937
    openml_name = "in_vehicle_coupon_recommendation"
