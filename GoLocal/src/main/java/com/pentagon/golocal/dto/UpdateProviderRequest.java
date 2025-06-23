package com.pentagon.golocal.dto;

import com.pentagon.golocal.entity.ServiceEntity;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdateProviderRequest {
    private String username;
    private String providerName;
    private String location;
    private Long mobileNumber;
    private String email;
    private String profilePicture;
    private ServiceEntity service;
    private int experience;
    private String description;
}
