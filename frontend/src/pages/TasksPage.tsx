import React, { use, useState } from 'react';
import { useTasks, useTasksByStatus, useDeleteTask } from '../hooks/useTasks';
import { useAppContext } from '../context/AppContext';
import { TaskFilters } from '../types/task.types';
import { TASK_STATUSES } from '../utils/constants';
import TaskList from '../components/TaskList/TaskList';
import TaskDetails from '../components/TaskDetails/TaskDetails';
import Loading from '../components/common/Loading/Loading';

const TasksPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { selectedTaskId, setSelectedTaskId } = useAppContext();
  const {data: allTasksData} = useTasks(page, 20);
  const { data: filteredTasksData} = useTasksByStatus(
    statusFilter !== 'all' ? statusFilter : '', page);
  const deleteTask = useDeleteTask();
  const tasksData = statusFilter === 'all' ? allTasksData : filteredTasksData;

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

  return (
    <div className="page-container tasks-page">
      <div className="page-header">
        <h1>All Tasks</h1>
        <div className="filter-controls">
          <label>Filter by status:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Tasks</option>
            {TASK_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <TaskList
        tasks={tasksData?.content || []}
        totalPages={tasksData?.totalPages || 0}
        currentPage={page}
        onPageChange={setPage}
      />

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