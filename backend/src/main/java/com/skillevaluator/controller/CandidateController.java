package com.skillevaluator.controller;

import com.skillevaluator.dto.TestSessionResponse;
import com.skillevaluator.dto.TestSubmissionRequest;
import com.skillevaluator.model.*;
import com.skillevaluator.repository.TestSessionRepository;
import com.skillevaluator.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/candidate")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CandidateController {

    @Autowired
    private TestService testService;

    @Autowired
    private TestSessionRepository testSessionRepository;

    @GetMapping("/tests")
    public ResponseEntity<List<Test>> getAvailableTests() {
        List<Test> tests = testService.getAvailableTests();
        // Remove questions from response to avoid exposing answers
        tests.forEach(test -> test.setQuestions(null));
        return ResponseEntity.ok(tests);
    }

    @PostMapping("/tests/{testId}/start")
    public ResponseEntity<TestSessionResponse> startTest(
            @PathVariable Long testId,
            Authentication authentication) {
        
        String username = authentication.getName();
        TestSession session = testService.startTestSession(testId, username);
        List<Question> questions = testService.getRandomizedQuestions(testId);
        
        // Remove correct answers from questions before sending to client
        questions.forEach(q -> {
            q.setCorrectAnswer(null);
            q.setExplanation(null);
        });

        // Calculate time remaining in seconds
        long secondsRemaining = Duration.between(
                LocalDateTime.now(),
                session.getExpiresAt()
        ).getSeconds();

        TestSessionResponse response = new TestSessionResponse(
                session.getTest(),
                questions,
                session.getId(),
                (int) Math.max(0, secondsRemaining)
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/tests/{testId}/submit")
    public ResponseEntity<?> submitTest(
            @PathVariable Long testId,
            @RequestBody TestSubmissionRequest submissionRequest,
            Authentication authentication) {
        
        String username = authentication.getName();
        
        // Find the active session for this test and user
        com.skillevaluator.model.User candidate = (com.skillevaluator.model.User) authentication.getPrincipal();
        Test test = testService.getTestById(testId);

        TestSession session = testSessionRepository
                .findByTestAndCandidateAndIsCompletedFalse(test, candidate)
                .orElseThrow(() -> new RuntimeException("Active test session not found"));

        TestSession completedSession = testService.submitTest(
                testId,
                session.getId(),
                submissionRequest.getAnswers(),
                username,
                submissionRequest.getAutoSubmit() != null && submissionRequest.getAutoSubmit()
        );

        return ResponseEntity.ok(Map.of(
                "message", "Test submitted successfully",
                "score", completedSession.getScore(),
                "totalPoints", completedSession.getTotalPoints()
        ));
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<TestSession>> getMySessions(Authentication authentication) {
        String username = authentication.getName();
        List<TestSession> sessions = testService.getCandidateSessions(username);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/sessions/{sessionId}/result")
    public ResponseEntity<?> getSessionResult(@PathVariable Long sessionId, Authentication authentication) {
        User candidate = (User) authentication.getPrincipal();
        Optional<TestSession> sessionOpt = testSessionRepository.findById(sessionId);
        
        if (sessionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        TestSession session = sessionOpt.get();
        
        // Verify the session belongs to the current user
        if (!session.getCandidate().getId().equals(candidate.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }

        if (!session.getIsCompleted()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Test session not completed yet"));
        }

        return ResponseEntity.ok(Map.of(
                "sessionId", session.getId(),
                "testTitle", session.getTest().getTitle(),
                "score", session.getScore(),
                "totalPoints", session.getTotalPoints(),
                "percentage", (session.getScore() * 100.0 / session.getTotalPoints()),
                "submittedAt", session.getSubmittedAt(),
                "status", session.getStatus()
        ));
    }
}

