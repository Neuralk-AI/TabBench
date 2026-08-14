import argparse
import random
import sys

import numpy as np
import yaml

from tabbench.constants import DATASETS_FILE
from tabbench.engine import (
    ModelConfig,
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


def main():
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
    args = parser.parse_args()
    random.seed(args.seed)
    np.random.seed(args.seed)

    config_path = resolve_config_path(args.model)
    model_config = ModelConfig.load(config_path)
    datasets = yaml.safe_load(DATASETS_FILE.read_text())

    results = []
    for dataset in datasets:
        ds = load_dataset(dataset)
        model = load_model(model_config)
        # Seed torch's RNG here only if torch has been imported by the model.
        torch = sys.modules.get("torch")
        if torch is not None:
            torch.manual_seed(args.seed)
        result = evaluate(
            model, ds, test_size=args.test_size, seed=args.seed, stratify=args.stratify
        )
        print(
            f"[debug] {result.openml_name}: "
            f"accuracy={result.metrics.accuracy:.4f} roc_auc={result.metrics.roc_auc}"
        )
        results.append(result)

    dump_results(results, model_config, config_path)


if __name__ == "__main__":
    main()
