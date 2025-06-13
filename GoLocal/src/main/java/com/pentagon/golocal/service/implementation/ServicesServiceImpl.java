package com.pentagon.golocal.service.implementation;

import com.pentagon.golocal.dto.RegisterServiceRequest;
import com.pentagon.golocal.entity.ServiceEntity;
import com.pentagon.golocal.repository.ServicesRepository;
import com.pentagon.golocal.service.ServicesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicesServiceImpl implements ServicesService {
    @Autowired ServicesRepository servicesRepository;
    @Override
    public ServiceEntity getServiceById(String serviceId) {
        return servicesRepository.findById(serviceId).orElseThrow(() -> new UsernameNotFoundException("Service doesn't exist"));
    }

    @Override
    public List<ServiceEntity> getAllServices() {
        return servicesRepository.findAll();
    }

    @Override
    public ServiceEntity createService(RegisterServiceRequest registerServiceRequest) {

        if(servicesRepository.existsByServiceId(registerServiceRequest.getServiceId())) {
            return null;
        }

        ServiceEntity service = new ServiceEntity(registerServiceRequest.getServiceId(), registerServiceRequest.getServiceName(), 0);
        servicesRepository.save(service);

        return service;
    }

    @Override
    public ServiceEntity increaseProviderCount(String serviceId) {
        ServiceEntity service = servicesRepository.findById(serviceId).orElse(null);

        if (service == null) {
            return null;
        }

        service.setNoOfProviders(service.getNoOfProviders() + 1);
        return servicesRepository.save(service);
    }

    @Override
    public ServiceEntity decreaseProviderCount(String serviceId) {
        ServiceEntity service = servicesRepository.findById(serviceId).orElse(null);

        if (service == null) {
            return null;
        }

        service.setNoOfProviders(service.getNoOfProviders() - 1);
        return servicesRepository.save(service);
    }
}
