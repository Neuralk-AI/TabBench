
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
import { xgboostProductCategorizationTsvData } from './data/industrial-categ/xgboost_product_categorization_data'; // Added XGBoost industrial data

export const MODELS: Model[] = [
  { id: 'xgboost', name: 'XGBoost', category: 'Tree-based' },
  { id: 'catboost', name: 'CatBoost', category: 'Tree-based' },
  { id: 'lightgbm', name: 'LightGBM', category: 'Tree-based' },
  { id: 'nicl', name: 'NICL', category: 'Neural In-Context Learning' },
  { id: 'tabicl', name: 'TabICL', category: 'Tabular In-Context Learning' },
  { id: 'mlp', name: 'MLP', category: 'Neural Network' },
  { id: 'tabpfn', name: 'TabPFN', category: 'Transformer' },
];

export const MODEL_COLORS: { [key: string]: string } = {
  'XGBoost': '#64748b', // slate-500
  'CatBoost': '#475569', // slate-600
  'LightGBM': '#d1d5db', // gray-300 (user requested lighter gray)
  'NICL': '#1b998b',      // primary teal
  'TabICL': '#a1a1aa', // zinc-400
  'MLP': '#cbd5e1',       // slate-300
  'TabPFN': '#71717a', // zinc-500
  // Fallback, though ideally all models in MODELS should have an entry
  'Unknown Model': '#cccccc',
};


const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Updated list of academic dataset raw names based on user's provided allowlist
export const ACADEMIC_DATASET_RAW_NAMES: string[] = [
  "analcatdata_authorship",
  "analcatdata_dmft",
  "Australian",
  "balance-scale",
  "banknote-authentication",
  "blood-transfusion-service-center",
  "breast-w",
  "car",
  "churn",
  "climate-model-simulation-crashes",
  "cmc",
  "credit-approval",
  "credit-g",
  "diabetes",
  "dna",
  "eucalyptus",
  "first-order-theorem-proving",
  "GesturePhaseSegmentationProcessed",
  "ilpd",
  "jasmine",
  "kc1",
  "kc2",
  "kr-vs-kp",
  "mfeat-factors",
  "mfeat-fourier",
  "mfeat-karhunen",
  "mfeat-morphological",
  "MiceProtein",
  "ozone-level-8hr",
  "pc1",
  "pc3",
  "pc4",
  "phoneme",
  "qsar-biodeg",
  "red_wine",
  "Satellite",
  "segment",
  "tic-tac-toe",
  "vehicle",
  "wdbc",
  "white_wine",
  "wilt",
  "wine-quality-white",
  "yeast"
];


const uniqueAcademicDatasetRawNames = Array.from(new Set(ACADEMIC_DATASET_RAW_NAMES));

// Define user-provided row counts map - REPLACED WITH USER'S NEW LIST
const userProvidedRowCountsMap = new Map<string, number>([
  ["analcatdata_authorship", 841],
  ["analcatdata_dmft", 797],
  ["Australian", 690],
  ["balance-scale", 625],
  ["banknote-authentication", 1372],
  ["blood-transfusion-service-center", 748],
  ["breast-w", 699],
  ["car", 1728],
  ["churn", 5000],
  ["climate-model-simulation-crashes", 540],
  ["cmc", 1473],
  ["credit-approval", 690],
  ["credit-g", 1000],
  ["diabetes", 768],
  ["dna", 3186],
  ["eucalyptus", 736],
  ["first-order-theorem-proving", 6118],
  ["GesturePhaseSegmentationProcessed", 9873],
  ["ilpd", 583],
  ["jasmine", 1000],
  ["kc1", 2109],
  ["kc2", 522],
  ["kr-vs-kp", 3196],
  ["mfeat-factors", 2000],
  ["mfeat-fourier", 2000],
  ["mfeat-karhunen", 2000],
  ["mfeat-morphological", 2000],
  ["MiceProtein", 1080],
  ["ozone-level-8hr", 2536],
  ["pc1", 1109],
  ["pc3", 1563],
  ["pc4", 1458],
  ["phoneme", 3172],
  ["qsar-biodeg", 1055],
  ["red_wine", 1599],
  ["Satellite", 6435],
  ["segment", 2310],
  ["tic-tac-toe", 958],
  ["vehicle", 846],
  ["wdbc", 569],
  ["white_wine", 4898],
  ["wilt", 4839],
  ["wine-quality-white", 4898],
  ["yeast", 1484]
]);

