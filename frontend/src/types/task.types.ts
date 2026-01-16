export interface Task {
  id: string;
  type: string;
  status: TaskStatus;
  payload: string;
  result?: string;
  retryCount: number;
  maxRetries: number;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  workerId?: string;
  errorMessage?: string;
  priority: number;
}

export enum TaskStatus {
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  RETRYING = 'RETRYING'
}

export interface TaskSubmission {
  type: string;
  payload: string;
  priority?: number;
  maxRetries?: number;
}

export interface TaskFilters {
  status?: TaskStatus;
  type?: string;
  workerId?: string;
  dateFrom?: string;
  dateTo?: string;
}