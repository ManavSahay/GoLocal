package com.pentagon.golocal.dto;

import com.pentagon.golocal.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenPair {
	private String accessToken;
	private String refreshToken;
	private Role role;
}
