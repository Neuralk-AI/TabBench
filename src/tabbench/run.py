import argparse
from pathlib import Path
from typing import Any

import yaml

REPO_ROOT = Path(__file__).resolve().parents[2]
DATASETS_FILE = Path(__file__).resolve().parent / "datasets" / "openml.yaml"
OUT_DIR = REPO_ROOT / "out"


def load_model(model_path: Path) -> Any:
    return None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("model_config", type=Path, help="Path to a .yaml model config file")
    args = parser.parse_args()

    model = load_model(args.model_config)
    datasets = yaml.safe_load(DATASETS_FILE.read_text())

    for dataset in datasets:
        pass

    OUT_DIR.mkdir(exist_ok=True)
    results = {"model_config": str(args.model_config), "datasets": [d["openml_id"] for d in datasets]}
    (OUT_DIR / "results.yaml").write_text(yaml.dump(results))


if __name__ == "__main__":
    main()
