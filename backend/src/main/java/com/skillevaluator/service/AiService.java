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

import jakarta.annotation.PostConstruct;
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

    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

    public AiService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void init() {
        if (apiKey == null || apiKey.isEmpty() || apiKey.startsWith("${")) {
            System.err.println("⚠️ AI Service: API Key is NOT configured! Value: " + (apiKey == null ? "null" : apiKey));
        } else {
            // Log first 10 chars for debugging (not full key for security)
            String maskedKey = apiKey.length() > 10 ? apiKey.substring(0, 10) + "..." : apiKey;
            System.out.println("✅ AI Service: API Key loaded successfully (starts with: " + maskedKey + ")");
        }
    }

    public List<Question> generateQuestions(String skill, String difficulty, int count, String questionType) {
        System.out.println("AI: Generating " + count + " questions for " + skill + " (" + difficulty + ") - Type: " + questionType);

        if (apiKey == null || apiKey.isEmpty() || apiKey.startsWith("${")) {
            System.err.println("❌ AI: API Key is not configured correctly! Current value: " + (apiKey == null ? "null" : apiKey));
            return generateMockQuestions(skill, difficulty, count, questionType);
        }

        // Debug: Log API key status (masked for security)
        String maskedKey = apiKey.length() > 10 ? apiKey.substring(0, 10) + "..." : "***";
        System.out.println("🔑 Using API Key: " + maskedKey + " (length: " + apiKey.length() + ")");

        String questionTypeInstruction = getQuestionTypeInstruction(questionType);
        String prompt = String.format(
                "Generate exactly %d technical questions for the skill '%s' with difficulty level '%s'. %s "
                        + "Return ONLY a JSON array of objects with these fields: "
                        + "\"text\" (the question), \"options\" (4 comma-separated options for MCQ, empty for others), \"correctAnswer\" (the exact text), \"points\" (integer), \"type\" (MCQ, TRUE_FALSE, or SHORT_ANSWER). "
                        + "Return raw JSON only, no markdown formatting.",
                count, skill, difficulty, questionTypeInstruction);

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

            if (root.has("error")) {
                String errorMsg = root.path("error").path("message").asText();
                System.err.println("Gemini API Error: " + errorMsg);
                throw new Exception("Gemini API Error: " + errorMsg);
            }

            JsonNode candidates = root.path("candidates");
            if (candidates.isEmpty()) {
                System.err.println("Gemini API returned no candidates. Full response: " + response);
                throw new Exception("No candidates returned from Gemini");
            }

            String jsonText = candidates.get(0).path("content").path("parts").get(0).path("text").asText();
            System.out.println("AI Raw Response: " + jsonText);

            // Clean up potentially present markdown
            jsonText = jsonText.trim();
            if (jsonText.startsWith("```json"))
                jsonText = jsonText.substring(7);
            else if (jsonText.startsWith("```"))
                jsonText = jsonText.substring(3);
            if (jsonText.endsWith("```"))
                jsonText = jsonText.substring(0, jsonText.length() - 3);
            jsonText = jsonText.trim();

            JsonNode questionsNode = objectMapper.readTree(jsonText);
            List<Question> questions = new ArrayList<>();
            Difficulty diffEnum = Difficulty.valueOf(difficulty.toUpperCase());

            if (questionsNode.isArray()) {
                for (JsonNode node : questionsNode) {
                    Question q = new Question();
                    q.setText(node.path("text").asText());
                    q.setOptions(node.path("options").asText(""));
                    q.setCorrectAnswer(node.path("correctAnswer").asText());
                    q.setPoints(node.path("points").asInt(10));
                    q.setSkill(skill);
                    q.setDifficulty(diffEnum);
                    
                    // Parse question type from AI response or use provided type
                    String typeStr = node.path("type").asText("");
                    if (!typeStr.isEmpty()) {
                        try {
                            q.setType(QuestionType.valueOf(typeStr.toUpperCase()));
                        } catch (IllegalArgumentException e) {
                            q.setType(determineQuestionType(questionType));
                        }
                    } else {
                        q.setType(determineQuestionType(questionType));
                    }
                    questions.add(q);
                }
            } else {
                System.err.println("Expected JSON array from AI, but got: " + jsonText);
                throw new Exception("AI response is not a JSON array");
            }

            System.out.println("Successfully generated " + questions.size() + " AI questions.");
            return questions;

        } catch (org.springframework.web.client.HttpClientErrorException
                | org.springframework.web.client.HttpServerErrorException e) {
            String errorBody = e.getResponseBodyAsString();
            System.err.println("AI API HTTP Error: " + e.getStatusCode() + " - " + errorBody);
            throw new RuntimeException("AI API Error: " + e.getStatusCode() + " " + errorBody);
        } catch (Exception e) {
            System.err.println("Critical Error in AI generation: " + e.getMessage());
            throw new RuntimeException("AI Generation failed: " + e.getMessage());
        }
    }

    private List<Question> generateMockQuestions(String skill, String difficulty, int count, String questionType) {
        List<Question> questions = new ArrayList<>();
        Difficulty diffEnum = Difficulty.valueOf(difficulty.toUpperCase());
        QuestionType qType = determineQuestionType(questionType);

        for (int i = 1; i <= count; i++) {
            Question q = new Question();
            q.setSkill(skill);
            q.setDifficulty(diffEnum);
            q.setType(qType);
            q.setText(String.format("[FALLBACK] %s Question %d: Technical insight about %s.", difficulty, i, skill));
            
            if (qType == QuestionType.MCQ) {
            q.setOptions("Option A, Option B, Option C, Option D");
            q.setCorrectAnswer("Option A");
            } else if (qType == QuestionType.TRUE_FALSE) {
                q.setOptions("");
                q.setCorrectAnswer("true");
            } else {
                q.setOptions("");
                q.setCorrectAnswer("Sample answer");
            }
            q.setPoints(10);
            questions.add(q);
        }

        return questions;
    }

    private String getQuestionTypeInstruction(String questionType) {
        if (questionType == null || questionType.equals("RANDOM")) {
            return "Generate a mix of question types (MCQ, True/False, and Short Answer).";
        } else if (questionType.equals("MCQ")) {
            return "Generate only Multiple Choice Questions (MCQ) with 4 options each.";
        } else if (questionType.equals("TRUE_FALSE")) {
            return "Generate only True/False questions.";
        } else if (questionType.equals("SHORT_ANSWER")) {
            return "Generate only Short Answer questions.";
        }
        return "Generate a mix of question types.";
    }

    private QuestionType determineQuestionType(String questionType) {
        if (questionType == null || questionType.equals("RANDOM")) {
            // For random, alternate between types
            return QuestionType.MCQ; // Default to MCQ, but AI can override
        }
        try {
            return QuestionType.valueOf(questionType.toUpperCase());
        } catch (IllegalArgumentException e) {
            return QuestionType.MCQ;
        }
    }

    public String generateHiringAdvice(List<Map<String, Object>> candidateData) {
        System.out.println("AI: Generating hiring advice for " + candidateData.size() + " candidates");

        if (apiKey == null || apiKey.isEmpty() || apiKey.startsWith("${")) {
            System.err.println("❌ AI: API Key is not configured correctly!");
            return "AI service is not available. Please configure the API key.";
        }

        // Build comparison data string
        StringBuilder comparisonData = new StringBuilder();
        comparisonData.append("Compare the following candidates and provide hiring advice:\n\n");
        
        for (int i = 0; i < candidateData.size(); i++) {
            Map<String, Object> candidate = candidateData.get(i);
            comparisonData.append(String.format("Candidate %d: %s\n", i + 1, candidate.get("name")));
            comparisonData.append(String.format("  - Test: %s\n", candidate.get("testTitle")));
            comparisonData.append(String.format("  - Score: %s/%s (%.1f%%)\n", 
                candidate.get("score"), candidate.get("totalPoints"), 
                ((Integer)candidate.get("score") * 100.0 / (Integer)candidate.get("totalPoints"))));
            comparisonData.append(String.format("  - Submitted: %s\n", candidate.get("submittedAt")));
            
            if (candidate.containsKey("skillBreakdown") && candidate.get("skillBreakdown") != null) {
                comparisonData.append("  - Skill Breakdown:\n");
                @SuppressWarnings("unchecked")
                Map<String, Integer> skills = (Map<String, Integer>) candidate.get("skillBreakdown");
                for (Map.Entry<String, Integer> entry : skills.entrySet()) {
                    comparisonData.append(String.format("    * %s: %d points\n", entry.getKey(), entry.getValue()));
                }
            }
            comparisonData.append("\n");
        }

        String prompt = comparisonData.toString() + 
            "Based on the above comparison, provide:\n" +
            "1. A clear recommendation on who to hire (or if multiple candidates are suitable)\n" +
            "2. Key strengths of the recommended candidate(s)\n" +
            "3. Areas where they excel compared to others\n" +
            "4. Any concerns or considerations\n" +
            "5. Overall assessment (1-2 sentences)\n\n" +
            "Be concise, professional, and data-driven. Format as a clear hiring recommendation.";

        try {
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);
            Map<String, Object> content = new HashMap<>();
            content.put("parts", List.of(part));
            requestBody.put("contents", List.of(content));

            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("temperature", 0.7);
            generationConfig.put("maxOutputTokens", 1000);
            requestBody.put("generationConfig", generationConfig);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            System.out.println("AI: Sending hiring advice request to Gemini API...");
            String response = restTemplate.postForObject(GEMINI_URL + apiKey, entity, String.class);
            System.out.println("AI: Received response from Gemini API (length: " + (response != null ? response.length() : 0) + ")");
            
            if (response == null || response.isEmpty()) {
                throw new Exception("Empty response from Gemini API");
            }

            JsonNode root = objectMapper.readTree(response);

            if (root.has("error")) {
                String errorMsg = root.path("error").path("message").asText();
                String errorCode = root.path("error").path("code").asText("");
                System.err.println("Gemini API Error [" + errorCode + "]: " + errorMsg);
                throw new Exception("Gemini API Error [" + errorCode + "]: " + errorMsg);
            }

            JsonNode candidates = root.path("candidates");
            if (candidates == null || candidates.isEmpty() || !candidates.isArray()) {
                System.err.println("Gemini API returned no candidates. Full response: " + response);
                throw new Exception("No candidates returned from Gemini");
            }

            JsonNode firstCandidate = candidates.get(0);
            if (!firstCandidate.has("content") || !firstCandidate.path("content").has("parts")) {
                System.err.println("Unexpected response structure. Full response: " + response);
                throw new Exception("Unexpected response structure from Gemini");
            }

            JsonNode parts = firstCandidate.path("content").path("parts");
            if (parts == null || !parts.isArray() || parts.isEmpty()) {
                System.err.println("No parts in response. Full response: " + response);
                throw new Exception("No content parts in Gemini response");
            }

            String advice = parts.get(0).path("text").asText();
            if (advice == null || advice.isEmpty()) {
                System.err.println("Empty advice text. Full response: " + response);
                throw new Exception("Empty advice text from Gemini");
            }

            System.out.println("AI Hiring Advice Generated successfully (length: " + advice.length() + " chars)");
            System.out.println("AI Advice preview: " + advice.substring(0, Math.min(150, advice.length())) + "...");
            return advice;

        } catch (org.springframework.web.client.HttpClientErrorException
                | org.springframework.web.client.HttpServerErrorException e) {
            String errorBody = e.getResponseBodyAsString();
            System.err.println("AI API HTTP Error: " + e.getStatusCode() + " - " + errorBody);
            e.printStackTrace();
            return "Unable to generate AI hiring advice: API returned " + e.getStatusCode() + ". Please check the API key configuration.";
        } catch (Exception e) {
            System.err.println("Error generating hiring advice: " + e.getMessage());
            e.printStackTrace();
            return "Unable to generate AI hiring advice at this time. Error: " + e.getMessage() + ". Please review the candidate comparison data manually.";
        }
    }
}
