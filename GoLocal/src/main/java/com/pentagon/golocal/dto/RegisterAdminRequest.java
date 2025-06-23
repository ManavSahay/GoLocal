package com.pentagon.golocal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisterAdminRequest extends RegisterRequest {
    @NotBlank(message = "Admin name cannot be blank")
    @Pattern(regexp = "[A-Za-z\\s]*", message = "Admin's name can consist only Alphabets and Spaces")
    private String adminName;
}
