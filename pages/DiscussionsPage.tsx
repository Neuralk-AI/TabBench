
import React from 'react';

const DiscussionsPage: React.FC = () => {
  return (
    <div className="space-y-6 md:space-y-10">
      <header className="pb-1 md:pb-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">TabBench Discussions</h1>
        <p className="text-s sm:text-md text-gray-600 mt-1">
          Join the conversation, ask questions, and share your insights.
        </p>
      </header>
      <section className="p-4 sm:p-6 bg-slate-50 rounded-lg shadow-md border border-slate-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
          Community Forums
        </h2>
        <div className="space-y-4 text-gray-600">
            <p>
                This space is dedicated to fostering a vibrant community around TabBench. We encourage you to participate in discussions related to:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Benchmark results and interpretations</li>
                <li>Model performance on specific datasets or use cases</li>
                <li>Challenges in tabular data modeling</li>
                <li>Suggestions for improving TabBench</li>
                <li>Research ideas and collaborations</li>
            </ul>
            <p>
                Currently, discussions are primarily hosted on our GitHub Discussions page (link to be added soon) and potentially other community platforms.
            </p>
            <p>
                Please be respectful and constructive in all your interactions. We aim to create a welcoming environment for everyone.
            </p>
        </div>
      </section>
    </div>
  );
};

export default DiscussionsPage;