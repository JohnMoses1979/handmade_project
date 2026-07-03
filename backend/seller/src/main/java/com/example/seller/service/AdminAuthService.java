package com.example.seller.service;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class AdminAuthService {

    private static final String ADMIN_EMAIL = "admin@selfbusiness.com";
    private static final String ADMIN_PASSWORD = "admin123";
    private static final String ADMIN_NAME = "Admin";

    public Map<String, Object> login(String email, String password) {
        String normalizedEmail = normalize(email);
        String normalizedPassword = normalize(password);

        if (normalizedEmail.isBlank()) {
            return response(false, "Email is required");
        }
        if (normalizedPassword.isBlank()) {
            return response(false, "Password is required");
        }

        if (!ADMIN_EMAIL.equalsIgnoreCase(normalizedEmail) || !ADMIN_PASSWORD.equals(normalizedPassword)) {
            return response(false, "Invalid admin credentials");
        }

        Map<String, Object> admin = new LinkedHashMap<>();
        admin.put("email", ADMIN_EMAIL);
        admin.put("name", ADMIN_NAME);
        admin.put("role", "admin");

        return response(true, "Login successful", "admin", admin);
    }

    private Map<String, Object> response(boolean success, String message) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("success", success);
        map.put("message", message);
        return map;
    }

    private Map<String, Object> response(boolean success, String message, String key, Object value) {
        Map<String, Object> map = response(success, message);
        map.put(key, value);
        return map;
    }

    private String normalize(Object value) {
        return value == null ? "" : String.valueOf(value).trim();
    }
}
