import argparse  # noqa: I001
import random

import numpy as np
import yaml

from tabbench.constants import DATASETS_FILE
from tabbench.engine import (
    MODEL_REGISTRY,
    ClassificationResults,
    Status,
    default_config_path,
    dump_results,
    evaluate,
    load_dataset,
    load_model,
)

# Import after tabbench.engine: xgboost/lightgbm link Homebrew's libomp, while
# torch bundles its own copy. Loading torch's first segfaults on macOS once a
# model actually runs multi-threaded (e.g. during fit()).
import torch


def seed_everything(seed: int) -> None:
    """Seed the random, numpy, and torch global RNGs for reproducibility."""
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--model",
        choices=sorted(MODEL_REGISTRY),
        required=True,
        help="Name of a registered model.",
    )
    parser.add_argument(
        "--test-size",
        type=float,
        default=0.2,
        help="Fraction of each dataset held out for testing.",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=0,
        help="Random seed.",
    )
    parser.add_argument(
        "--stratify",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Stratify the train/test split on the target.",
    )
    return parser.parse_args()


def main(model: str, test_size: float, seed: int, stratify: bool) -> None:
    seed_everything(seed)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    config_path = default_config_path(model)
    model_config = yaml.safe_load(config_path.read_text())
    datasets = yaml.safe_load(DATASETS_FILE.read_text())

    results = []
    for dataset in datasets:
        ds = load_dataset(dataset)
        loaded_model = load_model(config_path)
        if loaded_model.requires_cuda and device.type != "cuda":
            result = ClassificationResults.failure(
                ds.openml_id,
                ds.openml_name,
                Status.WRONG_DEVICE,
                error_message=f"{model} requires CUDA but resolved device is {device}",
            )
        else:
            result = evaluate(
                loaded_model, ds, test_size=test_size, seed=seed, stratify=stratify
            )
        print(
            f"[debug] {result.openml_name}: "
            f"accuracy={result.metrics.accuracy:.4f} roc_auc={result.metrics.roc_auc}"
        )
        results.append(result)

    dump_results(results, model_config, config_path)


if __name__ == "__main__":
    main(**vars(_parse_args()))
