package com.skillevaluator.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "test_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "test_id", nullable = false)
    private Test test;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    @Column(nullable = false)
    private LocalDateTime startedAt;

    @Column
    private LocalDateTime submittedAt;

    @Column
    private LocalDateTime expiresAt; // Calculated based on test duration

    @Column(nullable = false)
    private Boolean isCompleted = false;

    @Column
    private Integer score; // Final score

    @Column
    private Integer totalPoints; // Total possible points

    @Column(length = 10000)
    private String answers; // JSON string storing candidate's answers

    @Column(length = 2000)
    private String skillBreakdown; // JSON string storing skill category scores

    @Column(length = 1000)
    private String status; // "IN_PROGRESS", "COMPLETED", "EXPIRED", "SUBMITTED"
}
