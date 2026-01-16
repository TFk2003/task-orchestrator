package org.example.apiserver.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskStatisticsDTO {
    private Long totalTasks;
    private Long completedTasks;
    private Long failedTasks;
    private Long processingTasks;
    private Long pendingTasks;
    private Long retryingTasks;
    private Double successRate;
    private Long activeWorkers;
    private Map<String, Long> statusCounts;
}
