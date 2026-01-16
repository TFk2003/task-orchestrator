package org.example.apiserver.service;

import lombok.RequiredArgsConstructor;
import org.example.apiserver.dto.TaskStatisticsDTO;
import org.example.apiserver.model.Task;
import org.example.apiserver.repository.TaskRepository;
import org.example.apiserver.model.WorkerHealth;
import org.example.apiserver.repository.WorkerHealthRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class StatisticsService {
    private final TaskRepository taskRepository;
    private final WorkerHealthRepository workerHealthRepository;

    public TaskStatisticsDTO getTaskStatistics() {
        List<Object[]> taskStatistics = taskRepository.getTaskStatistics();

        Map<String, Long> statusCounts = new HashMap<>();
        long totalTasks = 0;
        long completedTasks = 0;
        long failedTasks = 0;
        long processingTasks = 0;
        long pendingTasks = 0;
        long retryingTasks = 0;

        for (Object[] row : taskStatistics) {
            totalTasks += (long) row[1];
            String status = (String) row[0];
            Long count = (Long) row[1];
            statusCounts.put(status, count);
            switch (status) {
                case "COMPLETED" -> completedTasks++;
                case "FAILED" -> failedTasks++;
                case "PROCESSING" -> processingTasks++;
                case "PENDING", "QUEUED" -> pendingTasks++;
                case "RETRYING" -> retryingTasks++;
            }

        }

        double successRate = totalTasks > 0
                ? (double) completedTasks / totalTasks * 100
                : 0.0;

        Long activeWorkers = (long) workerHealthRepository.findByStatus(
                WorkerHealth.WorkerStatus.ONLINE).size();

        return TaskStatisticsDTO.builder()
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .failedTasks(failedTasks)
                .processingTasks(processingTasks)
                .pendingTasks(pendingTasks)
                .retryingTasks(retryingTasks)
                .successRate(successRate)
                .activeWorkers(activeWorkers)
                .statusCounts(statusCounts)
                .build();
    }

    public TaskStatisticsDTO getWorkerStatistics(String workerId) {
        List<Task> workerTasks = taskRepository.findByWorkerIdAndStatus(
                workerId, Task.TaskStatus.COMPLETED);

        long totalProcessed = workerTasks.size();
        long failedByWorker = taskRepository.findByWorkerIdAndStatus(
                workerId, Task.TaskStatus.FAILED).size();

        return TaskStatisticsDTO.builder()
                .totalTasks(totalProcessed)
                .completedTasks(totalProcessed)
                .failedTasks(failedByWorker)
                .build();
    }
}
