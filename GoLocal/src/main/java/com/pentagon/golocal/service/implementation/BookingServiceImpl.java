package com.pentagon.golocal.service.implementation;

import com.pentagon.golocal.dto.BookProvider;
import com.pentagon.golocal.entity.Booking;
import com.pentagon.golocal.entity.BookingStatus;
import com.pentagon.golocal.repository.BookingRepository;
import com.pentagon.golocal.service.BookingService;
import com.pentagon.golocal.service.CustomerService;
import com.pentagon.golocal.service.ProviderService;
import com.pentagon.golocal.service.RatingService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.awt.print.Book;
import java.text.SimpleDateFormat;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {
    @Autowired private BookingRepository bookingRepository;
    @Autowired private ProviderService providerService;
    @Autowired private CustomerService customerService;
    @Autowired private RatingService ratingService;

    @Override
    public List<Booking> getBookedRequests(String username) {
        return bookingRepository.getBookingsByCustomerId(username);
    }

    @Override
    public List<Booking> getBookingRequests(String username) {
        return bookingRepository.getBookingsByProviderId(username);
    }

    @Override
    @Transactional
    public Booking bookService(String username, String typeOfJob, BookProvider bookProvider) {
        SimpleDateFormat format = new SimpleDateFormat("dd-MM-yyyy");
        Booking booking = new Booking();
        String bookingId = username + bookProvider.getProviderId() + format.format(bookProvider.getDateTime());
        booking.setBookingId(bookingId);
        booking.setCustomer(customerService.getCustomer(username));
        booking.setProvider(providerService.getProvider(bookProvider.getProviderId()));
        booking.setLocation(bookProvider.getLocation());
        booking.setDateTime(bookProvider.getDateTime());
        booking.setAmountPaid(bookProvider.getAmount());
        booking.setTypeOfJob(typeOfJob);
        booking.setStatus(BookingStatus.REQUESTED);

        return bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public Booking revokeBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new UsernameNotFoundException("Booking does not exists"));

        if (booking.getStatus() == BookingStatus.REJECTED) {
            return null;
        }

        booking.setStatus(BookingStatus.REVOKED);

        return bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public Booking acceptBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new UsernameNotFoundException("Booking does not exists"));

        if (booking.getStatus() == BookingStatus.REVOKED) {
            return null;
        }

        booking.setStatus(BookingStatus.BOOKED);
        ratingService.createRating("RAT_" + bookingId, bookingId);

        return bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public Booking rejectBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new UsernameNotFoundException("Booking does not exists"));

        if (booking.getStatus() == BookingStatus.REVOKED) {
            return null;
        }

        booking.setStatus(BookingStatus.REJECTED);

        return bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public Booking completeService(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new UsernameNotFoundException("Booking does not exists"));

        if (booking.getStatus() != BookingStatus.BOOKED) {
            return null;
        }

        booking.setStatus(BookingStatus.COMPLETED);
        providerService.increaseNoOfTimesBooked(booking.getProvider().getUsername());
        customerService.increateNumberOfBookings(booking.getCustomer().getUsername());

        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
