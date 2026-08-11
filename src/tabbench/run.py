import argparse
import random
from pathlib import Path

import numpy as np
import yaml

from tabbench.constants import DATASETS_FILE
from tabbench.engine import dump_results, evaluate, load_dataset, load_model


def seed_everything(seed: int) -> None:
    """Seed the random and numpy global RNGs for reproducibility."""
    random.seed(seed)
    np.random.seed(seed)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--model",
        type=Path,
        required=True,
        help="Path to a .yaml model config file.",
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
    seed_everything(args.seed)

    model_config = yaml.safe_load(args.model.read_text())
    datasets = yaml.safe_load(DATASETS_FILE.read_text())

    results = []
    for dataset in datasets:
        ds = load_dataset(dataset)
        model = load_model(args.model)
        result = evaluate(
            model, ds, test_size=args.test_size, seed=args.seed, stratify=args.stratify
        )
        print(
            f"[debug] {result.openml_name}: "
            f"accuracy={result.metrics.accuracy:.4f} roc_auc={result.metrics.roc_auc}"
        )
        results.append(result)

    dump_results(results, model_config, args.model)


if __name__ == "__main__":
    main()
