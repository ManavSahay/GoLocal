package com.pentagon.golocal.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/bookings/")
public class BookingController {

    @PostMapping("/book-request")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> bookProvider() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(username);
    }

    @PutMapping("/revoke-booking/{bookingId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> revokeBooking(@PathVariable String bookingId) {
        return ResponseEntity.ok(null);
    }

    @PutMapping("/accept-request/{bookingId}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> acceptBooking(@PathVariable String bookingId) {
        return ResponseEntity.ok(null);
    }

    @PutMapping("/reject-request/{bookingId}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> rejectBooking(@PathVariable String bookingId) {
        return ResponseEntity.ok(null);
    }

    @GetMapping("/all-received-requests")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> getAllRequests(@CookieValue("username") String username) {
        return ResponseEntity.ok(null);
    }

}
