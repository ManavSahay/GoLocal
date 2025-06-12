package com.pentagon.golocal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisterProviderRequest extends RegisterRequest {
	private String providerName;
	private String location;
	private Long mobileNumber;
	private String email;
	private byte[] profilePicture;
	private String service;
	private int experience;
	private String description;
}
