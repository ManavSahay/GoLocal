package com.pentagon.golocal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdateCustomerRequest {
    private String username;
    private String customerName;
    private String location;
    private Long mobileNumber;
    private String email;
    private byte[] profilePicture;
}
