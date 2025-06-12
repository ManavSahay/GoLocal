package com.pentagon.golocal.dto;

import com.pentagon.golocal.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisterCustomerRequest extends RegisterRequest {
	private String customerName;
	private String location;
	private Long mobileNumber;
	private String email;
	private byte[] profilePicture;

}
