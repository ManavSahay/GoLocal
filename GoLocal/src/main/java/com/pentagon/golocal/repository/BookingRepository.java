package com.pentagon.golocal.repository;

import com.pentagon.golocal.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, String> {

    @Query(value = "select * from bookings " +
            "where provider_id = ?1", nativeQuery = true)
    List<Booking> getBookingsByProviderId(String providerId);

    @Query(value = "select * from bookings " +
            "where customer_id = ?1", nativeQuery = true)
    List<Booking> getBookingsByCustomerId(String customerId);

}
