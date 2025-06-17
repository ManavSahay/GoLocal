package com.pentagon.golocal.service.implementation;

import com.pentagon.golocal.entity.Rating;
import com.pentagon.golocal.repository.RatingRepository;
import com.pentagon.golocal.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RatingServiceImpl implements RatingService {
    @Autowired RatingRepository ratingRepository;

    @Override
    public Rating rateProvider(String username, String bookingId, int ratingValue) {
        Rating rating = ratingRepository.findByBooking(bookingId).orElseThrow(
                () -> new IllegalArgumentException("Not found!")
        );

        if (username.equals(rating.getBooking().getCustomer().getUsername())) {
            return null;
        }

        rating.setRatingByCustomer(ratingValue);

        return ratingRepository.save(rating);
    }

    @Override
    public Rating rateCustomer(String username, String bookingId, int ratingValue) {
        Rating rating = ratingRepository.findByBooking(bookingId).orElseThrow(
                () -> new IllegalArgumentException("Not found!")
        );

        if (username.equals(rating.getBooking().getCustomer().getUsername())) {
            return null;
        }

        rating.setRatingByProvider(ratingValue);

        return ratingRepository.save(rating);
    }
}
