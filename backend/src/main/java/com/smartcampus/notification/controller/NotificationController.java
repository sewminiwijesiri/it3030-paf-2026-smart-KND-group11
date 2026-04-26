package com.smartcampus.notification.controller;

import com.smartcampus.notification.entity.Notification;
import com.smartcampus.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(Authentication authentication) {
        String email = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        List<Notification> results = new ArrayList<>(notificationRepository.findByUserIdOrderByTimestampDesc(email));
        
        if (isAdmin) {
            results.addAll(notificationRepository.findByUserIdOrderByTimestampDesc("ADMIN"));
            results.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));
        }
        
        return ResponseEntity.ok(results);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable String id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        String email = authentication.getName();
        List<Notification> unread = notificationRepository.findByUserIdAndReadOrderByTimestampDesc(email, false);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearNotifications(Authentication authentication) {
        String email = authentication.getName();
        List<Notification> all = notificationRepository.findByUserIdOrderByTimestampDesc(email);
        notificationRepository.deleteAll(all);
        return ResponseEntity.ok().build();
    }
}
