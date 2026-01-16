package org.example.apiserver.controller;

import lombok.RequiredArgsConstructor;
import org.example.apiserver.dto.TaskStatisticsDTO;
import org.example.apiserver.service.StatisticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StatisticsController {
    private final StatisticsService statisticsService;

    @GetMapping
    public ResponseEntity<TaskStatisticsDTO> getStatistics() {
        TaskStatisticsDTO stats = statisticsService.getTaskStatistics();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/worker/{workerId}")
    public ResponseEntity<TaskStatisticsDTO> getWorkerStatistics(
            @PathVariable String workerId) {
        TaskStatisticsDTO stats = statisticsService.getWorkerStatistics(workerId);
        return ResponseEntity.ok(stats);
    }
}
