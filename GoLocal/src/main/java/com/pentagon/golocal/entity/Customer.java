package com.pentagon.golocal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Customer")
public class Customer {

	@Id
	@Column(name = "customer_id")
	private String username;

	@Column(name = "customer_name")
	private String customerName;

	@Column(name = "location")
	private String location;

	@Column(name = "mobile_number")
	private Long mobileNumber;

	@Column(name = "email_id")
	private String email;

	@Column(name = "rating")
	private int rating;

	@Lob
	@Column(name = "profile_picture", columnDefinition = "MEDIUMBLOB")
	private byte[] profilePicture;

	@Column(name = "no_of_bookings")
	private int noOfBookings;

//	@OneToMany
//	@JoinColumn(name = "bookings")
//	@JsonIgnore
//	private List<Booking> bookings;

}
