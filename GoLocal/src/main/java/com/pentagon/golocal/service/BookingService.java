package com.pentagon.golocal.service;

import com.pentagon.golocal.dto.BookProvider;
import com.pentagon.golocal.entity.Booking;

import java.util.List;

public interface BookingService {
    List<Booking> getAllBookings();
    List<Booking> getBookedRequests(String username);
    List<Booking> getBookingRequests(String username);
    String bookService(String username, String typeOfJob, BookProvider bookProvider);
    Booking revokeBooking(String bookingId);
    Booking acceptBooking(String bookingId);
    Booking rejectBooking(String bookingId);
    Booking completeService(String bookingId);
}
