package com.eventPlatform.backend.repository;

import com.eventPlatform.backend.entity.EventView;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventViewRepository  extends JpaRepository<EventView, Long> {
    EventView findByUserIdAndEventId(Long userId, Long eventId);
    List<EventView> findByUserId(Long userId);
    List<EventView> findByEventId(Long eventId);
}
