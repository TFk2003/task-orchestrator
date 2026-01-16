export const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

export const validateTaskPayload = (payload: string): { 
  valid: boolean; 
  error?: string 
} => {
  if (!payload || payload.trim() === '') {
    return { valid: false, error: 'Payload cannot be empty' };
  }
  
  if (!isValidJSON(payload)) {
    return { valid: false, error: 'Payload must be valid JSON' };
  }
  
  return { valid: true };
};

export const validatePriority = (priority: number): { 
  valid: boolean; 
  error?: string 
} => {
  if (priority < 1 || priority > 10) {
    return { valid: false, error: 'Priority must be between 1 and 10' };
  }
  
  return { valid: true };
};

export const validateMaxRetries = (retries: number): { 
  valid: boolean; 
  error?: string 
} => {
  if (retries < 0 || retries > 10) {
    return { valid: false, error: 'Max retries must be between 0 and 10' };
  }
  
  return { valid: true };
};