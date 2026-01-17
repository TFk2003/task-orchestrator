import React, { useState } from 'react';
import { useWorkers, useWorker } from '../hooks/useWorkers';
import { useWorkerStatistics } from '../hooks/useStatistics';
import { useTheme } from '../context/ThemeContext';
import { REFRESH_INTERVALS } from '../utils/constants';
import { formatNumber, formatBytes, formatDateTime } from '../utils/formatters';
import WorkerMonitor from '../components/WorkerMonitor/WorkerMonitor';
import WorkerLoadChart from '../components/Charts/WorkerLoadChart';
import Loading from '../components/common/Loading/Loading';
import { Activity, Cpu, Server, XCircle, CheckCircle } from 'lucide-react';
import './WorkersPage.css';

const WorkersPage: React.FC = () => {
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const { theme } = useTheme();
  const { data: workers, isLoading} = useWorkers();
  const { data: selectedWorker } = useWorker(selectedWorkerId || '');
  const { data: workerStats } = useWorkerStatistics(selectedWorkerId || '');

  if (isLoading) {
    return <Loading message="Loading workers..." />;
  }

  const workerChartData = workers?.map(w => ({
    workerId: w.workerId.substring(0, 12),
    activeTasks: w.activeTasks || 0,
    totalProcessed: w.totalProcessed || 0,
    cpuUsage: w.cpuUsage || 0,
  })) || [];

  const activeWorkerCount = workers?.filter(w => w.status === 'IDLE').length || 0;
  const totalActiveTasks = workers?.reduce((sum, w) => sum + (w.activeTasks || 0), 0) || 0;

  return (
    <div className={`page-container workers-page ${theme}`}>
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1>
              <Server size={32} />
              Worker Monitor
            </h1>
            <p>Monitor worker health and performance in real-time</p>
          </div>
                  <div className="worker-summary">
            <div className="summary-item">
              <Activity size={16} />
              <span>Active: {formatNumber(activeWorkerCount)}</span>
            </div>
            <div className="summary-item">
              <Cpu size={16} />
              <span>Tasks: {formatNumber(totalActiveTasks)}</span>
            </div>
            <div className="summary-item">
              <span>Refresh: {REFRESH_INTERVALS.WORKERS / 1000}s</span>
            </div>
          </div>
        </div>
      </div>

      {workerChartData.length > 0 && (
        <div className='chart-section'>
          <div className="chart-card">
            <h3>
              <Activity size={20} />
              Worker Load Distribution
            </h3>
            <div className="chart-wrapper">
              <WorkerLoadChart data={workerChartData} />
            </div>
          </div>
        </div>
      )}
      <WorkerMonitor/>


      {selectedWorker && (
        <div className="worker-details-panel">
          <div className="panel-header">
            <h3>
              <Server size={20} />
              Worker Details
            </h3>
            <button 
              className="close-btn"
              onClick={() => setSelectedWorkerId(null)}
            >
              ×
            </button>
          </div>
          <div className="panel-content">
            <div className="detail-section">
              <h4>Basic Information</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Worker ID:</span>
                  <span className="detail-value monospace">{selectedWorker.workerId}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span className={`status-badge status-${selectedWorker.status.toLowerCase()}`}>
                    {selectedWorker.status}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Heartbeat:</span>
                  <span className="detail-value">{formatDateTime(selectedWorker.lastHeartbeat)}</span>
                </div>
              </div>
            </div>
            <div className="detail-section">
              <h4>
                <Activity size={16} />
                Performance Metrics
              </h4>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon">
                    <CheckCircle size={24} />
                  </div>
                  <div className="metric-content">
                    <span className="metric-label">Total Processed</span>
                    <span className="metric-value">{formatNumber(selectedWorker.totalProcessed)}</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon error">
                    <XCircle size={24} />
                  </div>
                  <div className="metric-content">
                    <span className="metric-label">Total Failed</span>
                    <span className="metric-value">{formatNumber(selectedWorker.totalFailed)}</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">
                    <Activity size={24} />
                  </div>
                  <div className="metric-content">
                    <span className="metric-label">Active Tasks</span>
                    <span className="metric-value">{formatNumber(selectedWorker.activeTasks)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="detail-section">
              <h4>
                <Cpu size={16} />
                System Resources
              </h4>
              <div className="resource-items">
                <div className="resource-item">
                  <div className="resource-header">
                    <span className="resource-label">CPU Usage</span>
                    <span className="resource-value">{(selectedWorker.cpuUsage || 0).toFixed(1)}%</span>
                  </div>
                  <div className="resource-bar">
                    <div 
                      className="resource-fill cpu" 
                      style={{ width: `${selectedWorker.cpuUsage || 0}%` }}
                    />
                  </div>
                </div>
                <div className="resource-item">
                  <div className="resource-header">
                    <span className="resource-label">Memory Usage</span>
                    <span className="resource-value">
                      {formatBytes((selectedWorker.memoryUsage || 0) * 1024 * 1024)}
                    </span>
                  </div>
                  <div className="resource-bar">
                    <div 
                      className="resource-fill memory" 
                      style={{ width: `${Math.min((selectedWorker.memoryUsage || 0) / 10, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkersPage;