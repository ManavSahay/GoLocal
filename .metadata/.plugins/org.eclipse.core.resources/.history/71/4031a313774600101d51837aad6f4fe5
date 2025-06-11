package com.pentagon.golocal.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/try")
public class TryController {
	
	@GetMapping("/hello")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> hello() {
		return ResponseEntity.ok("Hello Admin");
	}
	
	@GetMapping("/hii")
	public ResponseEntity<?> hii() {
		return ResponseEntity.ok("Hii everyone");
	}
}
