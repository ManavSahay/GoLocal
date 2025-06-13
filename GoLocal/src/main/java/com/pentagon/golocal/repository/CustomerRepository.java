package com.pentagon.golocal.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pentagon.golocal.entity.Customer;
import org.springframework.data.jpa.repository.Query;

public interface CustomerRepository extends JpaRepository<Customer, String> {
}
