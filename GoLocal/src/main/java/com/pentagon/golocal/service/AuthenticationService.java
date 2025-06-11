package com.pentagon.golocal.service;

import com.pentagon.golocal.dto.*;

public interface AuthenticationService {
	void registerUser(RegisterCustomerRequest registerCustomerRequest);
	void registerUser(RegisterProviderRequest registerRequest);
	void registerUser(RegisterAdminRequest registerRequest);
	TokenPair login(LoginRequest loginRequest);
}
