package com.pentagon.golocal.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ratings")
public class Rating {
	
	@Id
	@Column(name = "rating_id")
	private String ratingId;
	
	@Column(name = "booking_id")
	private String bookingId;
	
	@Column(name = "rating_by_customer")
	private int ratingByCustomer;
	
	@Column(name = "rating_by_provider")
	private int ratingByProvider;

	public Rating() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Rating(String ratingId, String bookingId, int ratingByCustomer, int ratingByProvider) {
		super();
		this.ratingId = ratingId;
		this.bookingId = bookingId;
		this.ratingByCustomer = ratingByCustomer;
		this.ratingByProvider = ratingByProvider;
	}

	public String getRatingId() {
		return ratingId;
	}

	public void setRatingId(String ratingId) {
		this.ratingId = ratingId;
	}

	public String getBookingId() {
		return bookingId;
	}

	public void setBookingId(String bookingId) {
		this.bookingId = bookingId;
	}

	public int getRatingByCustomer() {
		return ratingByCustomer;
	}

	public void setRatingByCustomer(int ratingByCustomer) {
		this.ratingByCustomer = ratingByCustomer;
	}

	public int getRatingByProvider() {
		return ratingByProvider;
	}

	public void setRatingByProvider(int ratingByProvider) {
		this.ratingByProvider = ratingByProvider;
	}
}
