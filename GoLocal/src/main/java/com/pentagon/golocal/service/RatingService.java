package com.pentagon.golocal.service;

import com.pentagon.golocal.dto.CreateRating;
import com.pentagon.golocal.entity.Rating;

public interface RatingService {
    Rating rateProvider(String bookingId);
    Rating rateCustomer(String bookingId);

}
