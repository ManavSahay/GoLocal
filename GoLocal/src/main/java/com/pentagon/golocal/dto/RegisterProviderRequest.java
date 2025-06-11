package com.pentagon.golocal.dto;

import com.pentagon.golocal.entity.Role;

public class RegisterProviderRequest extends RegisterRequest {
	private String providerName;
	private String location;
	private Long mobileNumber;
	private String email;
	private int rating;
	private byte[] profilePicture;
	private String service;
	private int experience;
	private byte[] description;
	private int noOfTimesBooked;

	public String getCustomerName() {
		return providerName;
	}

	public void setCustomerName(String providerName) {
		this.providerName = providerName;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public Long getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(Long mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public int getRating() {
		return rating;
	}

	public void setRating(int rating) {
		this.rating = rating;
	}

	public byte[] getProfilePicture() {
		return profilePicture;
	}

	public void setProfilePicture(byte[] profilePicture) {
		this.profilePicture = profilePicture;
	}

	public String getService() {
		return service;
	}

	public void setService(String service) {
		this.service = service;
	}

	public int getExperience() {
		return experience;
	}

	public void setExperience(int experience) {
		this.experience = experience;
	}

	public byte[] getDescription() {
		return description;
	}

	public void setDescription(byte[] description) {
		this.description = description;
	}

	public int getNoOfTimesBooked() {
		return noOfTimesBooked;
	}

	public void setNoOfTimesBooked(int noOfTimesBooked) {
		this.noOfTimesBooked = noOfTimesBooked;
	}

	public RegisterProviderRequest(String username, String password, Role role, boolean isDeleted,
			String providerName, String location, Long mobileNumber, String email, int rating, byte[] profilePicture,
			String service, int experience, byte[] description, int noOfTimesBooked) {
		super(username, password, role, isDeleted);
		this.providerName = providerName;
		this.location = location;
		this.mobileNumber = mobileNumber;
		this.email = email;
		this.rating = rating;
		this.profilePicture = profilePicture;
		this.service = service;
		this.experience = experience;
		this.description = description;
		this.noOfTimesBooked = noOfTimesBooked;
	}

}
