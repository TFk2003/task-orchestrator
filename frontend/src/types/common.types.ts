export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
  details?: string;
}

export interface Statistics {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  processingTasks: number;
  pendingTasks: number;
  retryingTasks: number;
  successRate: number;
  activeWorkers: number;
  statusCounts: Record<string, number>;
}

export type View = 'dashboard' | 'tasks' | 'workers' | 'analytics' | 'settings';