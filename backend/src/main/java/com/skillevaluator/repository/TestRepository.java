package com.skillevaluator.repository;

import com.skillevaluator.model.Test;
import com.skillevaluator.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestRepository extends JpaRepository<Test, Long> {
    List<Test> findByCreatedBy(User createdBy);
    List<Test> findByIsActiveTrue();
}

