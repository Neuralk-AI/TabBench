from enum import Enum
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
DATASETS_FILE = Path(__file__).resolve().parent / "openml.yaml"
OUT_DIR = REPO_ROOT / "out"


class YamlKeys(str, Enum):
    """Keys expected in a dataset entry of openml.yaml."""

    OPENML_ID = "openml_id"
    OPENML_NAME = "openml_name"
    DESCRIPTION = "description"
    TASK = "task"
    TARGET = "target"
