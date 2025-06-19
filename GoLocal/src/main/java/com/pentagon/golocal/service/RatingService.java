package com.pentagon.golocal.service;

import com.pentagon.golocal.entity.Rating;

public interface RatingService {
    Rating createRating(String ratingId, String bookingId);
    Rating rateProvider(String username, String bookingId, int ratingValue);
    Rating rateCustomer(String username, String bookingId, int ratingValue);

}
