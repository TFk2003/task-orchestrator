package org.example.apiserver.controller;

import lombok.RequiredArgsConstructor;
import org.example.apiserver.dto.WorkerHealthDTO;
import org.example.apiserver.service.WorkerHealthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WorkerController {
    private final WorkerHealthService workerHealthService;

    @PostMapping("/heartbeat")
    public ResponseEntity<Void> heartbeat(@RequestBody WorkerHealthDTO healthDTO) {
        workerHealthService.updateHeartbeat(healthDTO);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<WorkerHealthDTO>> getAllWorkers() {
        List<WorkerHealthDTO> workers = workerHealthService.getAllWorkers();
        return ResponseEntity.ok(workers);
    }

    @GetMapping("/{workerId}")
    public ResponseEntity<WorkerHealthDTO> getWorker(@PathVariable String workerId) {
        WorkerHealthDTO worker = workerHealthService.getWorker(workerId);
        return ResponseEntity.ok(worker);
    }
}
