package org.example.workernode.processor;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ImageProcessingTaskProcessorTest {
    private ImageProcessingTaskProcessor processor;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        processor = new ImageProcessingTaskProcessor(objectMapper);
    }

    @Test
    void testGetTaskType() {
        assertEquals("IMAGE_PROCESSING", processor.getTaskType());
    }

    @Test
    void testProcess() throws Exception {
        // Arrange
        String payload = "{\"imageUrl\":\"test.jpg\",\"operation\":\"resize\",\"width\":800,\"height\":600}";

        // Act
        String result = processor.process(payload);

        // Assert
        assertNotNull(result);
        assertTrue(result.contains("processedImageUrl"));
        assertTrue(result.contains("resize"));
        assertTrue(result.contains("success"));
    }

    @Test
    void testProcessInvalidPayload() {
        // Arrange
        String invalidPayload = "{invalid json}";

        // Act & Assert
        assertThrows(Exception.class, () -> processor.process(invalidPayload));
    }
}
