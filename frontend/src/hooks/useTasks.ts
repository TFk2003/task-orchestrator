import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api/apiClient";
import { TaskSubmission } from "../types/task.types";

export const useTasks = (page: number = 0, size: number = 20) => {
    return useQuery({
        queryKey: ['tasks', page, size],
        queryFn: () => tasksApi.getAllTasks(page, size),
        refetchInterval: 5000,
    });
};

export const useTask = (taskId: string) => {
    return useQuery({
        queryKey: ['task', taskId],
        queryFn: () => tasksApi.getTask(taskId),
        enabled: !!taskId,
        refetchInterval: 3000,
    });
};

export const useTasksByStatus = (status: string, page: number = 0) => {
    return useQuery({
        queryKey: ['tasks', 'status', status, page],
        queryFn: () => tasksApi.getTaskByStatus(status, page),
        refetchInterval: 5000,
    });
};

export const useSubmitTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (task: TaskSubmission) => tasksApi.submitTask(task),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (taskId: string) => tasksApi.deleteTask(taskId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

export const useMarkTaskProcessing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, workerId }: { taskId: string; workerId: string }) =>
      tasksApi.markTaskProcessing(taskId, workerId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useMarkTaskCompleted = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, result }: { taskId: string; result: string }) =>
      tasksApi.markTaskCompleted(taskId, result),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useMarkTaskFailed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      taskId, 
      errorMessage, 
      shouldRetry 
    }: { 
      taskId: string; 
      errorMessage: string; 
      shouldRetry?: boolean 
    }) => tasksApi.markTaskFailed(taskId, errorMessage, shouldRetry),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};