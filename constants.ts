
import { Dataset, Model, PerformanceResult, DatasetType, Metric } from './types';
import { tabIclUserDataTsv } from './data/academic/tabicl_data';
import { niclUserDataTsv } from './data/academic/nicl_data';
import { xgboostUserDataTsv } from './data/academic/xgboost_data';
import { catboostUserDataTsv } from './data/academic/catboost_data';
import { lightgbmUserDataTsv } from './data/academic/lightgbm_data';
import { tabpfnUserDataTsv } from './data/academic/tabpfn_data';
import { mlpUserDataTsv } from './data/academic/mlp_data';
import { niclProductCategorizationTsvData } from './data/industrial-categ/nicl_product_categorization_data';
import { tabIclProductCategorizationTsvData } from './data/industrial-categ/tabicl_product_categorization_data';
import { tabpfnProductCategorizationTsvData } from './data/industrial-categ/tabpfn_product_categorization_data';
import { catboostProductCategorizationTsvData } from './data/industrial-categ/catboost_product_categorization_data';
import { lightgbmProductCategorizationTsvData } from './data/industrial-categ/lightgbm_product_categorization_data';
import { mlpProductCategorizationTsvData } from './data/industrial-categ/mlp_product_categorization_data';
import { xgboostProductCategorizationTsvData } from './data/industrial-categ/xgboost_product_categorization_data';

export const MODELS: Model[] = [
  { id: 'xgboost', name: 'XGBoost', category: 'Tree-based' },
  { id: 'catboost', name: 'CatBoost', category: 'Tree-based' },
  { id: 'lightgbm', name: 'LightGBM', category: 'Tree-based' },
  { id: 'nicl', name: 'NICL', category: 'Neural In-Context Learning' },
  { id: 'tabicl', name: 'TabICL', category: 'Tabular In-Context Learning' },
  { id: 'mlp', name: 'MLP', category: 'Neural Network' },
  { id: 'tabpfn', name: 'TabPFNv2', category: 'Transformer' },
];

export const MODEL_COLORS: { [key: string]: string } = {
  'XGBoost': '#64748b', // slate-500
  'CatBoost': '#475569', // slate-600
  'LightGBM': '#d1d5db', // gray-300
  'NICL': '#1b998b',      // primary teal
  'TabICL': '#a1a1aa', // zinc-400
  'MLP': '#cbd5e1',       // slate-300
  'TabPFNv2': '#71717a', // zinc-500
  'Unknown Model': '#cccccc',
};

// Updated list of academic dataset raw names based on user's provided list
export const ACADEMIC_DATASET_RAW_NAMES: string[] = [
  "climate-model-simulation-crashes", "breast-w", "Satellite", "car", "wilt",
  "qsar-biodeg", "banknote-authentication", "jasmine", "ozone-level-8hr", "kc2",
  "ilpd", "credit-approval", "balance-scale", "kr-vs-kp", "yeast", "dna",
  "white_wine", "GesturePhaseSegmentationProcessed", "wine-quality-white", "pc1",
  "mfeat-morphological", "cmc", "pc4", "Australian", "segment", "analcatdata_dmft",
  "pc3", "wdbc", "analcatdata_authorship", "mfeat-karhunen", "MiceProtein",
  "churn", "phoneme", "mfeat-factors", "credit-g", "tic-tac-toe", "red_wine",
  "diabetes", "kc1", "blood-transfusion-service-center", "monks-problems-3",
  "mfeat-pixel", "monks-problems-1", "monks-problems-2", "eeg-eye-state",
  "spambase", "rmftsa_sleepdata", "colleges_usnews", "colleges_aaup", "gina_agnostic"
];

