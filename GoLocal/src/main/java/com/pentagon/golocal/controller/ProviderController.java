package com.pentagon.golocal.controller;

import com.pentagon.golocal.dto.UpdateProviderRequest;
import com.pentagon.golocal.entity.Provider;
import com.pentagon.golocal.entity.Rating;
import com.pentagon.golocal.service.ProviderService;
import com.pentagon.golocal.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/provider")
@PreAuthorize("hasRole('PROVIDER')")
public class ProviderController {

    @Autowired private ProviderService providerService;
    @Autowired private RatingService ratingService;

    @PutMapping("/update-provider/{providerId}")
    public ResponseEntity<?> updateProvider(@PathVariable String providerId,
                                            @Valid @RequestBody UpdateProviderRequest updateProviderRequest) {
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
    public ResponseEntity<?> getProfile(@PathVariable String providerId) {
        Provider provider = providerService.getProvider(providerId);

        return ResponseEntity.ok(provider);
    }
}
