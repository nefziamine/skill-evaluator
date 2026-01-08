package com.skillevaluator.controller;

import com.skillevaluator.dto.RegisterRequest;
import com.skillevaluator.model.Role;
import com.skillevaluator.model.User;
import com.skillevaluator.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        // Remove passwords from response
        users.forEach(user -> user.setPassword(null));
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            user.get().setPassword(null);
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@Valid @RequestBody RegisterRequest registerRequest, Authentication authentication) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Username is already taken!"));
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email is already in use!"));
        }

        // Admin can create any role
        Role role = registerRequest.getRole() != null ? registerRequest.getRole() : Role.CANDIDATE;

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
        user.setPassword(null);

        return ResponseEntity.ok(Map.of(
                "message", "User created successfully!",
                "user", user
        ));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        if (updates.containsKey("email")) {
            String newEmail = (String) updates.get("email");
            if (!user.getEmail().equals(newEmail) && userRepository.existsByEmail(newEmail)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Email is already in use!"));
            }
            user.setEmail(newEmail);
        }

        if (updates.containsKey("role")) {
            user.setRole(Role.valueOf(updates.get("role").toString()));
        }

        if (updates.containsKey("enabled")) {
            user.setEnabled((Boolean) updates.get("enabled"));
        }

        if (updates.containsKey("accountNonLocked")) {
            user.setAccountNonLocked((Boolean) updates.get("accountNonLocked"));
        }

        if (updates.containsKey("password")) {
            user.setPassword(passwordEncoder.encode(updates.get("password").toString()));
        }

        userRepository.save(user);
        user.setPassword(null);

        return ResponseEntity.ok(Map.of(
                "message", "User updated successfully!",
                "user", user
        ));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, Authentication authentication) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User currentUser = (User) authentication.getPrincipal();
        if (currentUser.getId().equals(id)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "You cannot delete your own account!"));
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully!"));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long totalUsers = userRepository.count();
        long adminCount = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ADMIN)
                .count();
        long recruiterCount = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.RECRUITER)
                .count();
        long candidateCount = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.CANDIDATE)
                .count();

        return ResponseEntity.ok(Map.of(
                "totalUsers", totalUsers,
                "admins", adminCount,
                "recruiters", recruiterCount,
                "candidates", candidateCount
        ));
    }
}

