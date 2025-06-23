package com.pentagon.golocal.dto;

import com.pentagon.golocal.entity.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisterCustomerRequest extends RegisterRequest {
	@NotBlank(message = "Customer's name is required")
	@Pattern(regexp = "[A-Za-z\\s]*", message = "Customer's name can consist only Alphabets and Spaces only")
	private String customerName;

	@NotBlank(message = "Location is required")
	@Pattern(regexp = "[A-Za-z\\s]*", message = "Location can only consist of letters and spaces")
	private String location;

	@NotBlank(message = "Mobile number is required")
	@Pattern(regexp = "[1-9][0-9]{9}", message = "Invalid mobile number")
	private Long mobileNumber;

	@NotBlank(message = "Email is required")
	@Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}$", message = "Invalid email id")
	private String email;

	@NotBlank(message = "Profile picture is needed")
	private String profilePicture;

}
