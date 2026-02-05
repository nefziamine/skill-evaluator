package com.skillevaluator.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String text;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType type;

    @Column(nullable = false)
    private String skill; // e.g., "Java", "Spring Boot", "React", etc.

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    // For MCQ: options stored as JSON string or separate table
    // For simplicity, storing as comma-separated values
    @Column(length = 2000)
    private String options; // JSON string or comma-separated for MCQ options

    @Column(nullable = false, length = 500)
    private String correctAnswer; // For MCQ: option index/letter, For True/False: "true"/"false", For Short
                                  // Answer: expected answer

    @Column(length = 1000)
    private String explanation; // Explanation of the correct answer

    @JsonIgnore
    @ManyToMany(mappedBy = "questions")
    private List<Test> tests = new ArrayList<>();

    @Column(nullable = false)
    private Integer points = 1; // Points for this question
}
