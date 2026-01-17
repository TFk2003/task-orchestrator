import React from 'react';
import { useStatistics } from '../../hooks/useStatistics';
import { TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './TaskStats.css';
import Loading from '../common/Loading/Loading';

const TaskStats: React.FC = () => {
  const { data: stats, isLoading } = useStatistics();

  if (isLoading) {
    return <Loading message='Loading Statistics...' />;
  }

  if (!stats) {
    return (
      <div className="stats-container">
        <div className='no-data-message'>
          <p>No statistics available.</p>
        </div>
      </div>
    );
  }

  const  statusCounts = stats.statusCounts || {};
  
  const completed = statusCounts.COMPLETED || 0;
  const failed = statusCounts.FAILED || 0;
  const processing = statusCounts.PROCESSING || 0;
  const pending = (statusCounts.PENDING || 0) + (statusCounts.QUEUED || 0);
  const retrying = statusCounts.RETRYING || 0;

  const chartData = [
    { name: 'Completed', value: completed, color: '#10b981' },
    { name: 'Processing', value: processing, color: '#3b82f6' },
    { name: 'Pending', value: pending, color: '#f59e0b' },
    { name: 'Retrying', value: retrying, color: '#8b5cf6' },
    { name: 'Failed', value: failed, color: '#ef4444' }
  ].filter(item => item.value > 0); // Only show non-zero values

  const successRate = stats.successRate || 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'white',
          padding: '0.75rem',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#1f2937' }}>
            {payload[0].payload.name}
          </p>
          <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>
            Count: <strong>{payload[0].value}</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="stats-container">
      <h2>
        <TrendingUp size={24} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
        Task Statistics
      </h2>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-value">{stats.totalTasks || 0}</div>
          <div className="stat-label">Total Tasks</div>
        </div>

        <div className="stat-card success">
          <div className="stat-value">{completed || 0}</div>
          <div className="stat-label">Completed</div>
        </div>

        <div className="stat-card processing">
          <div className="stat-value">{processing || 0}</div>
          <div className="stat-label">Processing</div>
        </div>

        <div className="stat-card error">
          <div className="stat-value">{failed || 0}</div>
          <div className="stat-label">Failed</div>
        </div>
      </div>

      <div className="success-rate">
        <div className="success-rate-label">Success Rate</div>
        <div className="success-rate-value">{successRate.toFixed(1)}%</div>
        <div className="success-rate-bar">
          <div 
            className="success-rate-fill" 
            style={{ width: `${successRate}%` }}
          />
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="chart-container">
          <h3>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#6b7280' }} 
                stroke="#9ca3af"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }} 
                stroke="#9ca3af"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TaskStats;
