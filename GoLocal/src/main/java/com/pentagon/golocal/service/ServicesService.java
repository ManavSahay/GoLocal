package com.pentagon.golocal.service;

import com.pentagon.golocal.dto.RegisterServiceRequest;
import com.pentagon.golocal.entity.ServiceEntity;

import java.util.List;

public interface ServicesService {
    ServiceEntity getServiceById(String serviceId);
    List<ServiceEntity> getAllServices();
    ServiceEntity createService(RegisterServiceRequest registerServiceRequest);
    ServiceEntity increaseProviderCount(String serviceId);
    ServiceEntity decreaseProviderCount(String serviceId);
}
