package com.skillevaluator.repository;

import com.skillevaluator.model.Difficulty;
import com.skillevaluator.model.Question;
import com.skillevaluator.model.QuestionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findBySkill(String skill);
    List<Question> findByDifficulty(Difficulty difficulty);
    List<Question> findByType(QuestionType type);
    List<Question> findBySkillAndDifficulty(String skill, Difficulty difficulty);
    
    @Query("SELECT q FROM Question q WHERE q.skill = :skill AND q.difficulty = :difficulty ORDER BY FUNCTION('RANDOM')")
    List<Question> findRandomBySkillAndDifficulty(@Param("skill") String skill, @Param("difficulty") Difficulty difficulty, org.springframework.data.domain.Pageable pageable);
}

