
import React, { useState, useMemo, useEffect } from 'react';
import { Dataset, DatasetType, ChartDataItem, Metric, PerformanceResult } from '../types';
import { DATASETS, MODELS, RESULTS, newAcademicDatasets } from '../constants'; // Import newAcademicDatasets for IDs
import DatasetCard from '../components/DatasetCard';
import PerformanceChart from '../components/PerformanceChart';
import PerformanceTable from '../components/PerformanceTable';
import DatasetDistributionChart from '../components/DatasetDistributionChart';
import CC18CrossModelPerformanceTable from '../components/CC18CrossModelPerformanceTable';

const AcademicDatasetsPage: React.FC = () => {
  const [selectedAvgAcademicMetric, setSelectedAvgAcademicMetric] = useState<string>('Accuracy'); // Updated default
  const [currentAcademicDataset, setCurrentAcademicDataset] = useState<Dataset | null>(null);
  const [selectedIndividualAcademicMetric, setSelectedIndividualAcademicMetric] = useState<string>('Accuracy'); // Updated default

  // Use IDs from the generated newAcademicDatasets
  const individualAcademicDatasetIds = useMemo(() => newAcademicDatasets.map(ds => ds.id), []);
  
  const academicDatasetsForExplorer = useMemo(() => {
    return DATASETS.filter(ds => individualAcademicDatasetIds.includes(ds.id) && ds.type === DatasetType.ACADEMIC)
                   .sort((a, b) => a.name.localeCompare(b.name)); // Sort for dropdown
  }, [DATASETS, individualAcademicDatasetIds]);

  const academicSummaryStats = useMemo(() => {
    const avgDataset = DATASETS.find(ds => ds.id === 'academic-openml-avg');

    const rowsArray = academicDatasetsForExplorer.map(ds => ds.rows); // rows are always number
    const numericFeaturesArray = academicDatasetsForExplorer
        .map(ds => ds.features)
        .filter(f => typeof f === 'number') as number[];

    if (academicDatasetsForExplorer.length === 0) {
        return null;
    }

    const minR = rowsArray.length > 0 ? Math.min(...rowsArray) : 'N/A';
    const maxR = rowsArray.length > 0 ? Math.max(...rowsArray) : 'N/A';
    const minF = numericFeaturesArray.length > 0 ? Math.min(...numericFeaturesArray) : 'N/A';
    const maxF = numericFeaturesArray.length > 0 ? Math.max(...numericFeaturesArray) : 'N/A';

    // Use avgDataset if available and its properties are numbers, otherwise calculate from individuals
    const avgRowsDisplay = (avgDataset && typeof avgDataset.rows === 'number')
        ? avgDataset.rows.toLocaleString()
        : (rowsArray.length > 0 ? (rowsArray.reduce((sum, r) => sum + r, 0) / rowsArray.length).toFixed(0) : 'N/A');

    const avgFeaturesDisplay = (avgDataset && typeof avgDataset.features === 'number')
        ? avgDataset.features.toLocaleString()
        : (numericFeaturesArray.length > 0 ? (numericFeaturesArray.reduce((sum, f) => sum + f, 0) / numericFeaturesArray.length).toFixed(0) : 'N/A');

    return {
        count: academicDatasetsForExplorer.length,
        avgRows: avgRowsDisplay,
        minRows: minR,
        maxRows: maxR,
        avgFeatures: avgFeaturesDisplay,
        minFeatures: minF,
        maxFeatures: maxF,
    };
  }, [academicDatasetsForExplorer, DATASETS]);


  const datasetsForDistribution = useMemo(() => {
    return academicDatasetsForExplorer.filter(ds => ds.hasRealCounts === true);
  }, [academicDatasetsForExplorer]);

  const getDistributionData = (datasets: Dataset[], prop: 'rows' | 'features', bins: number[]) => {
    const counts = Array(bins.length -1).fill(0);
    datasets.forEach(ds => {
      const rawValue = ds[prop];
      if (typeof rawValue === 'number') { // Ensure value is a number before comparison
        const value = rawValue;
        for (let i = 0; i < bins.length - 1; i++) {
          if (value >= bins[i] && value < bins[i+1]) {
            counts[i]++;
            break;
          }
        }
      }
    });
    return bins.slice(0, -1).map((binStart, i) => {
      const binEnd = bins[i+1];
      let name = `${binStart.toLocaleString()}-`;
      name += binEnd === Infinity ? '\u221E' : (binEnd -1).toLocaleString(); // Adjust bin end display
      return { name, count: counts[i]};
    });
  };

  const rowsDistributionDataAcademic = useMemo(() => {
    if (datasetsForDistribution.length === 0) return [];
    const bins = [0, 1000, 2000, 3000, 5000, 7500, 10001]; 
    return getDistributionData(datasetsForDistribution, 'rows', bins);
  }, [datasetsForDistribution]);

  const featuresDistributionDataAcademic = useMemo(() => {
     if (datasetsForDistribution.length === 0) return [];
    const bins = [0, 10, 20, 40, 60, 101]; 
    return getDistributionData(datasetsForDistribution, 'features', bins);
  }, [datasetsForDistribution]);

  const pageTitle = "Academic task: Classification 🎓";
  const pageDescription = `Performance evaluation on ${academicDatasetsForExplorer.length} OpenML classification tasks and their averages.`;
  
  const getChartData = (datasetId: string, metricName: string): ChartDataItem[] => {
    const datasetResults = RESULTS.filter(r => r.datasetId === datasetId);
    return datasetResults.map(result => {
      const model = MODELS.find(m => m.id === result.modelId);
      const metric = result.metrics.find(m => m.name === metricName);
      
      const chartItem: ChartDataItem = {
        modelName: model ? model.name : 'Unknown Model',
        [metricName]: metric ? metric.value : 0,
      };

      if (metric && metric.stdDev !== undefined && metric.stdDev > 0) {
        chartItem[`${metricName}_stdDev`] = metric.stdDev;
      }
      return chartItem;

    }).sort((a, b) => {
        if (a.modelName === 'NICL') return -1;
        if (b.modelName === 'NICL') return 1;

        const valA = a[metricName] as number;
        const valB = b[metricName] as number;

        if (typeof valA !== 'number' || isNaN(valA)) return 1;
        if (typeof valB !== 'number' || isNaN(valB)) return -1;
        
        const lowerIsBetterMetrics = ['rmse', 'inference latency (ms)', 'training time (s)'];
        if (lowerIsBetterMetrics.includes(metricName.toLowerCase())) {
            return valA - valB;
        }
        return valB - valA;
    });
  };

  const academicSelectableMetrics = ['Accuracy', 'F1 Score', 'AUC'];

  const averageAcademicResultsForTable = useMemo(() => {
    return RESULTS.filter(r => r.datasetId === 'academic-openml-avg'); 
  }, [RESULTS]);

  const averageAcademicChartData = useMemo(() => {
    const data = getChartData('academic-openml-avg', selectedAvgAcademicMetric);
    return data.sort((a, b) => {
        if (a.modelName === 'NICL') return -1;
        if (b.modelName === 'NICL') return 1;

        const valA = a[selectedAvgAcademicMetric] as number;
        const valB = b[selectedAvgAcademicMetric] as number;

        if (typeof valA !== 'number' || isNaN(valA)) return 1;
        if (typeof valB !== 'number' || isNaN(valB)) return -1;

        const lowerIsBetterMetrics = ['rmse', 'inference latency (ms)', 'training time (s)'];
        if (lowerIsBetterMetrics.includes(selectedAvgAcademicMetric.toLowerCase())) {
            return valA - valB;
        }
        return valB - valA;
    });
  }, [selectedAvgAcademicMetric, RESULTS]);


  useEffect(() => {
    const currentIsValid = currentAcademicDataset && academicDatasetsForExplorer.some(d => d.id === currentAcademicDataset.id);
    if (academicDatasetsForExplorer.length > 0 && !currentIsValid) {
        setCurrentAcademicDataset(academicDatasetsForExplorer[0]);
    } else if (academicDatasetsForExplorer.length === 0) {
        setCurrentAcademicDataset(null);
    }
  }, [academicDatasetsForExplorer, currentAcademicDataset]);


  const handleAcademicDatasetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const datasetId = event.target.value;
    const selected = academicDatasetsForExplorer.find(ds => ds.id === datasetId);
    if (selected) {
      setCurrentAcademicDataset(selected);
    }
  };

  const avgAcademicMetricSelectorControls = (
    <div className="flex justify-center w-full">
        <div role="group" className="inline-flex rounded-md shadow-sm">
        {academicSelectableMetrics.map((metric, idx) => (
            <button
            key={metric}
            type="button"
            onClick={() => setSelectedAvgAcademicMetric(metric)}
            className={`px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium border transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#1b998b] focus:z-10
                ${idx === 0 ? 'rounded-l-md' : ''}
                ${idx === academicSelectableMetrics.length - 1 ? 'rounded-r-md' : 'border-r-0'}
                ${selectedAvgAcademicMetric === metric 
                    ? 'bg-[#1b998b] text-white border-[#1b998b] hover:bg-[#137e71]' 
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
            aria-pressed={selectedAvgAcademicMetric === metric}
            >
            {metric}
            </button>
        ))}
        </div>
    </div>
  );
  
  const individualAcademicDatasetMetricSelectorControls = (currentDatasetId: string) => (
    <div className="flex justify-center w-full">
      <div id={`metric-select-academic-${currentDatasetId}`} role="group" className="inline-flex rounded-md shadow-sm">
        {academicSelectableMetrics.map((metric, idx) => (
          <button
            key={metric}
            type="button"
            onClick={() => setSelectedIndividualAcademicMetric(metric)}
            className={`px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium border transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#1b998b] focus:z-10
                ${idx === 0 ? 'rounded-l-md' : ''}
                ${idx === academicSelectableMetrics.length - 1 ? 'rounded-r-md' : 'border-r-0'}
                ${selectedIndividualAcademicMetric === metric 
                    ? 'bg-[#1b998b] text-white border-[#1b998b] hover:bg-[#137e71]' 
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
            aria-pressed={selectedIndividualAcademicMetric === metric}
          >
            {metric}
          </button>
        ))}
      </div>
    </div>
  );


  return (
    <div className="space-y-6 md:space-y-10">
      <header className="pb-1 md:pb-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{pageTitle}</h1>
        <p className="text-s sm:text-md text-gray-600 mt-4">{pageDescription}</p>
      </header>

      {academicDatasetsForExplorer.length > 0 ? (
        <>
          <section aria-labelledby="academic-dataset-explorer-heading" className="p-4 sm:p-6 bg-slate-50 rounded-lg shadow-md border border-slate-200">
            <h2 id="academic-dataset-explorer-heading" className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 mb-2">
              Academic Datasets Explorer
            </h2>
            <p className="text-md text-gray-600 mb-4 md:mb-6">
              This section explores {academicDatasetsForExplorer.length} OpenML datasets used for academic benchmarking. These datasets are standard in ML research and provide a basis for comparing model performance on well-understood classification tasks. 
            </p>
            
            {academicSummaryStats && (
              <div aria-labelledby="academic-summary-stats-subheading" className="mt-6 md:mt-8">
                <h3 id="academic-summary-stats-subheading" className="sr-only">Academic Dataset Summary Statistics</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-center mb-4">
                  <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200">
                    <p className="text-xs text-gray-500">Total Datasets</p>
                    <p className="text-lg font-semibold text-[#1b998b]">{academicSummaryStats.count}</p>
                  </div>
                  <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200">
                    <p className="text-xs text-gray-500">Avg. Rows</p>
                    <p className="text-lg font-semibold text-gray-700">{academicSummaryStats.avgRows}</p>
                  </div>
                  <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200">
                    <p className="text-xs text-gray-500">Rows Range</p>
                    <p className="text-lg font-semibold text-gray-700">
                      {typeof academicSummaryStats.minRows === 'number' ? academicSummaryStats.minRows.toLocaleString() : academicSummaryStats.minRows} - {typeof academicSummaryStats.maxRows === 'number' ? academicSummaryStats.maxRows.toLocaleString() : academicSummaryStats.maxRows}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200">
                    <p className="text-xs text-gray-500">Avg. Features</p>
                    <p className="text-lg font-semibold text-gray-700">{academicSummaryStats.avgFeatures}</p>
                  </div>
                    <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200 sm:col-start-2 md:col-start-auto">
                      <p className="text-xs text-gray-500">Features Range</p>
                      <p className="text-lg font-semibold text-gray-700">
                      {typeof academicSummaryStats.minFeatures === 'number' ? academicSummaryStats.minFeatures.toLocaleString() : academicSummaryStats.minFeatures} - {typeof academicSummaryStats.maxFeatures === 'number' ? academicSummaryStats.maxFeatures.toLocaleString() : academicSummaryStats.maxFeatures}
                      </p>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-6"> {/* Added mt-4 here */}
              <DatasetDistributionChart data={rowsDistributionDataAcademic} title="Distribution by Rows" barColor="#14b8a6" />
              <DatasetDistributionChart data={featuresDistributionDataAcademic} title="Distribution by Features" barColor="#0d9488" />
            </div>
            
          </section>

          {averageAcademicResultsForTable.length > 0 && (
             <section 
                aria-labelledby="average-academic-performance-heading" 
                className="mt-6 md:mt-8 p-4 sm:p-6 bg-slate-50 rounded-lg shadow-md border border-slate-200"
             >
                <h2 id="average-academic-performance-heading" className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 mb-0">
                    Average Model Performance
                </h2>
                 <p className="text-xs text-gray-500 mb-4 md:mb-6">(Average performance across all datasets)</p>
                
                {averageAcademicChartData.length > 0 ? (
                    <PerformanceChart
                        data={averageAcademicChartData}
                        metricName={selectedAvgAcademicMetric}
                        title={`Average Performance (${selectedAvgAcademicMetric})`}
                        headerControls={avgAcademicMetricSelectorControls}
                        tightenYAxis={true}
                    />
                ) : (
                    <p className="text-gray-500 text-sm p-4 text-center">No average chart data available for {selectedAvgAcademicMetric}.</p>
                )}
                 <PerformanceTable
                    results={averageAcademicResultsForTable}
                    title="Average Detailed Metrics"
                />
             </section>
          )}

          <section 
            aria-labelledby="individual-academic-dataset-evaluation-heading"
            className="mt-6 md:mt-8 p-4 sm:p-6 bg-slate-50 rounded-lg shadow-md border border-slate-200"
          >
            <div className="md:flex md:justify-between md:items-start mb-4 md:mb-6">
                <div>
                    <h2 id="individual-academic-dataset-evaluation-heading" className="text-xl sm:text-2xl md:text-2xl font-semibold text-gray-800 mb-1">
                    Individual Dataset Evaluation
                    </h2>
                    {academicDatasetsForExplorer.length > 0 && (
                        <p className="text-md text-gray-600">
                            Select a dataset from the dropdown to explore performance on individual OpenML datasets.
                        </p>
                    )}
                </div>
                {academicDatasetsForExplorer.length > 0 && currentAcademicDataset && (
                     <div className="mt-4 md:mt-0 flex justify-end">
                        <label htmlFor="academic-dataset-select" className="sr-only">Select Academic Dataset</label>
                        <select
                            id="academic-dataset-select"
                            value={currentAcademicDataset.id}
                            onChange={handleAcademicDatasetChange}
                            className="block w-full max-w-xs sm:max-w-sm md:w-auto md:max-w-md lg:max-w-lg pl-3 pr-10 py-2 text-base bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-[#1b998b] focus:border-[#1b998b] sm:text-sm rounded-md shadow-sm"
                            aria-label="Select an academic dataset for evaluation"
                        >
                            {academicDatasetsForExplorer.map(ds => (
                                <option key={ds.id} value={ds.id}>
                                    {ds.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

             {currentAcademicDataset ? (
                <div key={currentAcademicDataset.id} className="animate-fadeIn">
                    <DatasetCard dataset={currentAcademicDataset} />
                    
                    {(() => {
                        const datasetResults = RESULTS.filter(r => r.datasetId === currentAcademicDataset.id);
                        const chartData = getChartData(currentAcademicDataset.id, selectedIndividualAcademicMetric);
                        let chartToDisplay = null;
                        
                        if (chartData.length > 0) {
                            chartToDisplay = (
                              <PerformanceChart
                                data={chartData} 
                                metricName={selectedIndividualAcademicMetric}
                                title={`Performance on ${currentAcademicDataset.name}`}
                                headerControls={individualAcademicDatasetMetricSelectorControls(currentAcademicDataset.id)}
                                yAxisTickInterval={0.1} 
                              />
                          );
                        } else if (datasetResults.length > 0) { 
                            chartToDisplay = <div className="mb-4 md:mb-6">{individualAcademicDatasetMetricSelectorControls(currentAcademicDataset.id)}</div>;
                        }

                        return (
                            <>
                            {chartToDisplay}
                            {datasetResults.length > 0 ? (
                              <PerformanceTable 
                                results={datasetResults} 
                                title={`Detailed Metrics: ${currentAcademicDataset.name}`}
                              />
                            ) : (
                              <p className="text-gray-500 p-4 bg-white rounded-md text-center text-sm border border-gray-200 shadow-md">No performance results available for {currentAcademicDataset.name}.</p>
                            )}
                            </>
                        );
                    })()}
                </div>
            ) : (
              <div className="text-center py-8 md:py-10">
                  <p className="text-lg sm:text-xl text-gray-500">
                      {academicDatasetsForExplorer.length === 0 ? 
                          'No individual academic datasets available.' :
                          'Please select a dataset from the dropdown above to view its details.'
                      }
                  </p>
              </div>
            )}
          </section>

          <section className="mt-10 md:mt-12">
             <CC18CrossModelPerformanceTable 
                datasetIds={individualAcademicDatasetIds}
                title="Overview of performance on individual datasets"
             />
         </section>
        </>
      ) : (
        <div className="text-center py-8 md:py-10">
            <p className="text-lg sm:text-xl text-gray-500">
                No academic datasets available for display.
            </p>
        </div>
      )}
    </div>
  );
};

export default AcademicDatasetsPage;
