package com.eventPlatform.backend.controller;

import com.eventPlatform.backend.entity.Event;
import com.eventPlatform.backend.entity.Media;
import com.eventPlatform.backend.repository.EventRepository;
import com.eventPlatform.backend.service.FileStorageService;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class MediaController {

    private final EventRepository eventRepository;
    private final FileStorageService fileStorageService;

    public MediaController(
            EventRepository eventRepository,
            FileStorageService fileStorageService) {

        this.eventRepository = eventRepository;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(
            value = "/{eventId}/media",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> uploadImages(
            @PathVariable Long eventId,
            @RequestParam("files") List<MultipartFile> files) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new RuntimeException("Event not found"));

        try {

            for (MultipartFile file : files) {

                String imageUrl =
                        fileStorageService.store(file);

                Media media = new Media();
                media.setImageUrl(imageUrl);

                event.addMedia(media);
            }

            eventRepository.save(event);

            return ResponseEntity.ok(event);

        } catch (IOException e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload images");
        }
    }
}