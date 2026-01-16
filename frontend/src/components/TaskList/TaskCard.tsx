import React from 'react';
import { Task } from '../../types/task.types';
import { CheckCircle, XCircle, Clock, RefreshCw, Loader } from 'lucide-react';
import { formatDate, formatDuration, truncateString } from '../../utils/formatters';
import './TaskCard.css';
import { TASK_STATUSES } from '../../utils/constants';

interface TaskCardProps {
  task: Task;
  onViewDetails?: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onViewDetails }) => {
  const getStatusIcon = () => {
    switch (task.status) {
      case TASK_STATUSES[3]:
        return <CheckCircle className="status-icon success" />;
      case TASK_STATUSES[4]:
        return <XCircle className="status-icon error" />;
      case TASK_STATUSES[2]:
        return <Loader className="status-icon processing spin" />;
      case TASK_STATUSES[5]:
        return <RefreshCw className="status-icon warning spin" />;
      case TASK_STATUSES[0]:
        return <Clock className="status-icon pending" />;
      case TASK_STATUSES[1]:
        return <Clock className="status-icon queued" />;  
      default:
        return <Clock className="status-icon pending" />;
    }
  };

  const getStatusClass = () => {
    return `status-badge status-${task.status.toLowerCase()}`;
  };

  return (
    <div className="task-card">
      <div className="task-card-header">
        <div className="task-id">
          {getStatusIcon()}
          <span className="task-id-text" title={task.id}>{truncateString(task.id, 12)}</span>
        </div>
        <span className={getStatusClass()}>
          {task.status}
        </span>
      </div>

      <div className="task-card-body">
        <div className="task-info-row">
          <span className="task-label">Type:</span>
          <span className="task-value">{task.type}</span>
        </div>

        <div className="task-info-row">
          <span className="task-label">Priority:</span>
          <span className="task-value priority-badge">{task.priority}</span>
        </div>

        <div className="task-info-row">
          <span className="task-label">Retries:</span>
          <span className="task-value">{task.retryCount} / {task.maxRetries}</span>
        </div>

        {task.workerId && (
          <div className="task-info-row">
            <span className="task-label">Worker:</span>
            <span className="task-value worker-id" title={task.workerId}>{truncateString(task.workerId, 20)}</span>
          </div>
        )}

        <div className="task-info-row">
          <span className="task-label">Duration:</span>
          <span className="task-value">
            {formatDuration(task.startedAt, task.completedAt)}
          </span>
        </div>

        <div className="task-info-row">
          <span className="task-label">Created:</span>
          <span className="task-value task-date">
            {formatDate(task.createdAt)}
          </span>
        </div>

        {task.errorMessage && (
          <div className="task-error">
            <span className="task-label">Error:</span>
            <span className="error-message">{truncateString(task.errorMessage, 100)}</span>
          </div>
        )}
      </div>

      {onViewDetails && (
        <div className="task-card-footer">
          <button 
            className="view-details-btn"
            onClick={() => onViewDetails(task.id)}
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;