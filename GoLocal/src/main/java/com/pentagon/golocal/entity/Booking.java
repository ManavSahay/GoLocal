package com.pentagon.golocal.entity;

import java.util.Date;
import java.util.List;

import com.pentagon.golocal.entity.Provider;
import jakarta.persistence.*;
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
	
	@JoinColumn(name = "provider_id")
	@ManyToOne
	private Provider provider;
	
	@JoinColumn(name = "customer_id")
	@ManyToOne
	private Customer customer;
	
	@Column(name = "location")
	private String location;
	
	@Column(name = "date_time")
	private Date dateTime;
	
	@Column(name = "amount_paid")
	private float amountPaid;
	
	@Column(name = "type_of_job")
	private String typeOfJob;
	
	@Column(name = "status")
	private BookingStatus status;
}
