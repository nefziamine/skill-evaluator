package com.skillevaluator.controller;

import com.skillevaluator.model.JobAssessment;
import com.skillevaluator.model.User;
import com.skillevaluator.repository.JobAssessmentRepository;
import com.skillevaluator.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@Slf4j
public class JobAssessmentController {

    private final JobAssessmentRepository jobAssessmentRepository;
    private final UserRepository userRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<?> createJob(@RequestBody JobAssessment job) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            log.info("Creating job for recruiter: {}", username);
            
            if ("anonymousUser".equals(username)) {
                return ResponseEntity.status(401).body("Authentication required");
            }
            
            User recruiter = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Recruiter account '" + username + "' not found in database."));
            
            job.setRecruiter(recruiter);
            JobAssessment saved = jobAssessmentRepository.save(job);
            log.info("Job saved successfully with ID: {}", saved.getId());
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            log.error("Error creating job", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<JobAssessment>> getAllJobs() {
        return ResponseEntity.ok(jobAssessmentRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/my")
    public ResponseEntity<List<JobAssessment>> getMyJobs() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User recruiter = userRepository.findByUsername(username).orElseThrow();
        return ResponseEntity.ok(jobAssessmentRepository.findByRecruiter(recruiter));
    }
}
