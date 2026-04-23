package com.smartcampus.booking.entity;

import com.smartcampus.booking.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    @Field("user_id")
    private String userId;

    @Field("resource_id")
    private String resourceId;

    @Field("resource_name")
    private String resourceName;

    @Field("booking_date")
    private LocalDate bookingDate;

    @Field("start_time")
    private LocalTime startTime;

    @Field("end_time")
    private LocalTime endTime;

    private String purpose;

    @Field("expected_attendees")
    private Integer expectedAttendees;

    private BookingStatus status;

    private String reason;

    @Field("created_at")
    private LocalDateTime createdAt;
}
