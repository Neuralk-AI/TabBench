
import React, { useState, useMemo } from 'react';
import { Model, Dataset, PerformanceResult, Metric } from '../types';
import { MODELS, DATASETS, RESULTS } from '../constants';

interface CrossModelPerformanceTableProps {
  datasetIds: string[];
  title?: string;
}

type SortDirection = 'ascending' | 'descending';
interface SortConfig {
  key: string; // 'modelName' or dataset.id
  direction: SortDirection;
}

// Helper to determine if a metric is better when its value is higher
const isHigherBetter = (metricName: string): boolean => {
  const lowerIsBetterMetrics = ['rmse', 'inference latency (ms)', 'training time (s)'];
  return !lowerIsBetterMetrics.includes(metricName.toLowerCase());
};

const extractDatasetNumber = (name: string): number => {
  const match = name.match(/Dataset (\d+)/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  // Return a large number for names not matching "Dataset X"
  // so they are sorted after numbered datasets if mixed,
  // or rely on subsequent localeCompare for purely non-numbered sets.
  return Infinity;
};

const CrossModelPerformanceTable: React.FC<CrossModelPerformanceTableProps> = ({
  datasetIds,
  title,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('Accuracy'); // Default to Accuracy
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const selectableMetrics = ['Accuracy', 'F1 Score', 'AUC'];

  const relevantDatasets = useMemo(() =>
    DATASETS.filter(ds => datasetIds.includes(ds.id))
            .sort((a, b) => {
              const numA = extractDatasetNumber(a.name);
              const numB = extractDatasetNumber(b.name);

              if (numA !== Infinity && numB !== Infinity) {
                return numA - numB; // Sort by number if both have it
              }
              if (numA !== Infinity) return -1; // A has number, B doesn't, A comes first
              if (numB !== Infinity) return 1;  // B has number, A doesn't, B comes first
              return a.name.localeCompare(b.name); // Fallback to lexicographical
            }),
    [datasetIds]
  );

  if (relevantDatasets.length === 0) {
    return <p className="text-gray-500 text-sm p-4 text-center">No specified datasets found for cross-model table.</p>;
  }

  const sortedModelsData = useMemo(() => {
    let sortableItems = MODELS.map(model => {
      const performanceByDataset: { [datasetId: string]: number | undefined } = {};
      relevantDatasets.forEach(dataset => {
        const modelResult = RESULTS.find(r => r.datasetId === dataset.id && r.modelId === model.id);
        const metricValue = modelResult?.metrics.find(m => m.name === selectedMetric)?.value;
        performanceByDataset[dataset.id] = metricValue;
      });
      return {
        ...model, // id, name, category
        performanceByDataset,
      };
    });

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let valA: string | number | undefined;
        let valB: string | number | undefined;

        if (sortConfig.key === 'modelName') {
          valA = a.name;
          valB = b.name;
        } else { // Sorting by a dataset's metric value
          valA = a.performanceByDataset[sortConfig.key];
          valB = b.performanceByDataset[sortConfig.key];
        }

        if (valA === undefined || (typeof valA === 'number' && isNaN(valA))) return 1;
        if (valB === undefined || (typeof valB === 'number' && isNaN(valB))) return -1;

        const higherIsCurrentlyBetter = isHigherBetter(selectedMetric);

        if (typeof valA === 'number' && typeof valB === 'number') {
          if (sortConfig.direction === 'ascending') {
            return higherIsCurrentlyBetter ? valA - valB : valB - valA;
          }
          return higherIsCurrentlyBetter ? valB - valA : valA - valB;
        } else if (typeof valA === 'string' && typeof valB === 'string') {
           if (sortConfig.direction === 'ascending') {
            return valA.localeCompare(valB);
          }
          return valB.localeCompare(valA);
        }
        return 0;
      });
    }
    return sortableItems;
  }, [MODELS, relevantDatasets, RESULTS, selectedMetric, sortConfig]);

  const requestSort = (key: string) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const bestValuesHighlighting: { [datasetId: string]: number } = useMemo(() => {
    const bestVals: { [datasetId: string]: number } = {};
    relevantDatasets.forEach(dataset => {
      const datasetResults = RESULTS.filter(r => r.datasetId === dataset.id);
      const values = datasetResults
        .map(r => r.metrics.find(m => m.name === selectedMetric)?.value)
        .filter(v => typeof v === 'number' && !isNaN(v)) as number[];

      if (values.length > 0) {
        if (isHigherBetter(selectedMetric)) {
          bestVals[dataset.id] = Math.max(...values);
        } else {
          bestVals[dataset.id] = Math.min(...values);
        }
      }
    });
    return bestVals;
  }, [relevantDatasets, RESULTS, selectedMetric]);

  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <span className="opacity-50">↕</span>;
    }
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };

  const metricSelectorControls = (
    <div className="flex justify-center w-full mb-4 md:mb-6">
        <div role="group" className="inline-flex rounded-md shadow-sm">
        {selectableMetrics.map((metric, idx) => (
            <button
            key={metric}
            type="button"
            onClick={() => setSelectedMetric(metric)}
            className={`px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium border transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#1b998b] focus:z-10
                ${idx === 0 ? 'rounded-l-md' : ''}
                ${idx === selectableMetrics.length - 1 ? 'rounded-r-md' : 'border-r-0'}
                ${selectedMetric === metric
                    ? 'bg-[#1b998b] text-white border-[#1b998b] hover:bg-[#137e71]'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
            aria-pressed={selectedMetric === metric}
            >
            {metric}
            </button>
        ))}
        </div>
    </div>
  );

  return (
    <div className="bg-white shadow-lg rounded-xl p-3 sm:p-4 md:p-6 mb-6 md:mb-8 border border-gray-200">
      {title && <h4 className="text-md sm:text-lg md:text-xl font-semibold text-gray-700 mb-2 text-center">{title} <span className="text-sm text-gray-500">({selectedMetric})</span></h4>}
      {metricSelectorControls}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('modelName')}
                style={{ minWidth: '120px' }}
              >
                Model {getSortIndicator('modelName')}
              </th>
              {relevantDatasets.map(dataset => (
                <th
                  key={dataset.id}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort(dataset.id)}
                  style={{ minWidth: '150px' }}
                >
                  {dataset.name} {getSortIndicator(dataset.id)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedModelsData.map((modelData) => {
              return (
                <tr key={modelData.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900 sticky left-0 bg-white hover:bg-gray-50 z-10">{modelData.name}</td>
                  {relevantDatasets.map(dataset => {
                    const value = modelData.performanceByDataset[dataset.id];
                    const isBest = typeof value === 'number' && !isNaN(value) && value === bestValuesHighlighting[dataset.id];

                    const cellClassName = `px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-center ${ // Centered text for scores
                      isBest ? 'bg-green-100 text-green-800 font-semibold' : ''
                    }`;

                    return (
                      <td key={`${modelData.id}-${dataset.id}`} className={cellClassName}>
                        {typeof value === 'number' ? value.toFixed(4) : 'N/A'}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CrossModelPerformanceTable;
