package com.skillevaluator.controller;

import com.skillevaluator.model.User;
import com.skillevaluator.repository.UserRepository;
import com.skillevaluator.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PublicProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/candidate-registration")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> registerProfile(
            @RequestHeader(name = "Authorization", required = false) String bearerToken,
            @RequestBody Map<String, Object> profileData) {

        System.out.println("PUBLIC: Received registration request");

        try {
            if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized: Missing token"));
            }

            String jwt = bearerToken.substring(7);
            if (!tokenProvider.validateToken(jwt)) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized: Invalid token"));
            }

            String identifier = tokenProvider.getUsernameFromToken(jwt);
            User candidate = userRepository.findByUsername(identifier)
                    .or(() -> userRepository.findByEmail(identifier))
                    .orElseThrow(() -> new RuntimeException("Candidate not found: " + identifier));

            System.out.println("PUBLIC: Found candidate: " + candidate.getEmail());

            Object fName = profileData.get("firstName");
            Object lName = profileData.get("lastName");

            if (fName == null || fName.toString().trim().isEmpty() || lName == null
                    || lName.toString().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "First and Last names are required"));
            }

            candidate.setFirstName(fName.toString().trim());
            candidate.setLastName(lName.toString().trim());

            if (profileData.get("phone") != null)
                candidate.setPhone(profileData.get("phone").toString().trim());
            if (profileData.get("skills") != null)
                candidate.setSkills(profileData.get("skills").toString().trim());
            if (profileData.get("experience") != null)
                candidate.setExperience(profileData.get("experience").toString().trim());
            if (profileData.get("linkedinUrl") != null)
                candidate.setLinkedinUrl(profileData.get("linkedinUrl").toString().trim());
            if (profileData.get("githubUrl") != null)
                candidate.setGithubUrl(profileData.get("githubUrl").toString().trim());
            if (profileData.get("portfolioUrl") != null)
                candidate.setPortfolioUrl(profileData.get("portfolioUrl").toString().trim());

            userRepository.save(candidate);
            userRepository.flush(); // Force write to DB

            System.out.println("PUBLIC: Profile saved successfully for " + candidate.getEmail());

            return ResponseEntity.ok(Map.of("message", "Profile registered successfully"));

        } catch (Exception e) {
            System.err.println("PUBLIC ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Server Error: " + e.getMessage()));
        }
    }
}
