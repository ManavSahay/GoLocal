package com.pentagon.golocal.entity;

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
}
