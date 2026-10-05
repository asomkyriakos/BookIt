package com.eventPlatform.backend.entity;

import com.eventPlatform.backend.enums.BookingStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime time;

    private Integer numberOfTickets;

    private Double totalCost;

    @Enumerated(EnumType.STRING)
    private BookingStatus bookingStatus;

    @ManyToOne
    @JoinColumn(name = "attendee_id")
    private User attendee;

    @ManyToOne
    @JoinColumn(name = "ticket_type_id")
    private TicketType ticketType;

    @ManyToOne
    @JoinColumn(name = "event_id")
    @JsonBackReference
    private Event event;

    public Booking() {}

    public Long getId() { return id; }

    public LocalDateTime getTime() { return time; }
    public void setTime(LocalDateTime time) { this.time = time; }

    public Integer getNumberOfTickets() { return numberOfTickets; }
    public void setNumberOfTickets(Integer numberOfTickets) { this.numberOfTickets = numberOfTickets; }

    public Double getTotalCost() { return totalCost; }
    public void setTotalCost(Double totalCost) { this.totalCost = totalCost; }

    public BookingStatus getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(BookingStatus bookingStatus) { this.bookingStatus = bookingStatus; }

    public User getAttendee() { return attendee; }
    public void setAttendee(User attendee) { this.attendee = attendee; }

    public TicketType getTicketType() { return ticketType; }
    public void setTicketType(TicketType ticketType) { this.ticketType = ticketType; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
}
