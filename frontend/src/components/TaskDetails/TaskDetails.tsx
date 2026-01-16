import React, {useState} from 'react';
import { useTask, useMarkTaskCompleted, useMarkTaskFailed, useMarkTaskProcessing } from '../../hooks/useTasks';
import { Clock, CheckCircle, XCircle, RefreshCw, Play, CheckSquare, AlertTriangle } from 'lucide-react';
import { formatDateTime, formatDuration } from '../../utils/formatters';
import './TaskDetails.css';
import { TASK_STATUSES } from '../../utils/constants';
import Loading from '../common/Loading/Loading';

interface TaskDetailsProps {
  taskId: string;
  onClose: () => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ taskId, onClose }) => {
  const { data: task, isLoading } = useTask(taskId);
  const markProcessing = useMarkTaskProcessing();
  const markCompleted = useMarkTaskCompleted();
  const markFailed = useMarkTaskFailed();

  const [workerId, setWorkerId] = useState('manual-worker-1');
  const [result, setResult] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [shouldRetry, setShouldRetry] = useState(true);

  if (isLoading) {
    return (
      <Loading message='Loading task details...'/>
    );
  }

  if (!task) {
    return (
      <div className="task-details-modal">
        <div className="task-details-content">
          <div className="error">Task not found</div>
          <button onClick={onClose} className="close-button">Close</button>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (task.status) {
      case TASK_STATUSES[3]:
        return <CheckCircle className="status-icon success" />;
      case TASK_STATUSES[4]:
        return <XCircle className="status-icon error" />;
      case TASK_STATUSES[5]:
        return <RefreshCw className="status-icon warning" />;
      case TASK_STATUSES[0]:
      case TASK_STATUSES[1]:
        return <Clock className="status-icon pending" />;
      case TASK_STATUSES[2]:
        return <Clock className="status-icon processing spin" />;
      default:
        return <Clock className="status-icon pending" />;
    }
  };

  const handleMarkProcessing = async () => {
    if (!workerId) {
      alert('Please enter a worker ID');
      return;
    }
    try {
      await markProcessing.mutateAsync({ taskId, workerId });
      alert('Task marked as processing');
    } catch (error) {
      alert('Failed to mark task as processing');
    }
  };

  const handleMarkCompleted = async () => {
    if (!result) {
      alert('Please enter a result');
      return;
    }
    try {
      await markCompleted.mutateAsync({ taskId, result });
      alert('Task marked as completed');
      setResult('');
    } catch (error) {
      alert('Failed to mark task as completed');
    }
  };

  const handleMarkFailed = async () => {
    if (!errorMessage) {
      alert('Please enter an error message');
      return;
    }
    try {
      await markFailed.mutateAsync({ taskId, errorMessage, shouldRetry });
      alert(`Task marked as failed ${shouldRetry ? 'with retry' : 'without retry'}`);
      setErrorMessage('');
    } catch (error) {
      alert('Failed to mark task as failed');
    }
  };

  const canChangeStatus = ['PENDING', 'QUEUED', 'PROCESSING', 'RETRYING'].includes(task.status);

  return (
    <div className="task-details-modal" onClick={onClose}>
      <div className="task-details-content" onClick={(e) => e.stopPropagation()}>
        <div className="task-details-header">
          <div className="header-left">
            {getStatusIcon()}
            <h2>Task Details</h2>
          </div>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        <div className="task-details-body">
          <div className="detail-section">
            <h3>Basic Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Task ID:</span>
                <span className="detail-value monospace">{task.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{task.type}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className={`detail-value status-badge status-${task.status.toLowerCase()}`}>
                  {task.status}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Priority:</span>
                <span className="detail-value priority-badge">{task.priority}</span>
              </div>
            </div>
          </div>

          {/* Task Management Actions */}
          {canChangeStatus && (
            <div className="detail-section task-actions">
              <h3>Task Management Actions</h3>
              
              {/* Mark as Processing */}
              {task.status === 'PENDING' || task.status === 'QUEUED' ? (
                <div className="action-group">
                  <h4><Play size={16} /> Mark as Processing</h4>
                  <div className="action-form">
                    <input
                      type="text"
                      placeholder="Worker ID"
                      value={workerId}
                      onChange={(e) => setWorkerId(e.target.value)}
                      className="action-input"
                    />
                    <button 
                      onClick={handleMarkProcessing}
                      disabled={markProcessing.isPending}
                      className="action-btn processing"
                    >
                      {markProcessing.isPending ? 'Processing...' : 'Start Processing'}
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Mark as Completed */}
              {task.status === 'PROCESSING' ? (
                <div className="action-group">
                  <h4><CheckSquare size={16} /> Mark as Completed</h4>
                  <div className="action-form">
                    <textarea
                      placeholder='Result (JSON format: {"status": "success"})'
                      value={result}
                      onChange={(e) => setResult(e.target.value)}
                      className="action-textarea"
                      rows={3}
                    />
                    <button 
                      onClick={handleMarkCompleted}
                      disabled={markCompleted.isPending}
                      className="action-btn success"
                    >
                      {markCompleted.isPending ? 'Completing...' : 'Mark Completed'}
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Mark as Failed */}
              {task.status === 'PROCESSING' || task.status === 'RETRYING' ? (
                <div className="action-group">
                  <h4><AlertTriangle size={16} /> Mark as Failed</h4>
                  <div className="action-form">
                    <textarea
                      placeholder="Error message"
                      value={errorMessage}
                      onChange={(e) => setErrorMessage(e.target.value)}
                      className="action-textarea"
                      rows={2}
                    />
                    <div className="checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={shouldRetry}
                          onChange={(e) => setShouldRetry(e.target.checked)}
                        />
                        Allow retry
                      </label>
                    </div>
                    <button 
                      onClick={handleMarkFailed}
                      disabled={markFailed.isPending}
                      className="action-btn error"
                    >
                      {markFailed.isPending ? 'Failing...' : 'Mark Failed'}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          <div className="detail-section">
            <h3>Timing</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Created:</span>
                <span className="detail-value">{formatDateTime(task.createdAt)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Started:</span>
                <span className="detail-value">{formatDateTime(task.startedAt)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Completed:</span>
                <span className="detail-value">{formatDateTime(task.completedAt)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Duration:</span>
                <span className="detail-value">
                  {formatDuration(task.startedAt, task.completedAt)}
                </span>
              </div>
            </div>
          </div>

          {task.workerId && (
            <div className="detail-section">
              <h3>Worker Information</h3>
              <div className="detail-item">
                <span className="detail-label">Worker ID:</span>
                <span className="detail-value monospace">{task.workerId}</span>
              </div>
            </div>
          )}

          <div className="detail-section">
            <h3>Retry Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Retry Count:</span>
                <span className="detail-value">{task.retryCount}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Max Retries:</span>
                <span className="detail-value">{task.maxRetries}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Payload</h3>
            <pre className="code-block">{JSON.stringify(JSON.parse(task.payload), null, 2)}</pre>
          </div>

          {task.result && (
            <div className="detail-section">
              <h3>Result</h3>
              <pre className="code-block success">{JSON.stringify(JSON.parse(task.result), null, 2)}</pre>
            </div>
          )}

          {task.errorMessage && (
            <div className="detail-section">
              <h3>Error Message</h3>
              <div className="error-box">{task.errorMessage}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;