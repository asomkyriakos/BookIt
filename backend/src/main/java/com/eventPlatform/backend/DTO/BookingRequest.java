package com.eventPlatform.backend.DTO;

public class BookingRequest {
    private Long eventId;
    private Long ticketTypeId;
    private Integer numberOfTickets;

    public Long getEventId() {
        return eventId;
    }

    public Long getTicketTypeId() {
        return ticketTypeId;
    }

    public Integer getNumberOfTickets() {
        return numberOfTickets;
    }
}