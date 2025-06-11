package com.pentagon.golocal.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

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

	public Booking() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Booking(String bookingId, String providerId, String customerId, String location, Date dateTime,
			float amountPaid, String typeOfJob, boolean status) {
		super();
		this.bookingId = bookingId;
		this.providerId = providerId;
		this.customerId = customerId;
		this.location = location;
		this.dateTime = dateTime;
		this.amountPaid = amountPaid;
		this.typeOfJob = typeOfJob;
		this.status = status;
	}

	public String getBookingId() {
		return bookingId;
	}

	public void setBookingId(String bookingId) {
		this.bookingId = bookingId;
	}

	public String getProviderId() {
		return providerId;
	}

	public void setProviderId(String providerId) {
		this.providerId = providerId;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public Date getDateTime() {
		return dateTime;
	}

	public void setDateTime(Date dateTime) {
		this.dateTime = dateTime;
	}

	public float getAmountPaid() {
		return amountPaid;
	}

	public void setAmountPaid(float amountPaid) {
		this.amountPaid = amountPaid;
	}

	public String getTypeOfJob() {
		return typeOfJob;
	}

	public void setTypeOfJob(String typeOfJob) {
		this.typeOfJob = typeOfJob;
	}

	public boolean isStatus() {
		return status;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}

}
