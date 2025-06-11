package com.pentagon.golocal.service;

import com.pentagon.golocal.dto.RegisterCustomerRequest;
import com.pentagon.golocal.dto.RegisterProviderRequest;
import com.pentagon.golocal.entity.Customer;
import com.pentagon.golocal.entity.Provider;

public interface UsersRegisterService {
	Customer registerCustomer(RegisterCustomerRequest registerCustomerRequest);
	Provider registerProvider(RegisterProviderRequest registerProviderRequest);
}
