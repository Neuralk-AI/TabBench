
import React from 'react';

const ContributePage: React.FC = () => {
  return (
    <div className="space-y-6 md:space-y-10">
      <header className="pb-1 md:pb-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Contribute to TabBench</h1>
        <p className="text-s sm:text-md text-gray-600 mt-1">
          Help us improve the TabBench benchmark and dashboard.
        </p>
      </header>
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
      <section className="p-4 sm:p-6 bg-slate-50 rounded-lg shadow-md border border-slate-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
          How to Contribute
        </h2>
        <div className="space-y-4 text-gray-600">
            <p>
                We welcome contributions from the community! Whether you're interested in adding new models, datasets, improving the dashboard, or fixing bugs, your help is valuable.
            </p>
            <p>
                <strong>Dataset Submissions:</strong> If you have a relevant dataset that you believe would be a valuable addition to TabBench (especially private industry datasets), please <a className="font-semibold text-[#127064]" href="https://www.neuralk-ai.com/contact">contact us</a>. We have a process for evaluating and integrating new datasets while respecting data privacy and terms of use.
            </p>
            <p>
                <strong>Model Submissions:</strong> We’re actively keeping an eye on the latest research to integrate new models in TabBench. If you think we’ve missed an important publication-backed model that deserves to be benchmarked, please <a className="font-semibold text-[#127064]" href="https://www.neuralk-ai.com/contact">reach out to us</a>. 
            </p>
            <p>
                <strong>Bug Reports & Feature Requests:</strong> Found a bug or have an idea for a new feature? Please submit an issue on our <a className="font-semibold text-[#127064]" href="https://github.com/Neuralk-AI/TabBench/"> GitHub repository </a>.
            </p>
            <p>
                More detailed instructions and guidelines will be available here soon.
            </p>
        </div>
      </section>
    </div>
  );
};

export default ContributePage;