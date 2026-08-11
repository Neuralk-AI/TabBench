from pathlib import Path

import yaml

from tabbench.engine.dataset import YamlKeys

OPENML_YAML = (
    Path(__file__).resolve().parents[1]
    / "src"
    / "tabbench"
    / "datasets"
    / "openml.yaml"
)


def test_openml_yaml_exists():
    assert OPENML_YAML.is_file()


def test_openml_yaml_sorted_by_openml_id():
    datasets = yaml.safe_load(OPENML_YAML.read_text())
    ids = [dataset["openml_id"] for dataset in datasets]
    assert ids == sorted(ids)


def test_openml_yaml_entries_have_required_keys():
    datasets = yaml.safe_load(OPENML_YAML.read_text())
    for dataset in datasets:
        assert set(dataset.keys()) == set(YamlKeys)
