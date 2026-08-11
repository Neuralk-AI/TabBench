from pathlib import Path

import yaml

from tabbench.engine import ClassificationModel

from .lightgbm import LightGBM
from .logistic_regression import LogisticRegression
from .random_forest import RandomForest
from .xgboost import XGBoost

MODEL_REGISTRY: dict[str, type[ClassificationModel]] = {
    "lightgbm": LightGBM,
    "logistic_regression": LogisticRegression,
    "random_forest": RandomForest,
    "xgboost": XGBoost,
}


def default_config_path(name: str) -> Path:
    """Path to the packaged default config.yaml for a registered model name."""
    if name not in MODEL_REGISTRY:
        raise RuntimeError(
            f"Unknown model {name!r}; expected one of {list(MODEL_REGISTRY)}"
        )
    return Path(__file__).parent / name / "config.yaml"


def load_model(path: Path) -> ClassificationModel:
    """Instantiate the model named by the "model" key of a yaml config file."""
    yaml_dict = yaml.safe_load(path.read_text())
    name = yaml_dict["model"]
    try:
        model_cls = MODEL_REGISTRY[name]
    except KeyError:
        raise RuntimeError(
            f"Unknown model {name!r} in {path}; expected one of {list(MODEL_REGISTRY)}"
        ) from None
    return model_cls.load(path)
