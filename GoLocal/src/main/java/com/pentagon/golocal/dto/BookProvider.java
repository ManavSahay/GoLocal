package com.pentagon.golocal.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@AllArgsConstructor
public class BookProvider {
    @NotBlank(message = "Provider Id is required")
    private String providerId;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Date and time is required")
    @DateTimeFormat(pattern = "dd-MM-yyyy HH:mm")
    @Future(message = "The appointment must be in future")
    private Date dateTime;

    @Min(value = 100, message = "The minimum amount must be 100")
    @Max(value = 10000, message = "The maximum amount must be less than 10000")
    private float amount;
}
