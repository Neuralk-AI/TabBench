
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
            The TabBench dashboard and associated code are provided under an <a className="font-semibold text-[#127064] hover:underline" href="https://github.com/Neuralk-AI/TabBench/blob/main/LICENSE" target="_blank" rel="noopener noreferrer"> open-source license</a>. Private industry datasets remain confidential and are governed under partnership agreements.
        </p>


        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 mt-6">
          How to Cite TabBench
        </h2>
        <p className="text-gray-600 mb-2">
          If you use TabBench resources (benchmark, datasets, dashboard, or findings) in your research or work, please cite us:
        </p>
        <div className="p-3 bg-gray-100 rounded-md text-sm text-gray-700 border border-gray-300 mb-4">
          <p>
            TabBench: A Tabular Machine Learning Benchmark by Neuralk-AI (2025). Explore the dashboard at <a href="https://tabbench-dashboard.netlify.app/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#127064] hover:underline">TabBench Dashboard</a>.
          </p>
        </div>
        <p className="text-gray-600 mb-2">
          For academic publications, please use the following BibTeX entry:
        </p>
        <div className="p-3 bg-gray-100 rounded-md text-sm text-gray-700 border border-gray-300">
          <pre className="font-mono whitespace-pre-wrap text-xs sm:text-sm">
            <code>
{`@misc{TabBench2025,
  author    = {Neuralk-AI},
  title     = {TabBench: A Tabular Machine Learning Benchmark},
  year      = {2025},
  publisher = {Neuralk-AI},
  url      = {https://github.com/Neuralk-AI/TabBench/}
}`}
            </code>
          </pre>
        </div>
      </section>
    </div>
  );
};

export default TermsAndCitationPage;
