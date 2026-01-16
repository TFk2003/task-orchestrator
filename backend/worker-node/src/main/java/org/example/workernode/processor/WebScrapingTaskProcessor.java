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
public class WebScrapingTaskProcessor implements TaskProcessor{
    private final ObjectMapper objectMapper;

    @Override
    public String process(String payload) throws Exception {
        log.info("Processing web scraping task with payload: {}", payload);

        JsonNode payloadNode = objectMapper.readTree(payload);
        String url = payloadNode.get("url").asText();
        JsonNode selectorsNode = payloadNode.get("selectors");

        // Simulate web scraping
        Thread.sleep(4000); // 4 seconds processing time

        Map<String, Object> result = new HashMap<>();
        result.put("url", url);
        result.put("scrapedData", Map.of(
                "title", "Example Page Title",
                "content", "Scraped content from " + url
        ));
        result.put("timestamp", System.currentTimeMillis());
        result.put("status", "success");

        return objectMapper.writeValueAsString(result);
    }

    @Override
    public String getTaskType() {
        return "WEB_SCRAPING";
    }
}
