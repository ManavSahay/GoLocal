package com.pentagon.golocal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class BookProvider {
    private String providerId;
    private String location;
    private Date dateTime;
    private float amount;
}
