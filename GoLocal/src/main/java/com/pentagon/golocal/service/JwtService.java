package com.pentagon.golocal.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import com.pentagon.golocal.dto.TokenPair;

public interface JwtService {
	String generateAccessToken(Authentication authentication);
	String generateRefreshToken(Authentication authentication);
	boolean isValidToken(String token, UserDetails userDetails);
	boolean isRefreshToken(String token);
	String extractUsernameFromToken(String token);
	TokenPair generateTokenPair(Authentication authentication);
}
