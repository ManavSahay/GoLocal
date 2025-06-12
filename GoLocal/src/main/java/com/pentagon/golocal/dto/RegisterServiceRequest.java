package com.pentagon.golocal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisterServiceRequest {
    private String serviceId;
    private String serviceName;
}
