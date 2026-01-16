package org.example.workernode.processor;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class ReportGenerationTaskProcessor implements TaskProcessor{
    private final ObjectMapper objectMapper;

    @Override
    public String process(String payload) throws Exception {
        log.info("Processing report generation task with payload: {}", payload);

        JsonNode payloadNode = objectMapper.readTree(payload);
        String reportType = payloadNode.get("reportType").asText();
        String format = payloadNode.has("format")
                ? payloadNode.get("format").asText()
                : "PDF";

        // Simulate report generation
        Thread.sleep(8000); // 8 seconds processing time

        Map<String, Object> result = new HashMap<>();
        result.put("reportType", reportType);
        result.put("format", format);
        result.put("reportUrl", "https://reports.example.com/report-" +
                System.currentTimeMillis() + "." + format.toLowerCase());
        result.put("pages", 15);
        result.put("generatedAt", System.currentTimeMillis());
        result.put("status", "success");

        return objectMapper.writeValueAsString(result);
    }

    @Override
    public String getTaskType() {
        return "REPORT_GENERATION";
    }
}
