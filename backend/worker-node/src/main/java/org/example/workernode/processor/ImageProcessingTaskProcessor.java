package org.example.workernode.processor;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class ImageProcessingTaskProcessor implements TaskProcessor{
    private final ObjectMapper objectMapper;

    @Override
    public String process(String payload) throws Exception {
        log.info("Processing image task with payload: {}", payload);

        JsonNode payloadNode = objectMapper.readTree(payload);
        String imageUrl = payloadNode.get("imageUrl").asText();
        String operation = payloadNode.get("operation").asText();

        // Simulate image processing
        Thread.sleep(5000); // 5 seconds processing time

        // Return result as JSON
        return objectMapper.writeValueAsString(Map.of(
                "processedImageUrl", "https://processed.example.com/" + imageUrl,
                "operation", operation,
                "status", "success"
        ));
    }

    @Override
    public String getTaskType() {
        return "IMAGE_PROCESSING";
    }
}
