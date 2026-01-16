package org.example.workernode.processor;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Component
@Slf4j
@RequiredArgsConstructor
public class DataAnalysisTaskProcessor implements TaskProcessor{
    private final ObjectMapper objectMapper;
    private final Random random = new Random();

    @Override
    public String process(String payload) throws Exception {
        log.info("Processing data analysis task with payload: {}", payload);

        JsonNode payloadNode = objectMapper.readTree(payload);
        String dataset = payloadNode.get("dataset").asText();
        String analysisType = payloadNode.get("analysisType").asText();

        // Simulate data analysis
        Thread.sleep(6000); // 6 seconds processing time

        Map<String, Object> result = new HashMap<>();
        result.put("dataset", dataset);
        result.put("analysisType", analysisType);
        result.put("insights", Map.of(
                "trend", "upward",
                "averageValue", 42.5 + random.nextDouble() * 10,
                "prediction", "positive growth expected"
        ));
        result.put("processedRecords", 1000 + random.nextInt(5000));
        result.put("status", "success");

        return objectMapper.writeValueAsString(result);
    }

    @Override
    public String getTaskType() {
        return "DATA_ANALYSIS";
    }
}