// Updated user-provided row counts map
const userProvidedRowCountsMap = new Map<string, number>([
  ["climate-model-simulation-crashes", 540], ["breast-w", 699], ["Satellite", 5100],
  ["car", 1728], ["wilt", 4839], ["qsar-biodeg", 1055], ["banknote-authentication", 1372],
  ["jasmine", 2984], ["ozone-level-8hr", 2534], ["kc2", 522], ["ilpd", 583],
  ["credit-approval", 690], ["balance-scale", 625], ["kr-vs-kp", 3196], ["yeast", 1484],
  ["dna", 3186], ["white_wine", 4898], ["GesturePhaseSegmentationProcessed", 9873],
  ["wine-quality-white", 4898], ["pc1", 1109], ["mfeat-morphological", 2000],
  ["cmc", 1473], ["pc4", 1458], ["Australian", 690], ["segment", 2310],
  ["analcatdata_dmft", 797], ["pc3", 1563], ["wdbc", 569], ["analcatdata_authorship", 841],
  ["mfeat-karhunen", 2000], ["MiceProtein", 1080], ["churn", 5000], ["phoneme", 5404],
  ["mfeat-factors", 2000], ["credit-g", 1000], ["tic-tac-toe", 958], ["red_wine", 1599],
  ["diabetes", 768], ["kc1", 2109], ["blood-transfusion-service-center", 748],
  ["monks-problems-3", 554], ["mfeat-pixel", 2000], ["monks-problems-1", 556],
  ["monks-problems-2", 601], ["eeg-eye-state", 14980], ["spambase", 4601],
  ["rmftsa_sleepdata", 1024], ["colleges_usnews", 1302], ["colleges_aaup", 1161],
  ["gina_agnostic", 3468]
]);

// Updated user-provided feature counts map
const userProvidedFeatureCountsMap = new Map<string, number>([
  ["climate-model-simulation-crashes", 21], ["breast-w", 10], ["Satellite", 37],
  ["car", 7], ["wilt", 6], ["qsar-biodeg", 42], ["banknote-authentication", 5],
  ["jasmine", 145], ["ozone-level-8hr", 73], ["kc2", 22], ["ilpd", 11],
  ["credit-approval", 16], ["balance-scale", 5], ["kr-vs-kp", 37], ["yeast", 9],
  ["dna", 181], ["white_wine", 12], ["GesturePhaseSegmentationProcessed", 33],
  ["wine-quality-white", 12], ["pc1", 22], ["mfeat-morphological", 7],
  ["cmc", 10], ["pc4", 38], ["Australian", 15], ["segment", 20],
  ["analcatdata_dmft", 5], ["pc3", 38], ["wdbc", 31], ["analcatdata_authorship", 71],
  ["mfeat-karhunen", 65], ["MiceProtein", 82], ["churn", 21], ["phoneme", 6],
  ["mfeat-factors", 217], ["credit-g", 21], ["tic-tac-toe", 10], ["red_wine", 12],
  ["diabetes", 9], ["kc1", 22], ["blood-transfusion-service-center", 5],
  ["monks-problems-3", 7], ["mfeat-pixel", 241], ["monks-problems-1", 7],
  ["monks-problems-2", 7], ["eeg-eye-state", 15], ["spambase", 58],
  ["rmftsa_sleepdata", 3], ["colleges_usnews", 34], ["colleges_aaup", 15],
  ["gina_agnostic", 971]
]);

// Rebuilt userProvidedNumClassesMap based on new list and existing data
const userProvidedNumClassesMap = new Map<string, number>([
  ["analcatdata_authorship", 4], ["analcatdata_dmft", 6], ["Australian", 2],
  ["balance-scale", 3], ["banknote-authentication", 2], ["blood-transfusion-service-center", 2],
  ["breast-w", 2], ["car", 4], ["churn", 2], ["climate-model-simulation-crashes", 2],
  ["cmc", 3], ["credit-approval", 2], ["credit-g", 2], ["diabetes", 2],
  ["dna", 3], ["GesturePhaseSegmentationProcessed", 5], ["ilpd", 2],
  ["jasmine", 2], ["kc1", 2], ["kc2", 2], ["kr-vs-kp", 2],
  ["mfeat-factors", 10], ["mfeat-karhunen", 10], ["mfeat-morphological", 10],
  ["MiceProtein", 8], ["ozone-level-8hr", 2], ["pc1", 2], ["pc3", 2],
  ["pc4", 2], ["phoneme", 2], ["qsar-biodeg", 2], ["red_wine", 6],
  ["Satellite", 6], ["segment", 7], ["tic-tac-toe", 2], ["wdbc", 2],
  ["white_wine", 7], ["wilt", 2], ["wine-quality-white", 7], ["yeast", 10]
  // Datasets like monks-problems-*, eeg-eye-state, etc., will not have entries
  // and thus numClasses will be undefined for them in newAcademicDatasets.
]);


