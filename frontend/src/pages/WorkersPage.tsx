import React, { act, useState } from 'react';
import { useWorkers, useWorker } from '../hooks/useWorkers';
import { useWorkerStatistics } from '../hooks/useStatistics';
import { useTheme } from '../context/ThemeContext';
import { WORKER_STATUSES, REFRESH_INTERVALS } from '../utils/constants';
import { formatNumber, formatBytes } from '../utils/formatters';
import WorkerMonitor from '../components/WorkerMonitor/WorkerMonitor';
import WorkerLoadChart from '../components/Charts/WorkerLoadChart';
import Loading from '../components/common/Loading/Loading';
import { cpuUsage } from 'process';

const WorkersPage: React.FC = () => {
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const { theme } = useTheme();
  const { data: workers, isLoading} = useWorkers();
  const { data: selectedWorker} = useWorker(selectedWorkerId || '');
  const { data: workerStats } = useWorkerStatistics(selectedWorkerId || '');

  if (isLoading) {
    return <Loading message="Loading workers..." />;
  }

  const workerChartData = workers?.map(w => ({
    workerId: w.workerId.substring(0, 12),
    activeTasks: w.activeTasks,
    totalProcessed: w.totalProcessed,
    cpuUsage: w.cpuUsage,
  })) || [];

  return (
    <div className={`page-container workers-page ${theme}`}>
      <div className="page-header">
        <h1>Worker Monitor</h1>
        <p>Monitor worker health and performance in real-time</p>
        <div className="worker-summary">
          <span>Active Workers: {formatNumber(workers?.length || 0)}</span>
          <span>Refresh: Every {REFRESH_INTERVALS.WORKERS / 1000} seconds</span>
        </div>
      </div>

      {workerChartData.length > 0 && (
        <div className='chart-section'>
          <h3>Worker Load Distribution</h3>
          <WorkerLoadChart data={workerChartData} />
        </div>
      )}

      <WorkerMonitor />

      {selectedWorker && (
        <div className="worker-details-panel">
          <h3>Worker Details - {selectedWorker.workerId}</h3>
          <p>Total Processed: {formatNumber(selectedWorker.totalProcessed)}</p>
          <p>Total Failed: {formatNumber(selectedWorker.totalFailed)}</p>
          <p>Memory Usage: {formatBytes(selectedWorker.memoryUsage * 1024 * 1024)}</p>
        </div>
      )}
    </div>
  );
};

export default WorkersPage;