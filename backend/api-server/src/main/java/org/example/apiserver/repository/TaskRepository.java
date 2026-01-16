package org.example.apiserver.repository;

import org.example.apiserver.model.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {

    Page<Task> findByStatus(Task.TaskStatus status, Pageable pageable);

    List<Task> findByStatusAndCreatedAtBefore(
            Task.TaskStatus status, LocalDateTime dateTime);

    @Query("SELECT t FROM Task t WHERE t.workerId = :workerId AND t.status = :status")
    List<Task> findByWorkerIdAndStatus(String workerId, Task.TaskStatus status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.status = :status")
    long countByStatus(Task.TaskStatus status);

    @Query("SELECT t.status, COUNT(t) FROM Task t GROUP BY t.status")
    List<Object[]> getTaskStatistics();
}
