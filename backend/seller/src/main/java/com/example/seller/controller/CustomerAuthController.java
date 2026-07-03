// package com.example.seller.controller;

// import com.example.seller.dto.ForgotPasswordRequest;
// import com.example.seller.dto.LoginRequest;
// import com.example.seller.dto.ResetPasswordRequest;
// import com.example.seller.dto.VerifyOtpRequest;
// import com.example.seller.service.CustomerAuthService;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import java.util.Map;

// @RestController
// @RequestMapping("/api/auth/customer")
// @CrossOrigin(origins = "*")
// public class CustomerAuthController {

//     private final CustomerAuthService customerAuthService;

//     public CustomerAuthController(CustomerAuthService customerAuthService) {
//         this.customerAuthService = customerAuthService;
//     }

//     @PostMapping("/login")
//     public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest req) {
//         return ResponseEntity.ok(customerAuthService.login(req));
//     }

//     @PostMapping("/sync-account")
//     public ResponseEntity<Map<String, Object>> syncAccount(@RequestBody Map<String, Object> payload) {
//         return ResponseEntity.ok(customerAuthService.syncAccount(payload));
//     }

//     @PostMapping("/forgot-password")
//     public ResponseEntity<Map<String, Object>> forgotPassword(@RequestBody ForgotPasswordRequest req) {
//         return ResponseEntity.ok(customerAuthService.forgotPassword(req.getEmail()));
//     }

//     @PostMapping("/verify-otp")
//     public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody VerifyOtpRequest req) {
//         return ResponseEntity.ok(customerAuthService.verifyOtp(req.getEmail(), req.getOtp()));
//     }

//     @PostMapping("/reset-password")
//     public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody ResetPasswordRequest req) {
//         return ResponseEntity.ok(customerAuthService.resetPassword(req));
//     }

//     @PostMapping("/mark-onboarding-seen")
//     public ResponseEntity<Map<String, Object>> markOnboardingSeen(@RequestBody ForgotPasswordRequest req) {
//         return ResponseEntity.ok(customerAuthService.markOnboardingSeen(req.getEmail()));
//     }
// }  

































package com.example.seller.controller;

import com.example.seller.dto.ForgotPasswordRequest;
import com.example.seller.dto.LoginRequest;
import com.example.seller.dto.ResetPasswordRequest;
import com.example.seller.dto.SignupRequest;
import com.example.seller.dto.VerifyOtpRequest;
import com.example.seller.service.CustomerAuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/customer")
@CrossOrigin(origins = "*")
public class CustomerAuthController {

    private final CustomerAuthService customerAuthService;

    public CustomerAuthController(CustomerAuthService customerAuthService) {
        this.customerAuthService = customerAuthService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest req) {
        return ResponseEntity.ok(customerAuthService.login(req));
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody SignupRequest req) {
        return ResponseEntity.ok(customerAuthService.signup(req));
    }

    @PostMapping("/sync-account")
    public ResponseEntity<Map<String, Object>> syncAccount(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(customerAuthService.syncAccount(payload));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@RequestBody ForgotPasswordRequest req) {
        return ResponseEntity.ok(customerAuthService.forgotPassword(req.getEmail()));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody VerifyOtpRequest req) {
        return ResponseEntity.ok(customerAuthService.verifyOtp(req.getEmail(), req.getOtp()));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody ResetPasswordRequest req) {
        return ResponseEntity.ok(customerAuthService.resetPassword(req));
    }

    @PostMapping("/mark-onboarding-seen")
    public ResponseEntity<Map<String, Object>> markOnboardingSeen(@RequestBody ForgotPasswordRequest req) {
        return ResponseEntity.ok(customerAuthService.markOnboardingSeen(req.getEmail()));
    }
}
