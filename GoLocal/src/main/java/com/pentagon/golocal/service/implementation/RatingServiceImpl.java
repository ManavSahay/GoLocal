package com.pentagon.golocal.service.implementation;

import com.pentagon.golocal.entity.Rating;
import com.pentagon.golocal.repository.RatingRepository;
import com.pentagon.golocal.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;

public class RatingServiceImpl implements RatingService {
    @Autowired RatingRepository ratingRepository;

    @Override
    public Rating rateProvider(String bookingId) {
        return null;
    }

    @Override
    public Rating rateCustomer(String bookingId) {
        return null;
    }
}
