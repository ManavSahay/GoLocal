package com.pentagon.golocal.admin_register;

public interface AdminCreationAuthority {
    boolean canCreateAdmin(String secretKey);
}
