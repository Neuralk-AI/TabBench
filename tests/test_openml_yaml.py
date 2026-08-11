import yaml

from tabbench.constants import DATASETS_FILE, YamlKeys


def test_openml_yaml_exists():
    assert DATASETS_FILE.is_file()


def test_openml_yaml_sorted_by_openml_id():
    datasets = yaml.safe_load(DATASETS_FILE.read_text())
    ids = [dataset["openml_id"] for dataset in datasets]
    assert ids == sorted(ids)


def test_openml_yaml_entries_have_required_keys():
    datasets = yaml.safe_load(DATASETS_FILE.read_text())
    for dataset in datasets:
        assert set(dataset.keys()) == set(YamlKeys)
