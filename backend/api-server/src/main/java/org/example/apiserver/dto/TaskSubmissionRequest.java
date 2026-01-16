package org.example.apiserver.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskSubmissionRequest {

    @NotBlank(message = "Task type is required")
    private String type; // IMAGE_PROCESSING, WEB_SCRAPING, etc.

    @NotBlank(message = "Payload is required")
    private String payload; // JSON string

    @Min(1)
    @Max(10)
    private Integer priority = 5;

    @Min(0)
    @Max(10)
    private Integer maxRetries = 3;
}