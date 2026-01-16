package org.example.workernode.processor;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmailSendingTaskProcessor implements TaskProcessor{
    private final ObjectMapper objectMapper;

    @Override
    public String process(String payload) throws Exception {
        log.info("Processing email sending task with payload: {}", payload);

        JsonNode payloadNode = objectMapper.readTree(payload);
        String recipient = payloadNode.get("recipient").asText();
        String subject = payloadNode.get("subject").asText();
        String body = payloadNode.has("body") ? payloadNode.get("body").asText() : "";

        // Simulate email sending
        Thread.sleep(2000); // 2 seconds processing time

        Map<String, Object> result = new HashMap<>();
        result.put("recipient", recipient);
        result.put("subject", subject);
        result.put("sent", true);
        result.put("messageId", "msg-" + System.currentTimeMillis());
        result.put("status", "success");

        return objectMapper.writeValueAsString(result);
    }

    @Override
    public String getTaskType() {
        return "EMAIL_SENDING";
    }
}
