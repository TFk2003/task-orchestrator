import React, { useState } from 'react';
import { useTasks, useSubmitTask, useDeleteTask } from '../../hooks/useTasks';
import { useStatistics } from '../../hooks/useStatistics';
import { useTheme } from '../../context/ThemeContext';
import { useAppContext } from '../../context/AppContext';
import { TaskSubmission } from '../../types/task.types';
import { formatNumber, formatDateTime } from '../../utils/formatters';
import TaskList from '../TaskList/TaskList';
import TaskForm from '../TaskForm/TaskForm';
import TaskStats from '../TaskStats/TaskStats';
import TaskStatusChart from '../Charts/TaskStatusChart';
import './Dashboard.css';
import Loading from '../common/Loading/Loading';
import { Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [page, setPage] = useState(0);
    const { theme } = useTheme();
    const { selectedTaskId, setSelectedTaskId } = useAppContext();
    const { data: tasksData, isLoading, error } = useTasks(page, 20);
    const { data: stats } = useStatistics();
    const submitTask = useSubmitTask();
    const deleteTask = useDeleteTask();

    const handleSubmitTask = async (task: TaskSubmission) => {
        try {
            await submitTask.mutateAsync(task);
            alert('Task submitted successfully!');
        } catch (err) {
            alert('Failed to submit task.');
            console.error(err);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask.mutateAsync(taskId);
                alert('Task deleted successfully!');
            } catch (err) {
                alert('Failed to delete task.');
                console.error(err);
            }
        }
    };

    if (isLoading) {
        return <Loading message="Loading dashboard..." />;
    }

    if (error) {
        return (
            <div className="dashboard-error">
                <h2>Error loading dashboard</h2>
                <p>{error.message}</p>
            </div>
        );
    }

    const chartData = stats?.statusCounts
    ? Object.entries(stats.statusCounts).map(([name, value]) => ({
        name,
        value,
    }))
    : [];

    return (
        <div className={`dashboard ${theme}`}>
            <header className='dashboard-header'>
                <div className="header-content">
                    <div className="header-text">
                        <h1>
                            <Activity size={32} />
                            Task Orchestrator Dashboard
                        </h1>
                        <p>Distributed Task Management System</p>
                    </div>
                    <div className="last-updated">
                        Last updated: {formatDateTime(new Date().toISOString())}
                    </div>
                </div>
                <div className="dashboard-stats-summary">
                    <div className="summary-item">
                        <span className="summary-label">Total Tasks</span>
                        <span className="summary-value">{formatNumber(stats?.totalTasks || 0)}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Success Rate</span>
                        <span className="summary-value success">{stats?.successRate.toFixed(1)}%</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Active Workers</span>
                        <span className="summary-value">{formatNumber(stats?.activeWorkers || 0)}</span>
                    </div>
                </div>
            </header>

            <div className="dashboard-content">
                <div className="dashboard-left">
                    <TaskStats/>
                    {chartData.length > 0 && (
                        <div className="chart-section">
                            <h3>Status Distribution</h3>
                            <div className="chart-wrapper">
                                <TaskStatusChart data={chartData} />
                            </div>
                        </div>
                    )}

                    <TaskForm 
                        onSubmit={handleSubmitTask} 
                        isLoading={submitTask.isPending} 
                    />
                </div>

                <div className="dashboard-right">
                    <TaskList
                        tasks={tasksData?.content || []}
                        totalPages={tasksData?.totalPages || 0}
                        currentPage={page}
                        onPageChange={setPage}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
