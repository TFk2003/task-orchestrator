package org.example.workernode.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApiClientService {
    private final RestTemplate restTemplate;
    private final WorkerHealthService workerHealthService;

    @Value("${api.server.url:http://localhost:8080}")
    private String apiServerUrl;

    @Value("${app.worker.id}")
    private String workerId;

    public void notifyTaskProcessing(UUID taskId) {
        try {
            Map<String, String> request = new HashMap<>();
            request.put("workerId", workerId);

            restTemplate.postForEntity(
                    apiServerUrl + "/api/tasks/" + taskId + "/processing",
                    request,
                    Void.class
            );

            log.debug("Notified API server that task {} is processing", taskId);
        } catch (Exception e) {
            log.error("Failed to notify task processing for task {}", taskId, e);
        }
    }

    public void notifyTaskCompleted(UUID taskId, String result) {
        try {
            Map<String, String> request = new HashMap<>();
            request.put("result", result);

            restTemplate.postForEntity(
                    apiServerUrl + "/api/tasks/" + taskId + "/completed",
                    request,
                    Void.class
            );

            workerHealthService.decrementActiveTasks();

            log.debug("Notified API server that task {} completed", taskId);
        } catch (Exception e) {
            log.error("Failed to notify task completion for task {}", taskId, e);
        }
    }

    public void notifyTaskFailed(UUID taskId, String errorMessage, boolean shouldRetry) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("errorMessage", errorMessage);
            request.put("shouldRetry", shouldRetry);

            restTemplate.postForEntity(
                    apiServerUrl + "/api/tasks/" + taskId + "/failed",
                    request,
                    Void.class
            );

            log.debug("Notified API server that task {} failed", taskId);
        } catch (Exception e) {
            log.error("Failed to notify task failure for task {}", taskId, e);
        }
    }
}
