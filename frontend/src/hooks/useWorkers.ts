import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Worker } from '../types/worker.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const useWorkers = () => {
  return useQuery({
    queryKey: ['workers'],
    queryFn: async (): Promise<Worker[]> => {
      const response = await axios.get<Worker[]>(`${API_BASE_URL}/workers`);
      return response.data;
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });
};

export const useWorker = (workerId: string) => {
  return useQuery({
    queryKey: ['worker', workerId],
    queryFn: async (): Promise<Worker> => {
      const response = await axios.get<Worker>(`${API_BASE_URL}/workers/${workerId}`);
      return response.data;
    },
    enabled: !!workerId,
    refetchInterval: 3000,
  });
};