package com.eventPlatform.backend.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.json.JsonMapper;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class EventSerializationTests {

    @Test
    void serializingEventDoesNotRecurseThroughBookingsBackToEvent() throws Exception {
        Event event = new Event();
        event.setTitle("Test Event");
        event.setCategory("Technology");
        event.setEventType("Conference");
        event.setAddress("Athens");
        event.setStartDateTime(LocalDateTime.of(2026, 9, 18, 9, 0));
        event.setEndDateTime(LocalDateTime.of(2026, 9, 18, 18, 0));
        event.setCapacity(100);

        Booking booking = new Booking();
        booking.setNumberOfTickets(2);
        booking.setTotalCost(98.00);
        booking.setEvent(event);
        event.getBookings().add(booking);

        String json = JsonMapper.builder().findAndAddModules().build().writeValueAsString(event);
        JsonNode bookingJson = JsonMapper.builder().build().readTree(json).get("bookings").get(0);

        assertThat(bookingJson.has("event")).isFalse();
        assertThat(json).contains("\"bookings\"");
    }
}
