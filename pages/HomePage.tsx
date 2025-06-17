
import React from 'react';

const HomePage: React.FC = () => {
  // Previous features array commented out or removed
  // const features = [
  //   "A focus on critical, industry use cases to ensure models are evaluated on problems that actually matter in production.",
  //   "Extensive evaluation on public & private industry datasets shared from partner companies.",
  //   "Further evaluation on synthetic and academic datasets for fair model comparison.",
  //   "Easy identification of top-performing tabular models via the TabBench Dashboard.",
  //   "Simple workflow logic with standardized preprocessing, training, and evaluation steps across all models.",
  //   "Neuralk Foundry, a modular framework designed to help you quickly build and experiment with data processing workflows."
  // ];

  const dashboardFeatures = [
    "Explore datasets & tasks: Access information and statistics for industrial datasets tied to industry use cases like Product Categorization and Deduplication, as well as academic datasets covering general tasks like classification.",
    "Visualize performance: Interactively explore model results with dynamic plots and sortable tables across key performance metrics like Accuracy, F1-score and ROC-AUC.",
    "Compare models: For each dataset and use case, quickly compare models side by side to understand their strengths across different scenarios.",
    "Advanced resources to explore TabBench code and notebooks: Get hands-on with detailed example notebooks and open-source code to run TabBench yourself, including full access to both the TabBench benchmark and the Neuralk Foundry framework (available via the menu)",
  ];


  return (
    <div className="space-y-8 md:space-y-10 lg:space-y-12 bg-white rounded-lg">
      <header className="text-center md:text-left pb-2 md:pb-2"> {/* Enhanced border */}
        <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold text-gray-800 mb-3">
          Welcome to the TabBench Dashboard 👋
        </h1>
        <p className="text-md sm:text-lg text-gray-600 md:mx-0">
          Visualize and compare the performance of ML models on industry-grade tabular datasets and use cases.
        </p>
      </header>

      {/* Get Started Box - Moved Up, hidden on md screens and up */}
      <section className="space-y-4 p-5 sm:p-6 bg-gradient-to-r from-[#e0f2f1] to-[#e8f5f3] rounded-lg border border-[#a6dbd4] md:hidden">
        <div className="flex items-center mb-3 sm:mb-4"> {/* Increased bottom margin */}
          <h3 className="text-xl sm:text-2xl font-bold text-[#127064]"> {/* Bolder title */}
          Get Started
          </h3>
        </div>
        <p className="text-gray-700 text-sm sm:text-base leading-normal sm:leading-snug">
        Use the menu to explore performance on <strong className="text-[#1b998b]">Industrial</strong> datasets built around real industry use cases like Product Categorization and Deduplication, or check out <strong className="text-[#1b998b]">Academic</strong> benchmarks for comparison on more standardized, well-known tasks.

        </p>
          <p className="text-gray-700 text-sm sm:text-base leading-normal sm:leading-snug">
        We’re continuously expanding with new datasets, models and use cases, so check back often for the latest updates!
        </p>
      </section>

      {/* Visual Grouping for Core Content */}
      <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-200">
        <section>
          <h2 className="text-2xl sm:text-2xl font-semibold text-gray-800 mb-4 md:mb-5 text-center md:text-left">
            What is TabBench?
          </h2>
          <div className="space-y-4 text-gray-700 leading-normal sm:leading-snug text-sm sm:text-base"> {/* Enhanced line height */}
            <p>
            TabBench is the first open-source benchmark designed to test ML models on real enterprise data and use cases.
            </p>
            <p>
              It begins with a focus on Commerce, tackling key use cases like <a href="https://tabbench-dashboard.netlify.app/#/industrial/product-categorization" className="text-[#127064] font-semibold">Product categorization</a> and <a href="https://tabbench-dashboard.netlify.app/#/industrial/deduplication"  className="text-[#127064] font-semibold">Deduplication</a>, where data is complex, messy, and high-dimensional, reflecting the challenges data teams face every day.            </p>
            <p>
              Rather than evaluating models on generic ML tasks like most benchmarks, TabBench shows how they perform in these real, industry-grade scenarios, helping you confidently choose the solutions that work best in production and not just in theory.
            </p>
          </div>
        </section>

          <section className="mt-8 md:mt-10">
          <h2 className="text-2xl sm:text-2xl font-semibold text-gray-800 mb-4 md:mb-5 text-center md:text-left">
            NICL, a Tabular Foundation Model by Neuralk-AI 
          </h2>
          <div className="space-y-4 text-gray-700 leading-normal sm:leading-snug text-sm sm:text-base"> {/* Enhanced line height */}
            <p>
            The TabBench Dashboard presents the first performance results of NICL (Neuralk In-Context-Learning), a novel Tabular Foundation Model developed by Neuralk-AI, delivering state-of-the-art performance on industrial use cases. Navigate through the dashboard to start exploring the results.            </p>
          </div>
        </section>

        <section className="mt-8 md:mt-10"> {/* Spacing within the group */}
          <h2 className="text-2xl sm:text-2xl font-semibold text-gray-800 mb-3 md:mb-4 text-center md:text-left">
            👉 Overview of Dashboard Features
          </h2>
          <p className="text-gray-700 leading-normal sm:leading-snug text-sm sm:text-base mb-4 md:mb-5">
          The TabBench Dashboard makes it easy to explore how ML models perform across different tabular datasets and use cases. Here’s what you can do:
          </p>
          <ul className="space-y-3 sm:space-y-4">
            {dashboardFeatures.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg className="flex-shrink-0 h-5 w-5 text-[#1b998b] mr-3 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 leading-normal sm:leading-snug text-sm sm:text-base">{feature}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Partner Box - mt classes removed to rely on parent space-y */}
      <section className="p-5 sm:p-6 bg-gradient-to-r from-[#e0f2f1] to-[#e8f5f3] rounded-lg border border-[#a6dbd4]">
        <div className="flex items-center mb-3 sm:mb-4"> {/* Increased bottom margin */}
          <h3 className="text-xl sm:text-2xl font-bold text-[#127064]"> {/* Bolder title */}
            🤝 Partner with TabBench
          </h3>
        </div>
        <p className="text-gray-700 text-sm sm:text-base leading-normal sm:leading-snug mb-3">
        Interested to evaluate models on your private company data and use cases?
        </p>
        <p className="text-gray-700 text-sm sm:text-base leading-normal sm:leading-snug">
            <a 
                href="https://www.neuralk-ai.com/contact" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#1b998b] font-semibold hover:underline"
            >
                Get in touch 
            </a> to learn more about our partnerships program.
        </p>
      </section>

    </div>
  );
};

export default HomePage;
