import subprocess
import sys

import pytest


@pytest.mark.parametrize(
    ("model_arg", "expected"),
    [
        pytest.param("xgbost", "Unknown baseline model 'xgbost'", id="typo_in_baseline"),
        pytest.param("missing.yaml", "Config file not found", id="missing_config_file"),
    ],
)
def test_unresolvable_model_exits_cleanly_without_a_traceback(model_arg, expected):
    """--model is validated while arguments are parsed, so an unusable value is an
    argparse error rather than a traceback raised part-way into a run.
    """
    result = subprocess.run(
        [sys.executable, "-m", "tabbench.run", "--model", model_arg],
        capture_output=True,
    )

    stderr = result.stderr.decode()
    assert result.returncode == 2  # argparse's exit code for a usage error
    assert "Traceback" not in stderr
    assert expected in stderr


def test_model_help_lists_the_packaged_baselines():
    result = subprocess.run(
        [sys.executable, "-m", "tabbench.run", "--help"], capture_output=True
    )

    assert result.returncode == 0
    assert "xgboost" in result.stdout.decode()
