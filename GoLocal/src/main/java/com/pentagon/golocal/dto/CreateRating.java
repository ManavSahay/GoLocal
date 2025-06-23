package com.pentagon.golocal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateRating {
    @NotBlank(message = "The booking id must be provided")
    private String bookingId;

    private int ratingByCustomer;
    private int ratingByProvider;
}
