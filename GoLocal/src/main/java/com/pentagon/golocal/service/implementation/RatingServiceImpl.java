package com.pentagon.golocal.service.implementation;

import com.pentagon.golocal.entity.Customer;
import com.pentagon.golocal.entity.Provider;
import com.pentagon.golocal.entity.Rating;
import com.pentagon.golocal.repository.BookingRepository;
import com.pentagon.golocal.repository.RatingRepository;
import com.pentagon.golocal.service.BookingService;
import com.pentagon.golocal.service.CustomerService;
import com.pentagon.golocal.service.ProviderService;
import com.pentagon.golocal.service.RatingService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RatingServiceImpl implements RatingService {
    @Autowired private RatingRepository ratingRepository;
    @Autowired private CustomerService customerService;
    @Autowired private ProviderService providerService;
    @Autowired private BookingRepository bookingRepository;

    @Override
    @Transactional
    public Rating rateProvider(String username, String bookingId, int ratingValue) {
        Rating rating = ratingRepository.findByBooking(bookingId).orElseThrow(
                () -> new IllegalArgumentException("Not found!")
        );

        Provider provider = rating.getBooking().getProvider();

        if (username.equals(provider.getUsername())) {
            return null;
        }

        rating.setRatingByCustomer(ratingValue);

        Rating addedRating = ratingRepository.save(rating);

        List<Integer> ratings = ratingRepository.getRatingsByProviderId(provider.getUsername());

        if (ratings.isEmpty()) {
            providerService.updateRating(provider.getUsername(), ratingValue);
            return addedRating;
        }

        int averageRatingUpdated = ratings.stream()
                .reduce(Integer::sum)
                .orElse(0);

        providerService.updateRating(provider.getUsername(), averageRatingUpdated / ratings.size());

        return addedRating;
    }

    @Override
    @Transactional
    public Rating rateCustomer(String username, String bookingId, int ratingValue) {
        Rating rating = ratingRepository.findByBooking(bookingId).orElseThrow(
                () -> new IllegalArgumentException("Not found!")
        );

        Customer customer = rating.getBooking().getCustomer();

        if (username.equals(customer.getUsername())) {
            return null;
        }

        rating.setRatingByProvider(ratingValue);

        Rating addedRating = ratingRepository.save(rating);

        List<Integer> ratings = ratingRepository.getRatingsByCustomerId(customer.getUsername());

        if (ratings.isEmpty()) {
            customerService.updateRating(customer.getUsername(), ratingValue);
            return addedRating;
        }

        int averageRatingUpdated = ratings.stream()
                .reduce(Integer::sum)
                .orElse(0);

        customerService.updateRating(customer.getUsername(), averageRatingUpdated / ratings.size());

        return addedRating;
    }

    @Override
    @Transactional
    public Rating createRating(String ratingId, String bookingId) {
        Rating rating = new Rating();
        rating.setRatingId(ratingId);
        rating.setBooking(bookingRepository.findById(bookingId).orElseThrow(
                () -> new IllegalArgumentException("Booking not found!")
        ));

        return ratingRepository.save(rating);
    }
}
