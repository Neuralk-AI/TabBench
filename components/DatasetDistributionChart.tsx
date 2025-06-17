import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DistributionChartDataItem {
  name: string; // Bin name or category label
  count: number; // Number of datasets in this bin/category
}

interface DatasetDistributionChartProps {
  data: DistributionChartDataItem[];
  title: string;
  barColor?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

const DatasetDistributionChart: React.FC<DatasetDistributionChartProps> = ({
  data,
  title,
  barColor = '#8884d8',
  xAxisLabel,
  yAxisLabel,
}) => {
  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-sm p-4 text-center">No data available for "{title}".</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-3 sm:p-4 md:p-4 border border-gray-200 h-full">
      <h5 className="text-sm sm:text-md font-semibold text-gray-700 mb-3 md:mb-4 text-center">{title}</h5>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="name"
            angle={-30}
            textAnchor="end"
            height={40}
            interval={0}
            tick={{ fontSize: 9, fill: '#4A5568' }}
            label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5, fontSize: 10, fill: '#666' } : undefined}
          />
          <YAxis
            tick={{ fontSize: 9, fill: '#4A5568' }}
            allowDecimals={false}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fontSize: 10, fill: '#666' } : undefined}
            width={35}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '4px',
              padding: '5px 10px',
              fontSize: '12px',
              borderColor: barColor
            }}
            cursor={{ fill: 'rgba(200, 200, 200, 0.3)' }}
          />
          <Bar dataKey="count" name="Datasets" radius={[3, 3, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={barColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DatasetDistributionChart;