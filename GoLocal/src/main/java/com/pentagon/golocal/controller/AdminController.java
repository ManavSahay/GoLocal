package com.pentagon.golocal.controller;

import java.util.List;

import com.pentagon.golocal.dto.RegisterServiceRequest;
import com.pentagon.golocal.entity.ServiceEntity;
import com.pentagon.golocal.service.ServicesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.pentagon.golocal.entity.Customer;
import com.pentagon.golocal.entity.User;
import com.pentagon.golocal.repository.CustomerRepository;
import com.pentagon.golocal.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
	@Autowired UserRepository userRepository;
	@Autowired CustomerRepository customerRepository;
	@Autowired ServicesService servicesService;
	
	@GetMapping("/get-users")
	public ResponseEntity<?> getAllUsers() {
		List<User> allUsers = userRepository.findAll();
		return ResponseEntity.ok(allUsers);
	}

	@GetMapping("/get-customers")
	public ResponseEntity<?> getAllCustomers() {
		List<Customer> customers = customerRepository.findAll();
		return ResponseEntity.ok(customers);
	}
	
	@PostMapping("/create-customer")
	public ResponseEntity<?> createCustomer(@RequestParam Customer customer) {
		
		return ResponseEntity.ok(customer);
	}

	@PostMapping("/create-service")
	public ResponseEntity<?> createService(@RequestBody RegisterServiceRequest registerServiceRequest) {
		ServiceEntity service = servicesService.createService(registerServiceRequest);
		if (service == null) {
			return new ResponseEntity<>("Service already exist", HttpStatus.BAD_REQUEST);
		}

		return ResponseEntity.ok(service);
	}

	@GetMapping("/get-service/{serviceId}")
	public ResponseEntity<?> getServiceById(@PathVariable String serviceId) {
		ServiceEntity service = servicesService.getServiceById(serviceId);

		return ResponseEntity.ok(service);
	}

	@GetMapping("/get-service")
	public ResponseEntity<?> getAllServices() {
		List<ServiceEntity> services = servicesService.getAllServices();

		return ResponseEntity.ok(services);
	}

	@GetMapping("/hello")
	public ResponseEntity<?> hello() {
		return ResponseEntity.ok("Hello Admin");
	}
	
	@GetMapping("/hii")
	public ResponseEntity<?> hii() {
		return ResponseEntity.ok("Hii everyone");
	}
}
