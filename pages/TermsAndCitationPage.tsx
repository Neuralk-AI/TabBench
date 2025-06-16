
import React from 'react';

const TermsAndCitationPage: React.FC = () => {
  return (
    <div className="space-y-6 md:space-y-10">
      <header className="pb-1 md:pb-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Terms & Citation</h1>
        <p className="text-s sm:text-md text-gray-600 mt-1">
          Guidelines for using TabBench resources and how to cite our work.
        </p>
      </header>
      <section className="p-4 sm:p-6 bg-slate-50 rounded-lg shadow-md border border-slate-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
          Terms of Use
        </h2>
        <p className="text-gray-600 mb-4">
            The TabBench dashboard, associated code, and publicly available datasets are provided under an open-source license (e.g., MIT License, Apache 2.0 - specific license to be stated here). You are free to use, modify, and distribute these resources in accordance with the terms of the license.
        </p>
        <p className="text-gray-600 mb-4">
            Private industry datasets included in the benchmark are not publicly distributed and are used under specific agreements with our partners. Access to evaluate models on these datasets is managed through the TabBench contribution process.
        </p>
        <p className="text-gray-600 mb-4">
            While we strive for accuracy, the benchmark results and information provided on this dashboard are for research and informational purposes. We make no warranties regarding the completeness or suitability of the information for any particular purpose.
        </p>

        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 mt-6">
          How to Cite TabBench
        </h2>
        <p className="text-gray-600 mb-2">
            If you use TabBench resources (benchmark, datasets, dashboard, or findings) in your research or work, please cite our primary publication:
        </p>
        <div className="p-3 bg-gray-100 rounded-md text-sm text-gray-700 border border-gray-300">
            <p className="font-mono">
                [Placeholder for TabBench Paper Citation] <br />
                Author, A., Author, B., & Author, C. (Year). TabBench: A Comprehensive Benchmark for Tabular Data. <em>Journal/Conference Name, Volume</em>(Issue), Pages. <br />
                (Link to paper or arXiv preprint will be provided here)
            </p>
        </div>
        <p className="text-gray-600 mt-2">
            Using a consistent citation helps us track the impact of TabBench and supports the continued development of this resource.
        </p>
      </section>
    </div>
  );
};

export default TermsAndCitationPage;