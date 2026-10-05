package com.eventPlatform.backend.service;

import com.eventPlatform.backend.DTO.BookingRequest;
import com.eventPlatform.backend.entity.Booking;
import com.eventPlatform.backend.entity.Event;
import com.eventPlatform.backend.entity.TicketType;
import com.eventPlatform.backend.entity.User;
import com.eventPlatform.backend.repository.BookingRepository;
import com.eventPlatform.backend.repository.EventRepository;
import com.eventPlatform.backend.repository.TicketTypeRepository;
import com.eventPlatform.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.eventPlatform.backend.enums.BookingStatus;
import java.time.LocalDateTime;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final TicketTypeRepository ticketTypeRepository;

    public BookingService(BookingRepository bookingRepository, UserRepository userRepository, EventRepository eventRepository, TicketTypeRepository ticketTypeRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.ticketTypeRepository = ticketTypeRepository;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByAttendeeId(userId);
    }

    public List<Booking> getBookingsForOrganizer(Long organizerId) {
        return bookingRepository.findByEventOrganizerId(organizerId);
    }

    public Booking saveBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    @Transactional
    public Booking createBooking(BookingRequest request, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow();

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow();

        TicketType ticketType = ticketTypeRepository.findById(request.getTicketTypeId())
                .orElseThrow();

        if (request.getNumberOfTickets() == null || request.getNumberOfTickets() < 1) {
            throw new IllegalArgumentException("At least one ticket is required");
        }
        if (ticketType.getEvent() == null || !event.getId().equals(ticketType.getEvent().getId())) {
            throw new IllegalArgumentException("Ticket type does not belong to this event");
        }
        if (ticketType.getAvailable() == null || ticketType.getAvailable() < request.getNumberOfTickets()) {
            throw new IllegalArgumentException("Not enough tickets are available");
        }

        ticketType.setAvailable(ticketType.getAvailable() - request.getNumberOfTickets());
        ticketTypeRepository.save(ticketType);

        Booking booking = new Booking();

        booking.setAttendee(user);
        booking.setEvent(event);
        booking.setTicketType(ticketType);
        booking.setNumberOfTickets(request.getNumberOfTickets());
        booking.setTime(LocalDateTime.now());

        double cost = ticketType.getPrice() * request.getNumberOfTickets();
        booking.setTotalCost(cost);

        booking.setBookingStatus(BookingStatus.PENDING);

        return bookingRepository.save(booking);
    }

    public Booking findById(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }
}


