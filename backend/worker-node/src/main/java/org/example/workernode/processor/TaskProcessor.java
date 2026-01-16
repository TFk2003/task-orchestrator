package org.example.workernode.processor;

public interface TaskProcessor {
    String process(String payload) throws Exception;
    String getTaskType();
}
