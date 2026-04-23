package com.smartcampus.booking.dto;

import com.smartcampus.booking.enums.BookingStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class BookingResponseDTO {
    private String id;
    private String userId;
    private String resourceId;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private Integer expectedAttendees;
    private BookingStatus status;
    private String reason;
    private LocalDateTime createdAt;
}
