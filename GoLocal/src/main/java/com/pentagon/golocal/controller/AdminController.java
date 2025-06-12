package com.pentagon.golocal.controller;

import java.util.List;

import com.pentagon.golocal.dto.RegisterProviderRequest;
import com.pentagon.golocal.dto.RegisterServiceRequest;
import com.pentagon.golocal.dto.UpdateCustomerRequest;
import com.pentagon.golocal.dto.UpdateProviderRequest;
import com.pentagon.golocal.entity.Provider;
import com.pentagon.golocal.entity.ServiceEntity;
import com.pentagon.golocal.repository.ProviderRepository;
import com.pentagon.golocal.service.CustomerService;
import com.pentagon.golocal.service.ProviderService;
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
	@Autowired CustomerService customerService;
	@Autowired ServicesService servicesService;
	@Autowired ProviderService providerService;
	
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

	@PutMapping("/update-customer")
	public ResponseEntity<?> updateCustomer(@RequestBody UpdateCustomerRequest updateCustomerRequest) {
		Customer updatedCustomer = customerService.updateCustomer(updateCustomerRequest);

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

	@PutMapping("/update-provider")
	public ResponseEntity<?> updateProvider(@RequestBody UpdateProviderRequest updateProviderRequest) {
		Provider updatedProvider = providerService.updateProvider(updateProviderRequest);

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

	@PostMapping("/create-customer")
	public ResponseEntity<?> createCustomer(@RequestBody Customer customer) {
		
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
