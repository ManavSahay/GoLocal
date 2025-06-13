package com.pentagon.golocal.service;

import com.pentagon.golocal.dto.UpdateCustomerRequest;
import com.pentagon.golocal.entity.Customer;

import java.util.List;

public interface CustomerService {
    Customer createCustomer(Customer customer);
    Customer getCustomer(String customerId);
    List<Customer> getAllCustomers();
    Customer deleteCustomer(String customerId);
    Customer updateCustomer(UpdateCustomerRequest updateCustomerRequest);
    Customer increateNumberOfBookings(String customerId);
}
