package com.pentagon.golocal.service.implementation;

import com.pentagon.golocal.dto.RegisterServiceRequest;
import com.pentagon.golocal.entity.ServiceEntity;
import com.pentagon.golocal.repository.ServicesRepository;
import com.pentagon.golocal.service.ServicesService;
import jakarta.transaction.Transactional;
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
    @Transactional
    public ServiceEntity createService(RegisterServiceRequest registerServiceRequest) {

        if(servicesRepository.existsByServiceId(registerServiceRequest.getServiceId())) {
            return null;
        }

        ServiceEntity service = new ServiceEntity(registerServiceRequest.getServiceId(), registerServiceRequest.getServiceName(), 0);
        servicesRepository.save(service);

        return service;
    }

    @Override
    @Transactional
    public ServiceEntity increaseProviderCount(ServiceEntity service) {
        service.setNoOfProviders(servicesRepository.getNoOfProviders(service.getServiceId()) + 1);
        return servicesRepository.save(service);
    }

    @Override
    @Transactional
    public ServiceEntity decreaseProviderCount(ServiceEntity service) {
        service.setNoOfProviders(servicesRepository.getNoOfProviders(service.getServiceId()) + 1);
        return servicesRepository.save(service);
    }
}
