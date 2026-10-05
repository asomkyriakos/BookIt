package com.eventPlatform.backend.repository;

import com.eventPlatform.backend.entity.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TicketTypeRepository extends JpaRepository<TicketType, Long> {
    List<TicketType> findByEventId(Long eventId);
}