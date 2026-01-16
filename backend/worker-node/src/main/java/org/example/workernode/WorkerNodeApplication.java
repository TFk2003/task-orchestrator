package org.example.workernode;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class WorkerNodeApplication {

    public static void main(String[] args) {
        SpringApplication.run(WorkerNodeApplication.class, args);
    }

}
