package com.skillevaluator.service;

import com.skillevaluator.model.*;
import com.skillevaluator.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class TestService {

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private TestSessionRepository testSessionRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Test> getAvailableTests() {
        return testRepository.findByIsActiveTrue();
    }

    public Test getTestById(@org.springframework.lang.NonNull Long testId) {
        return testRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found"));
    }

    @Transactional
    public TestSession startTestSession(@org.springframework.lang.NonNull Long testId, String username) {
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found"));

        if (!test.getIsActive()) {
            throw new RuntimeException("Test is not active");
        }

        User candidate = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if there's an existing incomplete session
        Optional<TestSession> existingSession = testSessionRepository
                .findByTestAndCandidateAndIsCompletedFalse(test, candidate);

        if (existingSession.isPresent()) {
            TestSession session = existingSession.get();
            // Check if session has expired
            if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
                session.setIsCompleted(true);
                session.setStatus("EXPIRED");
                testSessionRepository.save(session);
            } else {
                return session; // Return existing session
            }
        }

        // Create new test session
        TestSession session = new TestSession();
        session.setTest(test);
        session.setCandidate(candidate);
        session.setStartedAt(LocalDateTime.now());
        session.setExpiresAt(LocalDateTime.now().plusMinutes(test.getDurationMinutes()));
        session.setIsCompleted(false);
        session.setStatus("IN_PROGRESS");
        session.setTotalPoints(test.getTotalPoints());

        return testSessionRepository.save(session);
    }

    public List<Question> getRandomizedQuestions(@org.springframework.lang.NonNull Long testId) {
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found"));

        List<Question> allQuestions = test.getQuestions();

        // Randomize questions
        List<Question> randomizedQuestions = new ArrayList<>(allQuestions);
        Collections.shuffle(randomizedQuestions);

        // For MCQ questions, also randomize options if needed
        randomizedQuestions.forEach(question -> {
            if (question.getType() == QuestionType.MCQ && question.getOptions() != null) {
                // Options are stored as comma-separated, we'll randomize them in the response
                // For now, we keep them as is - randomization can be done in DTO layer
            }
        });

        return randomizedQuestions;
    }

    @Transactional
    public TestSession submitTest(@org.springframework.lang.NonNull Long testId,
            @org.springframework.lang.NonNull Long sessionId, Map<Long, String> answers, String username,
            boolean autoSubmit) {
        TestSession session = testSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Test session not found"));

        if (!session.getCandidate().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized access to test session");
        }

        if (session.getIsCompleted()) {
            throw new RuntimeException("Test session already completed");
        }

        // Check if expired
        if (session.getExpiresAt().isBefore(LocalDateTime.now()) && !autoSubmit) {
            throw new RuntimeException("Test session has expired");
        }

        // Calculate score and skill breakdown
        Map<String, Map<String, Integer>> results = calculateScoreAndBreakdown(session.getTest(), answers);
        Map<String, Integer> skillScores = results.get("skillScores");
        int totalScore = skillScores.values().stream().mapToInt(Integer::intValue).sum();

        session.setAnswers(convertAnswersToJson(answers));
        session.setScore(totalScore);
        session.setSkillBreakdown(convertMapToJson(skillScores));
        session.setSubmittedAt(LocalDateTime.now());
        session.setIsCompleted(true);
        session.setStatus(autoSubmit ? "AUTO_SUBMITTED" : "SUBMITTED");

        return testSessionRepository.save(session);
    }

    private Map<String, Map<String, Integer>> calculateScoreAndBreakdown(Test test, Map<Long, String> answers) {
        Map<String, Integer> skillScores = new HashMap<>();

        for (Question question : test.getQuestions()) {
            String skill = question.getSkill();
            skillScores.putIfAbsent(skill, 0);

            String userAnswer = answers.get(question.getId());
            if (userAnswer != null && isAnswerCorrect(question, userAnswer)) {
                skillScores.put(skill, skillScores.get(skill) + question.getPoints());
            }
        }

        Map<String, Map<String, Integer>> result = new HashMap<>();
        result.put("skillScores", skillScores);
        return result;
    }

    private String convertMapToJson(Map<String, Integer> map) {
        if (map == null || map.isEmpty())
            return "{}";
        StringBuilder json = new StringBuilder("{");
        boolean first = true;
        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            if (!first)
                json.append(",");
            json.append("\"").append(entry.getKey()).append("\":").append(entry.getValue());
            first = false;
        }
        json.append("}");
        return json.toString();
    }

    private boolean isAnswerCorrect(Question question, String userAnswer) {
        String correctAnswer = question.getCorrectAnswer().trim();
        String userAnswerTrimmed = userAnswer.trim();

        switch (question.getType()) {
            case MCQ:
            case TRUE_FALSE:
                return correctAnswer.equalsIgnoreCase(userAnswerTrimmed);
            case SHORT_ANSWER:
                // For short answers, do case-insensitive comparison
                // In production, you might want more sophisticated matching
                return correctAnswer.equalsIgnoreCase(userAnswerTrimmed);
            default:
                return false;
        }
    }

    private String convertAnswersToJson(Map<Long, String> answers) {
        // Simple JSON conversion - in production, use a proper JSON library
        StringBuilder json = new StringBuilder("{");
        boolean first = true;
        for (Map.Entry<Long, String> entry : answers.entrySet()) {
            if (!first)
                json.append(",");
            json.append("\"").append(entry.getKey()).append("\":\"").append(entry.getValue()).append("\"");
            first = false;
        }
        json.append("}");
        return json.toString();
    }

    public List<TestSession> getCandidateSessions(String username) {
        User candidate = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return testSessionRepository.findByCandidate(candidate);
    }

    public Map<String, Object> getCandidateRank(@org.springframework.lang.NonNull Long sessionId) {
        TestSession session = testSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getIsCompleted()) {
            throw new RuntimeException("Test not completed");
        }

        Test test = session.getTest();
        List<TestSession> allSessions = testSessionRepository.findByTest(test).stream()
                .filter(TestSession::getIsCompleted)
                .sorted(Comparator.comparingInt(TestSession::getScore).reversed())
                .toList();

        int rank = 0;
        for (int i = 0; i < allSessions.size(); i++) {
            if (allSessions.get(i).getId().equals(sessionId)) {
                rank = i + 1;
                break;
            }
        }

        double percentile = ((double) (allSessions.size() - rank) / allSessions.size()) * 100;

        return Map.of(
                "rank", rank,
                "totalCandidates", allSessions.size(),
                "percentile", Math.round(percentile * 100.0) / 100.0);
    }
}
