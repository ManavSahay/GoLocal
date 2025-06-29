package com.pentagon.golocal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "userauth")
public class User {

	@Id
	@Column(name = "username")
	private String username;

	@Column(name = "password")
	private String password;

	@Column(name = "user_role")
	private Role role;

	@Column(name = "is_deleted")
	private boolean isDeleted;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private List<Token> tokens;

	public User(String username, String password, Role role, boolean isDeleted) {
		this.username = username;
		this.password = password;
		this.role = role;
		this.isDeleted = isDeleted;
	}
}
