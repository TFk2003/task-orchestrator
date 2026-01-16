package org.example.workernode.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.workernode.dto.TaskDTO;
import org.example.workernode.processor.TaskProcessor;
import org.example.workernode.processor.TaskProcessorFactory;
import org.example.workernode.service.ApiClientService;
import org.example.workernode.service.WorkerHealthService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class TaskConsumer {
    private final TaskProcessorFactory processorFactory;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final ApiClientService apiClientService;
    private final WorkerHealthService workerHealthService;

    @Value("${app.worker.id}")
    private String workerId;

    @Value("${api.server.url:http://localhost:8080}")
    private String apiServerUrl;

    @RabbitListener(queues = "${app.rabbitmq.queue.task}")
    public void consumeTask(TaskDTO taskData) {
        UUID taskId = taskData.getId();
        String taskType = taskData.getType();
        String payload = taskData.getPayload();

        log.info("Worker {} received task {} of type {}", workerId, taskId, taskType);
        workerHealthService.incrementActiveTasks();

        try {

            // Notify API server that task is being processed
            apiClientService.notifyTaskProcessing(taskId);

            // Get appropriate processor for task type
//            TaskProcessor processor = processorFactory.getProcessor(taskType);
//
//            // Process the task
//            String result = processor.process(payload);
//
//            // Notify API server of success
//            apiClientService.notifyTaskCompleted(taskId, result);

            log.info("Worker {} is processing task {}", workerId, taskId);

        } catch (Exception e) {
            log.error("Worker {} failed to process task {}", workerId, taskId, e);

            // Notify API server of failure
            apiClientService.notifyTaskFailed(taskId, e.getMessage(), true);
        }
    }
}
