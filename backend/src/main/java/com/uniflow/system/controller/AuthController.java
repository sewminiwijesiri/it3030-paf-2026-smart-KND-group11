package com.uniflow.system.controller;

import com.uniflow.system.model.User;
import com.uniflow.system.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.ok(authService.register(user));
    }

    @PostMapping("/login")
    public Object login(@RequestBody User user) {

        Optional<User> found = authService.login(user.getEmail(), user.getPassword());

        if (found.isPresent()) {
            User u = found.get();

            return Map.of(
                    "message", "Login successful",
                    "email", u.getEmail(),
                    "role", u.getRole());
        }

        return Map.of(
                "message", "Invalid credentials");
    }
}
