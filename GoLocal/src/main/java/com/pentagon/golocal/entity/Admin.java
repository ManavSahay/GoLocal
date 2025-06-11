package com.pentagon.golocal.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "AdminDetails")
public class Admin {
    @Id
    @Column
    private String adminId;

    @Column
    private String adminName;

    @Column
    private String adminPassword;
}
