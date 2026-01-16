import React from 'react';
import { useWorkers } from '../../hooks/useWorkers';
import './WorkerMonitor.css';
import WorkerCard from './WorkerCard';
import Loading from '../common/Loading/Loading';

const WorkerMonitor: React.FC = () => {
  const { data: workers, isLoading, error } = useWorkers();

  if (isLoading) {
    return <Loading message="Loading workers..." />;
  }

  if (error) {
    return <div className="worker-monitor-error">Failed to load workers</div>;
  }

  return (
    <div className="worker-monitor">
      <h2>Worker Health Monitor</h2>
      
      <div className="workers-grid">
        {workers && workers.length > 0 ? (
          workers.map(worker => (
            <WorkerCard key={worker.workerId} worker={worker} />
          ))
        ) : (
          <div className="no-workers">
            <p>No workers available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerMonitor;