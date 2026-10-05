package com.eventPlatform.backend.service;

import com.eventPlatform.backend.entity.Event;
import com.eventPlatform.backend.entity.TicketType;
import com.eventPlatform.backend.repository.EventRepository;
import com.eventPlatform.backend.repository.TicketTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TicketTypeService {

    private final TicketTypeRepository ticketTypeRepository;
    private final EventRepository eventRepository;

    public TicketTypeService(TicketTypeRepository ticketTypeRepository, EventRepository eventRepository) {
        this.ticketTypeRepository = ticketTypeRepository;
        this.eventRepository = eventRepository;
    }

    public TicketType addTicketTypeToEvent(Long eventId, TicketType ticketType) {
        Optional<Event> eventOptional = eventRepository.findById(eventId);

        if (eventOptional.isEmpty()) {
            throw new RuntimeException("Event not found");
        }

        Event event = eventOptional.get();
        ticketType.setEvent(event);
        ticketType.setAvailable(ticketType.getQuantity());

        return ticketTypeRepository.save(ticketType);
    }

    public List<TicketType> getTicketsByEventId(Long eventId) {
        return ticketTypeRepository.findByEventId(eventId);
    }
}