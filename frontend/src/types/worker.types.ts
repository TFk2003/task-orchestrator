export interface Worker {
  workerId: string;
  status: WorkerStatus;
  lastHeartbeat: string;
  activeTasks: number;
  totalProcessed: number;
  totalFailed: number;
  cpuUsage: number;
  memoryUsage: number;
  registeredAt: string;
}

export enum WorkerStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  BUSY = 'BUSY',
  IDLE = 'IDLE'
}