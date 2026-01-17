import React, { useState } from 'react';
import { useTasks, useTasksByStatus, useDeleteTask } from '../hooks/useTasks';
import { useAppContext } from '../context/AppContext';
import { TASK_STATUSES } from '../utils/constants';
import { formatNumber } from '../utils/formatters';
import TaskList from '../components/TaskList/TaskList';
import TaskDetails from '../components/TaskDetails/TaskDetails';
import Loading from '../components/common/Loading/Loading';
import './TasksPage.css';
import { FileText, Filter } from 'lucide-react';

const TasksPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { selectedTaskId, setSelectedTaskId } = useAppContext();

  const {data: allTasksData, isLoading: allLoading} = useTasks(page, 20);
  const { data: filteredTasksData, isLoading: filteredLoading} = useTasksByStatus(
    statusFilter !== 'all' ? statusFilter : '', page);

  const deleteTask = useDeleteTask();

  const tasksData = statusFilter === 'all' ? allTasksData : filteredTasksData;
  const isLoading = statusFilter === 'all' ? allLoading : filteredLoading;

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask.mutateAsync(taskId);
        alert('Task deleted successfully!');
      }
      catch (err) {
        alert('Failed to delete task.');
        console.error(err);
      }
    }
  };

    const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(0); // Reset to first page when filter changes
  };

  if (isLoading && !tasksData) {
    return <Loading message="Loading tasks..." />;
  }

  const totalTasks = tasksData?.totalElements || 0;

  return (
    <div className="page-container tasks-page">
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1>
              <FileText size={32} />
              All Tasks
            </h1>
            <p>Manage and monitor all your tasks in one place</p>
          </div>
          <div className="task-count">
            Total: {formatNumber(totalTasks)}
          </div>
        </div>
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="status-filter">
              <Filter size={16} />
              Filter by status:
            </label>
            <select 
              id="status-filter"
              value={statusFilter} 
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Tasks</option>
              {TASK_STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="tasks-content">
        <TaskList
          tasks={tasksData?.content || []}
          totalPages={tasksData?.totalPages || 0}
          currentPage={page}
          onPageChange={setPage}
          isLoading={isLoading}
        />
      </div>

      {selectedTaskId && (
        <TaskDetails
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  );
};

export default TasksPage;