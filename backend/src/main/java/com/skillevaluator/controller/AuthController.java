package com.skillevaluator.controller;

import com.skillevaluator.dto.JwtResponse;
import com.skillevaluator.dto.LoginRequest;
import com.skillevaluator.dto.RegisterRequest;
import com.skillevaluator.model.Role;
import com.skillevaluator.model.User;
import com.skillevaluator.repository.UserRepository;
import com.skillevaluator.security.JwtTokenProvider;
import jakarta.validation.Valid;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(new JwtResponse(
                jwt,
                "Bearer",
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body("Error: Email is already in use!");
        }

        // Allow selected roles for registration, prevent CANDIDATE registration
        Role role = registerRequest.getRole();
        if (role == null || role == Role.CANDIDATE) {
            role = Role.RECRUITER;
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(role);
        user.setEnabled(true);
        user.setAccountNonExpired(true);
        user.setAccountNonLocked(true);
        user.setCredentialsNonExpired(true);

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        String identifier = authentication.getName();
        User user = userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .orElseThrow(() -> new RuntimeException("User not found: " + identifier));
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/candidate/setup-password")
    public ResponseEntity<?> setupCandidatePassword(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String newPassword = request.get("password");

            if (token == null || newPassword == null) {
                return ResponseEntity.badRequest().body("Token and password are required");
            }

            // Validate the token
            if (!tokenProvider.validateToken(token)) {
                return ResponseEntity.status(401).body("Invalid or expired token");
            }

            // Get username from token
            String username = tokenProvider.getUsernameFromToken(token);
            
            // Find the user
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Verify it's a candidate
            if (user.getRole() != Role.CANDIDATE) {
                return ResponseEntity.badRequest().body("This endpoint is only for candidates");
            }

            // Check if password is still the default "invited"
            if (!passwordEncoder.matches("invited", user.getPassword())) {
                return ResponseEntity.badRequest().body("Password has already been set");
            }

            // Validate new password
            if (newPassword.length() < 6) {
                return ResponseEntity.badRequest().body("Password must be at least 6 characters");
            }

            // Update password
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);

            return ResponseEntity.ok("Password set successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error setting password: " + e.getMessage());
        }
    }

}
