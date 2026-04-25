package com.uniflow.system.service;

import com.uniflow.system.model.User;
import com.uniflow.system.repository.UserRepository;
import com.smartcampus.notification.service.NotificationService;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public AuthService(UserRepository userRepository, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public User register(User user) {
        User savedUser = userRepository.save(user);
        
        // Notify Admins
        try {
            notificationService.sendAdminNotification(
                "New User Registered",
                "A new member has joined: " + user.getName() + " (" + user.getEmail() + ")",
                "USER_REGISTRATION",
                "/admin/users"
            );
        } catch (Exception e) {
            System.err.println("Failed to send registration notification: " + e.getMessage());
        }
        
        return savedUser;
    }

    public Optional<User> login(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getPassword().equals(password)) {
                return Optional.of(user);
            }
        }
        
        return Optional.empty();
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean changePassword(String email, String currentPassword, String newPassword) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getPassword().equals(currentPassword)) {
                user.setPassword(newPassword);
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }

    public boolean updateProfile(String email, String newName) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setName(newName);
            userRepository.save(user);
            return true;
        }
        return false;
    }
}
