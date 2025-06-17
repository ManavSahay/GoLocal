package com.pentagon.golocal.controller;

import com.pentagon.golocal.entity.Provider;
import com.pentagon.golocal.service.ProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired private ProviderService providerService;

    @GetMapping("/{providerId}")
    public ResponseEntity<?> getProviderById(@PathVariable String providerId) {
        Provider provider = providerService.getProvider(providerId);

        if (provider == null) {
            return new ResponseEntity<>("Provider not found!", HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok(provider);
    }

    @GetMapping("/search-by-location/{location}")
    public ResponseEntity<?> getProviderByLocation(@PathVariable String location) {
        List<Provider> providers = providerService.getNearbyProviders(location);

        if (providers.isEmpty()) {
            return new ResponseEntity<>("No provider found in " + location, HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok(providers);
    }

    @GetMapping("/search-relevant/{location}/{serviceType}")
    public ResponseEntity<?> getRelevantProviders(@PathVariable String location,
                                                  @PathVariable String serviceType) {
        List<Provider> providers = providerService.getRelevantProvider(location, serviceType);

        if (providers.isEmpty()) {
            return new ResponseEntity<>("No relevant provider found!", HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok(providers);
    }
}
