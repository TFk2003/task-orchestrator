import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Statistics } from '../types/common.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const useStatistics = () => {
  return useQuery({
    queryKey: ['statistics'],
    queryFn: async (): Promise<Statistics> => {
      const response = await axios.get<Statistics>(`${API_BASE_URL}/statistics`);
      return response.data;
    },
    refetchInterval: 5000,
  });
};

export const useWorkerStatistics = (workerId: string) => {
  return useQuery({
    queryKey: ['statistics', 'worker', workerId],
    queryFn: async (): Promise<Statistics> => {
      const response = await axios.get<Statistics>(
        `${API_BASE_URL}/statistics/worker/${workerId}`
      );
      return response.data;
    },
    enabled: !!workerId,
    refetchInterval: 5000,
  });
};