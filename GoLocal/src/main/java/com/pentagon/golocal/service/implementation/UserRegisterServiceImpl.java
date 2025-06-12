package com.pentagon.golocal.service.implementation;

import com.pentagon.golocal.dto.RegisterAdminRequest;
import com.pentagon.golocal.dto.RegisterRequest;
import com.pentagon.golocal.entity.Admin;
import com.pentagon.golocal.repository.AdminRepository;
import com.pentagon.golocal.service.CustomerService;
import com.pentagon.golocal.service.ProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pentagon.golocal.dto.RegisterCustomerRequest;
import com.pentagon.golocal.dto.RegisterProviderRequest;
import com.pentagon.golocal.entity.Customer;
import com.pentagon.golocal.entity.Provider;
import com.pentagon.golocal.repository.CustomerRepository;
import com.pentagon.golocal.repository.ProviderRepository;
import com.pentagon.golocal.service.UsersRegisterService;

import java.nio.charset.StandardCharsets;

@Service
public class UserRegisterServiceImpl implements UsersRegisterService {
	@Autowired CustomerService customerService;
	@Autowired AdminRepository adminRepository;
	@Autowired ProviderService providerService;

	@Override
	public Customer registerCustomer(RegisterCustomerRequest registerCustomerRequest) {
		Customer customer = new Customer();
		customer.setUsername(registerCustomerRequest.getUsername());
		customer.setCustomerName(registerCustomerRequest.getCustomerName());
		customer.setLocation(registerCustomerRequest.getLocation());
		customer.setMobileNumber(registerCustomerRequest.getMobileNumber());
		customer.setEmail(registerCustomerRequest.getEmail());
		customer.setRating(registerCustomerRequest.getRating());
		customer.setProfilePicture(registerCustomerRequest.getProfilePicture());
		customer.setNoOfBookings(registerCustomerRequest.getNoOfBookings());
		
		return customerService.createCustomer(customer);
	}

	@Override
	public Provider registerProvider(RegisterProviderRequest registerProviderRequest) {
		Provider provider = new Provider();
		provider.setUsername(registerProviderRequest.getUsername());
		provider.setProviderName(registerProviderRequest.getProviderName());
		provider.setLocation(registerProviderRequest.getLocation());
		provider.setMobileNumber(registerProviderRequest.getMobileNumber());
		provider.setEmail(registerProviderRequest.getEmail());
		provider.setRating(registerProviderRequest.getRating());
		provider.setProfilePicture(registerProviderRequest.getProfilePicture());
		provider.setService(registerProviderRequest.getService());
		provider.setExperience(registerProviderRequest.getExperience());
		provider.setDescription(registerProviderRequest.getDescription().getBytes(StandardCharsets.UTF_8));
		provider.setNoOfTimesBooked(registerProviderRequest.getNoOfTimesBooked());

		return providerService.createProvider(provider);
	}

	@Override
	public Admin registerAdmin(RegisterAdminRequest registerRequest) {
		Admin admin = new Admin();
		admin.setAdminId(registerRequest.getUsername());
		admin.setAdminName(registerRequest.getAdminName());
		admin.setAdminPassword(registerRequest.getPassword());

		return adminRepository.save(admin);
	}
}
