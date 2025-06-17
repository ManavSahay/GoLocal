package com.pentagon.golocal.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
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
	
	@JoinColumn(name = "booking")
	@OneToOne
	@JsonProperty("booking")
	private Booking booking;
	
	@Column(name = "rating_by_customer")
	private int ratingByCustomer;
	
	@Column(name = "rating_by_provider")
	private int ratingByProvider;
}
