package com.smartcampus.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private String id;
    private String title;
    private String message;
    private String type; // e.g., "BOOKING_CREATED", "MAINTENANCE_REQUEST"
    private LocalDateTime timestamp;
    private boolean read;
    private String targetUrl;
}
