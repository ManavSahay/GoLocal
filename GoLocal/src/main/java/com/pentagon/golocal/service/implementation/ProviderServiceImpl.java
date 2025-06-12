package com.pentagon.golocal.service.implementation;

import com.pentagon.golocal.dto.UpdateProviderRequest;
import com.pentagon.golocal.entity.Provider;
import com.pentagon.golocal.repository.ProviderRepository;
import com.pentagon.golocal.repository.UserRepository;
import com.pentagon.golocal.service.ProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class ProviderServiceImpl implements ProviderService {
    @Autowired ProviderRepository providerRepository;
    @Autowired UserRepository userRepository;

    @Override
    public Provider createProvider(Provider provider) {
        if (providerRepository.existsByProviderId(provider.getUsername()) != null) {
            return null;
        }
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
    public Provider deleteProvider(String providerId) {
        if (providerRepository.existsByProviderId(providerId) == null) {
            return null;
        }
        Provider deletedProvider = providerRepository.findById(providerId).orElse(null);
        providerRepository.deleteById(providerId);
        userRepository.deleteById(providerId);
        return deletedProvider;
    }

    @Override
    public Provider updateProvider(UpdateProviderRequest provider) {
        Provider findProvider = providerRepository.findById(provider.getUsername()).orElse(null);

        if (findProvider == null) {
            return null;
        }

        findProvider.setProviderName(provider.getProviderName());
        findProvider.setLocation(provider.getLocation());
        findProvider.setMobileNumber(provider.getMobileNumber());
        findProvider.setEmail(provider.getEmail());
        findProvider.setRating(provider.getRating());
        findProvider.setProfilePicture(provider.getProfilePicture());
        findProvider.setService(provider.getService());
        findProvider.setExperience(provider.getExperience());
        findProvider.setDescription(provider.getDescription().getBytes(StandardCharsets.UTF_8));
        findProvider.setNoOfTimesBooked(provider.getNoOfTimesBooked());

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
}
