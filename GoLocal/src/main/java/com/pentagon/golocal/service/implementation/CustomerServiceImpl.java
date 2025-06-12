package com.pentagon.golocal.service.implementation;

import com.pentagon.golocal.dto.UpdateCustomerRequest;
import com.pentagon.golocal.entity.Customer;
import com.pentagon.golocal.repository.CustomerRepository;
import com.pentagon.golocal.repository.UserRepository;
import com.pentagon.golocal.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {
    @Autowired CustomerRepository customerRepository;
    @Autowired UserRepository userRepository;

    @Override
    public Customer createCustomer(Customer customer) {
        if (customerRepository.findById(customer.getUsername()).orElse(null) != null) {
            return null;
        }

        return customerRepository.save(customer);
    }

    @Override
    public Customer getCustomer(String customerId) {
        return customerRepository.findById(customerId).orElse(null);
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public Customer deleteCustomer(String customerId) {
        Customer deletedCustomer = customerRepository.findById(customerId).orElse(null);

        if (deletedCustomer == null) {
            return null;
        }

        customerRepository.deleteById(customerId);
        userRepository.deleteById(customerId);
        return deletedCustomer;
    }

    @Override
    public Customer updateCustomer(UpdateCustomerRequest updateCustomerRequest) {
        Customer updatedCustomer = customerRepository.findById(updateCustomerRequest.getUsername()).orElse(null);

        if (updatedCustomer == null) {
            return null;
        }

        updatedCustomer.setCustomerName(updateCustomerRequest.getCustomerName());
        updatedCustomer.setLocation(updateCustomerRequest.getLocation());
        updatedCustomer.setMobileNumber(updateCustomerRequest.getMobileNumber());
        updatedCustomer.setEmail(updateCustomerRequest.getEmail());
        updatedCustomer.setProfilePicture(updateCustomerRequest.getProfilePicture());

        return customerRepository.save(updatedCustomer);
    }
}
