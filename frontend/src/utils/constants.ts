export const TASK_TYPES = [
  'IMAGE_PROCESSING',
  'WEB_SCRAPING',
  'DATA_ANALYSIS',
  'EMAIL_SENDING',
  'REPORT_GENERATION'
] as const;

export const TASK_STATUSES = [
  'PENDING',
  'QUEUED',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'RETRYING'
] as const;

export const WORKER_STATUSES = [
  'ONLINE',
  'OFFLINE',
  'BUSY',
  'IDLE'
] as const;

export const PRIORITY_LEVELS = {
  CRITICAL: 10,
  HIGH: 7,
  MEDIUM: 5,
  LOW: 3,
  MINIMAL: 1
} as const;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_RETRIES = 3;
export const DEFAULT_PRIORITY = 5;

export const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  QUEUED: '#6b7280',
  PROCESSING: '#3b82f6',
  COMPLETED: '#10b981',
  FAILED: '#ef4444',
  RETRYING: '#8b5cf6',
  ONLINE: '#10b981',
  OFFLINE: '#6b7280',
  BUSY: '#f59e0b',
  IDLE: '#3b82f6'
};

export const EXAMPLE_PAYLOADS: Record<string, string> = {
  IMAGE_PROCESSING: JSON.stringify({
    imageUrl: 'https://example.com/image.jpg',
    operation: 'resize',
    width: 800,
    height: 600
  }, null, 2),
  WEB_SCRAPING: JSON.stringify({
    url: 'https://example.com',
    selectors: ['h1', '.article', '#content']
  }, null, 2),
  DATA_ANALYSIS: JSON.stringify({
    dataset: 'sales_data.csv',
    analysisType: 'trend',
    metrics: ['revenue', 'growth']
  }, null, 2),
  EMAIL_SENDING: JSON.stringify({
    recipient: 'user@example.com',
    subject: 'Test Email',
    body: 'This is a test email'
  }, null, 2),
  REPORT_GENERATION: JSON.stringify({
    reportType: 'monthly_sales',
    format: 'PDF',
    dateRange: '2024-01'
  }, null, 2)
};

export const REFRESH_INTERVALS = {
  TASKS: 5000,
  WORKERS: 5000,
  STATISTICS: 5000,
  TASK_DETAIL: 3000
} as const;
