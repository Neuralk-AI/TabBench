import subprocess
import sys

import numpy as np
import pandas as pd

from tabbench.engine import LightGBM


def test_load_reads_params_from_yaml(tmp_path):
    path = tmp_path / "lightgbm.yaml"
    path.write_text("model: lightgbm\nparams:\n  n_estimators: 5\n")

    model = LightGBM.load(path)

    assert model.estimator.n_estimators == 5


def test_fit_predict_roundtrip(tmp_path):
    path = tmp_path / "lightgbm.yaml"
    path.write_text("model: lightgbm\nparams:\n  n_estimators: 5\n")
    model = LightGBM.load(path)

    X = pd.DataFrame({"a": [0, 0, 1, 1], "b": [0, 1, 0, 1]})
    y = pd.Series(["low", "low", "high", "high"])
    model.fit(X, y)

    predictions = model.predict(X)
    assert set(predictions) <= {"low", "high"}
    assert len(predictions) == len(X)

    probabilities = model.predict_proba(X)
    assert probabilities.shape == (len(X), 2)
    assert np.allclose(probabilities.sum(axis=1), 1.0)


def test_fit_does_not_crash_after_importing_tabbench_run(tmp_path):
    """On macOS, torch bundles its own libomp while lightgbm links homebrew's;
    having both initialized in-process segfaults once fit() runs threads.
    Imports tabbench.run itself, rather than replaying its import order by
    hand, so this stays a regression test for run.py's actual import order."""
    path = tmp_path / "lightgbm.yaml"
    path.write_text("model: lightgbm\nparams:\n  n_estimators: 5\n  verbose: -1\n")
    script = f"""
import tabbench.run
import pandas as pd
from pathlib import Path
from tabbench.engine import LightGBM

model = LightGBM.load(Path({str(path)!r}))
X = pd.DataFrame({{"a": [0, 0, 1, 1], "b": [0, 1, 0, 1]}})
y = pd.Series(["low", "low", "high", "high"])
model.fit(X, y)
"""
    result = subprocess.run([sys.executable, "-c", script], capture_output=True)
    assert result.returncode == 0, result.stderr.decode()
