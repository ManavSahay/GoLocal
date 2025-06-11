package com.pentagon.golocal.service.implementation;

import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.pentagon.golocal.entity.User;
import com.pentagon.golocal.repository.UserRepository;
import com.pentagon.golocal.service.CustomUserDetailsService;

@Service
public class CustomUserDetailsServiceImpl implements CustomUserDetailsService {
	@Autowired UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
		return new org.springframework.security.core.userdetails.User(
					user.getUsername(),
					user.getPassword(),
					getAuthority(user)
				);
	}
	
	private Collection<? extends GrantedAuthority> getAuthority(User user) {
		GrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().name());
		return List.of(authority);
	}
}
