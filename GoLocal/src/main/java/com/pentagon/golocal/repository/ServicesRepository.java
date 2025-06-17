package com.pentagon.golocal.repository;

import com.pentagon.golocal.entity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ServicesRepository extends JpaRepository<ServiceEntity, String> {
    boolean existsByServiceId(String serviceId);

    @Query(value = "select no_of_providers " +
            "from services_types " +
            "where service_id = ?1", nativeQuery = true)
    int getNoOfProviders(String serviceId);
}
