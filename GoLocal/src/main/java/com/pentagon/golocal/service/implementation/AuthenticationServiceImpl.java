package com.pentagon.golocal.service.implementation;

import com.pentagon.golocal.dto.*;
import com.pentagon.golocal.entity.Token;
import com.pentagon.golocal.repository.TokenRepository;
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

import java.util.List;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

	@Autowired private UserRepository userRepository;
	@Autowired private PasswordEncoder passwordEncoder;
	@Autowired private AuthenticationManager authenticationManager;
	@Autowired private JwtService jwtService;
	@Autowired private UsersRegisterService usersRegisterService;
	@Autowired private TokenRepository tokenRepository;

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
		User user = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName())
				.orElseThrow(
						() -> new IllegalArgumentException("User not found!")
				);

		TokenPair tokenPair = jwtService.generateTokenPair(authentication, user.getRole());


		revokeAllTokensFromUser(user);

		saveUserToken(tokenPair, user);

		return tokenPair;
	}

	private boolean ifUserExists(String username) {
		return userRepository.existsByUsername(username);
    }

	@Override
	public void deleteUser(String userId) {
		userRepository.deleteById(userId);
	}

	private void saveUserToken(TokenPair tokenPair, User user) {
		Token token = new Token();
		token.setToken(tokenPair.getAccessToken());
		token.setLoggedOut(false);
		token.setUser(user);

		tokenRepository.save(token);
	}

	private void revokeAllTokensFromUser(User user) {
		List<Token> validTokenListByUser = tokenRepository.findAllTokenByUser(user.getUsername());

		if (!validTokenListByUser.isEmpty()) {
			validTokenListByUser.forEach( t ->
					t.setLoggedOut(true)
			);
		}

		tokenRepository.saveAll(validTokenListByUser);
	}
}
