package com.pentagon.golocal.repository;

import com.pentagon.golocal.dto.CreateRating;
import com.pentagon.golocal.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, String> {

    @Query(value = "select rating_by_customer " +
            "from ratings r inner join bookings b " +
            "on r.booking_id = b.booking_id " +
            "where b.provider_id = ?1 ", nativeQuery = true)
    List<Integer> getRatingsByCustomerId(String providerId);

    @Query(value = "select rating_by_provider " +
            "from ratings r inner join bookings b " +
            "on r.booking_id = b.booking_id " +
            "where b.customer_id = ?1", nativeQuery = true)
    List<Integer> getRatingsByProviderId(String customerId);

    @Query(value = "select booking_id, rating_by_customer, rating_by_provider " +
            "from ratings r inner join bookings b " +
            "on r.booking_id = b.booking_id " +
            "where booking_id = ?1", nativeQuery = true)
    CreateRating isBothRatingsProvided(String bookingId);
}