const getProductCategorizationLevel = (index: number): number => {
  if (index >= 0 && index <= 8) return 2;
  if (index >= 9 && index <= 17) return 3;
  if (index >= 18 && index <= 26) return 4;
  if (index >= 27 && index <= 35) return 1;
  return 1;
};

const productCategorizationBatchFiles: string[] = [
  "level_2/batch_3.parquet", "level_2/batch_2.parquet", "level_2/batch_0.parquet",
  "level_2/batch_8.parquet", "level_2/batch_4.parquet", "level_2/batch_5.parquet",
  "level_2/batch_6.parquet", "level_2/batch_1.parquet", "level_2/batch_7.parquet",
  "level_3/batch_3.parquet", "level_3/batch_2.parquet", "level_3/batch_0.parquet",
  "level_3/batch_8.parquet", "level_3/batch_4.parquet", "level_3/batch_5.parquet",
  "level_3/batch_6.parquet", "level_3/batch_1.parquet", "level_3/batch_7.parquet",
  "level_4/batch_3.parquet", "level_4/batch_2.parquet", "level_4/batch_0.parquet",
  "level_4/batch_8.parquet", "level_4/batch_4.parquet", "level_4/batch_5.parquet",
  "level_4/batch_6.parquet", "level_4/batch_1.parquet", "level_4/batch_7.parquet",
  "level_1/batch_3.parquet", "level_1/batch_2.parquet", "level_1/batch_0.parquet",
  "level_1/batch_8.parquet", "level_1/batch_4.parquet", "level_1/batch_5.parquet",
  "level_1/batch_6.parquet", "level_1/batch_1.parquet", "level_1/batch_7.parquet",
];

const industrialUseCasesData: { [key: string]: { datasets: Dataset[], description: string, source: string, task?: string } } = {
  'product-categorization': {
    description: 'Assigning products to the correct category based on their attributes, using a standardized set of 36 datasets.',
    source: 'Major retail player',
    datasets: Array.from({ length: 36 }, (_, i) => {
      const datasetNumber = i + 1;
      return {
        id: `industrial-pc-new-${datasetNumber}`,
        name: `Dataset ${datasetNumber}`,
        type: DatasetType.INDUSTRIAL,
        description: `An industrial dataset (No. ${datasetNumber}) for product categorization with 3000 rows. Features include product title and description.`,
        source: `Major retail player`,
        rows: 3000,
        features: "Title, Description",
        targetVariable: 'Category_ID',
        useCaseSlug: 'product-categorization',
        level: getProductCategorizationLevel(i),
        batchFile: productCategorizationBatchFiles[i] || 'N/A',
      };
    }),
  },
  'deduplication': {
    description: 'Identifying duplicate records in product listings or customer databases.',
    source: 'Synthetic & Partner Data',
    task: 'Binary Classification (Pairwise)',
    datasets: [],
  },
};

export const newAcademicDatasets: Dataset[] = ACADEMIC_DATASET_RAW_NAMES.map((rawName) => {
  const id = `academic-openml-${rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const userRowCount = userProvidedRowCountsMap.get(rawName);
  const userFeatureCount = userProvidedFeatureCountsMap.get(rawName);
  const userNumClasses = userProvidedNumClassesMap.get(rawName);
  const hasRealCounts = userRowCount !== undefined && userFeatureCount !== undefined;

  return {
    id,
    name: `${rawName.replace(/_/g, ' ').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
    type: DatasetType.ACADEMIC,
    description: `Benchmark dataset: ${rawName}. Used for general classification tasks.`,
    source: 'OpenML.org / User-specified',
    rows: userRowCount !== undefined ? userRowCount : 0, // Default to 0 if not found
    features: userFeatureCount !== undefined ? userFeatureCount : 0, // Default to 0 if not found
    task: 'Classification',
    targetVariable: 'class',
    hasRealCounts: hasRealCounts,
    numClasses: userNumClasses, // Will be undefined if not in map
  };
});

// All datasets from the new list are intended for averaging if they have real counts
const datasetsToAverageOver = newAcademicDatasets.filter(ds => ds.hasRealCounts === true);

const industrialDatasets: Dataset[] = Object.values(industrialUseCasesData).flatMap(uc => uc.datasets);
export const DATASETS: Dataset[] = [...industrialDatasets, ...newAcademicDatasets];