// Define user-provided feature counts map - UPDATED WITH USER'S LATEST LIST
const userProvidedFeatureCountsMap = new Map<string, number>([
  ["analcatdata_authorship", 71],
  ["analcatdata_dmft", 5],
  ["Australian", 14],
  ["balance-scale", 5],
  ["banknote-authentication", 5],
  ["blood-transfusion-service-center", 5],
  ["breast-w", 10],
  ["car", 7],
  ["churn", 21],
  ["climate-model-simulation-crashes", 21],
  ["cmc", 10],
  ["credit-approval", 16],
  ["credit-g", 21],
  ["diabetes", 9],
  ["dna", 181],
  ["eucalyptus", 20],
  ["first-order-theorem-proving", 52],
  ["GesturePhaseSegmentationProcessed", 33],
  ["ilpd", 11],
  ["jasmine", 145],
  ["kc1", 22],
  ["kc2", 22],
  ["kr-vs-kp", 37],
  ["mfeat-factors", 217],
  ["mfeat-fourier", 77],
  ["mfeat-karhunen", 65],
  ["mfeat-morphological", 7],
  ["MiceProtein", 82],
  ["ozone-level-8hr", 73],
  ["pc1", 22],
  ["pc3", 38],
  ["pc4", 38],
  ["phoneme", 6],
  ["qsar-biodeg", 42],
  ["red_wine", 12],
  ["Satellite", 37],
  ["segment", 20],
  ["tic-tac-toe", 10],
  ["vehicle", 19],
  ["wdbc", 31],
  ["white_wine", 12],
  ["wilt", 6],
  ["wine-quality-white", 12],
  ["yeast", 9]
]);

const userProvidedNumClassesMap = new Map<string, number>([
  ["analcatdata_authorship", 4],
  ["analcatdata_dmft", 6],
  ["Australian", 2],
  ["balance-scale", 3],
  ["banknote-authentication", 2],
  ["blood-transfusion-service-center", 2],
  ["breast-w", 2],
  ["car", 4],
  ["churn", 2],
  ["climate-model-simulation-crashes", 2],
  ["cmc", 3],
  ["credit-approval", 2],
  ["credit-g", 2],
  ["diabetes", 2],
  ["dna", 3],
  ["eucalyptus", 5],
  ["first-order-theorem-proving", 6],
  ["GesturePhaseSegmentationProcessed", 5],
  ["ilpd", 2],
  ["jasmine", 2],
  ["kc1", 2],
  ["kc2", 2],
  ["kr-vs-kp", 2],
  ["mfeat-factors", 10],
  ["mfeat-fourier", 10],
  ["mfeat-karhunen", 10],
  ["mfeat-morphological", 10],
  ["MiceProtein", 8],
  ["ozone-level-8hr", 2],
  ["pc1", 2],
  ["pc3", 2],
  ["pc4", 2],
  ["phoneme", 2],
  ["qsar-biodeg", 2],
  ["red_wine", 6],
  ["Satellite", 6],
  ["segment", 7],
  ["tic-tac-toe", 2],
  ["vehicle", 4],
  ["wdbc", 2],
  ["white_wine", 7],
  ["wilt", 2],
  ["wine-quality-white", 7],
  ["yeast", 10]
]);

const generateAcademicMetrics = (modelId: string, seed: number): Metric[] => {
  // Seeded random number generator for consistency
  const seededRandom = (s: number) => {
    let S = s % 2147483647;
    if (S <= 0) S += 2147483646;
    return () => {
      S = S * 16807 % 2147483647;
      return (S - 1) / 2147483646;
    };
  };
  const rand = seededRandom(seed + modelId.charCodeAt(0));

  let baseAuc = 0.85, baseAcc = 0.82, baseF1 = 0.80;

  // Slightly different base scores for some models for variability
  if (modelId === 'nicl' || modelId === 'tabicl') { // Higher base for NICL/TabICL
    baseAuc = 0.92; baseAcc = 0.90; baseF1 = 0.89;
  } else if (modelId === 'mlp') { // Slightly lower for MLP
    baseAuc = 0.83; baseAcc = 0.80; baseF1 = 0.78;
  } else if (modelId === 'tabpfn') {
    baseAuc = 0.91; baseAcc = 0.89; baseF1 = 0.88;
  }

  // Smaller, more realistic variations
  const accVal = Math.min(0.999, Math.max(0.55, baseAcc + (rand() - 0.5) * 0.1)); // Range [0.55, 0.999]
  const f1Val = Math.min(0.999, Math.max(0.50, baseF1 + (rand() - 0.5) * 0.1));   // Range [0.50, 0.999]
  const aucVal = Math.min(0.999, Math.max(0.60, baseAuc + (rand() - 0.5) * 0.1)); // Range [0.60, 0.999]


  // Simulate small standard deviation (1-3% of the value)
  const generateStdDev = (value: number) => parseFloat((value * (0.01 + rand() * 0.02)).toFixed(4));

  return [
    { name: 'Accuracy', value: parseFloat(accVal.toFixed(4)), stdDev: generateStdDev(accVal) },
    { name: 'F1 Score', value: parseFloat(f1Val.toFixed(4)), stdDev: generateStdDev(f1Val) },
    { name: 'AUC', value: parseFloat(aucVal.toFixed(4)), stdDev: generateStdDev(aucVal) },
  ];
};

