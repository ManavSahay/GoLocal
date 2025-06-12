package com.pentagon.golocal.controller;

import com.pentagon.golocal.admin_register.AdminCreationAuthority;
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pentagon.golocal.dto.*;
import com.pentagon.golocal.service.AuthenticationService;
import com.pentagon.golocal.service.UsersRegisterService;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
	@Autowired AuthenticationService authenticationService;
	@Autowired AdminCreationAuthority adminCreationAuthority;
	
	@PostMapping("/register-provider")
	public ResponseEntity<?> registerProvider(@RequestBody RegisterProviderRequest registerRequest) {
		authenticationService.registerUser(registerRequest);
		return ResponseEntity.ok(registerRequest);
	}
	
	@PostMapping("/register-customer")
	public ResponseEntity<?> registerCustomer(@RequestBody RegisterCustomerRequest registerRequest) {
		authenticationService.registerUser(registerRequest);
		return ResponseEntity.ok(registerRequest);
	}

	@PostMapping("/register-admin/{secretKey}")
	public ResponseEntity<?> registerAdmin(@PathVariable String secretKey, @RequestBody RegisterAdminRequest registerRequest) {
		if (!adminCreationAuthority.canCreateAdmin(secretKey)) {
			return new ResponseEntity<>("You cannot create an Admin!", HttpStatus.BAD_REQUEST);
		}
		authenticationService.registerUser(registerRequest);
		return ResponseEntity.ok(registerRequest);
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
		TokenPair tokenPair = authenticationService.login(loginRequest);
		
		if (tokenPair == null) {
			return new ResponseEntity<>("Invalid credentials", HttpStatus.BAD_REQUEST);
		}

		Cookie cookie = new Cookie("username", loginRequest.getUsername());
		
		return ResponseEntity.ok(tokenPair);
	}
}
