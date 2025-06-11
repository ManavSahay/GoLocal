package com.pentagon.golocal.repository;

import com.pentagon.golocal.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, String> {
}
