import importlib
from pathlib import Path

from tabbench.engine.model import ClassificationModel, ModelConfig

_MODELS_DIR = Path(__file__).parent


def available_baselines() -> list[str]:
    """Names of packaged baselines, discovered from models/<name>/config.yaml on disk."""
    return sorted(p.parent.name for p in _MODELS_DIR.glob("*/config.yaml"))


def resolve_config_path(model_arg: str) -> Path:
    """Resolve a --model argument to a config.yaml path.

    model_arg is either a path to a yaml config (ending in ".yaml"), or the name
    of a packaged baseline, resolved by convention to models/<name>/config.yaml.
    """
    if model_arg.endswith(".yaml"):
        path = Path(model_arg)
        if not path.is_file():
            raise RuntimeError(f"Config file not found: {model_arg}")
        return path
    path = _MODELS_DIR / model_arg / "config.yaml"
    if not path.is_file():
        raise RuntimeError(
            f"Unknown baseline model {model_arg!r}; "
            f"expected one of {available_baselines()}"
        )
    return path


def load_model(config: ModelConfig) -> ClassificationModel:
    """Instantiate the model described by a ModelConfig, forwarding its params."""
    module_path, class_name = config.target.rsplit(".", 1)
    model_cls = getattr(importlib.import_module(module_path), class_name)
    return model_cls(**config.params)
