package com.pentagon.golocal.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pentagon.golocal.entity.Provider;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProviderRepository extends JpaRepository<Provider, String> {
    @Query(value = "select * from service_provider where provider_id=?1", nativeQuery = true)
    Provider existsByProviderId(String providerId);

    @Query(value = "select * from service_provider where location=?1", nativeQuery = true)
    List<Provider> findProviderByLocation(String location);

    @Query(value = "select sp.* " +
            "from service_provider sp inner join services_types st " +
            "on sp.service = st.service_id " +
            "where st.service_name = ?1 and sp.location = ?2", nativeQuery = true)
    List<Provider> findProviderByTypeAndLocation(String serviceName, String location);
}
