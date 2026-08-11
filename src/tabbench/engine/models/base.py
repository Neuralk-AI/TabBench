from pathlib import Path

import yaml

from tabbench.engine import ClassificationModel

from .logistic_regression import LogisticRegression

MODEL_REGISTRY: dict[str, type[ClassificationModel]] = {
    "logistic_regression": LogisticRegression,
}


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
