package com.eventPlatform.backend.controller;

import com.eventPlatform.backend.DTO.BookingRequest;
import com.eventPlatform.backend.entity.Booking;
import com.eventPlatform.backend.enums.BookingStatus;
import com.eventPlatform.backend.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/Booking")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public List<Booking> getAllEvents() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/myBookings")
    public List<Booking> getMyBookings(Authentication authentication) {
        if(authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Not logged in");
        }
        Long userId = Long.parseLong(authentication.getName());


        return bookingService.getBookingsByUser(userId);
    }

    @GetMapping("/organiserBookings")
    public List<Booking> getOrganiserBookings(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Not logged in");
        }

        Long organizerId = Long.parseLong(authentication.getName());
        return bookingService.getBookingsForOrganizer(organizerId);
    }

    @PostMapping("/createBooking")
    public Booking createBooking(@RequestBody BookingRequest request,Authentication authentication) {
        if(authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Not logged in");
        }
        Long userId = Long.parseLong(authentication.getName());

        return bookingService.createBooking(request, userId);
    }


    @PatchMapping("/{id}/status")
    public ResponseEntity<Booking> editBookingStatus(@PathVariable Long id, @RequestBody BookingStatus bookingStatus, Authentication authentication) {

        if(authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        Booking booking = bookingService.findById(id);
        if(booking == null) {
            return ResponseEntity.notFound().build();
        }

        Long organizerId = Long.parseLong(authentication.getName());
        if (booking.getEvent() == null || booking.getEvent().getOrganizer() == null
                || !organizerId.equals(booking.getEvent().getOrganizer().getId())) {
            return ResponseEntity.status(403).build();
        }

        booking.setBookingStatus(bookingStatus);
        return ResponseEntity.ok(bookingService.saveBooking(booking));
    }

}
