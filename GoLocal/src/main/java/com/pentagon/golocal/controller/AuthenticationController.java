package com.pentagon.golocal.controller;

import com.pentagon.golocal.admin_register.AdminCreationAuthority;
import jakarta.servlet.http.Cookie;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.pentagon.golocal.dto.*;
import com.pentagon.golocal.service.AuthenticationService;
import com.pentagon.golocal.service.UsersRegisterService;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/auth")
public class AuthenticationController {
	@Autowired AuthenticationService authenticationService;
	@Autowired AdminCreationAuthority adminCreationAuthority;
	
	@PostMapping("/register-provider")
	public ResponseEntity<?> registerProvider(@Valid @RequestBody RegisterProviderRequest registerRequest) {
		authenticationService.registerUser(registerRequest);
		return ResponseEntity.ok(registerRequest);
	}
	
	@PostMapping("/register-customer")
	public ResponseEntity<?> registerCustomer(@Valid @RequestBody RegisterCustomerRequest registerRequest) {
		authenticationService.registerUser(registerRequest);
		return ResponseEntity.ok(registerRequest);
	}

	@PostMapping("/register-admin/{secretKey}")
	public ResponseEntity<?> registerAdmin(@PathVariable String secretKey,@Valid  @RequestBody RegisterAdminRequest registerRequest) {
		if (!adminCreationAuthority.canCreateAdmin(secretKey)) {
			return new ResponseEntity<>("You cannot create an Admin!", HttpStatus.BAD_REQUEST);
		}
		authenticationService.registerUser(registerRequest);
		return ResponseEntity.ok(registerRequest);
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
		TokenPair tokenPair = authenticationService.login(loginRequest);
		
		if (tokenPair == null) {
			return new ResponseEntity<>("Invalid credentials", HttpStatus.BAD_REQUEST);
		}

		return ResponseEntity.ok(tokenPair);
	}

	@GetMapping("/me")
	public ResponseEntity<?> getMyUsername() {
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		return ResponseEntity.ok(username);
	}
}
