import React, { useState } from "react";
import { TaskSubmission } from "../../types/task.types";
import { TASK_TYPES, PRIORITY_LEVELS, EXAMPLE_PAYLOADS } from '../../utils/constants';
import "./TaskForm.css";
import { validateMaxRetries, validatePriority, validateTaskPayload } from "../../utils/validators";

interface TaskFormProps {
    onSubmit: (task: TaskSubmission) => void;
    isLoading: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, isLoading }) => {
    const [taskType, setTaskType] = useState<typeof TASK_TYPES[number]>(TASK_TYPES[0]);
    const [payload, setPayload] = useState(EXAMPLE_PAYLOADS[TASK_TYPES[0]] || '{}');
    const [priority, setPriority] = useState<number>(PRIORITY_LEVELS.MEDIUM);
    const [maxRetries, setMaxRetries] = useState(3);
    const [error, setError] = useState<Record<string, string | null>>({});
    
    const handleTaskTypeChange = (type: typeof TASK_TYPES[number]) => {
        setTaskType(type);
        setPayload(EXAMPLE_PAYLOADS[type] || '{}');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        const payloadValidation = validateTaskPayload(payload);
        if (!payloadValidation.valid) {
            newErrors.payload = payloadValidation.error || 'Invalid payload';
        }
        const priorityValidation = validatePriority(priority);
        if (!priorityValidation.valid) {
            newErrors.priority = priorityValidation.error || 'Invalid priority';
        }
        const maxRetriesValidation = validateMaxRetries(maxRetries);
        if (!maxRetriesValidation.valid) {
            newErrors.maxRetries = maxRetriesValidation.error || 'Invalid max retries';
        }
        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            return;
        }
        setError({});
        onSubmit({
            type: taskType,
            payload,
            priority,
            maxRetries
        });
    };

    return (
        <div className="task-form-card">
            <h2>Submit New Task</h2>
            <form onSubmit={handleSubmit} className="task-form">
                <div className="form-group">
                    <label htmlFor="taskType">Task Type</label>
                    <select
                        id="taskType"
                        value={taskType}
                        onChange={(e) => handleTaskTypeChange(e.target.value as typeof TASK_TYPES[number])}
                        className="form-select"
                    >
                        {TASK_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="payload">Payload (JSON)</label>
                    <textarea
                        id="payload"
                        value={payload}
                        onChange={(e) => setPayload(e.target.value)}
                        className={`form-textarea ${error.payload ? 'error' : ''}`}
                        rows={8}
                        placeholder='{"key": "value"}'
                        required
                    />
                    {error.payload && <span className="error-text">{error.payload}</span>}
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="priority">
                            Priority (1-10)
                            <span className="hint">Current: {Object.entries(PRIORITY_LEVELS).find(([_, v]) => v === priority)?.[0] || 'CUSTOM'}</span>
                        </label>
                        <input
                        id="priority"
                        type="number"
                        min="1"
                        max="10"
                        value={priority}
                        onChange={(e) => setPriority(parseInt(e.target.value))}
                        className="form-input"
                        />
                        {error.priority && <span className="error-text">{error.priority}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="maxRetries">Max Retries</label>
                        <input
                        id="maxRetries"
                        type="number"
                        min="0"
                        max="10"
                        value={maxRetries}
                        onChange={(e) => setMaxRetries(parseInt(e.target.value))}
                        className="form-input"
                        />
                    </div>
                </div>
                <button 
                    type="submit" 
                    className="submit-button" 
                    disabled={isLoading}
                >
                    {isLoading ? 'Submitting...' : 'Submit Task'}
                </button>
            </form>
        </div>
    );
}
export default TaskForm;