const parseTsvData = (tsvData: string, modelId: string, metricMapping: { accuracy: string, f1: string, auc: string }): PerformanceResult[] => {
  const results: PerformanceResult[] = [];
  const lines = tsvData.trim().split('\n');
  if (lines.length <=1) return [];

  const headers = lines[0].split('\t').map(h => h.trim());
  const datasetNameIndex = headers.indexOf('dataset_name');

  if (datasetNameIndex === -1) {
    console.error(`TSV for ${modelId} is missing 'dataset_name' header.`);
    return [];
  }

  const getStdDevColName = (meanColName: string) => meanColName.replace(/^mean_/, 'std_');

  const accMeanCol = metricMapping.accuracy;
  const accStdCol = getStdDevColName(accMeanCol);
  const f1MeanCol = metricMapping.f1;
  const f1StdCol = getStdDevColName(f1MeanCol);
  const aucMeanCol = metricMapping.auc;
  const aucStdCol = getStdDevColName(aucMeanCol);

  const accIndex = headers.indexOf(accMeanCol);
  const accStdIndex = headers.indexOf(accStdCol);
  const f1Index = headers.indexOf(f1MeanCol);
  const f1StdIndex = headers.indexOf(f1StdCol);
  const aucIndex = headers.indexOf(aucMeanCol);
  const aucStdIndex = headers.indexOf(aucStdCol);

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('\t').map(v => v.trim());
    if (values.length !== headers.length) continue;

    const rawDatasetName = values[datasetNameIndex];
    // Match against newAcademicDatasets first
    let matchedDataset = newAcademicDatasets.find(d => {
        const normalizedNewDatasetName = d.name.toLowerCase().replace(/ /g, '_');
        const normalizedRawTsvName = rawDatasetName.toLowerCase();
        return normalizedNewDatasetName === normalizedRawTsvName || // exact match after normalization
               d.name.toLowerCase() === normalizedRawTsvName || // direct name match
               d.id.endsWith(normalizedRawTsvName.replace(/[^a-z0-9]+/g, '-')); // id match
    });


    if (!matchedDataset) { // Then check industrial
        matchedDataset = industrialDatasets.find(d => {
            if (d.name.toLowerCase() === rawDatasetName.toLowerCase() ||
                d.id.endsWith(rawDatasetName.toLowerCase().replace(/[^a-z0-9]+/g, '-'))) {
                return true;
            }
            if (d.batchFile && rawDatasetName.endsWith(d.batchFile)) {
                 return true;
            }
            return false;
        });
    }

    if (!matchedDataset) {
      continue;
    }

    const metrics: Metric[] = [];
    if (accIndex !== -1 && values[accIndex] && !isNaN(parseFloat(values[accIndex]))) {
      const metric: Metric = { name: 'Accuracy', value: parseFloat(parseFloat(values[accIndex]).toFixed(4)) };
      if (accStdIndex !== -1 && values[accStdIndex] && !isNaN(parseFloat(values[accStdIndex]))) {
        metric.stdDev = parseFloat(parseFloat(values[accStdIndex]).toFixed(4));
      }
      metrics.push(metric);
    }
    if (f1Index !== -1 && values[f1Index] && !isNaN(parseFloat(values[f1Index]))) {
      const metric: Metric = { name: 'F1 Score', value: parseFloat(parseFloat(values[f1Index]).toFixed(4)) };
      if (f1StdIndex !== -1 && values[f1StdIndex] && !isNaN(parseFloat(values[f1StdIndex]))) {
        metric.stdDev = parseFloat(parseFloat(values[f1StdIndex]).toFixed(4));
      }
      metrics.push(metric);
    }
    if (aucIndex !== -1 && values[aucIndex] && !isNaN(parseFloat(values[aucIndex]))) {
      const metric: Metric = { name: 'AUC', value: parseFloat(parseFloat(values[aucIndex]).toFixed(4)) };
       if (aucStdIndex !== -1 && values[aucStdIndex] && !isNaN(parseFloat(values[aucStdIndex]))) {
        metric.stdDev = parseFloat(parseFloat(values[aucStdIndex]).toFixed(4));
      }
      metrics.push(metric);
    }

    if (metrics.length > 0) {
        results.push({
            datasetId: matchedDataset.id,
            modelId: modelId,
            metrics: metrics,
        });
    }
  }
  return results;
};

