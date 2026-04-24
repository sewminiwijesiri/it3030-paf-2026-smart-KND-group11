package com.smartcampus.booking.controller;

import com.smartcampus.booking.dto.BookingRequestDTO;
import com.smartcampus.booking.dto.BookingResponseDTO;
import com.smartcampus.booking.dto.BookingStatusUpdateDTO;
import com.smartcampus.booking.enums.BookingStatus;
import com.smartcampus.booking.service.BookingService;
import com.smartcampus.booking.service.QRCodeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final QRCodeService qrCodeService;

    // Simulate extracting userId from context
    private String getCurrentUserId() {
        return "1"; // Dummy user ID for demonstration
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<BookingResponseDTO> createBooking(@Valid @RequestBody BookingRequestDTO request) {
        String userId = getCurrentUserId();
        BookingResponseDTO createdBooking = bookingService.createBooking(request, userId);
        return new ResponseEntity<>(createdBooking, HttpStatus.CREATED);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<BookingResponseDTO>> getUserBookings() {
        String userId = getCurrentUserId();
        List<BookingResponseDTO> userBookings = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(userBookings);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings(
            @RequestParam(required = false) String resourceId,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        List<BookingResponseDTO> allBookings = bookingService.getAllBookings(resourceId, status, date);
        return ResponseEntity.ok(allBookings);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponseDTO> updateBookingStatus(
            @PathVariable String id,
            @Valid @RequestBody BookingStatusUpdateDTO statusUpdate) {
        
        BookingResponseDTO updatedBooking = bookingService.updateBookingStatus(id, statusUpdate);
        return ResponseEntity.ok(updatedBooking);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Void> cancelBooking(@PathVariable String id) {
        String userId = getCurrentUserId();
        bookingService.cancelBooking(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/qrcode")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> getQRCode(@PathVariable String id) {
        String base64QRCode = qrCodeService.generateQRCodeBase64(id);
        return ResponseEntity.ok(java.util.Map.of("qrCode", base64QRCode));
    }
}
