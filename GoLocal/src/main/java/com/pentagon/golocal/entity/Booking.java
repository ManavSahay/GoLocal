package com.pentagon.golocal.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "bookings")
public class Booking {
	
	@Id
	@Column(name = "booking_id")
	private String bookingId;
	
	@Column(name = "provider_id")
	private String providerId;
	
	@Column(name = "customer_id")
	private String customerId;
	
	@Column(name = "location")
	private String location;
	
	@Column(name = "date_time")
	private Date dateTime;
	
	@Column(name = "amount_paid")
	private float amountPaid;
	
	@Column(name = "type_of_job")
	private String typeOfJob;
	
	@Column(name = "status")
	private boolean status;
}
