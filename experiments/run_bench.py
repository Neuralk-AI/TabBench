from pathlib import Path
import json
import shutil
import os

import tabbench
import tabbench.datasets
import tabbench.datasets.openml
from neuralk_foundry_ce.utils.data import make_json_serializable
from neuralk_foundry_ce.models.classifier import (
    LightGBMClassifier, XGBoostClassifier, CatBoostClassifier,
    MLPClassifier,
    TabICLClassifier, TabPFNClassifier
)

if __name__ == '__main__':
    from tabbench.workflow.use_cases import Classification
    
    datasets = [
        1049, 1050, 1063, 1067, 1068, 11, 12, 14, 1462, 1464,
        1475, 1480, 1487, 1489, 1494, 15, 1510, 16, 18, 6332,
        181, 188, 22, 23, 23381, 29, 3, 31, 37, 40498, 40670,
        40701, 40900, 40966, 40975, 40981, 40982, 40983, 40984,
        40994, 41143, 41144, 41145, 41146, 41156, 44966, 44967,
        44971, 44972, 4538, 458, 469, 50, 54,
    ]

    # Name, class, categorical_encoding, numerical_encoding
    models = [
        ('xgboost', XGBoostClassifier, 'integer', 'none'),
        ('catboost', CatBoostClassifier, 'integer', 'none'),
        ('lightgbm', LightGBMClassifier, 'integer', 'none'),
        ('mlp', MLPClassifier, 'integer', 'standard'),
        ('tabicl', TabICLClassifier, 'none', 'none'),
        ('tabpfn', TabPFNClassifier, 'none', 'none'),
    ]
    script_dir = Path(__file__).resolve().parent

    for model_name, model_class, categorical_encoding, numerical_encoding in models:
        print('Model:', model_name)

        model_cache = script_dir / f'cache'

        for dataset in datasets:
            dataset = f'openml-{dataset}'
            print(f'Dataset {dataset}')

            try:
                for fold_index in range(5):
                    fold_cache = model_cache / dataset / f'fold_{fold_index}'
                    workflow = Classification(dataset, cache_dir=fold_cache)
                    workflow.set_parameter('categorical_encoding', categorical_encoding)
                    workflow.set_parameter('numerical_encoding', numerical_encoding)
                    workflow.set_classifier(model_class())
                    data, metrics = workflow.run(fold_index=fold_index)
                    print(metrics[model_class.name]['test_roc_auc'])
                    with open(fold_cache / 'results.json', 'w') as f:
                        json.dump(make_json_serializable(metrics), f)
            except Exception as e:
                print('FAILED')
                print(f'Error is: {e}')
                continue
            print('SUCCESS')
