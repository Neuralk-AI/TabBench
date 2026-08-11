import argparse
from pathlib import Path
from typing import Any

import yaml

from tabbench.engine import load_dataset

REPO_ROOT = Path(__file__).resolve().parents[2]
DATASETS_FILE = Path(__file__).resolve().parent / "datasets" / "openml.yaml"
OUT_DIR = REPO_ROOT / "out"


def load_model(model_path: Path) -> Any:
    return None


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
            f"[debug] loaded {ds.openml_name} (openml_id={ds.openml_id}): X={ds.X.shape}, y={ds.y.shape}"
        )

    OUT_DIR.mkdir(exist_ok=True)
    results = {
        "model_config": str(args.model),
        "datasets": [d["openml_id"] for d in datasets],
    }
    (OUT_DIR / "results.yaml").write_text(yaml.dump(results))


if __name__ == "__main__":
    main()
