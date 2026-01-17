import axios from "axios";
import { Task, TaskSubmission } from '../types/task.types';
import { PageResponse } from '../types/common.types';
import config from "../config";

const apiClient = axios.create({
    baseURL: config.apiUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface TaskUpdateRequest{
    workerId?: string;
    result?: string;
    errorMessage?: string;
    shouldRetry?: boolean;
}

export const tasksApi = {
    submitTask: async (task: TaskSubmission): Promise<Task> => {
        const response = await apiClient.post<Task>('/tasks', task);
        return response.data;
    },
    
    getTask: async (taskId: string): Promise<Task> => {
        const response = await apiClient.get<Task>(`/tasks/${taskId}`);
        return response.data;
    },

    getAllTasks: async (
        page: number = 0,
        size: number = 20,
        sortBy: string = 'createdAt',
        direction: 'ASC' | 'DESC' = 'DESC'
    ): Promise<PageResponse<Task>> => {
        const response = await apiClient.get<PageResponse<Task>>('/tasks', {
            params: { page, size, sortBy, direction },
        });
        return response.data;
    },

    getTaskByStatus: async (
        status: string,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<Task>> => {
        const response = await apiClient.get<PageResponse<Task>>(`/tasks/status/${status}`, {
            params: { page, size },
        });
        return response.data;
    },

    deleteTask: async (taskId: string): Promise<void> => {
        await apiClient.delete(`/tasks/${taskId}`);
    },

    markTaskProcessing: async (taskId: string, workerId: string): Promise<void> => {
        await apiClient.post(`/tasks/${taskId}/processing`, { workerId });
    },

    markTaskCompleted: async (taskId: string, result: string): Promise<void> => {
        await apiClient.post(`/tasks/${taskId}/completed`, { result });
    },

    markTaskFailed: async (
        taskId: string, 
        errorMessage: string, 
        shouldRetry: boolean = true
    ): Promise<void> => {
        await apiClient.post(`/tasks/${taskId}/failed`, { 
        errorMessage, 
        shouldRetry 
        });
    },
};
export default apiClient;