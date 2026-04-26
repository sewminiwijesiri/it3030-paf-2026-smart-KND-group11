package com.smartcampus.notification.service;

import com.smartcampus.notification.dto.NotificationDTO;
import com.smartcampus.notification.entity.Notification;
import com.smartcampus.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;

    public void sendAdminNotification(String title, String message, String type, String targetUrl) {
        // Save to DB (optional for admin if you want persistent admin logs)
        Notification notificationEntity = saveNotification("ADMIN", title, message, type, targetUrl);
        
        NotificationDTO notificationDTO = mapToDTO(notificationEntity);
        messagingTemplate.convertAndSend("/topic/admin-notifications", notificationDTO);
    }

    public void sendUserNotification(String userId, String title, String message, String type, String targetUrl) {
        // Save to DB
        Notification notificationEntity = saveNotification(userId, title, message, type, targetUrl);
        
        NotificationDTO notificationDTO = mapToDTO(notificationEntity);
        String destination = "/topic/user/" + userId + "/notifications";
        System.out.println("Sending notification to destination: " + destination);
        messagingTemplate.convertAndSend(destination, notificationDTO);
    }

    private Notification saveNotification(String userId, String title, String message, String type, String targetUrl) {
        Notification notification = Notification.builder()
                .id(UUID.randomUUID().toString())
                .userId(userId)
                .title(title)
                .message(message)
                .type(type)
                .timestamp(LocalDateTime.now())
                .read(false)
                .targetUrl(targetUrl)
                .build();
        return notificationRepository.save(notification);
    }

    private NotificationDTO mapToDTO(Notification entity) {
        return NotificationDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .message(entity.getMessage())
                .type(entity.getType())
                .timestamp(entity.getTimestamp())
                .read(entity.isRead())
                .targetUrl(entity.getTargetUrl())
                .build();
    }
}
