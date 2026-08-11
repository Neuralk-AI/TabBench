import argparse
from pathlib import Path

import yaml

from tabbench.constants import DATASETS_FILE, OUT_DIR
from tabbench.engine import load_dataset, load_model


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--model",
        type=Path,
        required=True,
        help="Path to a .yaml model config file",
    )
    args = parser.parse_args()

    model = load_model(args.model)  # noqa: F841
    datasets = yaml.safe_load(DATASETS_FILE.read_text())

    for dataset in datasets:
        ds = load_dataset(dataset)
        print(
            f"[debug] loaded {ds.openml_name} (openml_id={ds.openml_id}): "
            f"X={ds.X.shape}, y={ds.y.shape}"
        )

    OUT_DIR.mkdir(exist_ok=True)
    results = {
        "model_config": str(args.model),
        "datasets": [d["openml_id"] for d in datasets],
    }
    (OUT_DIR / "results.yaml").write_text(yaml.dump(results))


if __name__ == "__main__":
    main()
