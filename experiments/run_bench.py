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
        23381, 1063, 40994, 6332, 335, 333, 1510, 1480, 334, 11,
        44967, 29, 40981, 15, 188, 1464, 43582, 37, 469, 458, 54,
        46906, 50, 46356, 31, 46941, 741, 1444, 1494, 44966, 1453, 
        40966, 1552, 1068, 488, 42464, 43672, 1479, 1589, 41705,
        930, 43812, 185, 46963, 1462, 1049, 43895, 23, 45052, 181, 
        46927, 1050, 1501, 40691, 44972, 1493, 40649, 1492, 40646, 
        1491, 46980, 46938, 40975, 40664, 41882, 41875, 41721, 41839, 
        40982, 14, 44528, 20, 44489, 46944, 22, 12, 16, 18, 1067,
        46597, 46940, 40984, 36, 46930, 45539, 45538, 45537, 45536,
        45540, 46951, 1548, 1487, 301, 44091, 46956, 40478, 41143,
        41144, 40670, 46, 46958, 3, 40678, 40677, 1038, 46912,
        40708, 40713, 40497, 40707, 46933, 41156, 1557, 46960, 42636,
        1037, 1043, 44, 46925, 40983, 40498, 44971, 43892, 44160,
        40701, 60, 45075, 40900, 41146, 44186, 44124, 1489, 1497, 
        30, 40499, 28, 44150, 41145, 46950, 1475, 42889, 182, 46962,
        42178, 803, 1496, 1507, 46969, 44130, 41972, 46916, 45553,
        4538, 375, 46911, 45062, 44122, 372, 1459, 46932, 46979,
        1044, 32, 46924, 45040, 310, 46947, 46937, 44123, 1476,
        1471, 1046, 44162, 44089, 45558, 1120, 46935, 6, 41671,
        45578, 43889, 45064, 45067, 1481, 184, 46919, 46905, 137,
        251, 1220, 41763, 41718, 41865, 41833, 41843, 41027, 46910,
        151, 45068, 179, 46939, 255, 40685, 41169, 43039, 40668,
        45547, 46922, 46908, 46955, 46441, 46920, 1509, 46929
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
