package com.pentagon.golocal.service.implementation;

import com.pentagon.golocal.dto.UpdateCustomerRequest;
import com.pentagon.golocal.entity.Customer;
import com.pentagon.golocal.repository.CustomerRepository;
import com.pentagon.golocal.repository.UserRepository;
import com.pentagon.golocal.service.CustomerService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {
    @Autowired CustomerRepository customerRepository;
    @Autowired UserRepository userRepository;

    @Override
    @Transactional
    public Customer createCustomer(Customer customer) {
        Customer isExistingCustomer = customerRepository.findById(customer.getUsername()).orElse(null);

        if (isExistingCustomer != null) {
            return null;
        }

        return customerRepository.save(customer);
    }

    @Override
    public Customer getCustomer(String customerId) {
        return customerRepository.findById(customerId).orElseThrow(
                () -> new IllegalArgumentException("Customer does not exist!")
        );
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    @Transactional
    public Customer deleteCustomer(String customerId) {
        Customer deletedCustomer = customerRepository.findById(customerId).orElseThrow(
                () -> new IllegalArgumentException("Customer does not exist!")
        );

        if (deletedCustomer == null) {
            return null;
        }

        customerRepository.deleteById(customerId);
        userRepository.deleteById(customerId);
        return deletedCustomer;
    }

    @Override
    @Transactional
    public Customer updateCustomer(String customerId, UpdateCustomerRequest updateCustomerRequest) {
        Customer updatedCustomer = customerRepository.findById(customerId).orElseThrow(
                () -> new IllegalArgumentException("Customer does not exist!")
        );

        if (updatedCustomer == null) {
            return null;
        }

        updatedCustomer.setCustomerName(updateCustomerRequest.getCustomerName());
        updatedCustomer.setLocation(updateCustomerRequest.getLocation());
        updatedCustomer.setMobileNumber(updateCustomerRequest.getMobileNumber());
        updatedCustomer.setEmail(updateCustomerRequest.getEmail());
        updatedCustomer.setProfilePicture(Base64.getMimeDecoder().decode(updateCustomerRequest.getProfilePicture()));

        return customerRepository.save(updatedCustomer);
    }

    @Override
    @Transactional
    public Customer increateNumberOfBookings(String customerId) {
        Customer customer = customerRepository.findById(customerId).orElse(null);

        if (customer == null) {
            return null;
        }

        customer.setNoOfBookings(customer.getNoOfBookings() + 1);
        return customerRepository.save(customer);
    }

    @Override
    @Transactional
    public void updateRating(String customerId, int rating) {
        Customer customer = customerRepository.findById(customerId).orElseThrow(
                () -> new IllegalArgumentException("Customer not found!")
        );

        customer.setRating(rating);

        customerRepository.save(customer);
    }
}
