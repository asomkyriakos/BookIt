package com.eventPlatform.backend.controller;

import com.eventPlatform.backend.entity.Event;
import com.eventPlatform.backend.entity.Media;
import com.eventPlatform.backend.service.*;
import com.eventPlatform.backend.entity.EventView;


import jakarta.transaction.Transactional;

import org.springframework.security.core.Authentication;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpHeaders;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final FileStorageService fileStorageService;
    private final XmlExportService xmlExportService;
    private final JsonExportService jsonExportService;
    private final EventViewService  eventViewService;
    private final UserService userService;

    public EventController(
            EventService eventService,
            FileStorageService fileStorageService,
            XmlExportService xmlExportService,
            JsonExportService jsonExportService,
            EventViewService eventViewService,
            UserService userService) {
        {
            this.eventService = eventService;
            this.fileStorageService = fileStorageService;
            this.xmlExportService = xmlExportService;
            this.jsonExportService = jsonExportService;
            this.eventViewService = eventViewService;
            this.userService = userService;

        }
    }

    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id, Authentication authentication) { //fix for frontend
        if(authentication == null || !authentication.isAuthenticated()){
            throw new RuntimeException("Not logged in");
        }
        Long userId = Long.parseLong(authentication.getName());

        EventView eventView = eventViewService.getEventView(userId,id);
        if(eventView == null){
            EventView newEventView = new EventView(userService.findById(userId) , eventService.findById(id) , 1);
            eventViewService.saveEventView(newEventView);
        }else{
            eventView.setVisitCount(eventView.getVisitCount()+1);
            eventViewService.saveEventView(eventView);
        }

        return eventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(value = "/createEvent", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Event createEvent(
            @RequestPart("event") Event event,
            @RequestPart(value = "files", required = false) //add multiple files
            List<MultipartFile> files
    ) throws IOException {

        if (files != null) {

            for (MultipartFile file : files) {

                if (!file.isEmpty()) {

                    String imageUrl
                            = fileStorageService.store(file);

                    Media media = new Media();

                    media.setImageUrl(imageUrl);
                    media.setEvent(event);

                    event.getMedia().add(media);
                }
            }
        }

        return eventService.saveEvent(event);
    }

    @PatchMapping(
            value = "/editEvent",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Event editEvent(
            @RequestPart("event") Event event,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) throws IOException {

        Event temp = eventService.findById(event.getId());

        if (temp == null) {
            throw new RuntimeException("Event not found");
        }

        if (event.getTitle() != null) {
            temp.setTitle(event.getTitle());
        }

        if (event.getCategory() != null) {
            temp.setCategory(event.getCategory());
        }

        if (event.getEventType() != null) {
            temp.setEventType(event.getEventType());
        }

        if (event.getVenue() != null) {
            temp.setVenue(event.getVenue());
        }

        if (event.getAddress() != null) {
            temp.setAddress(event.getAddress());
        }

        if (event.getCity() != null) {
            temp.setCity(event.getCity());
        }

        if (event.getCountry() != null) {
            temp.setCountry(event.getCountry());
        }

        if (event.getLatitude() != null) {
            temp.setLatitude(event.getLatitude());
        }

        if (event.getLongitude() != null) {
            temp.setLongitude(event.getLongitude());
        }

        if (event.getStartDateTime() != null) {
            temp.setStartDateTime(event.getStartDateTime());
        }

        if (event.getEndDateTime() != null) {
            temp.setEndDateTime(event.getEndDateTime());
        }

        if (event.getCapacity() != null) {
            temp.setCapacity(event.getCapacity());
        }

        if (event.getStatus() != null) {
            temp.setStatus(event.getStatus());
        }

        if (event.getDescription() != null) {
            temp.setDescription(event.getDescription());
        }

        if (event.getOrganizer() != null) {
            temp.setOrganizer(event.getOrganizer());
        }

        if (event.getTicketTypes() != null
                && !event.getTicketTypes().isEmpty()) {

            temp.setTicketTypes(event.getTicketTypes());
        }

        if (event.getBookings() != null
                && !event.getBookings().isEmpty()) {

            temp.setBookings(event.getBookings());
        }

        if (files != null && !files.isEmpty()) {

            // Delete old image files from disk
            for (Media oldMedia : temp.getMedia()) {
                fileStorageService.delete(oldMedia.getImageUrl());
            }

            // Remove old Media entities
            temp.getMedia().clear();

            // Store new images
            for (MultipartFile file : files) {

                if (!file.isEmpty()) {

                    String imageUrl = fileStorageService.store(file);

                    Media media = new Media();
                    media.setImageUrl(imageUrl);
                    media.setEvent(temp);

                    temp.getMedia().add(media);
                }
            }
        }
        return eventService.saveEvent(temp);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {

        eventService.deleteEvent(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export/xml")
    public ResponseEntity<byte[]> exportXml() throws Exception {

        byte[] xml = xmlExportService.exportEventsToXml();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=events.xml"
                )
                .contentType(MediaType.APPLICATION_XML)
                .body(xml);
    }

    @GetMapping("/export/json")
    public ResponseEntity<byte[]> exportJson() throws Exception {

        byte[] json = jsonExportService.exportEventsToJson();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=events.json"
                )
                .contentType(MediaType.APPLICATION_JSON)
                .body(json);

    }
}
