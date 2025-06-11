package com.pentagon.golocal.dto;

import com.pentagon.golocal.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
	private String username;
	private String password;
	private Role role;
	private boolean isDeleted;
}
