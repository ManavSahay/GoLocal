package com.pentagon.golocal.controller;

import com.pentagon.golocal.dto.UpdateProviderRequest;
import com.pentagon.golocal.entity.Customer;
import com.pentagon.golocal.entity.Provider;
import com.pentagon.golocal.entity.Rating;
import com.pentagon.golocal.service.ProviderService;
import com.pentagon.golocal.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/provider")
@PreAuthorize("hasRole('PROVIDER')")
public class ProviderController {

    @Autowired private ProviderService providerService;
    @Autowired private RatingService ratingService;

    @PutMapping("/update-provider/{providerId}")
    public ResponseEntity<?> updateProvider(@PathVariable String providerId,
                                            @RequestBody UpdateProviderRequest updateProviderRequest) {
        Provider provider = providerService.updateProvider(providerId, updateProviderRequest);

        return ResponseEntity.ok(provider);
    }

    @PostMapping("/rate-customer/{providerId}/{bookingId}/{ratingValue}")
    public ResponseEntity<?> rateCustomer(@PathVariable String providerId,
                                          @PathVariable String bookingId,
                                          @PathVariable int ratingValue) {
        Rating rating = ratingService.rateCustomer(providerId, bookingId, ratingValue);

        return ResponseEntity.ok(rating);
    }

    @GetMapping("/get-profile/{providerId}")
    public ResponseEntity<?> getProfile(@PathVariable String customerId) {
        Provider provider = providerService.getProvider(customerId);

        return ResponseEntity.ok(provider);
    }
}
