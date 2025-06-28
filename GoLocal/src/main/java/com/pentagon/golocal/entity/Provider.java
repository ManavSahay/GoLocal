package com.pentagon.golocal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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
	private String providerName;
	
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
	
	@JoinColumn(name = "service")
	@ManyToOne
	@JsonProperty("service")
	private ServiceEntity service;
	
	@Column(name = "experience")
	private int experience;
	
	@Lob
	@Column(name = "description", columnDefinition = "BLOB")
	private byte[] description;
	
	@Column(name = "no_of_times_booked")
	private int noOfTimesBooked;

	@OneToMany(mappedBy = "provider", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private List<Booking> bookings;
}
