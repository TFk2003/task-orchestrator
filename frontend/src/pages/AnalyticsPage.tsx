import React from 'react';
import { useStatistics } from '../hooks/useStatistics';
import { useTasks } from '../hooks/useTasks';
import { useTheme } from '../context/ThemeContext';
import { formatNumber } from '../utils/formatters';
import TaskStatusChart from '../components/Charts/TaskStatusChart';
import TaskTimelineChart from '../components/Charts/TaskTimelineChart';
import WorkerLoadChart from '../components/Charts/WorkerLoadChart';
import { STATUS_COLORS } from '../utils/constants';
import Loading from '../components/common/Loading/Loading';

const AnalyticsPage: React.FC = () => {
  const { data: stats, isLoading } = useStatistics();
  const { data: tasksData } = useTasks(0, 100);
  const { theme } = useTheme();

  if (isLoading) {
    return <Loading message="Loading analytics..." />;
  }

  // Prepare data for charts
  const statusData = stats?.statusCounts 
  ? Object.entries(stats.statusCounts).map(([name, value]) => ({
    name,
    value,
  })) : [];

  // Mock timeline data (in production, this would come from API)
  const timelineData = [
    { time: '00:00', completed: 45, failed: 5, processing: 12 },
    { time: '04:00', completed: 67, failed: 8, processing: 15 },
    { time: '08:00', completed: 123, failed: 12, processing: 23 },
    { time: '12:00', completed: 156, failed: 15, processing: 18 },
    { time: '16:00', completed: 189, failed: 18, processing: 25 },
    { time: '20:00', completed: 201, failed: 20, processing: 20 },
  ];

  return (
    <div className={`page-container analytics-page ${theme}`}>
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
        <p>Comprehensive insights into task processing performance</p>
      </div>

      <div className="analytics-grid">
        {/* Key Metrics */}
        <div className="analytics-card metrics-card">
          <h2>Key Metrics</h2>
          <div className="metrics-grid">
            <div className="metric">
              <span className="metric-label">Total Tasks</span>
              <span className="metric-value">{formatNumber(stats?.totalTasks || 0)}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Success Rate</span>
              <span className="metric-value">{stats?.successRate.toFixed(1)}%</span>
            </div>
            <div className="metric">
              <span className="metric-label">Active Workers</span>
              <span className="metric-value">{formatNumber(stats?.activeWorkers || 0)}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Processing</span>
              <span className="metric-value">{formatNumber(stats?.processingTasks || 0)}</span>
            </div>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="analytics-card">
          <h2>Status Distribution</h2>
          <TaskStatusChart data={statusData} />
        </div>

        {/* Task Timeline */}
        <div className="analytics-card full-width">
          <h2>Task Processing Timeline (Last 24 Hours)</h2>
          <TaskTimelineChart data={timelineData} />
        </div>

        {/* Performance Trends */}
      </div>
    </div>
  );
};

export default AnalyticsPage;