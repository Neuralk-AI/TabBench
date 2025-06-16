
import React from 'react';

const AboutUsPage: React.FC = () => {
  return (
    <div className="space-y-6 md:space-y-10">
      <header className="pb-1 md:pb-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">About TabBench</h1>
        <p className="text-s sm:text-md text-gray-600 mt-1">
          Learn more about the TabBench initiative, our mission, and the team.
        </p>
      </header>
      <section className="p-4 sm:p-6 bg-slate-50 rounded-lg shadow-md border border-slate-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
          Our Mission
        </h2>
        <p className="text-gray-600 mb-4">
            TabBench aims to advance the field of machine learning on tabular data by providing a comprehensive, realistic, and industry-relevant benchmark. We strive to bridge the gap between academic research and real-world applications, enabling fairer and more meaningful evaluation of tabular models.
        </p>

        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 mt-6">
          The Team
        </h2>
        <p className="text-gray-600 mb-4">
            TabBench is a collaborative effort involving researchers and engineers passionate about machine learning and data science. (Specific team member details or affiliations can be added here).
        </p>
        <p className="text-gray-600 mb-4">
            We believe in open science and community-driven development.
        </p>

        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 mt-6">
          Contact Us
        </h2>
        <p className="text-gray-600">
            For inquiries, collaborations, or more information about TabBench, please reach out via (contact method to be specified, e.g., email address or link to a contact form on the main documentation website).
        </p>
      </section>
    </div>
  );
};

export default AboutUsPage;