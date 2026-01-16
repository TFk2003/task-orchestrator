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
        setError({});
    };

    const handlePayloadChange = (value: string) => {
        setPayload(value);
        // Clear payload error when user types
        if (error.payload) {
            setError(prev => ({ ...prev, payload: null }));
        }
    };

    const handlePriorityChange = (value: number) => {
        setPriority(value);
        // Clear priority error when user changes value
        if (error.priority) {
            setError(prev => ({ ...prev, priority: null }));
        }
    };

    const handleMaxRetriesChange = (value: number) => {
        setMaxRetries(value);
        // Clear maxRetries error when user changes value
        if (error.maxRetries) {
            setError(prev => ({ ...prev, maxRetries: null }));
        }
    };

    const formatPayload = () => {
        try {
            const parsed = JSON.parse(payload);
            const formatted = JSON.stringify(parsed, null, 2);
            setPayload(formatted);
            setError(prev => ({ ...prev, payload: null }));
        } catch (err) {
            setError(prev => ({ 
                ...prev, 
                payload: 'Cannot format invalid JSON' 
            }));
        }
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

        resetForm();
    };

     const resetForm = () => {
        setTaskType(TASK_TYPES[0]);
        setPayload(EXAMPLE_PAYLOADS[TASK_TYPES[0]] || '{}');
        setPriority(PRIORITY_LEVELS.MEDIUM);
        setMaxRetries(3);
        setError({});
    };

    const getPriorityLabel = () => {
        const entry = Object.entries(PRIORITY_LEVELS).find(([_, v]) => v === priority);
        return entry ? entry[0] : 'CUSTOM';
    };

    return (
        <div className="task-form-card">
            <h2>Submit New Task</h2>
            <form onSubmit={handleSubmit} className="task-form">
                <div className={`form-group ${error.taskType ? 'has-error' : ''}`}>
                    <label htmlFor="taskType">Task Type</label>
                    <select
                        id="taskType"
                        value={taskType}
                        onChange={(e) => handleTaskTypeChange(e.target.value as typeof TASK_TYPES[number])}
                        className={`form-select ${error.taskType ? 'error' : ''}`}
                        disabled={isLoading}
                    >
                        {TASK_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    {error.taskType && <span className="error-text">{error.taskType}</span>}
                </div>
                <div className={`form-group ${error.payload ? 'has-error' : ''}`}>
                    <label htmlFor="payload">Payload (JSON)</label>
                    <textarea
                        id="payload"
                        value={payload}
                        onChange={(e) => handlePayloadChange(e.target.value)}
                        className={`form-textarea ${error.payload ? 'error' : ''}`}
                        rows={8}
                        placeholder='{"key": "value"}'
                        required
                        disabled={isLoading}
                    />
                    {error.payload && <span className="error-text">{error.payload}</span>}
                    <div className="payload-actions">
                        <button 
                            type="button" 
                            className="format-button"
                            onClick={formatPayload}
                            disabled={isLoading}
                        >
                            Format JSON
                        </button>
                    </div>
                </div>
                <div className="form-row">
                    <div className={`form-group ${error.priority ? 'has-error' : ''}`}>
                        <label htmlFor="priority">
                            Priority (1-10)
                            <span className="hint">Current: {getPriorityLabel()}</span>
                        </label>
                        <input
                        id="priority"
                        type="number"
                        min="1"
                        max="10"
                        value={priority}
                        onChange={(e) => handlePriorityChange(parseInt(e.target.value))}
                        className={`form-input ${error.priority ? 'error' : ''}`}
                        disabled={isLoading}
                        />
                        {error.priority && <span className="error-text">{error.priority}</span>}
                    </div>
                    <div className={`form-group ${error.maxRetries ? 'has-error' : ''}`}>
                        <label htmlFor="maxRetries">Max Retries (0-10)</label>
                        <input
                        id="maxRetries"
                        type="number"
                        min="0"
                        max="10"
                        value={maxRetries}
                        onChange={(e) => handleMaxRetriesChange(parseInt(e.target.value))}
                        className={`form-input ${error.maxRetries ? 'error' : ''}`} 
                        disabled={isLoading}
                        />
                        {error.maxRetries && <span className="error-text">{error.maxRetries}</span>}
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