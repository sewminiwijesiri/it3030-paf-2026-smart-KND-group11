package com.smartcampus.booking.dto;

import com.smartcampus.booking.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingStatusUpdateDTO {
    
    @NotNull(message = "Status is required")
    private BookingStatus status;
    
    private String reason;
}
