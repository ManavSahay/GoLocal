package com.pentagon.golocal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateRating {
    private String bookingId;
    private int ratingByCustomer;
    private int ratingByProvider;
}
