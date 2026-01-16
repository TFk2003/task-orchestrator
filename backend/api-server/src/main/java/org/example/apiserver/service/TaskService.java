package org.example.apiserver.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.apiserver.dto.TaskDTO;
import org.example.apiserver.dto.TaskSubmissionRequest;
import org.example.apiserver.model.Task;
import org.example.apiserver.model.WorkerHealth;
import org.example.apiserver.repository.TaskRepository;
import org.example.apiserver.repository.WorkerHealthRepository;
import org.example.apiserver.util.JsonUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {
    private final TaskRepository taskRepository;
    private final RabbitTemplate rabbitTemplate;
    private final WorkerHealthRepository workerHealthRepository;

    @Value("${app.rabbitmq.exchange}")

    private String exchange;
    @Value("${app.rabbitmq.routing-key}")
    private String routingKey;

    @Transactional
    public TaskDTO submitTask(TaskSubmissionRequest request) {
        // Create task entity

        if(JsonUtil.isValidJson(request.getPayload())){
            throw new RuntimeException("Invalid JSON payload");
        }
        Task task = Task.builder()
                .type(request.getType())
                .status(Task.TaskStatus.PENDING)
                .payload(request.getPayload())
                .priority(request.getPriority() != null ? request.getPriority() : 5)
                .maxRetries(request.getMaxRetries() != null ? request.getMaxRetries() : 3)
                .build();

        // Save to database
        task = taskRepository.save(task);
        log.info("Task created with ID: {}", task.getId());

        // Send to RabbitMQ
        try {
            task.setStatus(Task.TaskStatus.QUEUED);
            taskRepository.save(task);

            rabbitTemplate.convertAndSend(exchange, routingKey,
                    convertToDTO(task));
            log.info("Task {} sent to queue", task.getId());
        } catch (Exception e) {
            log.error("Failed to queue task {}", task.getId(), e);
            task.setStatus(Task.TaskStatus.FAILED);
            task.setErrorMessage("Failed to queue: " + e.getMessage());
            taskRepository.save(task);
        }

        return convertToDTO(task);
    }

    @Transactional
    public void deleteTask(UUID taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new RuntimeException("Task not found");
        }
        taskRepository.deleteById(taskId);
        log.info("Task {} deleted", taskId);
    }

    @Transactional
    public void markTaskProcessing(UUID taskId, String workerId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setStatus(Task.TaskStatus.PROCESSING);
        task.setWorkerId(workerId);
        task.setStartedAt(LocalDateTime.now());
        taskRepository.save(task);

        log.info("Task {} marked as processing by worker {}", taskId, workerId);
    }

    @Transactional
    public void markTaskCompleted(UUID taskId, String result) {
        if(JsonUtil.isValidJson(result)){
            throw new RuntimeException("Invalid JSON payload");
        }

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setStatus(Task.TaskStatus.COMPLETED);
        task.setResult(result);
        task.setCompletedAt(LocalDateTime.now());
        taskRepository.save(task);


        log.info("Task {} completed successfully", taskId);

        WorkerHealth workerHealth =  workerHealthRepository.findByWorkerId(task.getWorkerId())
                .orElseThrow(() -> new RuntimeException("Task not found"));;
        workerHealth.setTotalProcessed(workerHealth.getTotalProcessed() + 1);
        workerHealth.setActiveTasks(workerHealth.getActiveTasks() - 1);
        workerHealthRepository.save(workerHealth);
    }

    @Transactional
    public void markTaskFailed(UUID taskId, String errorMessage, boolean shouldRetry) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setRetryCount(task.getRetryCount() + 1);
        task.setErrorMessage(errorMessage);

        if (shouldRetry && task.getRetryCount() < task.getMaxRetries()) {
            // Calculate exponential backoff delay
            long delayMs = calculateBackoffDelay(task.getRetryCount());

            task.setStatus(Task.TaskStatus.RETRYING);
            taskRepository.save(task);

            log.info("Task {} will retry in {}ms (attempt {}/{})",
                    taskId, delayMs, task.getRetryCount(), task.getMaxRetries());

            // Schedule retry (using RabbitMQ delayed message plugin or Spring scheduler)
            scheduleRetry(task, delayMs);
        } else {
            task.setStatus(Task.TaskStatus.FAILED);
            task.setCompletedAt(LocalDateTime.now());
            taskRepository.save(task);

            log.error("Task {} permanently failed after {} attempts",
                    taskId, task.getRetryCount());

            WorkerHealth workerHealth =  workerHealthRepository.findByWorkerId(task.getWorkerId())
                    .orElseThrow(() -> new RuntimeException("Task not found"));
            workerHealth.setTotalFailed(workerHealth.getTotalFailed() + 1);
            workerHealthRepository.save(workerHealth);
        }
    }

    private long calculateBackoffDelay(int retryCount) {
        // Exponential backoff: 1s, 2s, 4s, 8s, etc.
        return (long) (1000 * Math.pow(2, retryCount - 1));
    }

    private void scheduleRetry(Task task, long delayMs) {
        // Using x-delay header for RabbitMQ delayed messages
        rabbitTemplate.convertAndSend(exchange, routingKey,
                convertToDTO(task), message -> {
                    message.getMessageProperties().setHeader("x-delay", delayMs);
                    return message;
                });
    }

    public TaskDTO getTask(UUID taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return convertToDTO(task);
    }

    public Page<TaskDTO> getAllTasks(Pageable pageable) {
        return taskRepository.findAll(pageable).map(this::convertToDTO);
    }

    public Page<TaskDTO> getTasksByStatus(Task.TaskStatus status, Pageable pageable) {
        return taskRepository.findByStatus(status, pageable).map(this::convertToDTO);
    }

    public List<TaskDTO> getTaskByStatusAndCreatedAtBefore( Task.TaskStatus status, LocalDateTime dateTime){
        List<Task> tasks = taskRepository.findByStatusAndCreatedAtBefore(status, dateTime);
        return tasks.stream().map(this::convertToDTO).toList();
    }

    private TaskDTO convertToDTO(Task task) {
        return TaskDTO.builder()
                .id(task.getId())
                .type(task.getType())
                .status(task.getStatus().name())
                .payload(task.getPayload())
                .result(task.getResult())
                .retryCount(task.getRetryCount())
                .maxRetries(task.getMaxRetries())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .startedAt(task.getStartedAt())
                .completedAt(task.getCompletedAt())
                .workerId(task.getWorkerId())
                .errorMessage(task.getErrorMessage())
                .priority(task.getPriority())
                .build();
    }
}
