package com.eventPlatform.backend.service;

import com.eventPlatform.backend.entity.Event;
import com.eventPlatform.backend.entity.TicketType;
import com.eventPlatform.backend.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public Event saveEvent(Event event) {

        int totalTickets = 0;

        if (event.getTicketTypes() != null) {

            for (TicketType ticketType : event.getTicketTypes()) {
                totalTickets = totalTickets + ticketType.getQuantity();
                ticketType.setEvent(event);
                ticketType.setAvailable(ticketType.getQuantity());
            }
        }
        if (totalTickets > event.getCapacity()) {
            throw new RuntimeException(
                    "Ticket quantity exceeds capacity"
            );
        }

        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    public Event findById(Long id) {
        return eventRepository.findById(id).orElse(null);
    }
}