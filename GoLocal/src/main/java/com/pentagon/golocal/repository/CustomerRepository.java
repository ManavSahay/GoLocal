package com.pentagon.golocal.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pentagon.golocal.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, String> {

}
