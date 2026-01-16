import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface WorkerLoadChartProps {
  data: Array<{
    workerId: string;
    activeTasks: number;
    totalProcessed: number;
    cpuUsage: number;
  }>;
}

const WorkerLoadChart: React.FC<WorkerLoadChartProps> = ({ data }) => {
  const getBarColor = (value: number) => {
    if (value < 30) return '#10b981';
    if (value < 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="workerId" 
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}
        />
        <Legend />
        <Bar 
          dataKey="activeTasks" 
          fill="#3b82f6"
          radius={[8, 8, 0, 0]}
        />
        <Bar 
          dataKey="cpuUsage" 
          radius={[8, 8, 0, 0]}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.cpuUsage)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WorkerLoadChart;