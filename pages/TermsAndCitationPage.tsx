
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
            The TabBench dashboard and associated code are provided under an <a className="font-semibold text-[#127064]" href="https://github.com/Neuralk-AI/TabBench/blob/main/LICENSE"> open-source license</a>. Private industry datasets remain confidential and are governed under partnership agreements. 
        </p>
     

        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 mt-6">
          How to Cite TabBench
        </h2>
        <p className="text-gray-600 mb-2">
            If you use TabBench resources (benchmark, datasets, dashboard, or findings) in your research or work, please cite our work:
        </p>
        <div className="p-3 bg-gray-100 rounded-md text-sm text-gray-700 border border-gray-300">
            <p className="font-mono">
                TabBench: A Tabular Machine Learning Benchmark, Neuralk-AI (2025).  <br />
                (Link to technical paper coming soon)
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