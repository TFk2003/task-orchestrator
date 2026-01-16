package org.example.apiserver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskUpdateRequest {
    private String status;
    private String result;
    private String errorMessage;
    private String workerId;
    private Boolean shouldRetry;
}
