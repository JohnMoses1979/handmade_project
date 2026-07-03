// package com.example.seller.service;

// import com.example.seller.dto.LoginRequest;
// import com.example.seller.dto.ResetPasswordRequest;
// import com.example.seller.entity.CustomerAccount;
// import com.example.seller.repository.CustomerAccountRepository;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import java.security.SecureRandom;
// import java.time.LocalDateTime;
// import java.util.LinkedHashMap;
// import java.util.Map;
// import java.util.Optional;

// @Service
// public class CustomerAuthService {

//     private static final SecureRandom OTP_RANDOM = new SecureRandom();

//     private final CustomerAccountRepository customerAccountRepository;
//     private final PasswordEncoder passwordEncoder;
//     private final EmailService emailService;

//     public CustomerAuthService(
//             CustomerAccountRepository customerAccountRepository,
//             PasswordEncoder passwordEncoder,
//             EmailService emailService
//     ) {
//         this.customerAccountRepository = customerAccountRepository;
//         this.passwordEncoder = passwordEncoder;
//         this.emailService = emailService;
//     }

//     public Map<String, Object> login(LoginRequest req) {
//         String email = normalizeEmail(req == null ? null : req.getEmail());
//         String password = req == null ? "" : asString(req.getPassword());
//         if (email.isBlank()) {
//             return response(false, "Email is required");
//         }
//         if (password.isBlank()) {
//             return response(false, "Password is required");
//         }

//         Optional<CustomerAccount> optionalAccount = customerAccountRepository.findByEmailIgnoreCase(email);
//         CustomerAccount account = optionalAccount.orElseGet(CustomerAccount::new);
//         boolean isNewAccount = account.getId() == null;

//         account.setEmail(email);

//         if (isNewAccount || account.getPassword() == null || account.getPassword().isBlank()) {
//             account.setPassword(passwordEncoder.encode(password));
//             account.setOnboardingSeen(false);
//             customerAccountRepository.save(account);
//             return response(true, "Customer account created", "customer", toAccountResponse(account));
//         }

//         if (!passwordEncoder.matches(password, account.getPassword())) {
//             return response(false, "Invalid password");
//         }

//         return response(true, "Login successful", "customer", toAccountResponse(account));
//     }

//     @Transactional
//     public Map<String, Object> syncAccount(Map<String, Object> payload) {
//         String email = normalizeEmail(payload == null ? null : payload.get("email"));
//         String password = asString(payload == null ? null : payload.get("password"));
//         if (email.isBlank()) {
//             return response(false, "Email is required");
//         }

//         Optional<CustomerAccount> optionalAccount = customerAccountRepository.findByEmailIgnoreCase(email);
//         CustomerAccount account = optionalAccount.orElseGet(CustomerAccount::new);
//         boolean isNewAccount = account.getId() == null;

//         account.setEmail(email);

//         String name = asString(payload == null ? null : payload.get("name"));
//         if (!name.isBlank()) {
//             account.setName(name);
//         }

//         String phone = asString(payload == null ? null : payload.get("phone"));
//         if (!phone.isBlank()) {
//             account.setPhone(phone);
//         }

//         if ((isNewAccount || account.getPassword() == null || account.getPassword().isBlank()) && !password.isBlank()) {
//             account.setPassword(passwordEncoder.encode(password));
//         }

//         customerAccountRepository.save(account);
//         return response(true, isNewAccount ? "Customer account created" : "Customer account synced", "customer", toAccountResponse(account));
//     }

//     @Transactional
//     public Map<String, Object> markOnboardingSeen(String email) {
//         String normalizedEmail = normalizeEmail(email);
//         if (normalizedEmail.isBlank()) {
//             return response(false, "Email is required");
//         }

//         CustomerAccount account = customerAccountRepository.findByEmailIgnoreCase(normalizedEmail).orElse(null);
//         if (account == null) {
//             return response(false, "Customer not found");
//         }

