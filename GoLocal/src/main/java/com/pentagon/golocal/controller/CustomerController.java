package com.pentagon.golocal.controller;

import com.pentagon.golocal.dto.UpdateCustomerRequest;
import com.pentagon.golocal.entity.Booking;
import com.pentagon.golocal.entity.Customer;
import com.pentagon.golocal.entity.Provider;
import com.pentagon.golocal.entity.Rating;
import com.pentagon.golocal.service.BookingService;
import com.pentagon.golocal.service.CustomerService;
import com.pentagon.golocal.service.ProviderService;
import com.pentagon.golocal.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/customer")
@PreAuthorize("hasRole('CUSTOMER')")
public class CustomerController {
    @Autowired private CustomerService customerService;
    @Autowired private RatingService ratingService;
    @Autowired private ProviderService providerService;

    @PutMapping("/update-customer/{customerId}")
    public ResponseEntity<?> updateCustomer(@PathVariable String customerId,
                                            @Valid @RequestBody UpdateCustomerRequest updateCustomerRequest) {
        Customer customer = customerService.updateCustomer(customerId, updateCustomerRequest);
        return ResponseEntity.ok(customer);
    }

    @PostMapping("/rate-provider/{customerId}/{bookingId}/{ratingValue}")
    public ResponseEntity<?> rateProvider(@PathVariable String customerId,
                                          @PathVariable String bookingId,
                                          @PathVariable int ratingValue) {

        Rating rating = ratingService.rateProvider(customerId, bookingId, ratingValue);
        return ResponseEntity.ok(rating);
    }

    @GetMapping("/get-profile/{customerId}")
    public ResponseEntity<?> getProfile(@PathVariable String customerId) {
        Customer customer = customerService.getCustomer(customerId);

        return ResponseEntity.ok(customer);
    }
}
