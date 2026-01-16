package org.example.apiserver.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "worker_health")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerHealth {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "worker_id", unique = true, nullable = false)
    private String workerId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private WorkerStatus status;

    @Column(name = "last_heartbeat")
    private LocalDateTime lastHeartbeat;

    @Column(name = "active_tasks")
    @Builder.Default
    private Integer activeTasks = 0;

    @Column(name = "total_processed")
    @Builder.Default
    private Long totalProcessed = 0L;

    @Column(name = "total_failed")
    @Builder.Default
    private Long totalFailed = 0L;

    @Column(name = "cpu_usage")
    private Double cpuUsage;

    @Column(name = "memory_usage")
    private Double memoryUsage;

    @Column(name = "registered_at")
    private LocalDateTime registeredAt;

    @PrePersist
    protected void onCreate() {
        registeredAt = LocalDateTime.now();
        lastHeartbeat = LocalDateTime.now();
    }

    public enum WorkerStatus {
        ONLINE,
        OFFLINE,
        BUSY,
        IDLE
    }
}