//         account.setOnboardingSeen(true);
//         customerAccountRepository.save(account);
//         return response(true, "Onboarding completed", "customer", toAccountResponse(account));
//     }

//     public Map<String, Object> forgotPassword(String email) {
//         String normalizedEmail = normalizeEmail(email);
//         if (normalizedEmail.isBlank()) {
//             return response(false, "Email is required");
//         }

//         Optional<CustomerAccount> optionalAccount = customerAccountRepository.findByEmailIgnoreCase(normalizedEmail);
//         if (optionalAccount.isEmpty()) {
//             return response(false, "Customer not found");
//         }

//         CustomerAccount account = optionalAccount.get();
//         String otp = String.format("%06d", OTP_RANDOM.nextInt(1_000_000));
//         account.setOtp(otp);
//         account.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
//         customerAccountRepository.save(account);

//         emailService.sendOtpEmail(account.getEmail(), otp);
//         return response(true, "OTP sent to your email");
//     }

//     public Map<String, Object> verifyOtp(String email, String otp) {
//         String normalizedEmail = normalizeEmail(email);
//         if (normalizedEmail.isBlank()) {
//             return response(false, "Email is required");
//         }

//         Optional<CustomerAccount> optionalAccount = customerAccountRepository.findByEmailIgnoreCase(normalizedEmail);
//         if (optionalAccount.isEmpty()) {
//             return response(false, "Customer not found");
//         }

//         CustomerAccount account = optionalAccount.get();
//         if (account.getOtp() == null || !account.getOtp().equals(asString(otp))) {
//             return response(false, "Invalid OTP");
//         }
//         if (account.getOtpExpiry() == null || account.getOtpExpiry().isBefore(LocalDateTime.now())) {
//             return response(false, "OTP expired");
//         }

//         return response(true, "OTP verified");
//     }

//     @Transactional
//     public Map<String, Object> resetPassword(ResetPasswordRequest req) {
//         String email = normalizeEmail(req == null ? null : req.getEmail());
//         String otp = asString(req == null ? null : req.getOtp());
//         String newPassword = asString(req == null ? null : req.getNewPassword());

//         if (email.isBlank()) {
//             return response(false, "Email is required");
//         }
//         if (newPassword.length() < 6) {
//             return response(false, "Password must be at least 6 characters");
//         }

//         Map<String, Object> otpResult = verifyOtp(email, otp);
//         if (!Boolean.TRUE.equals(otpResult.get("success"))) {
//             return otpResult;
//         }

//         CustomerAccount account = customerAccountRepository.findByEmailIgnoreCase(email).orElse(null);
//         if (account == null) {
//             return response(false, "Customer not found");
//         }

//         account.setPassword(passwordEncoder.encode(newPassword));
//         account.setOtp(null);
//         account.setOtpExpiry(null);
//         customerAccountRepository.save(account);

//         return response(true, "Password updated successfully", "customer", toAccountResponse(account));
//     }

//     private Map<String, Object> toAccountResponse(CustomerAccount account) {
//         Map<String, Object> map = new LinkedHashMap<>();
//         map.put("id", account.getId());
//         map.put("email", account.getEmail());
//         map.put("name", account.getName());
//         map.put("phone", account.getPhone());
//         map.put("onboardingSeen", Boolean.TRUE.equals(account.getOnboardingSeen()));
//         map.put("createdAt", account.getCreatedAt());
//         map.put("updatedAt", account.getUpdatedAt());
//         return map;
//     }

//     private Map<String, Object> response(boolean success, String message) {
//         Map<String, Object> map = new LinkedHashMap<>();
//         map.put("success", success);
//         map.put("message", message);
//         return map;
//     }

//     private Map<String, Object> response(boolean success, String message, String key, Object value) {
//         Map<String, Object> map = response(success, message);
//         map.put(key, value);
//         return map;
//     }

//     private String normalizeEmail(Object value) {
//         return value == null ? "" : String.valueOf(value).trim().toLowerCase();
//     }

