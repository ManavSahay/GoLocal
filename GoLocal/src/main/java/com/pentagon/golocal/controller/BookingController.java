package com.pentagon.golocal.controller;

import com.pentagon.golocal.dto.BookProvider;
import com.pentagon.golocal.entity.Booking;
import com.pentagon.golocal.service.BookingService;
import com.pentagon.golocal.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/bookings/")
public class BookingController {
    @Autowired BookingService bookingService;
//    @Autowired RatingService ratingService;

    @PostMapping("/book-request/{typeOfJob}/{customerId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> bookProvider(@PathVariable String customerId, @PathVariable String typeOfJob, @RequestBody BookProvider bookProvider) {
        Booking booking = bookingService.bookService(customerId, typeOfJob, bookProvider);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/get-booked-requests/{customerId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getAllBookedServices(@PathVariable String customerId) {
        List<Booking> bookings = bookingService.getBookedRequests(customerId);
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

    @GetMapping("/all-received-requests/{providerId}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> getAllRequests(@PathVariable String providerId) {
        List<Booking> bookings = bookingService.getBookingRequests(providerId);
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

}
