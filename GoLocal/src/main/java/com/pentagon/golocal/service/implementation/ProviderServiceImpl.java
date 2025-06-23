package com.pentagon.golocal.service.implementation;

import com.pentagon.golocal.dto.UpdateProviderRequest;
import com.pentagon.golocal.entity.Provider;
import com.pentagon.golocal.entity.Rating;
import com.pentagon.golocal.repository.ProviderRepository;
import com.pentagon.golocal.repository.UserRepository;
import com.pentagon.golocal.service.ProviderService;
import com.pentagon.golocal.service.ServicesService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

@Service
public class ProviderServiceImpl implements ProviderService {
    @Autowired ProviderRepository providerRepository;
    @Autowired UserRepository userRepository;
    @Autowired ServicesService servicesService;

    @Override
    @Transactional
    public Provider createProvider(Provider provider) {
        if (providerRepository.existsByProviderId(provider.getUsername()) != null) {
            return null;
        }

        servicesService.increaseProviderCount(provider.getService());
        return providerRepository.save(provider);
    }

    @Override
    public Provider getProvider(String providerId) {
        return providerRepository.findById(providerId).orElse(null);
    }

    @Override
    public List<Provider> getAllProvider() {
        return providerRepository.findAll();
    }

    @Override
    @Transactional
    public Provider deleteProvider(String providerId) {
        Provider deletedProvider = providerRepository.findById(providerId).orElse(null);

        if (deletedProvider == null) {
            return null;
        }

        servicesService.decreaseProviderCount(deletedProvider.getService());
        providerRepository.deleteById(providerId);
        userRepository.deleteById(providerId);
        return deletedProvider;
    }

    @Override
    @Transactional
    public Provider updateProvider(String providerId, UpdateProviderRequest provider) {
        Provider findProvider = providerRepository.findById(providerId).orElse(null);

        if (findProvider == null) {
            return null;
        }

        findProvider.setProviderName(provider.getProviderName());
        findProvider.setLocation(provider.getLocation());
        findProvider.setMobileNumber(provider.getMobileNumber());
        findProvider.setEmail(provider.getEmail());
        findProvider.setProfilePicture(Base64.getDecoder().decode(provider.getProfilePicture()));
        findProvider.setService(provider.getService());
        findProvider.setExperience(provider.getExperience());
        findProvider.setDescription(provider.getDescription().getBytes(StandardCharsets.UTF_8));

        return providerRepository.save(findProvider);
    }

    @Override
    public List<Provider> getNearbyProviders(String location) {
        return providerRepository.findProviderByLocation(location);
    }

    @Override
    public List<Provider> getRelevantProvider(String location, String serviceName) {
        return providerRepository.findProviderByTypeAndLocation(serviceName, location);
    }

    @Override
    @Transactional
    public Provider increaseNoOfTimesBooked(String providerId) {
        Provider provider = providerRepository.findById(providerId).orElse(null);

        if (provider == null) {
            return null;
        }

        provider.setNoOfTimesBooked(provider.getNoOfTimesBooked() + 1);
        return providerRepository.save(provider);
    }

    @Override
    @Transactional
    public void updateRating(String providerId, int rating) {
        Provider provider = providerRepository.findById(providerId).orElseThrow(
                () -> new IllegalArgumentException("Provider not found!")
        );

        provider.setRating(rating);

        providerRepository.save(provider);
    }
}
