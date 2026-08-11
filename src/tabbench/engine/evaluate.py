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
class ClassificationMetrics:
    openml_id: int
    openml_name: str
    accuracy: float
    roc_auc: float


def compute_metrics(y_test, y_pred, y_proba) -> tuple[float, float]:
    """Compute accuracy and ROC AUC (binary, or macro-averaged one-vs-rest)."""
    accuracy = float(accuracy_score(y_test, y_pred))
    if y_proba.shape[1] == 2:
        roc_auc = float(roc_auc_score(y_test, y_proba[:, 1]))
    else:
        roc_auc = float(
            roc_auc_score(y_test, y_proba, multi_class="ovr", average="macro")
        )
    return accuracy, roc_auc


def evaluate(
    model: Model,
    dataset: Dataset,
    test_size: float = 0.2,
    seed: int = 0,
    stratify: bool = True,
    encode: bool = True,
) -> ClassificationMetrics:
    """Train/test-split a dataset, fit a model, and score it with basic metrics.

    encode one-hot encodes dataset.X (sklearn estimators can't take OpenML's
    categorical dtype columns directly).
    """
    X = pd.get_dummies(dataset.X) if encode else dataset.X
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        dataset.y,
        test_size=test_size,
        random_state=seed,
        stratify=dataset.y if stratify else None,
    )

    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)
    accuracy, roc_auc = compute_metrics(y_test, y_pred, y_proba)

    return ClassificationMetrics(
        openml_id=dataset.openml_id,
        openml_name=dataset.openml_name,
        accuracy=accuracy,
        roc_auc=roc_auc,
    )


def dump_results(
    results: list[ClassificationMetrics], model_config: dict, model_config_path: Path
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
