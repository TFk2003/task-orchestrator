import React from 'react';
import { Task } from '../../types/task.types';
import { useAppContext } from '../../context/AppContext';
import { formatNumber } from '../../utils/formatters';
import { FileText } from 'lucide-react';
import './TaskList.css';
import TaskCard from './TaskCard';
import Pagination from '../common/Pagination/Pagination';
import TaskDetails from '../TaskDetails/TaskDetails';
import Loading from '../common/Loading/Loading';

interface TaskListProps {
  tasks: Task[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, totalPages, currentPage, onPageChange, isLoading = false }) => {
  const {selectedTaskId, setSelectedTaskId} = useAppContext();

  const handleCloseDetails = () => {
    setSelectedTaskId(null);
  }

  if(isLoading) {
    return <Loading message="Loading Tasks..." />;
  }
  
  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2>
          <FileText size={24}/>
          Tasks (for {formatNumber(tasks.length)})
        </h2>
      </div>

      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
                        <svg 
              className="empty-state-icon" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <p>No tasks found. Submit a new task to get started.</p>
          </div>
        ) : (
            tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task}
                onViewDetails={(id) => setSelectedTaskId(id)}
              />
            ))
        )}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}

      {selectedTaskId && (
        <TaskDetails
          taskId={selectedTaskId}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default TaskList;