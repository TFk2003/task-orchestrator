import React from 'react';
import { useTasks } from '../../hooks/useTasks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './TaskStats.css';

const TaskStats: React.FC = () => {
  const { data: tasksData } = useTasks(0, 1000); // Get more tasks for statistics

  const calculateStats = () => {
    if (!tasksData?.content) {
      return {
        total: 0,
        completed: 0,
        failed: 0,
        processing: 0,
        pending: 0,
        retrying: 0
      };
    }

    const tasks = tasksData.content;
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'COMPLETED').length,
      failed: tasks.filter(t => t.status === 'FAILED').length,
      processing: tasks.filter(t => t.status === 'PROCESSING').length,
      pending: tasks.filter(t => t.status === 'PENDING' || t.status === 'QUEUED').length,
      retrying: tasks.filter(t => t.status === 'RETRYING').length
    };
  };

  const stats = calculateStats();

  const chartData = [
    { name: 'Completed', value: stats.completed, color: '#10b981' },
    { name: 'Processing', value: stats.processing, color: '#3b82f6' },
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    { name: 'Retrying', value: stats.retrying, color: '#8b5cf6' },
    { name: 'Failed', value: stats.failed, color: '#ef4444' }
  ];

  const successRate = stats.total > 0 
    ? ((stats.completed / stats.total) * 100).toFixed(1)
    : '0';

  return (
    <div className="stats-container">
      <h2>Task Statistics</h2>
      
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>

        <div className="stat-card success">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>

        <div className="stat-card processing">
          <div className="stat-value">{stats.processing}</div>
          <div className="stat-label">Processing</div>
        </div>

        <div className="stat-card error">
          <div className="stat-value">{stats.failed}</div>
          <div className="stat-label">Failed</div>
        </div>
      </div>

      <div className="success-rate">
        <div className="success-rate-label">Success Rate</div>
        <div className="success-rate-value">{successRate}%</div>
        <div className="success-rate-bar">
          <div 
            className="success-rate-fill" 
            style={{ width: `${successRate}%` }}
          />
        </div>
      </div>

      <div className="chart-container">
        <h3>Status Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskStats;
