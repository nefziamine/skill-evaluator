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

        // Calculate score + totals from the actual questions at submission time (avoids stale/incorrect totals)
        ScoreResult results = calculateScoreAndBreakdown(session.getTest(), answers);

        session.setAnswers(convertAnswersToJson(answers));
        session.setScore(results.totalScore());
        session.setTotalPoints(results.totalPoints());
        session.setSkillBreakdown(convertMapToJson(results.skillScores()));
        session.setSubmittedAt(LocalDateTime.now());
        session.setIsCompleted(true);
        session.setStatus(autoSubmit ? "AUTO_SUBMITTED" : "SUBMITTED");

        return testSessionRepository.save(session);
    }

    private record ScoreResult(int totalScore, int totalPoints, Map<String, Integer> skillScores) {
    }

    private ScoreResult calculateScoreAndBreakdown(Test test, Map<Long, String> answers) {
        Map<String, Integer> skillScores = new HashMap<>();
        int totalScore = 0;
        int totalPoints = 0;

        for (Question question : test.getQuestions()) {
            String skill = question.getSkill();
            skillScores.putIfAbsent(skill, 0);

            int qPoints = question.getPoints() == null ? 0 : question.getPoints();
            totalPoints += qPoints;

            String userAnswer = answers.get(question.getId());
            if (userAnswer != null && !userAnswer.isBlank() && isAnswerCorrect(question, userAnswer)) {
                skillScores.put(skill, skillScores.get(skill) + qPoints);
                totalScore += qPoints;
            }
        }

        return new ScoreResult(totalScore, totalPoints, skillScores);
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
        String correctAnswer = normalizeAnswer(question.getCorrectAnswer());
        String userAnswerNorm = normalizeAnswer(userAnswer);

        switch (question.getType()) {
            case MCQ:
                return isMcqAnswerCorrect(question, correctAnswer, userAnswerNorm);
            case TRUE_FALSE:
                return correctAnswer.equalsIgnoreCase(userAnswerNorm);
            case SHORT_ANSWER:
                // For short answers, do case-insensitive comparison
                // In production, you might want more sophisticated matching
                return correctAnswer.equalsIgnoreCase(userAnswerNorm);
            default:
                return false;
        }
    }

    private boolean isMcqAnswerCorrect(Question question, String correctAnswerNorm, String userAnswerNorm) {
        if (correctAnswerNorm.isEmpty() || userAnswerNorm.isEmpty()) {
            return false;
        }

        // 1) If both are already option text, compare directly
        if (correctAnswerNorm.equalsIgnoreCase(userAnswerNorm)) {
            return true;
        }

        // 2) Support A/B/C/D (or 1/2/3/4) style answers by mapping to option text
        List<String> options = parseOptions(question.getOptions());
        String correctFromLetter = mapChoiceToOption(options, correctAnswerNorm);
        String userFromLetter = mapChoiceToOption(options, userAnswerNorm);

        if (correctFromLetter != null && userAnswerNorm.equalsIgnoreCase(correctFromLetter)) {
            return true;
        }
        if (userFromLetter != null && correctAnswerNorm.equalsIgnoreCase(userFromLetter)) {
            return true;
        }
        if (correctFromLetter != null && userFromLetter != null) {
            return correctFromLetter.equalsIgnoreCase(userFromLetter);
        }

        // 3) Fallback: compare against any option text case-insensitively
        for (String opt : options) {
            if (opt.equalsIgnoreCase(correctAnswerNorm) && opt.equalsIgnoreCase(userAnswerNorm)) {
                return true;
            }
        }

        return false;
    }

    private static String normalizeAnswer(String s) {
        if (s == null) return "";
        // trim + collapse whitespace
        return s.trim().replaceAll("\\s+", " ");
    }

    private static List<String> parseOptions(String optionsRaw) {
        if (optionsRaw == null || optionsRaw.isBlank()) return List.of();
        // Stored as comma-separated values
        String[] parts = optionsRaw.split(",");
        List<String> options = new ArrayList<>(parts.length);
        for (String p : parts) {
            String v = normalizeAnswer(p);
            if (!v.isEmpty()) options.add(v);
        }
        return options;
    }

    private static String mapChoiceToOption(List<String> options, String choice) {
        if (options == null || options.isEmpty() || choice == null) return null;
        String c = normalizeAnswer(choice).toUpperCase(Locale.ROOT);

        // A-D mapping
        if (c.length() == 1) {
            char ch = c.charAt(0);
            if (ch >= 'A' && ch <= 'D') {
                int idx = ch - 'A';
                return idx < options.size() ? options.get(idx) : null;
            }
            if (ch >= '1' && ch <= '4') {
                int idx = ch - '1';
                return idx < options.size() ? options.get(idx) : null;
            }
        }
        return null;
    }

    private String convertAnswersToJson(Map<Long, String> answers) {
        // Simple JSON conversion - in production, use a proper JSON library
        StringBuilder json = new StringBuilder("{");
        boolean first = true;
        for (Map.Entry<Long, String> entry : answers.entrySet()) {
            if (!first)
                json.append(",");
            json.append("\"").append(entry.getKey()).append("\":\"").append(escapeJson(entry.getValue())).append("\"");
            first = false;
        }
        json.append("}");
        return json.toString();
    }

    private static String escapeJson(String value) {
        if (value == null) return "";
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
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