const tabIclUserMetrics = parseTsvData(tabIclUserDataTsv, 'tabicl', { accuracy: 'mean_accuracy', f1: 'mean_macro_f1', auc: 'mean_roc_auc_ovo' });
const niclUserMetrics = parseTsvData(niclUserDataTsv, 'nicl', { accuracy: 'mean_accuracy', f1: 'mean_macro_f1', auc: 'mean_roc_auc_ovo' });
const xgboostUserMetrics = parseTsvData(xgboostUserDataTsv, 'xgboost', { accuracy: 'mean_accuracy', f1: 'mean_macro_f1', auc: 'mean_roc_auc_ovo' });
const catboostUserMetrics = parseTsvData(catboostUserDataTsv, 'catboost', { accuracy: 'mean_accuracy', f1: 'mean_macro_f1', auc: 'mean_roc_auc_ovo' });
const lightgbmUserMetrics = parseTsvData(lightgbmUserDataTsv, 'lightgbm', { accuracy: 'mean_accuracy', f1: 'mean_macro_f1', auc: 'mean_roc_auc_ovo' });
const tabpfnUserMetrics = parseTsvData(tabpfnUserDataTsv, 'tabpfn', { accuracy: 'mean_accuracy', f1: 'mean_macro_f1', auc: 'mean_roc_auc_ovo'});
const mlpUserMetrics = parseTsvData(mlpUserDataTsv, 'mlp', { accuracy: 'mean_accuracy', f1: 'mean_macro_f1', auc: 'mean_roc_auc_ovo'});

const niclProductCategorizationUserMetrics = parseTsvData(niclProductCategorizationTsvData, 'nicl', { accuracy: 'mean_accuracy', f1: 'mean_macro_f1', auc: 'mean_roc_auc_ovo' });
const tabIclProductCategorizationUserMetrics = parseTsvData(tabIclProductCategorizationTsvData, 'tabicl', { accuracy: 'mean_accuracy', f1: 'mean_macro_f1', auc: 'mean_roc_auc_ovo' });
const tabpfnProductCategorizationUserMetrics = parseTsvData(tabpfnProductCategorizationTsvData, 'tabpfn', { accuracy: 'mean_accuracy', f1: 'mean_macro_f1', auc: 'mean_roc_auc_ovo' });
const catboostProductCategorizationUserMetrics = parseTsvData(catboostProductCategorizationTsvData, 'catboost', { accuracy: 'mean_accuracy', f1: 'mean_macro_f1', auc: 'mean_roc_auc_ovo' });
const lightgbmProductCategorizationUserMetrics = parseTsvData(lightgbmProductCategorizationTsvData, 'lightgbm', { accuracy: 'mean_accuracy', f1: 'mean_macro_f1', auc: 'mean_roc_auc_ovo' });
const mlpProductCategorizationUserMetrics = parseTsvData(mlpProductCategorizationTsvData, 'mlp', { accuracy: 'mean_accuracy', f1: 'mean_macro_f1', auc: 'mean_roc_auc_ovo' });
const xgboostProductCategorizationUserMetrics = parseTsvData(xgboostProductCategorizationTsvData, 'xgboost', { accuracy: 'mean_accuracy', f1: 'mean_macro_f1', auc: 'mean_roc_auc_ovo' });

