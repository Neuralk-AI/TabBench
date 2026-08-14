import argparse
import random
import sys
import traceback

import numpy as np
import yaml

from tabbench.constants import DATASETS_FILE, YamlKeys
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


def _model(model_arg: str) -> str:
    """Check --model resolves, so a typo is an argparse error and not a traceback.

    Returns model_arg unchanged rather than the resolved path, to keep main()
    callable with a plain baseline name.
    """
    try:
        resolve_config_path(model_arg)
    except RuntimeError as error:
        raise argparse.ArgumentTypeError(str(error)) from None
    return model_arg


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--model",
        required=True,
        type=_model,
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
    return parser.parse_args()


def _run_dataset(
    dataset: dict,
    model_config: ModelConfig,
    test_size: float,
    seed: int,
    stratify: bool,
) -> ClassificationResults:
    """Evaluate one dataset, or record what stopped it.

    Failures are recorded rather than raised so that one unreachable dataset or one
    model that dislikes one target does not end a sweep. The stage that failed is
    reported because an engine bug fails at the same stage on every dataset, which a
    bare message would make indistinguishable from many unrelated model failures. The
    traceback still reaches stderr, so a recorded failure is never a silent one.
    """
    stage = "load_dataset"
    try:
        ds = load_dataset(dataset)
        stage = "load_model"
        loaded_model = load_model(model_config)
        # Seed torch's RNG here only if torch has been imported by the model.
        torch = sys.modules.get("torch")
        if torch is not None:
            torch.manual_seed(seed)
        stage = "evaluate"
        return evaluate(
            loaded_model, ds, test_size=test_size, seed=seed, stratify=stratify
        )
    except Exception as exc:
        traceback.print_exc()
        return ClassificationResults.failure(
            dataset[YamlKeys.OPENML_ID],
            dataset[YamlKeys.OPENML_NAME],
            Status.FAILURE,
            error_message=f"{stage}: {type(exc).__name__}: {exc}",
        )


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
    try:
        for dataset in datasets:
            if wrong_device:
                result = ClassificationResults.failure(
                    dataset[YamlKeys.OPENML_ID],
                    dataset[YamlKeys.OPENML_NAME],
                    Status.WRONG_DEVICE,
                    error_message=(
                        f"{model} requires CUDA but no CUDA device is available"
                    ),
                )
            else:
                result = _run_dataset(dataset, model_config, test_size, seed, stratify)
            print(
                f"[debug] {result.openml_name}: "
                f"accuracy={result.metrics.accuracy:.4f} roc_auc={result.metrics.roc_auc}"
            )
            results.append(result)
    finally:
        dump_results(results, model_config, config_path)


if __name__ == "__main__":
    main(**vars(_parse_args()))
