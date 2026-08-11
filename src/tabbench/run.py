import argparse
from pathlib import Path

import yaml

from tabbench.constants import DATASETS_FILE
from tabbench.engine import dump_results, evaluate, load_dataset, load_model


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--model",
        type=Path,
        required=True,
        help="Path to a .yaml model config file",
    )
    args = parser.parse_args()

    model_config = yaml.safe_load(args.model.read_text())
    datasets = yaml.safe_load(DATASETS_FILE.read_text())

    results = []
    for dataset in datasets:
        ds = load_dataset(dataset)
        model = load_model(args.model)
        result = evaluate(model, ds)
        print(
            f"[debug] {result.openml_name}: "
            f"accuracy={result.accuracy:.4f} roc_auc={result.roc_auc}"
        )
        results.append(result)

    dump_results(results, model_config, args.model)


if __name__ == "__main__":
    main()
