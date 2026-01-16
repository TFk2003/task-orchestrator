package org.example.apiserver.repository;

import org.example.apiserver.model.WorkerHealth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkerHealthRepository extends JpaRepository<WorkerHealth, Long> {
    Optional<WorkerHealth> findByWorkerId(String workerId);

    List<WorkerHealth> findByStatus(WorkerHealth.WorkerStatus status);

    List<WorkerHealth> findByLastHeartbeatBefore(LocalDateTime dateTime);
}
