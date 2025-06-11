package com.pentagon.golocal.admin_register.implementation;

import com.pentagon.golocal.admin_register.AdminCreationAuthority;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AdminCreationAuthorityImpl implements AdminCreationAuthority {
    @Value("${admin.secretKey.secret}")
    private String SECRET_KEY;

    @Override
    public boolean canCreateAdmin(String secretKey) {
        return SECRET_KEY.equals(secretKey);
    }
}
