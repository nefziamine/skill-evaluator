package com.skillevaluator.dto;

import com.skillevaluator.model.Question;
import com.skillevaluator.model.Test;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class TestSessionResponse {
    private Test test;
    private List<Question> questions;
    private Long sessionId;
    private Integer timeRemaining; // in seconds
}

