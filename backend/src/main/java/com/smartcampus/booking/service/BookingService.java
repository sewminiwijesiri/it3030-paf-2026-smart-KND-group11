package com.smartcampus.booking.service;

import com.smartcampus.booking.dto.BookingRequestDTO;
import com.smartcampus.booking.dto.BookingResponseDTO;
import com.smartcampus.booking.dto.BookingStatusUpdateDTO;
import com.smartcampus.booking.entity.Booking;
import com.smartcampus.booking.enums.BookingStatus;
import com.smartcampus.booking.exception.BookingConflictException;
import com.smartcampus.booking.exception.ResourceNotFoundException;
import com.smartcampus.booking.repository.BookingRepository;
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

    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO request, String userId) {
        if (request.getStartTime().isAfter(request.getEndTime()) || request.getStartTime().equals(request.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

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
            if (bookingRepository.existsOverlap(booking.getResourceId(), booking.getBookingDate(), booking.getStartTime(), booking.getEndTime(), id)) {
                throw new BookingConflictException("The selected resource is already booked for the given time slot.");
            }
        }

        booking.setStatus(statusUpdate.getStatus());
        booking.setReason(statusUpdate.getReason());

        Booking updatedBooking = bookingRepository.save(booking);
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
        bookingRepository.save(booking);
    }

    public boolean hasConflict(String resourceId, LocalDate date, java.time.LocalTime startTime, java.time.LocalTime endTime) {
        return bookingRepository.existsOverlap(resourceId, date, startTime, endTime, null);
    }

    private BookingResponseDTO mapToDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        BeanUtils.copyProperties(booking, dto);
        return dto;
    }
}