let individualNewAcademicResults: PerformanceResult[] = [];
newAcademicDatasets.forEach((dataset) => {
  MODELS.forEach(model => {
    let userMetricsProvided = false;
    let metricsSource: PerformanceResult | undefined;

    if (model.id === 'tabicl') metricsSource = tabIclUserMetrics.find(r => r.datasetId === dataset.id);
    else if (model.id === 'nicl') metricsSource = niclUserMetrics.find(r => r.datasetId === dataset.id);
    else if (model.id === 'xgboost') metricsSource = xgboostUserMetrics.find(r => r.datasetId === dataset.id);
    else if (model.id === 'catboost') metricsSource = catboostUserMetrics.find(r => r.datasetId === dataset.id);
    else if (model.id === 'lightgbm') metricsSource = lightgbmUserMetrics.find(r => r.datasetId === dataset.id);
    else if (model.id === 'tabpfn') metricsSource = tabpfnUserMetrics.find(r => r.datasetId === dataset.id);
    else if (model.id === 'mlp') metricsSource = mlpUserMetrics.find(r => r.datasetId === dataset.id);

    if (metricsSource && metricsSource.metrics.length > 0) {
      individualNewAcademicResults.push({
        datasetId: dataset.id,
        modelId: model.id,
        metrics: metricsSource.metrics,
      });
      userMetricsProvided = true;
    }

    if (!userMetricsProvided) {
      // If metrics are not found in TSV for a specified academic dataset,
      // push metrics with NaN values.
      const nanMetrics: Metric[] = [
        { name: 'Accuracy', value: NaN },
        { name: 'F1 Score', value: NaN },
        { name: 'AUC', value: NaN },
      ];
      individualNewAcademicResults.push({
        datasetId: dataset.id,
        modelId: model.id,
        metrics: nanMetrics,
      });
    }
  });
});

const trulyAveragedNewAcademicResults: PerformanceResult[] = [];
const modelMetricsAccumulator: {
    [modelId: string]: {
        [metricName: string]: { sum: number; count: number; sumOfSquares: number };
    };
} = {};

MODELS.forEach(model => {
    modelMetricsAccumulator[model.id] = {
        Accuracy: { sum: 0, count: 0, sumOfSquares: 0 },
        'F1 Score': { sum: 0, count: 0, sumOfSquares: 0 },
        AUC: { sum: 0, count: 0, sumOfSquares: 0 },
    };
});

const datasetsToAverageOverIds = datasetsToAverageOver.map(ds => ds.id);

individualNewAcademicResults.forEach(result => {
    if (datasetsToAverageOverIds.includes(result.datasetId)) {
        result.metrics.forEach(metric => {
            if (modelMetricsAccumulator[result.modelId]?.[metric.name] && !isNaN(metric.value)) {
                modelMetricsAccumulator[result.modelId][metric.name].sum += metric.value;
                modelMetricsAccumulator[result.modelId][metric.name].sumOfSquares += metric.value * metric.value;
                modelMetricsAccumulator[result.modelId][metric.name].count++;
            }
        });
    }
});

MODELS.forEach(model => {
    const avgMetrics: Metric[] = [];
    ['Accuracy', 'F1 Score', 'AUC'].forEach(metricName => {
        const acc = modelMetricsAccumulator[model.id]?.[metricName];
        if (acc && acc.count > 0) {
            const mean = acc.sum / acc.count;
            const variance = (acc.sumOfSquares / acc.count) - (mean * mean);
            const stdDev = variance > 0 ? Math.sqrt(variance) : 0;
            avgMetrics.push({
                name: metricName,
                value: parseFloat(mean.toFixed(4)),
                stdDev: parseFloat(stdDev.toFixed(4)),
            });
        } else { // If no valid data to average, push NaN
             avgMetrics.push({ name: metricName, value: NaN, stdDev: NaN });
        }
    });

    // Push result even if all metrics are NaN, to represent the model in the average table
    trulyAveragedNewAcademicResults.push({
        datasetId: 'academic-openml-avg',
        modelId: model.id,
        metrics: avgMetrics,
    });
});


export const newAverageAcademicDataset: Dataset = {
    id: 'academic-openml-avg',
    name: `OpenML Academic Average (${datasetsToAverageOver.length} Datasets)`,
    type: DatasetType.ACADEMIC,
    description: `Average performance across ${datasetsToAverageOver.length} selected OpenML classification datasets. This provides a general overview of model performance on common academic benchmarks. Only datasets with available, non-NaN results for a given model contribute to that model's average for each metric.`,
    source: 'Aggregated from OpenML.org / User-specified',
    rows: parseFloat((datasetsToAverageOver.reduce((sum, ds) => sum + ds.rows, 0) / (datasetsToAverageOver.length || 1)).toFixed(0)),
    features: datasetsToAverageOver.length > 0 ? Math.floor(datasetsToAverageOver.reduce((sum, ds) => sum + (ds.features as number), 0) / datasetsToAverageOver.length) : 0,
    task: 'Average Classification Performance',
    targetVariable: 'N/A',
    hasRealCounts: true, 
    numClasses: 'Varies',
};

