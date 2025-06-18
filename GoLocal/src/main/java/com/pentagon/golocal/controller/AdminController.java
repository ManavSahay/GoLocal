package com.pentagon.golocal.controller;

import java.util.List;

import com.pentagon.golocal.dto.*;
import com.pentagon.golocal.entity.*;
import com.pentagon.golocal.repository.ProviderRepository;
import com.pentagon.golocal.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.pentagon.golocal.repository.CustomerRepository;
import com.pentagon.golocal.repository.UserRepository;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
	@Autowired private AuthenticationService authenticationService;
	@Autowired private UserRepository userRepository;
	@Autowired private CustomerService customerService;
	@Autowired private ServicesService servicesService;
	@Autowired private ProviderService providerService;
	@Autowired private BookingService bookingService;
	@Autowired private PasswordEncoder passwordEncoder;
	
	@GetMapping("/get-users")
	public ResponseEntity<?> getAllUsers() {
		List<User> allUsers = userRepository.findAll();
		return ResponseEntity.ok(allUsers);
	}

	@GetMapping("/get-customers")
	public ResponseEntity<?> getAllCustomers() {
		List<Customer> customers = customerService.getAllCustomers();
		return ResponseEntity.ok(customers);
	}

	@GetMapping("/get-customers/{customerId}")
	public ResponseEntity<?> getCustomerById(@PathVariable String customerId) {
		Customer customer = customerService.getCustomer(customerId);

		if (customer == null) {
			return new ResponseEntity<>("Customer does not exists!", HttpStatus.BAD_REQUEST);
		}

		return ResponseEntity.ok(customer);
	}

	@PostMapping("/create-customer")
	public ResponseEntity<?> createCustomer(@RequestBody RegisterCustomerRequest registerRequest) {
		authenticationService.registerUser(registerRequest);
		return ResponseEntity.ok("Customer created!");
	}

	@PutMapping("/update-customer/{customerId}")
	public ResponseEntity<?> updateCustomer(@PathVariable String customerId, @RequestBody UpdateCustomerRequest updateCustomerRequest) {
		Customer updatedCustomer = customerService.updateCustomer(customerId, updateCustomerRequest);

		if (updatedCustomer == null) {
			return new ResponseEntity<>("Customer does not exists!", HttpStatus.BAD_REQUEST);
		}

		return ResponseEntity.ok(updatedCustomer);
	}

	@DeleteMapping("/delete-customer/{customerId}")
	public ResponseEntity<?> deleteCustomer(@PathVariable String customerId) {
		Customer deletedCustomer = customerService.deleteCustomer(customerId);

		if (deletedCustomer == null) {
			return new ResponseEntity<>("Customer does not exists!", HttpStatus.BAD_REQUEST);
		}

		return ResponseEntity.ok(deletedCustomer);
	}

	@GetMapping("/get-providers")
	public ResponseEntity<?> getAllProviders() {
		List<Provider> providers = providerService.getAllProvider();
		return ResponseEntity.ok(providers);
	}

	@GetMapping("/get-providers/{providerId}")
	public ResponseEntity<?> getProviderById(@PathVariable String providerId) {
		Provider provider = providerService.getProvider(providerId);

		if (provider == null) {
			return new ResponseEntity<>("Provider does not exist!", HttpStatus.BAD_REQUEST);
		}

		return ResponseEntity.ok(provider);
	}

	@PostMapping("/create-provider")
	public ResponseEntity<?> registerProvider(@RequestBody RegisterProviderRequest registerRequest) {
		authenticationService.registerUser(registerRequest);
		return ResponseEntity.ok(registerRequest);
	}

	@PutMapping("/update-provider/{providerId}")
	public ResponseEntity<?> updateProvider(@PathVariable String providerId, @RequestBody UpdateProviderRequest updateProviderRequest) {
		Provider updatedProvider = providerService.updateProvider(providerId, updateProviderRequest);

		return ResponseEntity.ok(updatedProvider);
	}

	@DeleteMapping("/delete-provider/{providerId}")
	public ResponseEntity<?> deleteProvider(@PathVariable String providerId) {
		Provider provider = providerService.deleteProvider(providerId);

		return ResponseEntity.ok(provider);
	}

	@GetMapping("/get-provider-location")
	public ResponseEntity<?> getProvidersByLocation(@RequestParam String location) {
		List<Provider> providers = providerService.getNearbyProviders(location);

		if (providers.isEmpty()) {
			return new ResponseEntity<>("No nearby providers found!", HttpStatus.BAD_REQUEST);
		}

		return ResponseEntity.ok(providers);
	}

	@GetMapping("/get-provider-relevant")
	public ResponseEntity<?> getRelevantProviders(@RequestParam String location, @RequestParam String serviceName) {
		List<Provider> providers = providerService.getRelevantProvider(location, serviceName);

		if (providers.isEmpty()) {
			return new ResponseEntity<>("No nearby providers found!", HttpStatus.BAD_REQUEST);
		}

		return ResponseEntity.ok(providers);
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

	@GetMapping("/get-all-bookings")
	public ResponseEntity<?> getAllBookings() {
		List<Booking> bookings = bookingService.getAllBookings();
		return ResponseEntity.ok(bookings);
	}

	@PutMapping("/update-password/{username}/{newPassword}")
	public ResponseEntity<?> updatePassword(@PathVariable String username,
											@PathVariable String newPassword) {
		User user = userRepository.findByUsername(username).orElseThrow(
				() -> new IllegalArgumentException("User does not exist!")
		);

		user.setPassword(passwordEncoder.encode(newPassword));

		userRepository.save(user);

		return ResponseEntity.ok("Password changed");
	}
}
