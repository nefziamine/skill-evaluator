package com.skillevaluator.controller;

import com.skillevaluator.model.*;
import com.skillevaluator.repository.*;
import com.skillevaluator.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.skillevaluator.model.User;
import com.skillevaluator.model.Role;
import com.skillevaluator.model.Test;
import com.skillevaluator.model.Question;
import com.skillevaluator.model.TestSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.security.core.GrantedAuthority;

@RestController
@RequestMapping("/api/recruiter")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
public class RecruiterController {

    @Autowired
    private JwtTokenProvider tokenProvider; // Injected JwtTokenProvider

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private TestSessionRepository testSessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.skillevaluator.service.AiService aiService;

    @Autowired
    private com.skillevaluator.service.EmailService emailService;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    // ========== AI GENERATION ==========

    @PostMapping("/generate-ai-test")
    public ResponseEntity<?> generateAiTest(@RequestBody Map<String, Object> data, Authentication authentication) {
        try {
            String skill = (String) data.getOrDefault("skill", "General");
            String difficulty = (String) data.getOrDefault("difficulty", "MEDIUM");
            Integer questionCount = Integer.parseInt(data.getOrDefault("count", "5").toString());
            String questionType = (String) data.getOrDefault("questionType", "RANDOM");

            User creator = (User) authentication.getPrincipal();

            // 1. Generate questions via AI
            List<Question> generatedQuestions = aiService.generateQuestions(skill, difficulty, questionCount,
                    questionType);

            // 2. Wrap into a Test
            Test test = new Test();
            test.setTitle("AI Generated: " + skill + " (" + difficulty + ")");
            test.setDescription("Automatically generated assessment for " + skill + " skills.");

            int duration = data.containsKey("durationMinutes")
                    ? Integer.parseInt(data.get("durationMinutes").toString())
                    : questionCount * 2;
            test.setDurationMinutes(duration);
            test.setCreatedBy(creator);
            test.setIsActive(true);
            test.setCreatedAt(java.time.LocalDateTime.now());

            // 3. Save questions and link to test
            questionRepository.saveAll(generatedQuestions);
            test.getQuestions().addAll(generatedQuestions);
            test.setTotalPoints(generatedQuestions.stream().mapToInt(Question::getPoints).sum());

            final Test savedTest = testRepository.save(test);

            return ResponseEntity.ok(Map.of(
                    "message", "Test generated successfully via AI!",
                    "testId", savedTest.getId()));
        } catch (Exception e) {
            System.err.println("AI Generation Controller Error: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error",
                    "AI Generation failed: " + (e.getCause() != null ? e.getCause().getMessage() : e.getMessage())));
        }
    }

    // ========== TEST MANAGEMENT ==========

    @GetMapping("/tests")
    public ResponseEntity<List<Test>> getAllTests(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        List<Test> tests;

        if (currentUser.getRole() == Role.ADMIN) {
            tests = testRepository.findAll();
        } else {
            tests = testRepository.findByCreatedBy(currentUser);
        }

        return ResponseEntity.ok(tests);
    }

    @GetMapping("/tests/{id}")
    public ResponseEntity<?> getTestById(@PathVariable @org.springframework.lang.NonNull Long id,
            Authentication authentication) {
        Optional<Test> testOpt = testRepository.findById(id);
        if (testOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Test test = testOpt.get();
        User currentUser = (User) authentication.getPrincipal();

        // Recruiters can only see their own tests (unless admin)
        if (currentUser.getRole() != Role.ADMIN &&
                !test.getCreatedBy().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }

        return ResponseEntity.ok(test);
    }

    @PostMapping("/tests")
    public ResponseEntity<?> createTest(@RequestBody Map<String, Object> testData, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();

        Test test = new Test();
        test.setTitle((String) testData.get("title"));
        test.setDescription((String) testData.get("description"));
        test.setCreatedBy(currentUser);
        test.setDurationMinutes(Integer.parseInt(testData.get("durationMinutes").toString()));
        test.setIsActive(true);

        // Calculate total points from questions if provided
        if (testData.containsKey("questionIds")) {
            @SuppressWarnings("unchecked")
            List<Long> questionIds = (List<Long>) testData.get("questionIds");
            List<Question> questions = questionRepository.findAllById(java.util.Objects.requireNonNull(questionIds));
            test.setQuestions(questions);

            int totalPoints = questions.stream()
                    .mapToInt(Question::getPoints)
                    .sum();
            test.setTotalPoints(totalPoints);
        } else {
            test.setTotalPoints(0);
        }

        test = testRepository.save(java.util.Objects.requireNonNull(test));
        return ResponseEntity.ok(test);
    }

    @PutMapping("/tests/{id}")
    public ResponseEntity<?> updateTest(@PathVariable @org.springframework.lang.NonNull Long id,
            @RequestBody Map<String, Object> testData, Authentication authentication) {
        Optional<Test> testOpt = testRepository.findById(id);
        if (testOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Test test = testOpt.get();
        User currentUser = (User) authentication.getPrincipal();

        if (currentUser.getRole() != Role.ADMIN &&
                !test.getCreatedBy().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }

        if (testData.containsKey("title")) {
            test.setTitle((String) testData.get("title"));
        }
        if (testData.containsKey("description")) {
            test.setDescription((String) testData.get("description"));
        }
        if (testData.containsKey("durationMinutes")) {
            test.setDurationMinutes(Integer.parseInt(testData.get("durationMinutes").toString()));
        }
        if (testData.containsKey("isActive")) {
            test.setIsActive((Boolean) testData.get("isActive"));
        }
        if (testData.containsKey("questionIds")) {
            @SuppressWarnings("unchecked")
            List<Long> questionIds = (List<Long>) testData.get("questionIds");
            List<Question> questions = questionRepository.findAllById(java.util.Objects.requireNonNull(questionIds));
            test.setQuestions(questions);

            int totalPoints = questions.stream()
                    .mapToInt(Question::getPoints)
                    .sum();
            test.setTotalPoints(totalPoints);
        }

        test = testRepository.save(java.util.Objects.requireNonNull(test));
        return ResponseEntity.ok(test);
    }

    @DeleteMapping("/tests/{id}")
    public ResponseEntity<?> deleteTest(@PathVariable @org.springframework.lang.NonNull Long id,
            Authentication authentication) {
        Optional<Test> testOpt = testRepository.findById(id);
        if (testOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Test test = testOpt.get();
        User currentUser = (User) authentication.getPrincipal();

        if (currentUser.getRole() != Role.ADMIN &&
                !test.getCreatedBy().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }

        testRepository.deleteById(java.util.Objects.requireNonNull(id));
        return ResponseEntity.ok(Map.of("message", "Test deleted successfully!"));
    }

    // ========== QUESTION MANAGEMENT ==========

    @GetMapping("/questions")
    public ResponseEntity<List<Question>> getAllQuestions(
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String type) {

        List<Question> questions;

        if (skill != null && difficulty != null) {
            questions = questionRepository.findBySkillAndDifficulty(skill, Difficulty.valueOf(difficulty));
        } else if (skill != null) {
            questions = questionRepository.findBySkill(skill);
        } else if (difficulty != null) {
            questions = questionRepository.findByDifficulty(Difficulty.valueOf(difficulty));
        } else if (type != null) {
            questions = questionRepository.findByType(QuestionType.valueOf(type));
        } else {
            questions = questionRepository.findAll();
        }

        return ResponseEntity.ok(questions);
    }

    @GetMapping("/questions/{id}")
    public ResponseEntity<?> getQuestionById(@PathVariable @org.springframework.lang.NonNull Long id) {
        Optional<Question> question = questionRepository.findById(id);
        if (question.isPresent()) {
            return ResponseEntity.ok(question.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/questions")
    public ResponseEntity<?> createQuestion(@RequestBody Map<String, Object> questionData) {
        Question question = new Question();
        question.setText((String) questionData.get("text"));
        question.setType(QuestionType.valueOf(questionData.get("type").toString()));
        question.setSkill((String) questionData.get("skill"));
        question.setDifficulty(Difficulty.valueOf(questionData.get("difficulty").toString()));
        question.setCorrectAnswer((String) questionData.get("correctAnswer"));

        if (questionData.containsKey("options")) {
            question.setOptions((String) questionData.get("options"));
        }
        if (questionData.containsKey("explanation")) {
            question.setExplanation((String) questionData.get("explanation"));
        }
        if (questionData.containsKey("points")) {
            question.setPoints(Integer.parseInt(questionData.get("points").toString()));
        } else {
            question.setPoints(1);
        }

        question = questionRepository.save(java.util.Objects.requireNonNull(question));
        return ResponseEntity.ok(question);
    }

    @PutMapping("/questions/{id}")
    public ResponseEntity<?> updateQuestion(@PathVariable @org.springframework.lang.NonNull Long id,
            @RequestBody Map<String, Object> questionData) {
        Optional<Question> questionOpt = questionRepository.findById(id);
        if (questionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Question question = questionOpt.get();

        if (questionData.containsKey("text")) {
            question.setText((String) questionData.get("text"));
        }
        if (questionData.containsKey("type")) {
            question.setType(QuestionType.valueOf(questionData.get("type").toString()));
        }
        if (questionData.containsKey("skill")) {
            question.setSkill((String) questionData.get("skill"));
        }
        if (questionData.containsKey("difficulty")) {
            question.setDifficulty(Difficulty.valueOf(questionData.get("difficulty").toString()));
        }
        if (questionData.containsKey("correctAnswer")) {
            question.setCorrectAnswer((String) questionData.get("correctAnswer"));
        }
        if (questionData.containsKey("options")) {
            question.setOptions((String) questionData.get("options"));
        }
        if (questionData.containsKey("explanation")) {
            question.setExplanation((String) questionData.get("explanation"));
        }
        if (questionData.containsKey("points")) {
            question.setPoints(Integer.parseInt(questionData.get("points").toString()));
        }

        question = questionRepository.save(java.util.Objects.requireNonNull(question));
        return ResponseEntity.ok(question);
    }

    @DeleteMapping("/questions/{id}")
    @Transactional
    public ResponseEntity<?> deleteQuestion(@PathVariable @org.springframework.lang.NonNull Long id) {
        Optional<Question> questionOpt = questionRepository.findById(id);
        if (questionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Question question = questionOpt.get();

        // Remove question from all tests first
        for (Test test : new ArrayList<>(question.getTests())) {
            test.getQuestions().remove(question);
            testRepository.save(test);
        }

        questionRepository.delete(question);
        return ResponseEntity.ok(Map.of("message", "Question deleted successfully!"));
    }

    @PostMapping("/questions/batch-delete")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Transactional
    public ResponseEntity<?> deleteQuestionsBatch(@RequestBody List<Long> ids) {
        System.out.println("RECRUITER: Batch delete requested for IDs: " + ids);

        for (Long id : ids) {
            Optional<Question> questionOpt = questionRepository.findById(id);
            if (questionOpt.isPresent()) {
                Question question = questionOpt.get();
                // Remove from all tests
                for (Test test : new ArrayList<>(question.getTests())) {
                    test.getQuestions().remove(question);
                    testRepository.save(test);
                }
                questionRepository.delete(question);
            }
        }

        return ResponseEntity.ok(Map.of("message", "Questions deleted successfully!"));
    }

    // ========== RESULTS & ANALYTICS ==========

    @GetMapping("/tests/{testId}/sessions")
    public ResponseEntity<List<TestSession>> getTestSessions(
            @PathVariable @org.springframework.lang.NonNull Long testId, Authentication authentication) {
        Optional<Test> testOpt = testRepository.findById(testId);
        if (testOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Test test = testOpt.get();
        User currentUser = (User) authentication.getPrincipal();

        if (currentUser.getRole() != Role.ADMIN &&
                !test.getCreatedBy().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body(null);
        }

        List<TestSession> sessions = testSessionRepository.findByTest(test);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/candidates/{candidateId}/sessions")
    public ResponseEntity<List<TestSession>> getCandidateSessions(
            @PathVariable @org.springframework.lang.NonNull Long candidateId) {
        Optional<User> candidateOpt = userRepository.findById(candidateId);
        if (candidateOpt.isEmpty() || candidateOpt.get().getRole() != Role.CANDIDATE) {
            return ResponseEntity.notFound().build();
        }

        List<TestSession> sessions = testSessionRepository.findByCandidate(candidateOpt.get());
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/sessions/completed")
    public ResponseEntity<List<TestSession>> getCompletedSessions(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        List<TestSession> sessions;
        if (currentUser.getRole() == Role.ADMIN) {
            sessions = testSessionRepository.findAll();
        } else {
            sessions = testSessionRepository.findAll().stream()
                    .filter(s -> s.getTest().getCreatedBy().getId().equals(currentUser.getId()))
                    .filter(TestSession::getIsCompleted)
                    .toList();
        }
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/sessions/{sessionId}/details")
    public ResponseEntity<?> getSessionDetails(@PathVariable @org.springframework.lang.NonNull Long sessionId,
            Authentication authentication) {
        Optional<TestSession> sessionOpt = testSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        TestSession session = sessionOpt.get();
        User currentUser = (User) authentication.getPrincipal();

        if (currentUser.getRole() != Role.ADMIN &&
                !session.getTest().getCreatedBy().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }

        return ResponseEntity.ok(session);
    }

    @PostMapping("/compare-candidates/ai-advice")
    public ResponseEntity<?> getHiringAdvice(@RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            @SuppressWarnings("unchecked")
            List<Object> sessionIdsRaw = (List<Object>) request.get("sessionIds");

            if (sessionIdsRaw == null || sessionIdsRaw.size() < 2) {
                return ResponseEntity.badRequest().body(Map.of("error", "At least 2 session IDs are required"));
            }

            // Convert session IDs to Long (handle both Integer and Long from JSON)
            List<Long> sessionIds = new ArrayList<>();
            for (Object id : sessionIdsRaw) {
                if (id instanceof Integer) {
                    sessionIds.add(((Integer) id).longValue());
                } else if (id instanceof Long) {
                    sessionIds.add((Long) id);
                } else if (id instanceof Number) {
                    sessionIds.add(((Number) id).longValue());
                } else {
                    System.err.println("Invalid session ID type: " + id.getClass().getName());
                }
            }

            if (sessionIds.size() < 2) {
                return ResponseEntity.badRequest().body(Map.of("error", "At least 2 valid session IDs are required"));
            }

            User currentUser = (User) authentication.getPrincipal();
            List<Map<String, Object>> candidateData = new ArrayList<>();

            for (Long sessionId : sessionIds) {
                Optional<TestSession> sessionOpt = testSessionRepository.findById(sessionId);
                if (sessionOpt.isEmpty()) {
                    continue;
                }

                TestSession session = sessionOpt.get();

                // Check access
                if (currentUser.getRole() != Role.ADMIN &&
                        !session.getTest().getCreatedBy().getId().equals(currentUser.getId())) {
                    continue;
                }

                if (!session.getIsCompleted() || session.getScore() == null) {
                    continue;
                }

                Map<String, Object> candidate = new HashMap<>();
                candidate.put("name", session.getCandidate().getUsername());
                candidate.put("testTitle", session.getTest().getTitle());
                candidate.put("score", session.getScore());
                candidate.put("totalPoints", session.getTotalPoints());
                candidate.put("submittedAt",
                        session.getSubmittedAt() != null ? session.getSubmittedAt().toString() : "N/A");

                if (session.getSkillBreakdown() != null && !session.getSkillBreakdown().isEmpty()) {
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        Map<String, Integer> skillMap = mapper.readValue(session.getSkillBreakdown(),
                                new TypeReference<Map<String, Integer>>() {
                                });
                        candidate.put("skillBreakdown", skillMap);
                    } catch (Exception e) {
                        // Skip skill breakdown if parsing fails
                    }
                }

                candidateData.add(candidate);
            }

            if (candidateData.size() < 2) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Insufficient valid candidate data for comparison"));
            }

            System.out.println("Generating hiring advice for " + candidateData.size() + " candidates");
            String advice = aiService.generateHiringAdvice(candidateData);

            if (advice == null || advice.isEmpty()) {
                return ResponseEntity.status(500).body(Map.of("error", "AI service returned empty advice"));
            }

            return ResponseEntity.ok(Map.of("advice", advice));

        } catch (Exception e) {
            System.err.println("Error in hiring advice endpoint: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to generate hiring advice: " + e.getMessage()));
        }
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();

        List<Test> tests;
        if (currentUser.getRole() == Role.ADMIN) {
            tests = testRepository.findAll();
        } else {
            tests = testRepository.findByCreatedBy(currentUser);
        }

        long totalTests = tests.size();
        long activeTests = tests.stream().filter(Test::getIsActive).count();
        long totalSessions = testSessionRepository.findAll().stream()
                .filter(s -> tests.contains(s.getTest()))
                .count();
        long completedSessions = testSessionRepository.findAll().stream()
                .filter(s -> tests.contains(s.getTest()) && s.getIsCompleted())
                .count();
        long totalQuestions = questionRepository.count();

        return ResponseEntity.ok(Map.of(
                "totalTests", totalTests,
                "activeTests", activeTests,
                "totalSessions", totalSessions,
                "completedSessions", completedSessions,
                "totalQuestions", totalQuestions));
    }

    @PostMapping("/invite-candidate")
    public ResponseEntity<?> inviteCandidate(@RequestBody Map<String, Object> inviteData) {
        String email = (String) inviteData.get("email");
        if (inviteData.get("testId") == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "testId is required"));
        }
        Long testId = Long.parseLong(inviteData.get("testId").toString());

        // Find test to get title
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found"));

        // Find or create candidate user
        Optional<User> userOpt = userRepository.findByEmail(email);
        User candidate;
        if (userOpt.isPresent()) {
            candidate = userOpt.get();
        } else {
            candidate = new User();
            candidate.setEmail(email);
            candidate.setUsername(email); // Use email as username
            candidate.setPassword("invited"); // Placeholder
            candidate.setRole(Role.CANDIDATE);
            candidate.setEnabled(true);
            candidate.setAccountNonExpired(true);
            candidate.setAccountNonLocked(true);
            candidate.setCredentialsNonExpired(true);
            candidate = userRepository.save(candidate);
        }

        // Generate token for this candidate
        String token = tokenProvider.generateToken(candidate.getUsername(), "ROLE_CANDIDATE");

        // The invitation link
        String inviteLink = "http://localhost:3000/invite/" + token + "?testId=" + testId;

        // Send Email automatically
        emailService.sendInvitation(email, inviteLink, test.getTitle());

        return ResponseEntity.ok(Map.of(
                "inviteLink", inviteLink,
                "token", token,
                "message", "Invitation sent to " + email));
    }

    // ========== SELF PROFILE MANAGEMENT ==========

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentRecruiter(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        currentUser.setPassword(null);
        return ResponseEntity.ok(currentUser);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentRecruiter(@RequestBody Map<String, String> updates,
            Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();

        String newEmail = updates.get("email");
        String currentPassword = updates.get("currentPassword");
        String newPassword = updates.get("newPassword");

        if (newEmail != null && !newEmail.equals(currentUser.getEmail())) {
            if (userRepository.existsByEmail(newEmail)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is already in use!"));
            }
            currentUser.setEmail(newEmail);
        }

        if (newPassword != null && !newPassword.isEmpty()) {
            if (currentPassword == null || !passwordEncoder.matches(currentPassword, currentUser.getPassword())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Current password is incorrect"));
            }
            currentUser.setPassword(passwordEncoder.encode(newPassword));
        }

        userRepository.save(currentUser);
        currentUser.setPassword(null);

        return ResponseEntity.ok(Map.of(
                "message", "Profile updated successfully",
                "user", currentUser));
    }

    // ========== TALENT BROWSER ==========

    @GetMapping("/talent-browser")
    public ResponseEntity<?> browseTalent(Authentication authentication) {
        boolean canViewContact = authentication != null && authentication.getAuthorities() != null
                && authentication.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .anyMatch(a -> a.equals("ROLE_RECRUITER") || a.equals("ROLE_ADMIN"));

        List<User> candidates = userRepository.findAll().stream()
                // Public directory: show ALL candidates across the platform
                .filter(u -> u.getRole() == Role.CANDIDATE)
                .toList();

        record TalentProfile(
                Long id,
                String firstName,
                String lastName,
                String skills,
                String experience,
                // Contact / links (only for logged-in recruiters/admins)
                String email,
                String phone,
                String linkedinUrl,
                String githubUrl,
                String portfolioUrl) {
        }

        List<TalentProfile> response = candidates.stream()
                .map(u -> new TalentProfile(
                        u.getId(),
                        u.getFirstName(),
                        u.getLastName(),
                        u.getSkills(),
                        u.getExperience(),
                        canViewContact ? u.getEmail() : null,
                        canViewContact ? u.getPhone() : null,
                        canViewContact ? u.getLinkedinUrl() : null,
                        canViewContact ? u.getGithubUrl() : null,
                        canViewContact ? u.getPortfolioUrl() : null))
                .toList();

        return ResponseEntity.ok(response);
    }
}
