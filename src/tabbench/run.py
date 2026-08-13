import argparse
import random
import sys

import numpy as np
import yaml

from tabbench.constants import DATASETS_FILE
from tabbench.engine import (
    ClassificationResults,
    ModelConfig,
    Status,
    available_baselines,
    dump_results,
    evaluate,
    load_dataset,
    load_model,
    resolve_config_path,
)


def add_arguments(parser: argparse.ArgumentParser) -> None:
    parser.add_argument(
        "--model",
        required=True,
        help=(
            "Name of a packaged baseline (" + ", ".join(available_baselines()) + ") "
            "or a path to a custom model's yaml config."
        ),
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


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    add_arguments(parser)
    return parser.parse_args()


def main(model: str, test_size: float, seed: int, stratify: bool) -> None:
    random.seed(seed)
    np.random.seed(seed)

    config_path = resolve_config_path(model)
    model_config = ModelConfig.load(config_path)
    datasets = yaml.safe_load(DATASETS_FILE.read_text())

    # Only check CUDA availability (which needs torch) for models that declare
    # they need it, to avoid clashes with OpenMP used in XGBoost/LightGBM.
    wrong_device = False
    if model_config.requires_cuda:
        import torch

        wrong_device = not torch.cuda.is_available()

    results = []
    for dataset in datasets:
        ds = load_dataset(dataset)
        if wrong_device:
            result = ClassificationResults.failure(
                ds.openml_id,
                ds.openml_name,
                Status.WRONG_DEVICE,
                error_message=f"{model} requires CUDA but no CUDA device is available",
            )
        else:
            loaded_model = load_model(model_config)
            # Seed torch's RNG here only if torch has been imported by the model.
            torch = sys.modules.get("torch")
            if torch is not None:
                torch.manual_seed(seed)
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