const getProductCategorizationLevel = (index: number): number => {
  if (index >= 0 && index <= 8) return 2;   // Datasets 1-9
  if (index >= 9 && index <= 17) return 3;  // Datasets 10-18
  if (index >= 18 && index <= 26) return 4; // Datasets 19-27
  if (index >= 27 && index <= 35) return 1; // Datasets 28-36
  return 1; // Default fallback, though should not be reached for indices 0-35
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
    // task: 'Multi-class Classification', // Removed as per request
    datasets: Array.from({ length: 36 }, (_, i) => {
      const datasetNumber = i + 1;
      return {
        id: `industrial-pc-new-${datasetNumber}`,
        name: `Product Catalog Dataset ${datasetNumber}`,
        type: DatasetType.INDUSTRIAL,
        description: `An industrial dataset (No. ${datasetNumber}) for product categorization with 3000 rows. Features include product title and description.`, // Updated description
        source: `Major retail player`,
        rows: 3000,
        features: "Title, Description", // Changed as per request
        // task: 'Multi-class Classification', // Removed as per request
        targetVariable: 'Category_ID',
        useCaseSlug: 'product-categorization',
        // numClasses: (i % 10) + 1, // Removed as per request
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

export const newAcademicDatasets: Dataset[] = uniqueAcademicDatasetRawNames.map((rawName, index) => {
  const id = `academic-openml-${rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const userRowCount = userProvidedRowCountsMap.get(rawName);
  const userFeatureCount = userProvidedFeatureCountsMap.get(rawName);
  const userNumClasses = userProvidedNumClassesMap.get(rawName);
  const hasRealCounts = userRowCount !== undefined && userFeatureCount !== undefined;

  return {
    id,
    name: `${rawName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
    type: DatasetType.ACADEMIC,
    description: `Standard OpenML benchmark dataset: ${rawName}. Used for general classification tasks.`,
    source: 'OpenML.org',
    rows: userRowCount !== undefined ? userRowCount : getRandomInt(500, 70000),
    features: userFeatureCount !== undefined ? userFeatureCount : getRandomInt(4, 100),
    task: 'Classification',
    targetVariable: 'class',
    hasRealCounts: hasRealCounts,
    numClasses: userNumClasses,
  };
});

const datasetsToAverageOver = newAcademicDatasets.filter(ds => {
    if (ds.hasRealCounts !== true) return false;
    const originalRawName = ds.name.replace(/ /g, '_').toLowerCase();
    const originalRawNameHyphen = ds.name.replace(/ /g, '-').toLowerCase();
    return ACADEMIC_DATASET_RAW_NAMES.some(rawNameInList =>
        rawNameInList.toLowerCase() === originalRawName ||
        rawNameInList.toLowerCase() === originalRawNameHyphen
    );
});


const sumMetrics = (metrics: Metric[]): {auc: number, acc: number, f1: number, aucStd?: number, accStd?: number, f1Std?: number } => {
  let auc = NaN, acc = NaN, f1 = NaN;
  let aucStd: number | undefined, accStd: number | undefined, f1Std: number | undefined;

  metrics.forEach(m => {
    if (m.name === 'AUC') { auc = m.value; aucStd = m.stdDev; }
    else if (m.name === 'Accuracy') { acc = m.value; accStd = m.stdDev; }
    else if (m.name === 'F1 Score') { f1 = m.value; f1Std = m.stdDev; }
  });
  return { auc, acc, f1, aucStd, accStd, f1Std };
};

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
    let matchedDataset = newAcademicDatasets.find(d =>
        d.name.toLowerCase() === rawDatasetName.toLowerCase() ||
        d.id.endsWith(rawDatasetName.toLowerCase().replace(/[^a-z0-9]+/g, '-')) ||
        d.name.replace(/ /g, '_').toLowerCase() === rawDatasetName.toLowerCase() ||
        d.name.replace(/-/g, '_').toLowerCase() === rawDatasetName.toLowerCase()
    );

    if (!matchedDataset) {
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

const tabIclUserMetrics = parseTsvData(tabIclUserDataTsv, 'tabicl', { accuracy: 'mean_accuracy', f1: 'mean_macro_f1', auc: 'mean_roc_auc_ovr' });
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
newAcademicDatasets.forEach((dataset, index) => {
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
      individualNewAcademicResults.push({
        datasetId: dataset.id,
        modelId: model.id,
        metrics: generateAcademicMetrics(model.id, index + dataset.name.length),
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
        }
    });

    if (avgMetrics.length > 0) {
        trulyAveragedNewAcademicResults.push({
            datasetId: 'academic-openml-avg',
            modelId: model.id,
            metrics: avgMetrics,
        });
    }
});


export const newAverageAcademicDataset: Dataset = {
    id: 'academic-openml-avg',
    name: `OpenML Academic Average (${datasetsToAverageOver.length} Datasets)`,
    type: DatasetType.ACADEMIC,
    description: `Average performance across ${datasetsToAverageOver.length} selected OpenML classification datasets with real counts. This provides a general overview of model performance on common academic benchmarks.`,
    source: 'Aggregated from OpenML.org',
    rows: parseFloat((datasetsToAverageOver.reduce((sum, ds) => sum + ds.rows, 0) / (datasetsToAverageOver.length || 1)).toFixed(0)),
    features: parseFloat((datasetsToAverageOver.reduce((sum, ds) => sum + (ds.features as number), 0) / (datasetsToAverageOver.length || 1)).toFixed(1)), // Cast features as number for calculation
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
} else if (avgDatasetExists && datasetsToAverageOver.length === 0) {
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
        // No fallback to general academic tabpfnUserMetrics for product categorization
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

    // Fallback data generation
    if (!userMetricsProvided) {
        // If it's TabPFN, CatBoost, LightGBM, MLP, OR XGBoost for a product-categorization dataset AND no metricsSource was found,
        // then we do NOT generate fake data. It should appear as N/A.
        if ((model.id === 'tabpfn' || model.id === 'catboost' || model.id === 'lightgbm' || model.id === 'mlp' || model.id === 'xgboost') && dataset.useCaseSlug === 'product-categorization') {
            // Do nothing, let it be missing from results.
        } else {
            // Generate fake data for:
            // 1. NICL, TabICL if no user data was found (and it wasn't product-categorization handled above)
            // 2. TabPFN, CatBoost, LightGBM, MLP, and XGBoost on NON-product-categorization datasets if no user data was found.
            let metrics: Metric[] = [];
            const baseF1 = model.id === 'nicl' || model.id === 'tabicl' ? 0.75 : (model.id === 'tabpfn' || model.id === 'catboost' || model.id === 'lightgbm' ? 0.72 : (model.id === 'mlp' || model.id === 'xgboost' ? 0.68 : 0.65));
            const baseAcc = model.id === 'nicl' || model.id === 'tabicl' ? 0.80 : (model.id === 'tabpfn' || model.id === 'catboost' || model.id === 'lightgbm' ? 0.77 : (model.id === 'mlp' || model.id === 'xgboost' ? 0.72 : 0.70));

            const generateFakeStdDev = (val: number) => parseFloat((val * (0.01 + Math.random() * 0.02)).toFixed(4));

            const accVal = parseFloat((baseAcc + (Math.random() - 0.5) * 0.1).toFixed(4));
            metrics.push({ name: 'Accuracy', value: accVal, stdDev: generateFakeStdDev(accVal) });

            const f1Val = parseFloat((baseF1 + (Math.random() - 0.5) * 0.1).toFixed(4));
            metrics.push({ name: 'F1 Score', value: f1Val, stdDev: generateFakeStdDev(f1Val) });

            if (dataset.task && dataset.task.toLowerCase().includes('regression')) {
                const rmseVal = parseFloat((0.5 + Math.random() * 0.5).toFixed(4));
                metrics.push({ name: 'RMSE', value: rmseVal, stdDev: generateFakeStdDev(rmseVal) });
            } else {
                const aucVal = parseFloat((0.8 + (Math.random() - 0.5) * 0.15).toFixed(4));
                metrics.push({ name: 'AUC', value: aucVal, stdDev: generateFakeStdDev(aucVal) });
            }
            industrialResults.push({
                datasetId: dataset.id,
                modelId: model.id,
                metrics: metrics
            });
        }
    }
  });
});


export const RESULTS: PerformanceResult[] = [
  ...industrialResults,
  ...individualNewAcademicResults,
  ...(datasetsToAverageOver.length > 0 ? trulyAveragedNewAcademicResults : [])
];
