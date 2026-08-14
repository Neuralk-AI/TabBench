from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path

import numpy as np
import pandas as pd
import yaml
from sklearn.metrics import (
    accuracy_score,
    matthews_corrcoef,
    multilabel_confusion_matrix,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split

from tabbench.constants import OUT_DIR

from .dataset import Dataset
from .model import ClassificationModel, ModelConfig


@dataclass
class ClassificationMetrics:
    """Scores for a binary target, or macro-averaged one-vs-rest for multiclass.

    Attributes
    ----------
    accuracy : float
    roc_auc : float
    tpr : float
        True positive rate.
    fpr : float
        False positive rate.
    tnr : float
        True negative rate.
    fnr : float
        False negative rate.
    mcc : float
        Matthews correlation coefficient.
    """

    accuracy: float
    roc_auc: float
    tpr: float
    fpr: float
    tnr: float
    fnr: float
    mcc: float


@dataclass
class ClassificationResults:
    """Metrics and per-row predictions from evaluating a model on a dataset.

    Attributes
    ----------
    openml_id : int
        OpenML dataset ID.
    openml_name : str
        OpenML dataset name.
    metrics : ClassificationMetrics
        Scores on the test split.
    predictions : pd.DataFrame
        Test-split y_true, y_pred, and per-class predicted probabilities
        (proba_<class> columns).
    """

    openml_id: int
    openml_name: str
    metrics: ClassificationMetrics
    predictions: pd.DataFrame


def evaluate(
    model: ClassificationModel,
    dataset: Dataset,
    test_size: float,
    seed: int,
    stratify: bool,
) -> ClassificationResults:
    """Train/test-split a dataset, fit a model, and score it with basic metrics.

    Parameters
    ----------
    model : ClassificationModel
        Model to fit and evaluate.
    dataset : Dataset
        Dataset to split into train/test.
    test_size : float
        Fraction of the dataset held out for testing.
    seed : int
        Random state for the train/test split.
    stratify : bool
        Whether to stratify the split on dataset.y.

    Returns
    -------
    ClassificationResults
    """
    # FIXME: naive one-hot encoding until proper data processing is added.
    X = pd.get_dummies(dataset.X)
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
    classes = model.classes_
    metrics = _compute_metrics(y_test, y_pred, y_proba, classes)

    predictions = pd.DataFrame(y_proba, columns=[f"proba_{label}" for label in classes])
    predictions.insert(0, "y_pred", y_pred)
    predictions.insert(0, "y_true", y_test.to_numpy())

    return ClassificationResults(
        openml_id=dataset.openml_id,
        openml_name=dataset.openml_name,
        metrics=metrics,
        predictions=predictions,
    )


def dump_results(
    results: list[ClassificationResults],
    model_config: ModelConfig,
    model_config_path: Path,
) -> Path:
    """Write a run's metrics summary and per-dataset predictions to OUT_DIR.

    Creates OUT_DIR/<timestamp>_<model_name>/, containing summary.yaml and one
    <openml_id>_<openml_name>.parquet file of predictions per dataset.

    Parameters
    ----------
    results : list of ClassificationResults
        One per evaluated dataset.
    model_config : ModelConfig
        Parsed model yaml config, embedded verbatim in summary.yaml.
    model_config_path : Path
        Path to the model yaml config, recorded in summary.yaml.

    Returns
    -------
    Path
        The created run directory.
    """
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    run_dir = OUT_DIR / f"{timestamp}_{model_config.name}"
    run_dir.mkdir(parents=True)

    (run_dir / "summary.yaml").write_text(
        yaml.dump(
            {
                "model_config_path": str(model_config_path),
                "model_config": asdict(model_config),
                "results": [
                    {
                        "openml_id": result.openml_id,
                        "openml_name": result.openml_name,
                        "metrics": asdict(result.metrics),
                    }
                    for result in results
                ],
            },
            sort_keys=False,
        )
    )
    for result in results:
        predictions_path = run_dir / f"{result.openml_id}_{result.openml_name}.parquet"
        result.predictions.to_parquet(predictions_path)

    return run_dir


def _compute_metrics(
    y_test: np.ndarray, y_pred: np.ndarray, y_proba: np.ndarray, classes: np.ndarray
) -> ClassificationMetrics:
    """Score a binary target directly, or macro-average one-vs-rest for multiclass."""
    confusion = multilabel_confusion_matrix(y_test, y_pred, labels=classes)
    tn, fp = confusion[:, 0, 0], confusion[:, 0, 1]
    fn, tp = confusion[:, 1, 0], confusion[:, 1, 1]
    tpr_per_class = tp / (tp + fn)
    fpr_per_class = fp / (fp + tn)
    tnr_per_class = tn / (tn + fp)
    fnr_per_class = fn / (fn + tp)

    if len(classes) == 2:
        roc_auc = float(roc_auc_score(y_test, y_proba[:, 1]))
        tpr, fpr = float(tpr_per_class[1]), float(fpr_per_class[1])
        tnr, fnr = float(tnr_per_class[1]), float(fnr_per_class[1])
    else:
        roc_auc = float(
            roc_auc_score(
                y_test, y_proba, multi_class="ovr", average="macro", labels=classes
            )
        )
        tpr, fpr = float(tpr_per_class.mean()), float(fpr_per_class.mean())
        tnr, fnr = float(tnr_per_class.mean()), float(fnr_per_class.mean())

    return ClassificationMetrics(
        accuracy=float(accuracy_score(y_test, y_pred)),
        roc_auc=roc_auc,
        tpr=tpr,
        fpr=fpr,
        tnr=tnr,
        fnr=fnr,
        mcc=float(matthews_corrcoef(y_test, y_pred)),
    )
