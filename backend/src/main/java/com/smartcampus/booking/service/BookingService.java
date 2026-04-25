package com.smartcampus.booking.service;

import com.smartcampus.booking.dto.BookingRequestDTO;
import com.smartcampus.booking.dto.BookingResponseDTO;
import com.smartcampus.booking.dto.BookingStatusUpdateDTO;
import com.smartcampus.booking.entity.Booking;
import com.smartcampus.booking.enums.BookingStatus;
import com.smartcampus.booking.exception.BookingConflictException;
import com.smartcampus.booking.exception.ResourceNotFoundException;
import com.smartcampus.booking.repository.BookingRepository;
import com.uniflow.system.catalogue.model.Resource;
import com.uniflow.system.catalogue.repository.ResourceRepository;
import com.smartcampus.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationService notificationService;

    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO request, String userId) {
        if (request.getStartTime().isAfter(request.getEndTime()) || request.getStartTime().equals(request.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        Booking tempBooking = new Booking();
        tempBooking.setResourceId(request.getResourceId());
        tempBooking.setBookingDate(request.getBookingDate());
        tempBooking.setStartTime(request.getStartTime());
        tempBooking.setEndTime(request.getEndTime());
        checkResourceAvailability(tempBooking);

        if (hasConflict(request.getResourceId(), request.getBookingDate(), request.getStartTime(), request.getEndTime())) {
            throw new BookingConflictException("The selected resource is already booked for the given time slot.");
        }

        Booking booking = Booking.builder()
                .userId(userId)
                .resourceId(request.getResourceId())
                .bookingDate(request.getBookingDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .purpose(request.getPurpose())
                .expectedAttendees(request.getExpectedAttendees())
                .status(BookingStatus.PENDING)
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        
        // Send real-time notification to admin
        notificationService.sendAdminNotification(
            "New Resource Booking",
            "A new booking for resource ID " + savedBooking.getResourceId() + " has been created.",
            "BOOKING_CREATED",
            "/admin-bookings"
        );

        return mapToDTO(savedBooking);
    }

    public List<BookingResponseDTO> getUserBookings(String userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<BookingResponseDTO> getAllBookings(String resourceId, BookingStatus status, LocalDate date) {
        return bookingRepository.findAll().stream()
                .filter(b -> resourceId == null || resourceId.equals(b.getResourceId()))
                .filter(b -> status == null || status.equals(b.getStatus()))
                .filter(b -> date == null || date.equals(b.getBookingDate()))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponseDTO updateBookingStatus(String id, BookingStatusUpdateDTO statusUpdate) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (statusUpdate.getStatus() == BookingStatus.APPROVED || statusUpdate.getStatus() == BookingStatus.PENDING) {
            checkResourceAvailability(booking);
            if (bookingRepository.existsOverlap(booking.getResourceId(), booking.getBookingDate(), booking.getStartTime(), booking.getEndTime(), id)) {
                throw new BookingConflictException("The selected resource is already booked for the given time slot.");
            }
        }

        booking.setStatus(statusUpdate.getStatus());
        booking.setReason(statusUpdate.getReason());

        Booking updatedBooking = bookingRepository.save(booking);

        // Send real-time notification to user
        String status = updatedBooking.getStatus().toString();
        String message = "Your booking for resource ID " + updatedBooking.getResourceId() + " has been " + status.toLowerCase();
        if (updatedBooking.getReason() != null && !updatedBooking.getReason().isEmpty()) {
            message += ". Reason: " + updatedBooking.getReason();
        }

        System.out.println("Sending notification to user: " + updatedBooking.getUserId() + " with status: " + status);
        
        notificationService.sendUserNotification(
            updatedBooking.getUserId(),
            "Booking Status Updated",
            message,
            "BOOKING_STATUS_UPDATED",
            "/my-bookings"
        );

        // Also notify admins (for verification and tracking)
        notificationService.sendAdminNotification(
            "Booking Updated",
            "Booking #" + updatedBooking.getId() + " has been " + status.toLowerCase() + " for user " + updatedBooking.getUserId(),
            "BOOKING_UPDATED",
            "/admin-bookings"
        );

        return mapToDTO(updatedBooking);
    }

    @Transactional
    public void cancelBooking(String id, String userId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() != BookingStatus.APPROVED && booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING or APPROVED bookings can be cancelled.");
        }
        
        booking.setStatus(BookingStatus.CANCELLED);
        Booking savedBooking = bookingRepository.save(booking);

        // Send real-time notification to admin
        notificationService.sendAdminNotification(
            "Booking Cancelled",
            "Booking #" + id + " for resource ID " + savedBooking.getResourceId() + " has been cancelled by user " + userId,
            "BOOKING_CANCELLED",
            "/admin-bookings"
        );
    }

    public boolean hasConflict(String resourceId, LocalDate date, java.time.LocalTime startTime, java.time.LocalTime endTime) {
        return bookingRepository.existsOverlap(resourceId, date, startTime, endTime, null);
    }

    public void checkResourceAvailability(Booking booking) {
        Resource resource = resourceRepository.findById(booking.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + booking.getResourceId()));
                
        if (resource.getAvailableDays() == null || resource.getAvailableDays().isEmpty()) {
            return; // No specific availability defined, assume available
        }
        
        String dayOfWeek = booking.getBookingDate().getDayOfWeek().name();
        
        boolean dayAvailable = resource.getAvailableDays().stream()
                .anyMatch(day -> day.equalsIgnoreCase(dayOfWeek) || day.regionMatches(true, 0, dayOfWeek, 0, 3));
                
        if (!dayAvailable) {
            throw new IllegalArgumentException("Resource not available on " + dayOfWeek + ".");
        }
        
        if (resource.getAvailableStartTime() != null && booking.getStartTime().isBefore(resource.getAvailableStartTime())) {
            throw new IllegalArgumentException("Resource is only available from " + resource.getAvailableStartTime() + " to " + resource.getAvailableEndTime());
        }
        
        if (resource.getAvailableEndTime() != null && booking.getEndTime().isAfter(resource.getAvailableEndTime())) {
            throw new IllegalArgumentException("Resource is only available from " + resource.getAvailableStartTime() + " to " + resource.getAvailableEndTime());
        }
    }

    private BookingResponseDTO mapToDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        BeanUtils.copyProperties(booking, dto);
        return dto;
    }
}
