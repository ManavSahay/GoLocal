package com.pentagon.golocal.dto;

import com.pentagon.golocal.entity.ServiceEntity;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdateProviderRequest {

    @NotBlank(message = "Username is required")
    @Pattern(regexp = "A-Za-z\\s]*", message = "Username can consist only Alphabets and Spaces")
    private String username;

    @NotBlank(message = "Provider's name is required")
    @Pattern(regexp = "A-Za-z\\s]*", message = "Provider's name can consist only Alphabets and Spaces")
    private String providerName;

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

    private ServiceEntity service;

    @NotBlank(message = "Experience is required")
    @Min(value = 0, message = "The minimum experience must be greater than or equal to 0")
    @Max(value = 50, message = "The maximum experience must be less than or equal to 50")
    private int experience;

    @NotBlank(message = "Some description is required")
    private String description;
}
