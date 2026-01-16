package org.example.apiserver.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.apiserver.dto.TaskDTO;
import org.example.apiserver.dto.TaskSubmissionRequest;
import org.example.apiserver.dto.TaskUpdateRequest;
import org.example.apiserver.model.Task;
import org.example.apiserver.service.TaskService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TaskController {
    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskDTO> submitTask(
            @Valid @RequestBody TaskSubmissionRequest request) {
        TaskDTO task = taskService.submitTask(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(task);
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<TaskDTO> getTask(@PathVariable UUID taskId) {
        TaskDTO task = taskService.getTask(taskId);
        return ResponseEntity.ok(task);
    }

    @GetMapping
    public ResponseEntity<Page<TaskDTO>> getAllTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        Page<TaskDTO> tasks = taskService.getAllTasks(pageRequest);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<TaskDTO>> getTasksByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Task.TaskStatus taskStatus = Task.TaskStatus.valueOf(status.toUpperCase());
        PageRequest pageRequest = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<TaskDTO> tasks = taskService.getTasksByStatus(taskStatus, pageRequest);
        return ResponseEntity.ok(tasks);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID taskId) {
        // Implementation for task deletion
        taskService.deleteTask(taskId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{taskId}/processing")
    public ResponseEntity<Void> markTaskProcessing(
            @PathVariable UUID taskId,
            @RequestBody TaskUpdateRequest request) {
        taskService.markTaskProcessing(taskId, request.getWorkerId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{taskId}/completed")
    public ResponseEntity<Void> markTaskCompleted(
            @PathVariable UUID taskId,
            @RequestBody TaskUpdateRequest request) {
        taskService.markTaskCompleted(taskId, request.getResult());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{taskId}/failed")
    public ResponseEntity<Void> markTaskFailed(
            @PathVariable UUID taskId,
            @RequestBody TaskUpdateRequest request) {
        taskService.markTaskFailed(
                taskId,
                request.getErrorMessage(),
                request.getShouldRetry() != null ? request.getShouldRetry() : true
        );
        return ResponseEntity.ok().build();
    }
}
