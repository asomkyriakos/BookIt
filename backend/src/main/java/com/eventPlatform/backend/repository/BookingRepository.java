package com.eventPlatform.backend.repository;

import com.eventPlatform.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByAttendeeId(Long attendeeId);
    List<Booking> findByEventId(Long eventId);
    List<Booking> findByEventOrganizerId(Long organizerId);
}
