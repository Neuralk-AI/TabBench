
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Dataset, DatasetType, ChartDataItem, Metric, PerformanceResult } from '../types';
import { DATASETS, MODELS, RESULTS } from '../constants';
import DatasetCard from '../components/DatasetCard';
import PerformanceChart from '../components/PerformanceChart';
import PerformanceTable from '../components/PerformanceTable';
import DatasetDistributionChart from '../components/DatasetDistributionChart';
import CrossModelPerformanceTable from '../components/CrossModelPerformanceTable'; // Updated import

const getUseCaseDisplayName = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const IndustrialDatasetsPage: React.FC = () => {
  const { useCaseSlug } = useParams<{ useCaseSlug?: string }>();
  const [selectedProductCatMetric, setSelectedProductCatMetric] = useState<string>('Accuracy');
  const [selectedAvgProductCatMetric, setSelectedAvgProductCatMetric] = useState<string>('Accuracy');
  const [currentProductCatDataset, setCurrentProductCatDataset] = useState<Dataset | null>(null);

  const allIndustrialRaw = useMemo(() => DATASETS.filter(ds => ds.type === DatasetType.INDUSTRIAL), []);

  const industrialDatasetsForPage: Dataset[] = useMemo(() => {
    if (!useCaseSlug) return [];
    return allIndustrialRaw.filter(ds => ds.useCaseSlug === useCaseSlug);
  }, [allIndustrialRaw, useCaseSlug]);

  const productCategorizationDatasets = useMemo(() => {
    return allIndustrialRaw.filter(ds => ds.useCaseSlug === 'product-categorization');
  }, [allIndustrialRaw]);

  const productCatDatasetsForDisplay = useMemo(() => {
    if (useCaseSlug !== 'product-categorization') return [];

    const extractNum = (name: string): number => {
      const match = name.match(/^Dataset (\d+)$/); // Regex for "Dataset X"
      return match ? parseInt(match[1], 10) : Infinity;
    };

    return [...productCategorizationDatasets].sort((a, b) => {
      const numA = extractNum(a.name);
      const numB = extractNum(b.name);

      if (numA !== Infinity && numB !== Infinity) {
        return numA - numB; // Sort numerically if both are numbers
      }
      // Fallback for non-standard names or if one is not a number
      if (numA !== Infinity) return -1; // numA (number) comes before numB (Infinity/non-match)
      if (numB !== Infinity) return 1;  // numB (number) comes before numA (Infinity/non-match)
      return a.name.localeCompare(b.name); // Fallback to alphabetical if neither matches "Dataset X"
    });
  }, [productCategorizationDatasets, useCaseSlug]);

  useEffect(() => {
    if (useCaseSlug === 'product-categorization') {
      const currentIsValid = currentProductCatDataset && productCatDatasetsForDisplay.some(d => d.id === currentProductCatDataset.id);
      if (productCatDatasetsForDisplay.length > 0 && !currentIsValid) {
        const defaultDataset = productCatDatasetsForDisplay.find(ds => ds.name === 'Dataset 25');
        if (defaultDataset) {
          setCurrentProductCatDataset(defaultDataset);
        } else if (productCatDatasetsForDisplay.length > 0) {
          setCurrentProductCatDataset(productCatDatasetsForDisplay[0]);
        } else {
           setCurrentProductCatDataset(null);
        }
      } else if (productCatDatasetsForDisplay.length === 0) {
        setCurrentProductCatDataset(null);
      }
    }
  }, [productCatDatasetsForDisplay, useCaseSlug, currentProductCatDataset]);

  const handleProductCatDatasetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const datasetId = event.target.value;
    const selected = productCatDatasetsForDisplay.find(ds => ds.id === datasetId);
    if (selected) {
      setCurrentProductCatDataset(selected);
    }
  };

  const productCatSummaryStats = useMemo(() => {
    if (productCategorizationDatasets.length === 0) return null;
    const N = productCategorizationDatasets.length;
    const rows = productCategorizationDatasets.map(ds => ds.rows);
    
    return {
      count: N,
      avgRows: (rows.reduce((sum, r) => sum + r, 0) / N).toFixed(0),
    };
  }, [productCategorizationDatasets]);

  let pageTitle = '';
  let pageDescription = '';

  if (useCaseSlug === 'product-categorization') {
    pageTitle = 'Industrial use case: Product Categorization 🛍️';
    pageDescription = "Product categorization is a key task in Commerce, involving the classification of products into structured categories using complex, high-dimensional tabular data. This section evaluates model performance on real industrial datasets that are used in production environments.";
  } else if (useCaseSlug === 'deduplication') {
    pageTitle = 'Industrial use case: Deduplication 🧹';
    pageDescription = `This section will evaluate models on an industry deduplication task where a model has to identify duplicate records in product listings or customer databases. Benchmarking data and insights are coming soon.`;
  } else if (useCaseSlug) {
    pageTitle = `Industrial: ${getUseCaseDisplayName(useCaseSlug)}`;
    if (industrialDatasetsForPage.length > 0) {
      pageDescription = `Model performance on ${industrialDatasetsForPage.length} ${getUseCaseDisplayName(useCaseSlug).toLowerCase()} datasets.`;
    } else {
      pageDescription = `Model performance on ${getUseCaseDisplayName(useCaseSlug).toLowerCase()} tasks. Currently, no datasets are configured for this specific use case.`;
    }
  } else {
    pageTitle = 'Industrial Datasets';
    pageDescription = 'Explore performance on various industrial use cases.';
  }

  const getChartData = (datasetId: string, metricName: string): ChartDataItem[] => {
    const datasetResults = RESULTS.filter(r => r.datasetId === datasetId);
    return datasetResults.map(result => {
      const model = MODELS.find(m => m.id === result.modelId);
      const metric = result.metrics.find(m => m.name === metricName);
      
      const chartItem: ChartDataItem = {
        modelName: model ? model.name : 'Unknown Model',
        [metricName]: metric && typeof metric.value === 'number' ? metric.value : NaN, // Use NaN for missing/invalid
      };
      if (metric && typeof metric.stdDev === 'number' && metric.stdDev > 0 && !isNaN(metric.value)) {
        chartItem[`${metricName}_stdDev`] = metric.stdDev;
      }
      return chartItem;

    }).sort((a, b) => {
        if (a.modelName === 'NICL') return -1;
        if (b.modelName === 'NICL') return 1;

        const valA = a[metricName] as number;
        const valB = b[metricName] as number;

        if (isNaN(valA)) return 1; // Push NaN to end
        if (isNaN(valB)) return -1; // Push NaN to end

        const lowerIsBetterMetrics = ['rmse', 'inference latency (ms)', 'training time (s)'];
        if (lowerIsBetterMetrics.includes(metricName.toLowerCase())) {
            return valA - valB;
        }
        return valB - valA;
    });
  };

  const productCatSelectableMetrics = ['Accuracy', 'F1 Score', 'AUC'];
  const avgProductCatSelectableMetrics = ['Accuracy', 'F1 Score', 'AUC'];

  const productCatModelStats = useMemo(() => {
    if (useCaseSlug !== 'product-categorization' || productCategorizationDatasets.length === 0) {
        return null;
    }
    const metricsToAggregate = ['Accuracy', 'F1 Score', 'AUC'];
    const modelAggregates: { [modelId: string]: { [metricName: string]: { sum: number, count: number, sumOfSquares: number } } } = {};

    MODELS.forEach(model => {
        modelAggregates[model.id] = {};
        metricsToAggregate.forEach(metric => {
            modelAggregates[model.id][metric] = { sum: 0, count: 0, sumOfSquares: 0 };
        });
    });

    productCategorizationDatasets.forEach(dataset => {
        MODELS.forEach(model => {
            const result = RESULTS.find(r => r.datasetId === dataset.id && r.modelId === model.id);
            if (result) {
                metricsToAggregate.forEach(metricName => {
                    const metric = result.metrics.find(m => m.name === metricName);
                    if (metric && typeof metric.value === 'number' && !isNaN(metric.value)) {
                        modelAggregates[model.id][metricName].sum += metric.value;
                        modelAggregates[model.id][metricName].sumOfSquares += metric.value * metric.value;
                        modelAggregates[model.id][metricName].count += 1;
                    }
                });
            }
        });
    });
    return modelAggregates;
  }, [productCategorizationDatasets, MODELS, RESULTS, useCaseSlug]);

  const averagePerformanceChartData = useMemo((): ChartDataItem[] => {
      if (!productCatModelStats) return [];
      return MODELS.map(model => {
          const modelStats = productCatModelStats[model.id];
          const metricStats = modelStats?.[selectedAvgProductCatMetric];
          let avgValue: number = NaN; // Default to NaN
          let stdDevValue: number = NaN; // Default to NaN

          if (metricStats && metricStats.count > 0) {
              avgValue = parseFloat((metricStats.sum / metricStats.count).toFixed(4));
              const mean = metricStats.sum / metricStats.count;
              const variance = (metricStats.sumOfSquares / metricStats.count) - (mean * mean);
              stdDevValue = variance > 0 ? parseFloat(Math.sqrt(variance).toFixed(4)) : 0; // stdDev can be 0
          }
          const chartDataItem: ChartDataItem = {
              modelName: model.name,
              [selectedAvgProductCatMetric]: avgValue,
          };
          if (!isNaN(stdDevValue) && stdDevValue > 0) { // Only add stdDev if it's a valid positive number
              chartDataItem[`${selectedAvgProductCatMetric}_stdDev`] = stdDevValue;
          }
          return chartDataItem;
      }).sort((a, b) => {
          if (a.modelName === 'NICL') return -1;
          if (b.modelName === 'NICL') return 1;

          const valA = a[selectedAvgProductCatMetric] as number;
          const valB = b[selectedAvgProductCatMetric] as number;

          if (isNaN(valA)) return 1;
          if (isNaN(valB)) return -1;
          
          const lowerIsBetterMetrics = ['rmse', 'inference latency (ms)', 'training time (s)'];
          if (lowerIsBetterMetrics.includes(selectedAvgProductCatMetric.toLowerCase())) {
              return valA - valB;
          }
          return valB - valA;
      });
  }, [productCatModelStats, selectedAvgProductCatMetric, MODELS]);

  const averagePerformanceTableResults = useMemo((): PerformanceResult[] => {
      if (!productCatModelStats) return [];
      const metricsForTable = ['Accuracy', 'F1 Score', 'AUC'];
      return MODELS.map(model => {
          const avgMetrics: Metric[] = [];
          const modelAggData = productCatModelStats[model.id];
          metricsForTable.forEach(metricName => {
              const metricData = modelAggData?.[metricName];
              if (metricData && metricData.count > 0) {
                  avgMetrics.push({ 
                      name: metricName, 
                      value: parseFloat((metricData.sum / metricData.count).toFixed(4)) 
                  });
              } else {
                  avgMetrics.push({ name: metricName, value: NaN }); // Push NaN if no data
              }
          });
          return {
              datasetId: 'product-categorization-avg', 
              modelId: model.id,
              metrics: avgMetrics,
          };
      }); 
  }, [productCatModelStats, MODELS]);
  
  const productCategorizationDatasetIds = useMemo(() => {
    return productCategorizationDatasets.map(ds => ds.id);
  }, [productCategorizationDatasets]);

  const avgMetricSelectorControls = (
    <div className="flex justify-center w-full">
        <div id="avg-metric-select-group" role="group" className="inline-flex rounded-md shadow-sm">
        {avgProductCatSelectableMetrics.map((metric, idx) => ( 
            <button
            key={metric}
            type="button"
            onClick={() => setSelectedAvgProductCatMetric(metric)}
            className={`px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium border transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#1b998b] focus:z-10
                ${idx === 0 ? 'rounded-l-md' : ''}
                ${idx === avgProductCatSelectableMetrics.length - 1 ? 'rounded-r-md' : 'border-r-0'}
                ${selectedAvgProductCatMetric === metric 
                    ? 'bg-[#1b998b] text-white border-[#1b998b] hover:bg-[#137e71]' 
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
            aria-pressed={selectedAvgProductCatMetric === metric}
            >
            {metric}
            </button>
        ))}
        </div>
    </div>
  );
  
  const individualDatasetMetricSelectorControls = (currentDatasetId: string) => (
    <div className="flex justify-center w-full">
      <div id={`metric-select-group-${currentDatasetId}`} role="group" className="inline-flex rounded-md shadow-sm">
        {productCatSelectableMetrics.map((metric, idx) => (
          <button
            key={metric}
            type="button"
            onClick={() => setSelectedProductCatMetric(metric)}
            className={`px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium border transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#1b998b] focus:z-10
                ${idx === 0 ? 'rounded-l-md' : ''}
                ${idx === productCatSelectableMetrics.length - 1 ? 'rounded-r-md' : 'border-r-0'}
                ${selectedProductCatMetric === metric 
                    ? 'bg-[#1b998b] text-white border-[#1b998b] hover:bg-[#137e71]' 
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
            aria-pressed={selectedProductCatMetric === metric}
          >
            {metric}
          </button>
        ))}
      </div>
    </div>
  );


  return (
    <div className="space-y-6 md:space-y-5">
      <header className="pb-6 md:pb-2">
        <div className="md:flex md:justify-between md:items-start">
          <div className="flex-grow">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{pageTitle}</h1>
            <p className="text-md sm:text-md text-gray-600 mt-4">{pageDescription}</p>
          </div>
        </div>
      </header>

      {useCaseSlug === 'product-categorization' && (
        <section className="p-4 sm:p-5 bg-gradient-to-r from-teal-50 to-green-50 rounded-lg border border-teal-200 text-center shadow-sm">
          <p className="text-gray-700 text-sm sm:text-base mb-3">
              Curious how TabBench models perform on your company’s private data?
          </p>
          <a
            href="https://www.neuralk-ai.com/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#1b998b] text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:bg-[#157f71] focus:outline-none focus:ring-2 focus:ring-[#1b998b] focus:ring-offset-2 transition-colors duration-150 text-sm"
          >
            Reach out to get started
          </a>
        </section>
      )}

      {useCaseSlug === 'deduplication' && (
        <section className="p-6 sm:p-8 bg-slate-50 rounded-lg shadow-md border border-slate-200 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-700 mb-3">
            Deduplication Datasets - Coming Soon!
          </h2>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-md text-gray-600 mt-2">
            We are working diligently to curate and add specialized datasets for the deduplication use case.
            These datasets will focus on real-world challenges like identifying duplicate product listings and customer records.
          </p>
          <p className="text-md text-gray-600 mt-2">
            Please check back later for updates!
          </p>
        </section>
      )}

      {useCaseSlug === 'product-categorization' && (
        <>
          {productCategorizationDatasets.length > 0 ? (
            <>
              <section 
                aria-labelledby="dataset-explorer-heading" 
                className="mt-4 md:mt-6 p-4 sm:p-6 bg-slate-50 rounded-lg shadow-md border border-slate-200"
              >
                <h2 id="dataset-explorer-heading" className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 mb-2">
                  Datasets Explorer
                </h2>
                <div className="text-md text-gray-600 space-y-2">
                  <p>
                    This section explores industry datasets derived from a large, industry-grade retail database with a hierarchical product ontology. The full product categorization spans four levels of depth, reflecting increasingly fine-grained classification. For example, a product like a jigsaw might be categorized as:
                  </p>
                  <p className="pl-4">
                    <em>Tools/Equipment → Tools/Equipment → Saws → Jigsaw</em>
                  </p>
                  <p>
                    To manage memory constraints and enable focused analysis, the original database was split into four separate datasets, each corresponding to a different complexity level (Levels 1–4). These levels represent increasing granularity in the product taxonomy:
                  </p>
                  <ul className="list-disc list-inside pl-4 space-y-1">
                    <li>Level 1 includes 48 broad categories,</li>
                    <li>Level 2 expands to 102 mid-level categories,</li>
                    <li>Level 3 captures 383 more specific subcategories, and</li>
                    <li>Level 4 reaches 1218 highly detailed leaf-level categories.</li>
                  </ul>
                  <p className="mb-8 md:mb-10 lg:mb-12">
                    This hierarchical structure allows for progressive evaluation of models, where categorization becomes more challenging at deeper levels due to the increasing number of categories and their semantic similarity.
                  </p>
                </div>

                <div className="mt-3 md:mt-4 py-4">
                   <p className="text-md text-gray-600 mb-4">
                    The evaluation results are generated using an optimized Workflow tailored to each specific use case. Below is an example illustrating the Workflow process for XGBoost — the same logic applies to all other models assessed. For a deeper understanding, you can explore our <a href="https://github.com/Neuralk-AI/TabBench/tree/main/tutorials" className="text-[#127064] font-semibold">Notebooks</a> to see the Workflows in action.
                  </p>
                  <img 
                    src="https://raw.githubusercontent.com/Neuralk-AI/TabBench/refs/heads/dashboard/workflow.png" 
                    alt="Example Workflow for XGBoost Evaluation" 
                    className="w-full max-w-3xl mx-auto rounded-lg shadow-md border border-gray-300" 
                  />
                </div>
                
                {productCatSummaryStats && (
                  <div aria-labelledby="summary-stats-subheading" className="mt-6 md:mt-8">
                    <h3 id="summary-stats-subheading" className="sr-only">Dataset Summary Statistics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center mb-4">
                      <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200">
                        <p className="text-xs text-gray-500">Total Datasets</p>
                        <p className="text-lg font-semibold text-[#1b998b]">{productCatSummaryStats.count}</p>
                      </div>
                      <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200">
                        <p className="text-xs text-gray-500">Avg. Rows</p>
                        <p className="text-lg font-semibold text-gray-700">{Number(productCatSummaryStats.avgRows).toLocaleString()}</p>
                      </div>
                       <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200">
                        <p className="text-xs text-gray-500">Features</p>
                        <p className="text-base sm:text-lg font-semibold text-gray-800">Title, Description</p>
                      </div>
                    </div>
                  </div>
                )}
                
              </section>

              {averagePerformanceTableResults.length > 0 && (
                 <section 
                    aria-labelledby="average-model-performance-heading" 
                    className="mt-6 md:mt-8 p-4 sm:p-6 bg-slate-50 rounded-lg shadow-md border border-slate-200"
                 >
                    <h2 id="average-model-performance-heading" className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 mb-0">
                        Average Model Performance
                    </h2>
                     <p className="text-sm text-gray-500 mb-4 md:mb-6">(across all datasets)</p>
                    
                    {averagePerformanceChartData.some(item => !isNaN(item[selectedAvgProductCatMetric] as number)) ? (
                        <PerformanceChart
                            data={averagePerformanceChartData}
                            metricName={selectedAvgProductCatMetric}
                            title={`Average Performance (${selectedAvgProductCatMetric})`}
                            headerControls={avgMetricSelectorControls}
                            tightenYAxis={true}
                        />
                    ) : (
                        <p className="text-gray-500 text-sm p-4 text-center">No average chart data available for {selectedAvgProductCatMetric}.</p>
                    )}
                     <PerformanceTable
                        results={averagePerformanceTableResults}
                        title="Average Detailed Metrics - Product Categorization"
                    />
                 </section>
              )}

              <section 
                aria-labelledby="individual-dataset-evaluation-heading"
                className="mt-6 md:mt-8 p-4 sm:p-6 bg-slate-50 rounded-lg shadow-md border border-slate-200"
              >
                <div className="md:flex md:justify-between md:items-start mb-4 md:mb-6">
                    <div>
                        <h2 id="individual-dataset-evaluation-heading" className="text-xl sm:text-2xl md:text-2xl font-semibold text-gray-800 mb-1">
                        Individual Dataset Evaluation
                        </h2>
                        {productCatDatasetsForDisplay.length > 0 && (
                            <p className="text-sm text-gray-600">
                                Select a dataset from the dropdown to explore its performance details.
                            </p>
                        )}
                    </div>
                    {productCatDatasetsForDisplay.length > 0 && currentProductCatDataset && (
                         <div className="mt-4 md:mt-0 flex justify-end">
                            <label htmlFor="product-cat-dataset-select" className="sr-only">Select Product Categorization Dataset</label>
                            <select
                                id="product-cat-dataset-select"
                                value={currentProductCatDataset.id}
                                onChange={handleProductCatDatasetChange}
                                className="block w-full max-w-xs sm:max-w-sm md:w-auto md:max-w-md lg:max-w-lg pl-3 pr-10 py-2 text-base bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-[#1b998b] focus:border-[#1b998b] sm:text-sm rounded-md shadow-sm"
                                aria-label="Select a dataset for evaluation"
                            >
                                {productCatDatasetsForDisplay.map(ds => (
                                    <option key={ds.id} value={ds.id}>
                                        {ds.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                 {currentProductCatDataset ? (
                    <div key={currentProductCatDataset.id} className="animate-fadeIn">
                        <DatasetCard dataset={currentProductCatDataset} />
                        
                        {(() => {
                            let datasetResults = RESULTS.filter(r => r.datasetId === currentProductCatDataset.id);
                            if (currentProductCatDataset.useCaseSlug === 'product-categorization') {
                                datasetResults = datasetResults.map(res => ({
                                    ...res,
                                    metrics: res.metrics.filter(m => m.name !== 'Precision')
                                })).filter(res => res.metrics.length > 0);
                            }

                            const chartData = getChartData(currentProductCatDataset.id, selectedProductCatMetric);
                            let chartToDisplay = null;

                            if (chartData.some(item => !isNaN(item[selectedProductCatMetric] as number))) { // Check if there's any valid data
                                chartToDisplay = (
                                  <PerformanceChart
                                    data={chartData}
                                    metricName={selectedProductCatMetric}
                                    title={`Performance on ${currentProductCatDataset.name}`}
                                    headerControls={individualDatasetMetricSelectorControls(currentProductCatDataset.id)}
                                  />
                              );
                            } else if (datasetResults.length > 0) { 
                                chartToDisplay = <div className="mb-4 md:mb-6">{individualDatasetMetricSelectorControls(currentProductCatDataset.id)}</div>;
                            }

                            return (
                                <>
                                {chartToDisplay}
                                {datasetResults.length > 0 && datasetResults.some(r => r.metrics.some(m => !isNaN(m.value))) ? (
                                  <PerformanceTable 
                                    results={datasetResults} 
                                    title={`Detailed Metrics: ${currentProductCatDataset.name}`}
                                  />
                                ) : (
                                  <p className="text-gray-500 p-4 bg-white rounded-md text-center text-sm border border-gray-200 shadow-md">No performance results available for {currentProductCatDataset.name}.</p>
                                )}
                                </>
                            );
                        })()}
                    </div>
                ) : (
                  <div className="text-center py-8 md:py-10">
                      <p className="text-lg sm:text-xl text-gray-500">
                          {productCategorizationDatasets.length === 0 ? 
                              'No datasets available for Product Categorization.' :
                              'Please select a dataset from the dropdown above to view its details.'
                          }
                      </p>
                  </div>
                )}
              </section>
              
              {productCategorizationDatasetIds.length > 0 && (
                <section className="mt-10 md:mt-12">
                    <CrossModelPerformanceTable 
                        datasetIds={productCategorizationDatasetIds}
                        title="Overview of performance on individual datasets"
                    />
                </section>
              )}
            </>
          ) : (
            <div className="text-center py-8 md:py-10">
                <p className="text-lg sm:text-xl text-gray-500">
                    No datasets available for Product Categorization.
                </p>
            </div>
          )}
        </>
      )}

      {useCaseSlug !== 'product-categorization' && useCaseSlug !== 'deduplication' && (
        <>
          {industrialDatasetsForPage.length === 0 && useCaseSlug && (
            <div className="text-center py-8 md:py-10">
                <p className="text-lg sm:text-xl text-gray-500">
                    {`No datasets currently available for "${getUseCaseDisplayName(useCaseSlug)}".`}
                </p>
            </div>
          )}

          {industrialDatasetsForPage.map((dataset: Dataset) => {
            const datasetResults = RESULTS.filter(r => r.datasetId === dataset.id);
            let chartToDisplay = null;
            const primaryMetricOrder = ['Accuracy', 'F1 Score', 'AUC', 'R2 Score', 'Recall', 'RMSE']; 
            let primaryMetric = 'N/A';

            if (datasetResults.length > 0 && datasetResults[0].metrics.length > 0) {
                const availableMetrics = datasetResults[0].metrics.map(m => m.name);
                for (const preferredMetric of primaryMetricOrder) {
                    if (availableMetrics.includes(preferredMetric)) {
                        primaryMetric = preferredMetric;
                        break;
                    }
                }
                if (primaryMetric === 'N/A' && availableMetrics.length > 0) { 
                    primaryMetric = availableMetrics[0];
                }
            }
            
            const primaryChartData = primaryMetric !== 'N/A' ? getChartData(dataset.id, primaryMetric) : [];
            if (primaryMetric !== 'N/A' && primaryChartData.some(item => !isNaN(item[primaryMetric] as number))) {
              chartToDisplay = (
                <PerformanceChart
                  data={primaryChartData}
                  metricName={primaryMetric}
                  title={`Performance on ${dataset.name}`}
                />
              );
            }

            return (
              <section key={dataset.id} className="mt-6 md:mt-8" aria-labelledby={`dataset-heading-${dataset.id}`}>
                <h2 id={`dataset-heading-${dataset.id}`} className="sr-only">{dataset.name} Details and Performance</h2>
                <DatasetCard dataset={dataset} />
                {chartToDisplay}
                {datasetResults.length > 0 && datasetResults.some(r => r.metrics.some(m => !isNaN(m.value)))? (
                  <PerformanceTable 
                    results={datasetResults} 
                    title={`Detailed Metrics: ${dataset.name}`}
                  />
                ) : (
                  <p className="text-gray-500 p-4 bg-gray-50 rounded-md text-center text-sm">No performance results available for {dataset.name}.</p>
                )}
              </section>
            );
          })}
        </>
      )}
    </div>
  );
};

export default IndustrialDatasetsPage;
