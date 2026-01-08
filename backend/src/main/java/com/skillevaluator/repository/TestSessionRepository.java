package com.skillevaluator.repository;

import com.skillevaluator.model.Test;
import com.skillevaluator.model.TestSession;
import com.skillevaluator.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TestSessionRepository extends JpaRepository<TestSession, Long> {
    List<TestSession> findByCandidate(User candidate);
    List<TestSession> findByTest(Test test);
    Optional<TestSession> findByTestAndCandidateAndIsCompletedFalse(Test test, User candidate);
    List<TestSession> findByCandidateAndIsCompletedTrue(User candidate);
}

