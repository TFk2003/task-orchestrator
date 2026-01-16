import React from 'react';
import { Worker } from '../../types/worker.types';
import { Activity, Cpu, HardDrive } from 'lucide-react';
import { formatDate, formatPercentage } from '../../utils/formatters';
import './WorkerCard.css';

interface WorkerCardProps {
  worker: Worker;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ worker }) => {
  return (
    <div className={`worker-card status-${worker.status.toLowerCase()}`}>
      <div className="worker-header">
        <div className="worker-id">
          <Activity className="worker-icon" />
          <span>{worker.workerId.substring(0, 20)}...</span>
        </div>
        <span className={`worker-status status-${worker.status.toLowerCase()}`}>
          {worker.status}
        </span>
      </div>

      <div className="worker-stats">
        <div className="stat-item">
          <span className="stat-label">Active Tasks</span>
          <span className="stat-value">{worker.activeTasks}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Processed</span>
          <span className="stat-value">{worker.totalProcessed}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Failed</span>
          <span className="stat-value">{worker.totalFailed}</span>
        </div>
      </div>

      <div className="worker-metrics">
        <div className="metric-item">
          <div className="metric-header">
            <Cpu className="metric-icon" />
            <span>CPU Usage</span>
          </div>
          <div className="metric-bar">
            <div 
              className="metric-fill cpu"
              style={{ width: `${Math.min(Math.max(worker.cpuUsage, 0), 100)}%` }}
            />
          </div>
          <span className="metric-value">{formatPercentage(worker.cpuUsage)}</span>
        </div>

        <div className="metric-item">
          <div className="metric-header">
            <HardDrive className="metric-icon" />
            <span>Memory Usage</span>
          </div>
          <div className="metric-bar">
            <div 
              className="metric-fill memory"
              style={{ width: `${Math.min(worker.memoryUsage, 100)}%` }}
            />
          </div>
          <span className="metric-value">{formatPercentage(worker.memoryUsage)}</span>
        </div>
      </div>

      <div className="worker-footer">
        <span className="last-heartbeat">
          Last heartbeat: {formatDate(worker.lastHeartbeat)}
        </span>
      </div>
    </div>
  );
};

export default WorkerCard;
