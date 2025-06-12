package com.pentagon.golocal.service;

import com.pentagon.golocal.dto.UpdateProviderRequest;
import com.pentagon.golocal.entity.Provider;

import java.util.List;

public interface ProviderService {
    Provider createProvider(Provider provider);
    Provider getProvider(String providerId);
    List<Provider> getAllProvider();
    Provider deleteProvider(String providerId);
    Provider updateProvider(UpdateProviderRequest updateProviderRequest);
    List<Provider> getNearbyProviders(String location);
    List<Provider> getRelevantProvider(String location, String serviceId);
}
