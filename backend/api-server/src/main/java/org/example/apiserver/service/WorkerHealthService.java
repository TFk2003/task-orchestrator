package org.example.apiserver.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.apiserver.dto.WorkerHealthDTO;
import org.example.apiserver.model.WorkerHealth;
import org.example.apiserver.repository.WorkerHealthRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkerHealthService {
    private final WorkerHealthRepository workerHealthRepository;
    private static final int HEARTBEAT_TIMEOUT_SECONDS = 60;

    @Transactional
    public void updateHeartbeat(WorkerHealthDTO dto) {
        WorkerHealth worker = workerHealthRepository.findByWorkerId(dto.getWorkerId())
                .orElse(WorkerHealth.builder()
                        .workerId(dto.getWorkerId())
                        .build());

        worker.setLastHeartbeat(LocalDateTime.now());
        worker.setStatus(WorkerHealth.WorkerStatus.valueOf(dto.getStatus()));
        worker.setActiveTasks(dto.getActiveTasks());
        worker.setCpuUsage(dto.getCpuUsage());
        worker.setMemoryUsage(dto.getMemoryUsage());

        workerHealthRepository.save(worker);
        log.debug("Updated heartbeat for worker: {}", dto.getWorkerId());
    }

    public List<WorkerHealthDTO> getAllWorkers() {
        return workerHealthRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public WorkerHealthDTO getWorker(String workerId) {
        WorkerHealth worker = workerHealthRepository.findByWorkerId(workerId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));
        return convertToDTO(worker);
    }

    @Scheduled(fixedRate = 30000) // Run every 30 seconds
    @Transactional
    public void checkWorkerHealth() {
        LocalDateTime threshold = LocalDateTime.now().minusSeconds(HEARTBEAT_TIMEOUT_SECONDS);
        List<WorkerHealth> staleWorkers = workerHealthRepository
                .findByLastHeartbeatBefore(threshold);

        for (WorkerHealth worker : staleWorkers) {
            if (worker.getStatus() != WorkerHealth.WorkerStatus.OFFLINE) {
                worker.setStatus(WorkerHealth.WorkerStatus.OFFLINE);
                workerHealthRepository.save(worker);
                log.warn("Worker {} marked as OFFLINE due to missing heartbeat",
                        worker.getWorkerId());
            }
        }
    }

    private WorkerHealthDTO convertToDTO(WorkerHealth worker) {
        return WorkerHealthDTO.builder()
                .workerId(worker.getWorkerId())
                .status(worker.getStatus().name())
                .lastHeartbeat(worker.getLastHeartbeat())
                .activeTasks(worker.getActiveTasks())
                .totalProcessed(worker.getTotalProcessed())
                .totalFailed(worker.getTotalFailed())
                .cpuUsage(worker.getCpuUsage())
                .memoryUsage(worker.getMemoryUsage())
                .registeredAt(worker.getRegisteredAt())
                .build();
    }
}
