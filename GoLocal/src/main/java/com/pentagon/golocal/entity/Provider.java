package com.pentagon.golocal.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "service_provider")
public class Provider {
	
	@Id
	@Column(name = "provider_id")
	private String username;
	
	@Column(name = "provider_name")
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
	@Column(name = "profile_picture", columnDefinition = "BLOB")
	private byte[] profilePicture;
	
	@Column(name = "service")
	private String service;
	
	@Column(name = "experience")
	private int experience;
	
	@Lob
	@Column(name = "description", columnDefinition = "BLOB")
	private byte[] description;
	
	@Column(name = "no_of_times_booked")
	private int noOfTimesBooked;
}
