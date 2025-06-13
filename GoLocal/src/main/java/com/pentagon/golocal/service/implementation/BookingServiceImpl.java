package com.pentagon.golocal.service.implementation;

import com.pentagon.golocal.dto.BookProvider;
import com.pentagon.golocal.entity.Booking;
import com.pentagon.golocal.entity.BookingStatus;
import com.pentagon.golocal.repository.BookingRepository;
import com.pentagon.golocal.service.BookingService;
import com.pentagon.golocal.service.CustomerService;
import com.pentagon.golocal.service.ProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {
    @Autowired BookingRepository bookingRepository;
    @Autowired ProviderService providerService;
    @Autowired CustomerService customerService;

    @Override
    public List<Booking> getBookedRequests(String username) {
        return bookingRepository.getBookingsByCustomerId(username);
    }

    @Override
    public List<Booking> getBookingRequests(String username) {
        return bookingRepository.getBookingsByProviderId(username);
    }

    @Override
    public String bookService(String username, String typeOfJob, BookProvider bookProvider) {
        SimpleDateFormat format = new SimpleDateFormat("dd-MM-yyyy");
        Booking booking = new Booking();
        String bookingId = username + bookProvider.getProviderId() + format.format(bookProvider.getDateTime());
        booking.setBookingId(bookingId);
        booking.setCustomerId(username);
        booking.setProviderId(bookProvider.getProviderId());
        booking.setLocation(bookProvider.getLocation());
        booking.setDateTime(bookProvider.getDateTime());
        booking.setAmountPaid(bookProvider.getAmount());
        booking.setTypeOfJob(typeOfJob);
        booking.setStatus(BookingStatus.REQUESTED);

        bookingRepository.save(booking);

        return bookingId;
    }

    @Override
    public Booking revokeBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new UsernameNotFoundException("Booking does not exists"));

        if (booking.getStatus() == BookingStatus.REJECTED) {
            return null;
        }

        booking.setStatus(BookingStatus.REVOKED);

        return bookingRepository.save(booking);
    }

    @Override
    public Booking acceptBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new UsernameNotFoundException("Booking does not exists"));

        if (booking.getStatus() == BookingStatus.REVOKED) {
            return null;
        }

        booking.setStatus(BookingStatus.BOOKED);

        return bookingRepository.save(booking);
    }

    @Override
    public Booking rejectBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new UsernameNotFoundException("Booking does not exists"));

        if (booking.getStatus() == BookingStatus.REVOKED) {
            return null;
        }

        booking.setStatus(BookingStatus.REJECTED);

        return bookingRepository.save(booking);
    }

    @Override
    public Booking completeService(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new UsernameNotFoundException("Booking does not exists"));

        if (booking.getStatus() != BookingStatus.BOOKED) {
            return null;
        }

        booking.setStatus(BookingStatus.COMPLETED);
        providerService.increaseNoOfTimesBooked(booking.getProviderId());
        customerService.increateNumberOfBookings(booking.getCustomerId());

        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
