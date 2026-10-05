package com.eventPlatform.backend.service;

import com.eventPlatform.backend.entity.EventView;
import com.eventPlatform.backend.entity.User;
import com.eventPlatform.backend.repository.EventViewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventViewService {
    private final EventViewRepository eventViewRepository;

    public EventViewService(EventViewRepository eventViewRepository) {
        this.eventViewRepository = eventViewRepository;
    }

    public EventView getEventView(Long userId,Long eventId) {
        return eventViewRepository.findByUserIdAndEventId(userId,eventId);
    }

    public List<EventView> findByUserId(Long userId) {
        return eventViewRepository.findByUserId(userId);
    }
    public List<EventView> findByEventId(Long eventId) {
        return eventViewRepository.findByEventId(eventId);
    }

    public EventView saveEventView(EventView eventView) {
        return eventViewRepository.save(eventView);
    }



}
