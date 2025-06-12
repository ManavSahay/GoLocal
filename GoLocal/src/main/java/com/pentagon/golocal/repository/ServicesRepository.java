package com.pentagon.golocal.repository;

import com.pentagon.golocal.entity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServicesRepository extends JpaRepository<ServiceEntity, String> {
    boolean existsByServiceId(String serviceId);
}
