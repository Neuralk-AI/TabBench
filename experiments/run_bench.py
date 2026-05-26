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
    
    # 188 OpenML classification datasets — the public TabBench v2 base
    # (kept in sync with hf/tabbench/base_datasets.json).
    datasets = [
        3, 6, 11, 12, 14, 15, 16, 18, 20, 22,
        23, 28, 29, 30, 31, 32, 36, 37, 44, 46,
        54, 60, 137, 179, 181, 182, 184, 185, 188, 251,
        255, 301, 310, 334, 335, 372, 458, 469, 741, 803,
        930, 1037, 1038, 1043, 1046, 1049, 1050, 1063, 1067, 1068,
        1120, 1220, 1444, 1459, 1462, 1464, 1471, 1475, 1476, 1480,
        1481, 1487, 1489, 1491, 1492, 1493, 1494, 1496, 1497, 1501,
        1509, 1510, 1548, 1552, 1557, 4538, 6332, 23381, 40478, 40497,
        40499, 40646, 40649, 40664, 40668, 40670, 40677, 40678, 40685, 40701,
        40707, 40708, 40900, 40966, 40975, 40981, 40982, 40983, 40994, 41027,
        41143, 41156, 41169, 41671, 41705, 41721, 41865, 41875, 41882, 41972,
        42178, 42464, 42636, 43039, 43582, 43672, 43812, 43889, 43892, 43895,
        44089, 44122, 44123, 44124, 44130, 44150, 44160, 44162, 44186, 44489,
        44528, 44966, 44967, 44971, 44972, 45040, 45052, 45062, 45064, 45067,
        45075, 45536, 45537, 45538, 45539, 45540, 45547, 45553, 45558, 45578,
        46356, 46441, 46597, 46905, 46906, 46908, 46910, 46911, 46912, 46916,
        46919, 46920, 46922, 46924, 46925, 46927, 46929, 46930, 46932, 46933,
        46935, 46937, 46938, 46940, 46941, 46944, 46947, 46950, 46951, 46955,
        46956, 46958, 46960, 46962, 46963, 46969, 46979, 46980,
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
                    with open(fold_cache / f'results_{model_name}.json', 'w') as f:
                        json.dump(make_json_serializable(metrics), f)
            except Exception as e:
                print('FAILED')
                print(f'Error is: {e}')
                continue
            print('SUCCESS')
