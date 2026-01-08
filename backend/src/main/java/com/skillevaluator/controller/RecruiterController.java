package com.skillevaluator.controller;

import com.skillevaluator.model.*;
import com.skillevaluator.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recruiter")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
public class RecruiterController {

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private TestSessionRepository testSessionRepository;

    @Autowired
    private UserRepository userRepository;

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
    public ResponseEntity<?> getTestById(@PathVariable Long id, Authentication authentication) {
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
            List<Question> questions = questionRepository.findAllById(questionIds);
            test.setQuestions(questions);
            
            int totalPoints = questions.stream()
                    .mapToInt(Question::getPoints)
                    .sum();
            test.setTotalPoints(totalPoints);
        } else {
            test.setTotalPoints(0);
        }

        test = testRepository.save(test);
        return ResponseEntity.ok(test);
    }

    @PutMapping("/tests/{id}")
    public ResponseEntity<?> updateTest(@PathVariable Long id, @RequestBody Map<String, Object> testData, Authentication authentication) {
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
            List<Question> questions = questionRepository.findAllById(questionIds);
            test.setQuestions(questions);
            
            int totalPoints = questions.stream()
                    .mapToInt(Question::getPoints)
                    .sum();
            test.setTotalPoints(totalPoints);
        }

        test = testRepository.save(test);
        return ResponseEntity.ok(test);
    }

    @DeleteMapping("/tests/{id}")
    public ResponseEntity<?> deleteTest(@PathVariable Long id, Authentication authentication) {
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

        testRepository.deleteById(id);
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
    public ResponseEntity<?> getQuestionById(@PathVariable Long id) {
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

        question = questionRepository.save(question);
        return ResponseEntity.ok(question);
    }

    @PutMapping("/questions/{id}")
    public ResponseEntity<?> updateQuestion(@PathVariable Long id, @RequestBody Map<String, Object> questionData) {
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

        question = questionRepository.save(question);
        return ResponseEntity.ok(question);
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        if (!questionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        questionRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Question deleted successfully!"));
    }

    // ========== RESULTS & ANALYTICS ==========

    @GetMapping("/tests/{testId}/sessions")
    public ResponseEntity<List<TestSession>> getTestSessions(@PathVariable Long testId, Authentication authentication) {
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
    public ResponseEntity<List<TestSession>> getCandidateSessions(@PathVariable Long candidateId) {
        Optional<User> candidateOpt = userRepository.findById(candidateId);
        if (candidateOpt.isEmpty() || candidateOpt.get().getRole() != Role.CANDIDATE) {
            return ResponseEntity.notFound().build();
        }

        List<TestSession> sessions = testSessionRepository.findByCandidate(candidateOpt.get());
        return ResponseEntity.ok(sessions);
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

        return ResponseEntity.ok(Map.of(
                "totalTests", totalTests,
                "activeTests", activeTests,
                "totalSessions", totalSessions,
                "completedSessions", completedSessions
        ));
    }
}

