package com.eventPlatform.backend.service;

import com.eventPlatform.backend.entity.Booking;
import com.eventPlatform.backend.entity.Event;
import com.eventPlatform.backend.repository.BookingRepository;
import com.eventPlatform.backend.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class XmlExportService {

    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;

    public XmlExportService(
            EventRepository eventRepository,
            BookingRepository bookingRepository
    ) {
        this.eventRepository = eventRepository;
        this.bookingRepository = bookingRepository;
    }

    public byte[] exportEventsToXml() throws Exception {

        // Get all events
        List<Event> events = eventRepository.findAll();

        // Create XML document
        DocumentBuilderFactory factory =
                DocumentBuilderFactory.newInstance();

        DocumentBuilder builder =
                factory.newDocumentBuilder();

        Document document = builder.newDocument();

        // Root: <Events>
        Element eventsElement =
                document.createElement("Events");

        document.appendChild(eventsElement);

        // Every Event
        for (Event event : events) {

            Element eventElement =
                    document.createElement("Event");

            eventElement.setAttribute(
                    "EventID",
                    String.valueOf(event.getId())
            );

            eventsElement.appendChild(eventElement);

            // Title
            addElement(
                    document,
                    eventElement,
                    "Title",
                    event.getTitle()
            );

            // Category
            addElement(
                    document,
                    eventElement,
                    "Category",
                    event.getCategory()
            );

            // EventType
            addElement(
                    document,
                    eventElement,
                    "EventType",
                    event.getEventType()
            );

            // Venue
            addElement(
                    document,
                    eventElement,
                    "Venue",
                    event.getVenue()
            );

            // Address
            addElement(
                    document,
                    eventElement,
                    "Address",
                    event.getAddress()
            );

            // City
            addElement(
                    document,
                    eventElement,
                    "City",
                    event.getCity()
            );

            // Country
            addElement(
                    document,
                    eventElement,
                    "Country",
                    event.getCountry()
            );

            // GeoLocation
            if (event.getLatitude() != null
                    && event.getLongitude() != null) {

                Element geoLocation =
                        document.createElement("GeoLocation");

                geoLocation.setAttribute(
                        "Latitude",
                        String.valueOf(event.getLatitude())
                );

                geoLocation.setAttribute(
                        "Longitude",
                        String.valueOf(event.getLongitude())
                );

                eventElement.appendChild(geoLocation);
            }

            // StartDateTime
            addElement(
                    document,
                    eventElement,
                    "StartDateTime",
                    String.valueOf(event.getStartDateTime())
            );

            // EndDateTime
            addElement(
                    document,
                    eventElement,
                    "EndDateTime",
                    String.valueOf(event.getEndDateTime())
            );

            // Capacity
            addElement(
                    document,
                    eventElement,
                    "Capacity",
                    String.valueOf(event.getCapacity())
            );

            // =========================
            // TICKET TYPES
            // =========================

            Element ticketTypesElement =
                    document.createElement("TicketTypes");

            eventElement.appendChild(ticketTypesElement);

            if (event.getTicketTypes() != null) {

                event.getTicketTypes().forEach(ticketType -> {

                    Element ticketTypeElement =
                            document.createElement("TicketType");

                    ticketTypeElement.setAttribute(
                            "TicketTypeID",
                            String.valueOf(ticketType.getId())
                    );

                    ticketTypesElement.appendChild(
                            ticketTypeElement
                    );

                    addElement(
                            document,
                            ticketTypeElement,
                            "Name",
                            ticketType.getName()
                    );

                    addElement(
                            document,
                            ticketTypeElement,
                            "Price",
                            String.valueOf(ticketType.getPrice())
                    );

                    addElement(
                            document,
                            ticketTypeElement,
                            "Quantity",
                            String.valueOf(ticketType.getQuantity())
                    );

                    addElement(
                            document,
                            ticketTypeElement,
                            "Available",
                            String.valueOf(ticketType.getAvailable())
                    );
                });
            }

            // =========================
            // BOOKINGS
            // =========================

            Element bookingsElement =
                    document.createElement("Bookings");

            eventElement.appendChild(bookingsElement);

            List<Booking> bookings =
                    bookingRepository.findByEventId(event.getId());

            for (Booking booking : bookings) {

                Element bookingElement =
                        document.createElement("Booking");

                bookingElement.setAttribute(
                        "BookingID",
                        String.valueOf(booking.getId())
                );

                bookingsElement.appendChild(
                        bookingElement
                );

                // Attendee
                if (booking.getAttendee() != null) {

                    Element attendeeElement =
                            document.createElement("Attendee");

                    attendeeElement.setAttribute(
                            "UserID",
                            String.valueOf(
                                    booking.getAttendee().getId()
                            )
                    );

                    bookingElement.appendChild(
                            attendeeElement
                    );
                }

                // Time
                addElement(
                        document,
                        bookingElement,
                        "Time",
                        String.valueOf(booking.getTime())
                );

                // TicketTypeRef
                if (booking.getTicketType() != null) {

                    addElement(
                            document,
                            bookingElement,
                            "TicketTypeRef",
                            String.valueOf(
                                    booking.getTicketType().getId()
                            )
                    );
                }

                // NumberOfTickets
                addElement(
                        document,
                        bookingElement,
                        "NumberOfTickets",
                        String.valueOf(
                                booking.getNumberOfTickets()
                        )
                );

                // TotalCost
                addElement(
                        document,
                        bookingElement,
                        "TotalCost",
                        String.valueOf(
                                booking.getTotalCost()
                        )
                );

                // BookingStatus
                addElement(
                        document,
                        bookingElement,
                        "BookingStatus",
                        String.valueOf(
                                booking.getBookingStatus()
                        )
                );
            }

            // =========================
            // ORGANIZER
            // =========================

            if (event.getOrganizer() != null) {

                Element organizerElement =
                        document.createElement("Organizer");

                organizerElement.setAttribute(
                        "UserID",
                        String.valueOf(
                                event.getOrganizer().getId()
                        )
                );

                eventElement.appendChild(
                        organizerElement
                );
            }

            // Status
            addElement(
                    document,
                    eventElement,
                    "Status",
                    String.valueOf(event.getStatus())
            );

            // Description
            addElement(
                    document,
                    eventElement,
                    "Description",
                    event.getDescription()
            );

            // =========================
            // MEDIA
            // =========================

            if (event.getMedia() != null
                    && !event.getMedia().isEmpty()) {

                Element mediaElement =
                        document.createElement("Media");

                eventElement.appendChild(mediaElement);

                event.getMedia().forEach(media -> {

                    Element photoElement =
                            document.createElement("Photo");

                    photoElement.setTextContent(
                            media.getImageUrl()
                    );

                    mediaElement.appendChild(
                            photoElement
                    );
                });
            }
        }

        // =========================
        // TRANSFORM XML
        // =========================

        TransformerFactory transformerFactory =
                TransformerFactory.newInstance();

        Transformer transformer =
                transformerFactory.newTransformer();

        transformer.setOutputProperty(
                OutputKeys.INDENT,
                "yes"
        );

        transformer.setOutputProperty(
                OutputKeys.ENCODING,
                "UTF-8"
        );

        // Attach DTD
        transformer.setOutputProperty(
                OutputKeys.DOCTYPE_SYSTEM,
                "events.dtd"
        );

        ByteArrayOutputStream outputStream =
                new ByteArrayOutputStream();

        transformer.transform(
                new DOMSource(document),
                new StreamResult(outputStream)
        );

        return outputStream.toByteArray();
    }

    // Helper method
    private void addElement(
            Document document,
            Element parent,
            String name,
            String value
    ) {

        Element element =
                document.createElement(name);

        if (value != null) {
            element.setTextContent(value);
        }

        parent.appendChild(element);
    }
}