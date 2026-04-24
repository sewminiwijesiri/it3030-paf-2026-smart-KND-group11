package com.smartcampus.booking.controller;

import com.smartcampus.booking.entity.Booking;
import com.smartcampus.booking.exception.ResourceNotFoundException;
import com.smartcampus.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public/booking")
@RequiredArgsConstructor
public class PublicBookingController {

    private final BookingRepository bookingRepository;

    @GetMapping("/{id}")
    public ResponseEntity<?> getPublicBookingDetails(@PathVariable String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        // Return only non-sensitive public details
        Map<String, Object> details = new HashMap<>();
        details.put("id", booking.getId());
        details.put("resourceName", booking.getResourceName() != null ? booking.getResourceName() : booking.getResourceId());
        details.put("bookingDate", booking.getBookingDate());
        details.put("startTime", booking.getStartTime());
        details.put("endTime", booking.getEndTime());
        details.put("purpose", booking.getPurpose());
        details.put("expectedAttendees", booking.getExpectedAttendees());
        details.put("status", booking.getStatus());

        return ResponseEntity.ok(details);
    }
}