const avgDatasetExists = DATASETS.some(ds => ds.id === newAverageAcademicDataset.id);
if (!avgDatasetExists && datasetsToAverageOver.length > 0) {
    DATASETS.push(newAverageAcademicDataset);
} else if (avgDatasetExists && datasetsToAverageOver.length > 0) {
    const existingAvgIndex = DATASETS.findIndex(ds => ds.id === newAverageAcademicDataset.id);
    if (existingAvgIndex !== -1) {
        DATASETS[existingAvgIndex] = newAverageAcademicDataset;
    }
} else if (avgDatasetExists && datasetsToAverageOver.length === 0) { // if no datasets to average, remove avg entry
    const existingAvgIndex = DATASETS.findIndex(ds => ds.id === newAverageAcademicDataset.id);
    if (existingAvgIndex !== -1) {
        DATASETS.splice(existingAvgIndex, 1);
    }
}

let industrialResults: PerformanceResult[] = [];
industrialDatasets.forEach(dataset => {
  MODELS.forEach(model => {
    let metricsSource: PerformanceResult | undefined;
    let userMetricsProvided = false;

    if (model.id === 'tabicl') {
        metricsSource = tabIclProductCategorizationUserMetrics.find(r => r.datasetId === dataset.id);
        if (!metricsSource && dataset.useCaseSlug !== 'product-categorization') {
             metricsSource = tabIclUserMetrics.find(r => r.datasetId === dataset.id);
        }
    } else if (model.id === 'nicl') {
        metricsSource = niclProductCategorizationUserMetrics.find(r => r.datasetId === dataset.id);
        if (!metricsSource && dataset.useCaseSlug !== 'product-categorization') {
             metricsSource = niclUserMetrics.find(r => r.datasetId === dataset.id);
        }
    } else if (model.id === 'tabpfn') {
        if (dataset.useCaseSlug === 'product-categorization') {
            metricsSource = tabpfnProductCategorizationUserMetrics.find(r => r.datasetId === dataset.id);
        }
    } else if (model.id === 'catboost') {
        if (dataset.useCaseSlug === 'product-categorization') {
            metricsSource = catboostProductCategorizationUserMetrics.find(r => r.datasetId === dataset.id);
        }
        if (!metricsSource) {
            metricsSource = catboostUserMetrics.find(r => r.datasetId === dataset.id);
        }
    } else if (model.id === 'lightgbm') {
        if (dataset.useCaseSlug === 'product-categorization') {
            metricsSource = lightgbmProductCategorizationUserMetrics.find(r => r.datasetId === dataset.id);
        }
        if (!metricsSource) {
            metricsSource = lightgbmUserMetrics.find(r => r.datasetId === dataset.id);
        }
    } else if (model.id === 'mlp') {
        if (dataset.useCaseSlug === 'product-categorization') {
            metricsSource = mlpProductCategorizationUserMetrics.find(r => r.datasetId === dataset.id);
        }
        if (!metricsSource) {
            metricsSource = mlpUserMetrics.find(r => r.datasetId === dataset.id);
        }
    } else if (model.id === 'xgboost') {
        if (dataset.useCaseSlug === 'product-categorization') {
            metricsSource = xgboostProductCategorizationUserMetrics.find(r => r.datasetId === dataset.id);
        }
        if (!metricsSource) {
            metricsSource = xgboostUserMetrics.find(r => r.datasetId === dataset.id);
        }
    }

    if (metricsSource && metricsSource.metrics.length > 0) {
        industrialResults.push({
            datasetId: dataset.id,
            modelId: model.id,
            metrics: metricsSource.metrics,
        });
        userMetricsProvided = true;
    }

    if (!userMetricsProvided) {
         const nanMetrics: Metric[] = [
                { name: 'Accuracy', value: NaN }, { name: 'F1 Score', value: NaN }, { name: 'AUC', value: NaN }
            ];
          industrialResults.push({ datasetId: dataset.id, modelId: model.id, metrics: nanMetrics }); 
    }
  });
});

export const RESULTS: PerformanceResult[] = [
  ...industrialResults,
  ...individualNewAcademicResults,
  ...(datasetsToAverageOver.length > 0 ? trulyAveragedNewAcademicResults : [])
];
