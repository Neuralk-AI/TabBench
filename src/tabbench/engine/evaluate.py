from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path

import pandas as pd
import yaml
from sklearn.metrics import accuracy_score, roc_auc_score
from sklearn.model_selection import train_test_split

from tabbench.constants import OUT_DIR

from .dataset import Dataset
from .model import Model


@dataclass
class Result:
    openml_id: int
    openml_name: str
    accuracy: float
    roc_auc: float | None


def evaluate(model: Model, dataset: Dataset) -> Result:
    """Train/test-split a dataset, fit a model, and score it with basic metrics.

    All current datasets and models are classification-only, so metrics are
    hardcoded accordingly (accuracy always, ROC AUC only for binary targets).
    """
    X = pd.get_dummies(dataset.X)
    X_train, X_test, y_train, y_test = train_test_split(
        X, dataset.y, test_size=0.2, random_state=0, stratify=dataset.y
    )

    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)

    roc_auc = None
    if y_proba.shape[1] == 2:
        roc_auc = float(roc_auc_score(y_test, y_proba[:, 1]))

    return Result(
        openml_id=dataset.openml_id,
        openml_name=dataset.openml_name,
        accuracy=float(accuracy_score(y_test, y_pred)),
        roc_auc=roc_auc,
    )


def dump_results(
    results: list[Result], model_config: dict, model_config_path: Path
) -> Path:
    """Write evaluation results to a timestamped yaml file in OUT_DIR."""
    OUT_DIR.mkdir(exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    output_path = OUT_DIR / f"{timestamp}_{model_config['model']}.yaml"
    output_path.write_text(
        yaml.dump(
            {
                "model_config_path": str(model_config_path),
                "model_config": model_config,
                "results": [asdict(result) for result in results],
            }
        )
    )
    return output_path
