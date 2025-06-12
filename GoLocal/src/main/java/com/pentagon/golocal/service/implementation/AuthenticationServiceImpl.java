package com.pentagon.golocal.service.implementation;

import com.pentagon.golocal.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pentagon.golocal.entity.User;
import com.pentagon.golocal.repository.UserRepository;
import com.pentagon.golocal.service.AuthenticationService;
import com.pentagon.golocal.service.JwtService;
import com.pentagon.golocal.service.UsersRegisterService;

import jakarta.transaction.Transactional;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

	@Autowired private UserRepository userRepository;
	@Autowired private PasswordEncoder passwordEncoder;
	@Autowired private AuthenticationManager authenticationManager;
	@Autowired private JwtService jwtService;
	@Autowired private UsersRegisterService usersRegisterService;

	@Transactional
	public void registerUser(RegisterCustomerRequest registerRequest) {
		if (ifUserExists(registerRequest.getUsername())) {
			throw new IllegalArgumentException("User already exists!");
		}

		User user = new User(registerRequest.getUsername(), passwordEncoder.encode(registerRequest.getPassword()),
				registerRequest.getRole(), false);
		
		userRepository.save(user);
		usersRegisterService.registerCustomer(registerRequest);
	}
	
	@Transactional
	public void registerUser(RegisterProviderRequest registerRequest) {
		if (ifUserExists(registerRequest.getUsername())) {
			throw new IllegalArgumentException("User already exists!");
		}
		
		User user = new User(registerRequest.getUsername(), passwordEncoder.encode(registerRequest.getPassword()),
				registerRequest.getRole(), false);
		
		userRepository.save(user);
		usersRegisterService.registerProvider(registerRequest);
	}

	@Transactional
	public void registerUser(RegisterAdminRequest registerRequest) {
		if (ifUserExists(registerRequest.getUsername())) {
			throw new IllegalArgumentException("User already exists!");
		}

		User user = new User(registerRequest.getUsername(), passwordEncoder.encode(registerRequest.getPassword()),
				registerRequest.getRole(), false);

		userRepository.save(user);
		usersRegisterService.registerAdmin(registerRequest);
	}

	public TokenPair login(LoginRequest loginRequest) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		return jwtService.generateTokenPair(authentication);
	}
	
	private boolean ifUserExists(String username) {
		if (userRepository.existsByUsername(username)) {
			return true;
		}
		return false;
	}

	@Override
	public void deleteUser(String userId) {
		userRepository.deleteById(userId);
	}
}
