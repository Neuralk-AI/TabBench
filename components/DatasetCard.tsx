import React from 'react';
import { Dataset } from '../types';

interface DatasetCardProps {
  dataset: Dataset;
}

const InfoPill: React.FC<{label: string, value: string | number, className?: string}> = ({label, value, className = 'bg-[#d1e9e6] text-[#105c52]'}) => (
  <span className={`text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded-full ${className} whitespace-nowrap`}>
    {label}: <strong className="font-semibold">{value}</strong>
  </span>
);

const DatasetCard: React.FC<DatasetCardProps> = ({ dataset }) => {
  const levelFromFile = dataset.batchFile?.match(/level_(\d+)/)?.[1];

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      {dataset.useCaseSlug === 'product-categorization' && (
         <div className="mb-2 md:mb-3">
            <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Product Categorization</span>
        </div>
      )}
      <h3 className="text-xl md:text-2xl font-bold text-[#1b998b] mb-2 md:mb-3">{dataset.name}</h3>
      <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">{dataset.description}</p>
      
      <div className="mb-3 md:mb-4 flex flex-wrap">
        <InfoPill label="Type" value={dataset.type.charAt(0).toUpperCase() + dataset.type.slice(1)} className="bg-indigo-100 text-indigo-800" />
        <InfoPill label="Source" value={dataset.source} className="bg-green-100 text-green-800" />
        {dataset.task && (
            <InfoPill label="Task" value={dataset.task} className="bg-yellow-100 text-yellow-800" />
        )}
        {typeof dataset.level === 'number' && (
            <InfoPill label="Level" value={dataset.level} className="bg-purple-100 text-purple-800" />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-sm mb-3 md:mb-4">
        <div className="bg-gray-50 p-3 rounded-md text-center sm:text-left">
          <p className="text-gray-500 font-medium text-xs sm:text-sm">Rows</p>
          <p className="text-gray-800 font-semibold text-base sm:text-lg">{dataset.rows.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md text-center sm:text-left">
          <p className="text-gray-500 font-medium text-xs sm:text-sm">Features</p>
          <p className="text-gray-800 font-semibold text-base sm:text-lg">
            {typeof dataset.features === 'string' ? dataset.features : dataset.features.toLocaleString()}
          </p>
        </div>
        {dataset.numClasses !== undefined && (
            <div className="bg-gray-50 p-3 rounded-md text-center sm:text-left">
                <p className="text-gray-500 font-medium text-xs sm:text-sm">Classes</p>
                <p className="text-gray-800 font-semibold text-base sm:text-lg">
                    {typeof dataset.numClasses === 'number' ? dataset.numClasses.toLocaleString() : dataset.numClasses}
                </p>
            </div>
        )}
        {levelFromFile && (
            <div className="bg-gray-50 p-3 rounded-md text-center sm:text-left">
                <p className="text-gray-500 font-medium text-xs sm:text-sm">Level</p>
                <p className="text-gray-800 font-semibold text-base sm:text-lg">
                    {levelFromFile}
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default DatasetCard;