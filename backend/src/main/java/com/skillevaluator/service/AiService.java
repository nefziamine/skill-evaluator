package com.skillevaluator.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillevaluator.model.Difficulty;
import com.skillevaluator.model.Question;
import com.skillevaluator.model.QuestionType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=";

    public AiService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public List<Question> generateQuestions(String skill, String difficulty, int count) {
        System.out.println("AI: Generating " + count + " questions for " + skill + " (" + difficulty + ")");
        System.out.println("AI: Using URL: " + GEMINI_URL);
        System.out.println("AI: API Key loaded: "
                + (apiKey != null && !apiKey.isEmpty() ? (apiKey.substring(0, 5) + "...") : "NULL/EMPTY"));

        String prompt = String.format(
                "Generate exactly %d challenging and practical technical multiple-choice questions for the skill '%s' with difficulty level '%s'. "
                        +
                        "Return ONLY a JSON array of objects with the following fields: " +
                        "'text' (the question), 'options' (4 comma-separated options), 'correctAnswer' (the exact text of the correct option), 'points' (integer). "
                        +
                        "Ensure questions are not generic; use code snippets or specific scenarios where applicable. " +
                        "Do not include any other text, markdown formatting, or code blocks (like ```json). Return raw JSON only.",
                count, skill, difficulty);

        try {
            Map<String, Object> requestBody = new HashMap<>();

            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);

            Map<String, Object> content = new HashMap<>();
            content.put("parts", List.of(part));

            requestBody.put("contents", List.of(content));

            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("responseMimeType", "application/json");
            requestBody.put("generationConfig", generationConfig);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            String response = restTemplate.postForObject(GEMINI_URL + apiKey, entity, String.class);
            JsonNode root = objectMapper.readTree(response);
            String jsonText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

            // Clean up markdown code blocks if present
            jsonText = jsonText.trim();
            if (jsonText.startsWith("```json")) {
                jsonText = jsonText.substring(7);
            } else if (jsonText.startsWith("```")) {
                jsonText = jsonText.substring(3);
            }
            if (jsonText.endsWith("```")) {
                jsonText = jsonText.substring(0, jsonText.length() - 3);
            }
            jsonText = jsonText.trim();

            System.out.println("AI Response JSON: " + jsonText); // Debug logging

            JsonNode questionsNode = objectMapper.readTree(jsonText);
            List<Question> questions = new ArrayList<>();
            Difficulty diffEnum = Difficulty.valueOf(difficulty.toUpperCase());

            if (questionsNode.isArray()) {
                for (JsonNode node : questionsNode) {
                    Question q = new Question();
                    q.setText(node.path("text").asText());
                    q.setOptions(node.path("options").asText());
                    q.setCorrectAnswer(node.path("correctAnswer").asText());
                    q.setPoints(node.path("points").asInt(10));
                    q.setSkill(skill);
                    q.setDifficulty(diffEnum);
                    q.setType(QuestionType.MCQ);
                    questions.add(q);
                }
            }
            return questions;

        } catch (org.springframework.web.client.HttpClientErrorException
                | org.springframework.web.client.HttpServerErrorException e) {
            System.err.println("AI API HTTP Error: " + e.getStatusCode() + " " + e.getResponseBodyAsString());
            return generateMockQuestions(skill, difficulty, count);
        } catch (Exception e) {
            System.err.println("Error generating questions with AI: " + e.getMessage());
            e.printStackTrace();
            return generateMockQuestions(skill, difficulty, count);
        }
    }

    private List<Question> generateMockQuestions(String skill, String difficulty, int count) {
        List<Question> questions = new ArrayList<>();
        Difficulty diffEnum = Difficulty.valueOf(difficulty.toUpperCase());

        for (int i = 1; i <= count; i++) {
            Question q = new Question();
            q.setSkill(skill);
            q.setDifficulty(diffEnum);
            q.setType(QuestionType.MCQ);
            q.setText(String.format("[FALLBACK] %s Question %d: Technical insight about %s.", difficulty, i, skill));
            q.setOptions("Option A, Option B, Option C, Option D");
            q.setCorrectAnswer("Option A");
            q.setPoints(10);
            questions.add(q);
        }

        return questions;
    }
}
