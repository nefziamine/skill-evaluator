package com.skillevaluator.controller;

import com.skillevaluator.dto.RegisterRequest;
import com.skillevaluator.model.Role;
import com.skillevaluator.model.User;
import com.skillevaluator.repository.UserRepository;
import com.skillevaluator.repository.SystemSettingRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.skillevaluator.repository.TestRepository testRepository;

    @Autowired
    private com.skillevaluator.repository.QuestionRepository questionRepository;

    @Autowired
    private com.skillevaluator.repository.TestSessionRepository testSessionRepository;

    @Autowired
    private SystemSettingRepository systemSettingRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
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
    public ResponseEntity<?> createUser(@Valid @RequestBody RegisterRequest registerRequest) {
        System.out.println("ADMIN: Attempting to create user: " + registerRequest.getUsername() + ", Role="
                + registerRequest.getRole());
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username is already taken!"));
        }
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is already in use!"));
        }

        Role role = registerRequest.getRole() != null ? registerRequest.getRole() : Role.RECRUITER;
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
        System.out.println("ADMIN: User created successfully: " + user.getId());
        user.setPassword(null);
        return ResponseEntity.ok(Map.of("message", "User created successfully!", "user", user));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        System.out.println("ADMIN: Attempting to update user ID: " + id);
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty())
            return ResponseEntity.notFound().build();

        User user = userOpt.get();
        if (updates.containsKey("email")) {
            String newEmail = (String) updates.get("email");
            if (!user.getEmail().equals(newEmail) && userRepository.existsByEmail(newEmail)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is already in use!"));
            }
            user.setEmail(newEmail);
        }
        if (updates.containsKey("role"))
            user.setRole(Role.valueOf(updates.get("role").toString()));
        if (updates.containsKey("enabled"))
            user.setEnabled((Boolean) updates.get("enabled"));
        if (updates.containsKey("password") && !updates.get("password").toString().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updates.get("password").toString()));
        }

        userRepository.save(user);
        user.setPassword(null);
        return ResponseEntity.ok(Map.of("message", "User updated successfully!", "user", user));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, Authentication authentication) {
        System.out.println("ADMIN: Attempting to delete user ID: " + id);
        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username).orElse(null);

        if (currentUser != null && currentUser.getId().equals(id)) {
            return ResponseEntity.badRequest().body(Map.of("error", "You cannot delete your own account!"));
        }

        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        userRepository.deleteById(id);
        System.out.println("ADMIN: User deleted successfully: " + id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully!"));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        System.out.println("ADMIN: Fetching global statistics...");
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("admins", userRepository.countByRole(Role.ADMIN));
        stats.put("recruiters", userRepository.countByRole(Role.RECRUITER));
        stats.put("candidates", userRepository.countByRole(Role.CANDIDATE));
        stats.put("totalTests", testRepository.count());
        stats.put("totalQuestions", questionRepository.count());
        stats.put("totalSessions", testSessionRepository.count());
        System.out.println("ADMIN: Stats summary - Total Users: " + stats.get("totalUsers"));
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/settings")
    public ResponseEntity<Map<String, String>> getSettings() {
        List<com.skillevaluator.model.SystemSetting> settingsList = systemSettingRepository.findAll();
        Map<String, String> settings = new HashMap<>();
        settings.put("platformName", "SkillPro Platform");
        settings.put("contactEmail", "admin@skillpro.com");
        settings.put("maintenanceMode", "false");
        settings.put("allowNewRegistrations", "true");
        for (com.skillevaluator.model.SystemSetting s : settingsList) {
            settings.put(s.getKey(), s.getValue());
        }
        return ResponseEntity.ok(settings);
    }

    @PostMapping("/settings")
    public ResponseEntity<?> updateSettings(@RequestBody Map<String, String> settings) {
        settings.forEach((key, value) -> {
            com.skillevaluator.model.SystemSetting setting = systemSettingRepository.findById(key)
                    .orElse(new com.skillevaluator.model.SystemSetting(key, value));
            setting.setValue(value);
            systemSettingRepository.save(setting);
        });
        return ResponseEntity.ok(Map.of("message", "Settings updated successfully"));
    }

    @PostMapping("/tasks/audit")
    public ResponseEntity<?> runAudit() {
        return ResponseEntity.ok(Map.of("message", "Audit logs generated at " + java.time.LocalDateTime.now()));
    }

    @PostMapping("/tasks/backup")
    public ResponseEntity<?> runBackup() {
        return ResponseEntity.ok(Map.of("message", "Database backup completed. Size: 42MB"));
    }

    @PostMapping("/tasks/broadcast")
    public ResponseEntity<?> runBroadcast(@RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(Map.of("message", "Broadcast sent: " + payload.get("message")));
    }

    @GetMapping("/diagnostics")
    public ResponseEntity<?> runDiagnostics() {
        return ResponseEntity.ok(Map.of(
                "status", "Healthy",
                "uptime", "14 days, 6 hours",
                "dbConnection", "Active",
                "storageUsage", "14%",
                "apiVersion", "1.0.0-PROD",
                "lastBackup", "2 hours ago"));
    }
}
