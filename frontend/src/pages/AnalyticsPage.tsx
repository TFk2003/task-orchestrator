import React from 'react';
import { useStatistics } from '../hooks/useStatistics';
import { useTasks } from '../hooks/useTasks';
import { useWorkers } from '../hooks/useWorkers';
import { useTheme } from '../context/ThemeContext';
import { formatNumber, formatDateTime } from '../utils/formatters';
import TaskStatusChart from '../components/Charts/TaskStatusChart';
import TaskTimelineChart from '../components/Charts/TaskTimelineChart';
import WorkerLoadChart from '../components/Charts/WorkerLoadChart';
import Loading from '../components/common/Loading/Loading';
import { Activity, TrendingUp, Users, CheckCircle } from 'lucide-react';
import './AnalyticsPage.css';

const AnalyticsPage: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useStatistics();
  const { data: tasksData, isLoading: tasksLoading } = useTasks(0, 100);
  const { data: workers, isLoading: workersLoading } = useWorkers();
  const { theme } = useTheme();

  const isLoading = statsLoading || tasksLoading || workersLoading;

  if (isLoading) {
    return <Loading message="Loading analytics..." />;
  }

  // Prepare data for charts
  const statusData = stats?.statusCounts 
  ? Object.entries(stats.statusCounts).map(([name, value]) => ({
    name,
    value,
  })) : [];

  // Prepare timeline data from actual tasks
  const prepareTimelineData = () => {
    if (!tasksData?.content) return [];

    // Group tasks by hour for last 24 hours
    const now = new Date();
    const hoursData: { [key: string]: { completed: number; failed: number; processing: number } } = {};

    // Initialize last 24 hours
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      const timeKey = `${hour.getHours().toString().padStart(2, '0')}:00`;
      hoursData[timeKey] = { completed: 0, failed: 0, processing: 0 };
    }

    // Count tasks by status and hour
    tasksData.content.forEach(task => {
      const taskDate = new Date(task.createdAt);
      const hoursDiff = Math.floor((now.getTime() - taskDate.getTime()) / (1000 * 60 * 60));
      
      if (hoursDiff < 24) {
        const timeKey = `${taskDate.getHours().toString().padStart(2, '0')}:00`;
        if (hoursData[timeKey]) {
          if (task.status === 'COMPLETED') hoursData[timeKey].completed++;
          else if (task.status === 'FAILED') hoursData[timeKey].failed++;
          else if (task.status === 'PROCESSING') hoursData[timeKey].processing++;
        }
      }
    });

    return Object.entries(hoursData).map(([time, counts]) => ({
      time,
      ...counts,
    }));
  };

  const timelineData = prepareTimelineData();

  // Prepare worker load data
  const workerLoadData = workers?.map(worker => ({
    workerId: worker.workerId.substring(0, 12),
    activeTasks: worker.activeTasks || 0,
    totalProcessed: worker.totalProcessed || 0,
    cpuUsage: worker.cpuUsage || 0,
  })) || [];

  const activeWorkers = workers?.filter(w => w.status === 'IDLE').length || 0;
  const processingTasks = stats?.statusCounts?.PROCESSING || 0;

  return (
    <div className={`page-container analytics-page ${theme}`}>
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1>
              <Activity size={32} />
              Analytics Dashboard
            </h1>
            <p>Comprehensive insights into task processing performance</p>
          </div>
          <div className="last-updated">
            Last updated: {formatDateTime(new Date().toISOString())}
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Key Metrics */}
        <div className="analytics-card metrics-card">
          <h2>
            <TrendingUp size={20} />
            Key Metrics
          </h2>
          <div className="metrics-grid">
            <div className="metric total">
              <div className="metric-icon">
                <CheckCircle size={24} />
              </div>
              <div className="metric-content">
                <span className="metric-label">Total Tasks</span>
                <span className="metric-value">{formatNumber(stats?.totalTasks || 0)}</span>
              </div>
            </div>
            <div className="metric success">
              <div className="metric-icon">
                <CheckCircle size={24} />
              </div>
              <div className="metric-content">
                <span className="metric-label">Success Rate</span>
                <span className="metric-value">{stats?.successRate.toFixed(1)}%</span>
              </div>
            </div>
                        <div className="metric workers">
              <div className="metric-icon">
                <Users size={24} />
              </div>
              <div className="metric-content">
                <span className="metric-label">Active Workers</span>
                <span className="metric-value">{formatNumber(activeWorkers)}</span>
              </div>
            </div>
            <div className="metric processing">
              <div className="metric-icon">
                <Activity size={24} />
              </div>
              <div className="metric-content">
                <span className="metric-label">Processing</span>
                <span className="metric-value">{formatNumber(processingTasks)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        {statusData.length > 0 && (
          <div className="analytics-card chart-card">
            <h2>Status Distribution</h2>
            <div className="chart-wrapper">
              <TaskStatusChart data={statusData} />
            </div>
          </div>
        )}

        {/* Task Timeline */}
        {timelineData.length > 0 && (
          <div className="analytics-card full-width chart-card">
            <h2>Task Processing Timeline (Last 24 Hours)</h2>
            <div className="chart-wrapper timeline-chart">
              <TaskTimelineChart data={timelineData} />
            </div>
          </div>
        )}

        {/* Worker Load Distribution */}
        {workerLoadData.length > 0 && (
          <div className="analytics-card full-width chart-card">
            <h2>Worker Load Distribution</h2>
            <div className="chart-wrapper">
              <WorkerLoadChart data={workerLoadData} />
            </div>
          </div>
        )}

        {/* Performance Summary */}
        <div className="analytics-card performance-card">
          <h2>Performance Summary</h2>
          <div className="performance-stats">
            <div className="performance-item">
              <span className="performance-label">Completed Tasks</span>
              <span className="performance-value success">
                {formatNumber(stats?.statusCounts?.COMPLETED || 0)}
              </span>
            </div>
            <div className="performance-item">
              <span className="performance-label">Failed Tasks</span>
              <span className="performance-value error">
                {formatNumber(stats?.statusCounts?.FAILED || 0)}
              </span>
            </div>
            <div className="performance-item">
              <span className="performance-label">Queued Tasks</span>
              <span className="performance-value queued">
                {formatNumber((stats?.statusCounts?.QUEUED || 0) + (stats?.statusCounts?.PENDING || 0))}
              </span>
            </div>
            <div className="performance-item">
              <span className="performance-label">Retrying Tasks</span>
              <span className="performance-value retrying">
                {formatNumber(stats?.statusCounts?.RETRYING || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Worker Health */}
        {workers && workers.length > 0 && (
          <div className="analytics-card workers-health-card">
            <h2>
              <Users size={20} />
              Worker Health
            </h2>
            <div className="workers-health-list">
              {workers.slice(0, 5).map(worker => (
                <div key={worker.workerId} className="worker-health-item">
                  <div className="worker-info">
                    <span className="worker-id">{worker.workerId.substring(0, 16)}...</span>
                    <span className={`worker-status status-${worker.status.toLowerCase()}`}>
                      {worker.status}
                    </span>
                  </div>
                  <div className="worker-metrics">
                    <span>Tasks: {worker.activeTasks || 0}</span>
                    <span>CPU: {(worker.cpuUsage || 0).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;