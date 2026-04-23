package com.smartcampus.booking.repository;

import com.smartcampus.booking.entity.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByUserId(String userId);

    List<Booking> findByResourceIdAndBookingDateAndStatusIn(String resourceId, LocalDate bookingDate, List<String> statuses);

    @Query("{ 'resource_id': ?0, 'booking_date': ?1, 'status': { $in: ['PENDING', 'APPROVED'] }, 'start_time': { $lt: ?3 }, 'end_time': { $gt: ?2 } }")
    List<Booking> findConflictingBookings(String resourceId, LocalDate bookingDate, java.time.LocalTime startTime, java.time.LocalTime endTime);

    @Query(value = "{ 'resource_id': ?0, 'booking_date': ?1, 'status': { $ne: 'CANCELLED' }, 'start_time': { $lt: ?3 }, 'end_time': { $gt: ?2 }, '_id': { $ne: ?4 } }", exists = true)
    boolean existsOverlap(String resourceId, LocalDate date, java.time.LocalTime startTime, java.time.LocalTime endTime, String excludeId);
}
