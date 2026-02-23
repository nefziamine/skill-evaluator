package com.skillevaluator.dto;

import lombok.Data;
import java.util.Map;

@Data
public class TestSubmissionRequest {
    private Map<Long, String> answers; // questionId -> answer
    private Boolean autoSubmit = false;
}

