package com.pentagon.golocal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookProvider {
    private String providerId;
    private String customerId;
    private String location;
    private String dateTime;
    private float amount;
}
