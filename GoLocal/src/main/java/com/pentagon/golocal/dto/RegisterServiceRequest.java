package com.pentagon.golocal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisterServiceRequest {
    @NotBlank(message = "Service id is required")
    @Pattern(regexp = "[A-Z]*", message = "Service id must contain only Capital Alphabets and no spaces")
    private String serviceId;

    @NotBlank(message = "Service name is required")
    @Pattern(regexp = "[A-Za-z\\s]*", message = "Service name can only consist of letters and spaces")
    private String serviceName;
}
