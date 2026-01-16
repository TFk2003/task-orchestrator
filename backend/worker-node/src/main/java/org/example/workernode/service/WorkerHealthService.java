package org.example.workernode.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.workernode.util.MetricsUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.lang.management.ManagementFactory;
import java.lang.management.OperatingSystemMXBean;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkerHealthService {
    private final RestTemplate restTemplate;

    @Value("${app.worker.id}")
    private String workerId;

    @Value("${api.server.url:http://localhost:8080}")
    private String apiServerUrl;

    private int activeTasks = 0;

    @Scheduled(fixedRate = 15000) // Send heartbeat every 15 seconds
    public void sendHeartbeat() {
        try {
            Map<String, Object> heartbeat = new HashMap<>();
            heartbeat.put("workerId", workerId);
            heartbeat.put("status", getWorkerStatus());
            heartbeat.put("activeTasks", activeTasks);
            heartbeat.put("cpuUsage", getCpuUsage());
            heartbeat.put("memoryUsage", getMemoryUsage());

            restTemplate.postForEntity(
                    apiServerUrl + "/api/workers/heartbeat",
                    heartbeat,
                    Void.class
            );

            log.debug("Heartbeat sent successfully");
        } catch (Exception e) {
            log.error("Failed to send heartbeat", e);
        }
    }

    private String getWorkerStatus() {
        return activeTasks > 0 ? "BUSY" : "IDLE";
    }

    private double getCpuUsage() {
        OperatingSystemMXBean osBean = ManagementFactory.getOperatingSystemMXBean();
        return osBean.getSystemLoadAverage();
    }

    private double getMemoryUsage() {
        return MetricsUtil.getMemoryUsage();
    }

    public void incrementActiveTasks() {
        activeTasks++;
    }

    public void decrementActiveTasks() {
        activeTasks = Math.max(0, activeTasks - 1);
    }
}

