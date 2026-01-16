package org.example.workernode.processor;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class TaskProcessorFactory {
    private final Map<String, TaskProcessor> processors;

    public TaskProcessorFactory(List<TaskProcessor> processorList) {
        this.processors = processorList.stream()
                .collect(Collectors.toMap(
                        TaskProcessor::getTaskType,
                        Function.identity()
                ));
    }

    public TaskProcessor getProcessor(String taskType) {
        TaskProcessor processor = processors.get(taskType);
        if (processor == null) {
            throw new IllegalArgumentException("No processor found for task type: " + taskType);
        }
        return processor;
    }
}
