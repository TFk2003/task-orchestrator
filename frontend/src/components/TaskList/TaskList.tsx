import React, { useState } from 'react';
import { Task } from '../../types/task.types';
import { useAppContext } from '../../context/AppContext';
import { truncateString, formatNumber } from '../../utils/formatters';
import './TaskList.css';
import TaskCard from './TaskCard';
import Pagination from '../common/Pagination/Pagination';
import TaskDetails from '../TaskDetails/TaskDetails';

interface TaskListProps {
  tasks: Task[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, totalPages, currentPage, onPageChange }) => {
  const {selectedTaskId, setSelectedTaskId} = useAppContext();
  
  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2>Tasks (for {formatNumber(tasks.length)})</h2>
      </div>

      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
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
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  );
};

export default TaskList;