
import React, { useState, useMemo } from 'react';
import { PerformanceResult, Model, Metric } from '../types';
import { MODELS } from '../constants';

interface PerformanceTableProps {
  results: PerformanceResult[];
  title?: string;
}

type SortDirection = 'ascending' | 'descending';
interface SortConfig {
  key: string; // 'modelName' or metric name
  direction: SortDirection;
}

// Helper to determine if a metric is better when its value is higher
const isHigherBetter = (metricName: string): boolean => {
  const lowerIsBetterMetrics = ['rmse', 'inference latency (ms)', 'training time (s)'];
  return !lowerIsBetterMetrics.includes(metricName.toLowerCase());
};

const PerformanceTable: React.FC<PerformanceTableProps> = ({ results, title }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  if (!results || results.length === 0) {
    return <p className="text-gray-500 text-sm p-4 text-center">No table data available.</p>;
  }

  const rawMetricNames = Array.from(new Set(results.flatMap(r => r.metrics.map(m => m.name))));
  const desiredOrder = ['Accuracy', 'F1 Score', 'AUC', 'Precision'];

  const metricNames = useMemo(() => {
    return [...rawMetricNames].sort((a, b) => {
      const indexA = desiredOrder.indexOf(a);
      const indexB = desiredOrder.indexOf(b);

      if (indexA !== -1 && indexB !== -1) { // Both are in desired order
        return indexA - indexB;
      }
      if (indexA !== -1) return -1; // A is in desired, B is not: A comes first
      if (indexB !== -1) return 1;  // B is in desired, A is not: B comes first
      return a.localeCompare(b); // Neither in desired, sort alphabetically
    });
  }, [results]); // Recalculate if results (and thus rawMetricNames) change


  const sortedModelsData = useMemo(() => {
    let sortableItems = MODELS.map(model => {
      const modelResult = results.find(r => r.modelId === model.id);
      const metricsMap: { [key: string]: number | undefined } = {};
      modelResult?.metrics.forEach(m => {
        metricsMap[m.name] = m.value;
      });
      return {
        ...model, // id, name, category
        metricsMap,
      };
    });

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let valA: string | number | undefined;
        let valB: string | number | undefined;

        if (sortConfig.key === 'modelName') {
          valA = a.name;
          valB = b.name;
        } else {
          valA = a.metricsMap[sortConfig.key];
          valB = b.metricsMap[sortConfig.key];
        }
        
        // Handle undefined or NaN values by pushing them to the bottom
        if (valA === undefined || (typeof valA === 'number' && isNaN(valA))) return 1;
        if (valB === undefined || (typeof valB === 'number' && isNaN(valB))) return -1;


        if (typeof valA === 'number' && typeof valB === 'number') {
          if (sortConfig.direction === 'ascending') {
            return valA - valB;
          }
          return valB - valA;
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
  }, [MODELS, results, sortConfig]);

  const requestSort = (key: string) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // Pre-calculate best values for each metric for highlighting (unsorted data)
  const bestValuesHighlighting: Record<string, number> = {};
  metricNames.forEach(metricName => {
    const values = results
      .map(r => r.metrics.find(m => m.name === metricName)?.value)
      .filter(v => typeof v === 'number' && !isNaN(v)) as number[];

    if (values.length > 0) {
      if (isHigherBetter(metricName)) {
        bestValuesHighlighting[metricName] = Math.max(...values);
      } else {
        bestValuesHighlighting[metricName] = Math.min(...values);
      }
    }
  });
  
  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <span className="opacity-50">↕</span>;
    }
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };


  return (
    <div className="bg-white shadow-lg rounded-xl p-3 sm:p-4 md:p-6 mb-6 md:mb-8 border border-gray-200">
      {title && <h4 className="text-md sm:text-lg md:text-xl font-semibold text-gray-700 mb-4 md:mb-6 text-center">{title}</h4>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('modelName')}
              >
                Model {getSortIndicator('modelName')}
              </th>
              {metricNames.map(metricName => (
                <th 
                  key={metricName} 
                  scope="col" 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort(metricName)}
                >
                  {metricName} {getSortIndicator(metricName)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedModelsData.map((modelData) => {
              return (
                <tr key={modelData.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{modelData.name}</td>
                  {metricNames.map(metricName => {
                    const value = modelData.metricsMap[metricName];
                    const isBest = typeof value === 'number' && !isNaN(value) && value === bestValuesHighlighting[metricName];
                    const cellClassName = `px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500 ${
                      isBest ? 'bg-green-100 text-green-800 font-semibold' : ''
                    }`;
                    return (
                      <td key={metricName} className={cellClassName}>
                        {typeof value === 'number' ? value.toFixed(metricName.toLowerCase().includes('latency') || metricName.toLowerCase().includes('time') ? 0 : 4) : 'N/A'}
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

export default PerformanceTable;
