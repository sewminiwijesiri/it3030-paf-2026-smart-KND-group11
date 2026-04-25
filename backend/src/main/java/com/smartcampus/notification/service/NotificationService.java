package com.smartcampus.notification.service;

import com.smartcampus.notification.dto.NotificationDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendAdminNotification(String title, String message, String type, String targetUrl) {
        NotificationDTO notification = NotificationDTO.builder()
                .id(UUID.randomUUID().toString())
                .title(title)
                .message(message)
                .type(type)
                .timestamp(LocalDateTime.now())
                .read(false)
                .targetUrl(targetUrl)
                .build();

        messagingTemplate.convertAndSend("/topic/admin-notifications", notification);
    }
}
