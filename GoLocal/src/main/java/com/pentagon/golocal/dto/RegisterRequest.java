package com.pentagon.golocal.dto;

import com.pentagon.golocal.entity.Role;

import jakarta.validation.constraints.NotBlank;

public class RegisterRequest {
	@NotBlank(message = "Username cannot be blank")
	private String username;
	
	@NotBlank(message = "Password cannot be blank")
	private String password;
	
	private Role role;
	
	private boolean isDeleted;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean isDeleted) {
		this.isDeleted = isDeleted;
	}

	public RegisterRequest(@NotBlank(message = "Username cannot be blank") String username,
			@NotBlank(message = "Password cannot be blank") String password, Role role, boolean isDeleted) {
		super();
		this.username = username;
		this.password = password;
		this.role = role;
		this.isDeleted = isDeleted;
	}

	public RegisterRequest() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	
}
