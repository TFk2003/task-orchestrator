package org.example.apiserver.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerHealthDTO {
    private String workerId;
    private String status;
    private LocalDateTime lastHeartbeat;
    private Integer activeTasks;
    private Long totalProcessed;
    private Long totalFailed;
    private Double cpuUsage;
    private Double memoryUsage;
    private LocalDateTime registeredAt;
}
