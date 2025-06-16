export enum DatasetType {
  INDUSTRIAL = 'industrial',
  ACADEMIC = 'academic',
}

export interface Dataset {
  id: string;
  name: string;
  type: DatasetType;
  description: string;
  source: string; // e.g., 'Public', 'Partner Company XYZ'
  rows: number;
  features: number | string; // Can be a number or a descriptive string
  task?: string; // e.g., 'Binary Classification', 'Regression', 'Multi-class Classification' - Made optional
  targetVariable: string;
  useCaseSlug?: string; // e.g., 'product-categorization', 'deduplication', 'churn-prediction'
  hasRealCounts?: boolean; // True if rows/features are from user-provided maps
  numClasses?: number | string; // Number of classes or 'Varies' - Made optional
  level?: number; // Level of the dataset, e.g., for product categorization
  batchFile?: string; // Path to the batch file, e.g., level_X/batch_Y.parquet
}

export interface Model {
  id: string;
  name: string;
  category: string; // e.g., 'Tree-based', 'Neural Network', 'Linear Model'
}

export interface Metric {
  name: string; // e.g., 'Accuracy', 'F1 Score', 'AUC', 'RMSE'
  value: number;
  stdDev?: number; // Standard deviation for the metric value
}

export interface PerformanceResult {
  datasetId: string;
  modelId: string;
  metrics: Metric[];
}

export interface ChartDataItem {
  modelName: string;
  [metricName: string]: number | string; // Allows for dynamic metric keys like 'Accuracy', 'F1 Score'
}