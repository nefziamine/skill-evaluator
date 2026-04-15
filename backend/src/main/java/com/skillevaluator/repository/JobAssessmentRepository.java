package com.skillevaluator.repository;

import com.skillevaluator.model.JobAssessment;
import com.skillevaluator.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobAssessmentRepository extends JpaRepository<JobAssessment, Long> {
    List<JobAssessment> findByRecruiter(User recruiter);
    List<JobAssessment> findAllByOrderByCreatedAtDesc();
}