//     private String asString(Object value) {
//         return value == null ? "" : String.valueOf(value).trim();
//     }
// }































package com.example.seller.service;

import com.example.seller.dto.LoginRequest;
import com.example.seller.dto.ResetPasswordRequest;
import com.example.seller.dto.SignupRequest;
import com.example.seller.entity.CustomerAccount;
import com.example.seller.repository.CustomerAccountRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class CustomerAuthService {

    private static final SecureRandom OTP_RANDOM = new SecureRandom();
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    private final CustomerAccountRepository customerAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public CustomerAuthService(
            CustomerAccountRepository customerAccountRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService
    ) {
        this.customerAccountRepository = customerAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public Map<String, Object> login(LoginRequest req) {
        String email = normalizeEmail(req == null ? null : req.getEmail());
        String password = req == null ? "" : asString(req.getPassword());
        if (email.isBlank()) {
            return response(false, "Email is required");
        }
        if (password.isBlank()) {
            return response(false, "Password is required");
        }

        Optional<CustomerAccount> optionalAccount = customerAccountRepository.findByEmailIgnoreCase(email);
        if (optionalAccount.isEmpty()) {
            return response(false, "No account found with this email. Please sign up first.");
        }

        CustomerAccount account = optionalAccount.get();
        if (account.getPassword() == null || account.getPassword().isBlank()) {
            return response(false, "This account has no password set. Please reset your password.");
        }

        if (!passwordEncoder.matches(password, account.getPassword())) {
            return response(false, "Invalid email or password");
        }

        return response(true, "Login successful", "customer", toAccountResponse(account));
    }

    @Transactional
    public Map<String, Object> signup(SignupRequest req) {
        String name = asString(req == null ? null : req.getName());
        String email = normalizeEmail(req == null ? null : req.getEmail());
        String password = req == null ? "" : asString(req.getPassword());
        String confirmPassword = req == null ? "" : asString(req.getConfirmPassword());

        if (name.isBlank()) {
            return response(false, "Full name is required");
        }
        if (email.isBlank()) {
            return response(false, "Email is required");
        }
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            return response(false, "Please enter a valid email address");
        }
        if (password.isBlank()) {
            return response(false, "Password is required");
        }
        if (password.length() < 6) {
            return response(false, "Password must be at least 6 characters");
        }
        if (confirmPassword.isBlank()) {
            return response(false, "Please confirm your password");
        }
        if (!password.equals(confirmPassword)) {
            return response(false, "Password and Confirm Password do not match");
        }

        if (customerAccountRepository.existsByEmailIgnoreCase(email)) {
            return response(false, "An account with this email already exists. Please login instead.");
        }

        CustomerAccount account = new CustomerAccount();
        account.setName(name);
        account.setEmail(email);
        account.setPassword(passwordEncoder.encode(password));
        account.setOnboardingSeen(false);
        customerAccountRepository.save(account);

        return response(true, "Account created successfully. Please login to continue.", "customer", toAccountResponse(account));
    }

    @Transactional
    public Map<String, Object> syncAccount(Map<String, Object> payload) {
        String email = normalizeEmail(payload == null ? null : payload.get("email"));
        String password = asString(payload == null ? null : payload.get("password"));
        if (email.isBlank()) {
            return response(false, "Email is required");
        }

        Optional<CustomerAccount> optionalAccount = customerAccountRepository.findByEmailIgnoreCase(email);
        CustomerAccount account = optionalAccount.orElseGet(CustomerAccount::new);
        boolean isNewAccount = account.getId() == null;

        account.setEmail(email);

        String name = asString(payload == null ? null : payload.get("name"));
        if (!name.isBlank()) {
            account.setName(name);
        }

        String phone = asString(payload == null ? null : payload.get("phone"));
        if (!phone.isBlank()) {
            account.setPhone(phone);
        }

        if ((isNewAccount || account.getPassword() == null || account.getPassword().isBlank()) && !password.isBlank()) {
            account.setPassword(passwordEncoder.encode(password));
        }

        customerAccountRepository.save(account);
        return response(true, isNewAccount ? "Customer account created" : "Customer account synced", "customer", toAccountResponse(account));
    }

    @Transactional
    public Map<String, Object> markOnboardingSeen(String email) {
        String normalizedEmail = normalizeEmail(email);
        if (normalizedEmail.isBlank()) {
            return response(false, "Email is required");
        }

        CustomerAccount account = customerAccountRepository.findByEmailIgnoreCase(normalizedEmail).orElse(null);
        if (account == null) {
            return response(false, "Customer not found");
        }

        account.setOnboardingSeen(true);
        customerAccountRepository.save(account);
        return response(true, "Onboarding completed", "customer", toAccountResponse(account));
    }

    public Map<String, Object> forgotPassword(String email) {
        String normalizedEmail = normalizeEmail(email);
        if (normalizedEmail.isBlank()) {
            return response(false, "Email is required");
        }

        Optional<CustomerAccount> optionalAccount = customerAccountRepository.findByEmailIgnoreCase(normalizedEmail);
        if (optionalAccount.isEmpty()) {
            return response(false, "Customer not found");
        }

        CustomerAccount account = optionalAccount.get();
        String otp = String.format("%06d", OTP_RANDOM.nextInt(1_000_000));
        account.setOtp(otp);
        account.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        customerAccountRepository.save(account);

        emailService.sendOtpEmail(account.getEmail(), otp);
        return response(true, "OTP sent to your email");
    }

    public Map<String, Object> verifyOtp(String email, String otp) {
        String normalizedEmail = normalizeEmail(email);
        if (normalizedEmail.isBlank()) {
            return response(false, "Email is required");
        }

        Optional<CustomerAccount> optionalAccount = customerAccountRepository.findByEmailIgnoreCase(normalizedEmail);
        if (optionalAccount.isEmpty()) {
            return response(false, "Customer not found");
        }

        CustomerAccount account = optionalAccount.get();
        if (account.getOtp() == null || !account.getOtp().equals(asString(otp))) {
            return response(false, "Invalid OTP");
        }
        if (account.getOtpExpiry() == null || account.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return response(false, "OTP expired");
        }

        return response(true, "OTP verified");
    }

    @Transactional
    public Map<String, Object> resetPassword(ResetPasswordRequest req) {
        String email = normalizeEmail(req == null ? null : req.getEmail());
        String otp = asString(req == null ? null : req.getOtp());
        String newPassword = asString(req == null ? null : req.getNewPassword());

        if (email.isBlank()) {
            return response(false, "Email is required");
        }
        if (newPassword.length() < 6) {
            return response(false, "Password must be at least 6 characters");
        }

        Map<String, Object> otpResult = verifyOtp(email, otp);
        if (!Boolean.TRUE.equals(otpResult.get("success"))) {
            return otpResult;
        }

        CustomerAccount account = customerAccountRepository.findByEmailIgnoreCase(email).orElse(null);
        if (account == null) {
            return response(false, "Customer not found");
        }

        account.setPassword(passwordEncoder.encode(newPassword));
        account.setOtp(null);
        account.setOtpExpiry(null);
        customerAccountRepository.save(account);

        return response(true, "Password updated successfully", "customer", toAccountResponse(account));
    }

    private Map<String, Object> toAccountResponse(CustomerAccount account) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", account.getId());
        map.put("email", account.getEmail());
        map.put("name", account.getName());
        map.put("phone", account.getPhone());
        map.put("onboardingSeen", Boolean.TRUE.equals(account.getOnboardingSeen()));
        map.put("createdAt", account.getCreatedAt());
        map.put("updatedAt", account.getUpdatedAt());
        return map;
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

    private String normalizeEmail(Object value) {
        return value == null ? "" : String.valueOf(value).trim().toLowerCase();
    }

    private String asString(Object value) {
        return value == null ? "" : String.valueOf(value).trim();
    }
}