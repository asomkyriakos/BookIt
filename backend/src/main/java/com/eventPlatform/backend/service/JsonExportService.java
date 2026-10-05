package com.eventPlatform.backend.service;

import com.eventPlatform.backend.entity.Booking;
import com.eventPlatform.backend.entity.Event;
import com.eventPlatform.backend.entity.Media;
import com.eventPlatform.backend.entity.TicketType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class JsonExportService {

    private final EventService eventService;
    private final ObjectMapper objectMapper;

    public JsonExportService(
            EventService eventService,
            ObjectMapper objectMapper
    ) {
        this.eventService = eventService;
        this.objectMapper = objectMapper;
    }

    public byte[] exportEventsToJson() throws Exception {

        List<Event> events = eventService.getAllEvents();

        ObjectNode root = objectMapper.createObjectNode();

        ArrayNode eventsArray = objectMapper.createArrayNode();

        for (Event event : events) {

            ObjectNode eventNode = objectMapper.createObjectNode();

            // Event
            eventNode.put("EventID", event.getId());
            eventNode.put("Title", event.getTitle());
            eventNode.put("Category", event.getCategory());
            eventNode.put("EventType", event.getEventType());
            eventNode.put("Venue", event.getVenue());
            eventNode.put("Address", event.getAddress());
            eventNode.put("City", event.getCity());
            eventNode.put("Country", event.getCountry());

            // GeoLocation
            if (event.getLatitude() != null &&
                    event.getLongitude() != null) {

                ObjectNode geoLocation =
                        objectMapper.createObjectNode();

                geoLocation.put(
                        "Latitude",
                        event.getLatitude()
                );

                geoLocation.put(
                        "Longitude",
                        event.getLongitude()
                );

                eventNode.set(
                        "GeoLocation",
                        geoLocation
                );
            }

            // Dates
            if (event.getStartDateTime() != null) {
                eventNode.put(
                        "StartDateTime",
                        event.getStartDateTime().toString()
                );
            }

            if (event.getEndDateTime() != null) {
                eventNode.put(
                        "EndDateTime",
                        event.getEndDateTime().toString()
                );
            }

            eventNode.put(
                    "Capacity",
                    event.getCapacity()
            );

            // TicketTypes
            ArrayNode ticketTypes =
                    objectMapper.createArrayNode();

            for (TicketType ticketType : event.getTicketTypes()) {

                ObjectNode ticketNode =
                        objectMapper.createObjectNode();

                ticketNode.put(
                        "TicketTypeID",
                        ticketType.getId()
                );

                ticketNode.put(
                        "Name",
                        ticketType.getName()
                );

                ticketNode.put(
                        "Price",
                        ticketType.getPrice()
                );

                ticketNode.put(
                        "Quantity",
                        ticketType.getQuantity()
                );

                ticketNode.put(
                        "Available",
                        ticketType.getAvailable()
                );

                ticketTypes.add(ticketNode);
            }

            eventNode.set(
                    "TicketTypes",
                    ticketTypes
            );

            // Bookings
            ArrayNode bookings =
                    objectMapper.createArrayNode();

            for (Booking booking : event.getBookings()) {

                ObjectNode bookingNode =
                        objectMapper.createObjectNode();

                bookingNode.put(
                        "BookingID",
                        booking.getId()
                );

                // Attendee
                ObjectNode attendee =
                        objectMapper.createObjectNode();

                if (booking.getAttendee() != null) {
                    attendee.put(
                            "UserID",
                            booking.getAttendee().getId()
                    );
                }

                bookingNode.set(
                        "Attendee",
                        attendee
                );

                // Time
                if (booking.getTime() != null) {
                    bookingNode.put(
                            "Time",
                            booking.getTime().toString()
                    );
                }

                // TicketTypeRef
                if (booking.getTicketType() != null) {
                    bookingNode.put(
                            "TicketTypeRef",
                            booking.getTicketType().getId()
                    );
                }

                bookingNode.put(
                        "NumberOfTickets",
                        booking.getNumberOfTickets()
                );

                bookingNode.put(
                        "TotalCost",
                        booking.getTotalCost()
                );

                if (booking.getBookingStatus() != null) {
                    bookingNode.put(
                            "BookingStatus",
                            booking.getBookingStatus().toString()
                    );
                }

                bookings.add(bookingNode);
            }

            eventNode.set(
                    "Bookings",
                    bookings
            );

            // Organizer
            ObjectNode organizer =
                    objectMapper.createObjectNode();

            if (event.getOrganizer() != null) {
                organizer.put(
                        "UserID",
                        event.getOrganizer().getId()
                );
            }

            eventNode.set(
                    "Organizer",
                    organizer
            );

            // Status
            if (event.getStatus() != null) {
                eventNode.put(
                        "Status",
                        event.getStatus().toString()
                );
            }

            // Description
            eventNode.put(
                    "Description",
                    event.getDescription()
            );

            // Media
            ArrayNode media =
                    objectMapper.createArrayNode();

            for (Media mediaItem : event.getMedia()) {

                if (mediaItem.getImageUrl() != null) {
                    media.add(mediaItem.getImageUrl());
                }
            }

            eventNode.set(
                    "Media",
                    media
            );

            eventsArray.add(eventNode);
        }

        root.set("Events", eventsArray);

        String json = objectMapper
                .writerWithDefaultPrettyPrinter()
                .writeValueAsString(root);

        return json.getBytes(StandardCharsets.UTF_8);
    }
}