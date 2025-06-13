package com.pentagon.golocal.controller;

import com.pentagon.golocal.dto.BookProvider;
import com.pentagon.golocal.entity.Booking;
import com.pentagon.golocal.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api/bookings/")
public class BookingController {
    @Autowired BookingService bookingService;

    @PostMapping("/book-request")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> bookProvider(@RequestParam String typeOfJob, @RequestBody BookProvider bookProvider) {
        String bookingId = bookingService.bookService(getUsername(), typeOfJob, bookProvider);
        return ResponseEntity.ok(bookingId);
    }

    @GetMapping("/get-booked-requests")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getAllBookedServices() {
        List<Booking> bookings = bookingService.getBookedRequests(getUsername());
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/revoke-booking/{bookingId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> revokeBooking(@PathVariable String bookingId) {
        Booking revokedBooking = bookingService.revokeBooking(bookingId);
        return ResponseEntity.ok(revokedBooking);
    }

    @PutMapping("/accept-request/{bookingId}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> acceptBooking(@PathVariable String bookingId) {
        Booking acceptedBooking = bookingService.acceptBooking(bookingId);
        return ResponseEntity.ok(acceptedBooking);
    }

    @PutMapping("/reject-request/{bookingId}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> rejectBooking(@PathVariable String bookingId) {
        Booking rejectedBooking = bookingService.rejectBooking(bookingId);
        return ResponseEntity.ok(rejectedBooking);
    }

    @GetMapping("/all-received-requests")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> getAllRequests() {
        List<Booking> bookings = bookingService.getBookingRequests(getUsername());
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/complete/{bookingId}")
    @PreAuthorize("hasAnyRole('PROVIDER', 'CUSTOMER')")
    public ResponseEntity<?> completeService(@PathVariable String bookingId) {
        Booking completedBooking = bookingService.completeService(bookingId);

        if (completedBooking == null) {
            return new ResponseEntity<>("Request does not exist!", HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok(completedBooking);
    }

    private String getUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

}
