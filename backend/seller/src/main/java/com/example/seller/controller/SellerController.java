package com.example.seller.controller;

import com.example.seller.dto.*;
import com.example.seller.entity.Product;
import com.example.seller.entity.Seller;
import com.example.seller.service.SellerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SellerController {

    private final SellerService sellerService;

    public SellerController(SellerService sellerService) {
        this.sellerService = sellerService;
    }

    // ── Seller Registration (with documents) ──────────────────────────────────
    @PostMapping("/seller/register")
    public ResponseEntity<Map<String, Object>> register(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("phone") String phone,
            @RequestParam("shopName") String shopName,
            @RequestParam("category") String category,
            @RequestParam(value = "gst", required = false) String gst,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "documents", required = false) List<MultipartFile> documents
    ) throws IOException {
        SellerRegisterRequest req = new SellerRegisterRequest();
        req.setName(name);
        req.setEmail(email);
        req.setPassword(password);
        req.setPhone(phone);
        req.setShopName(shopName);
        req.setCategory(category);
        req.setGst(gst);
        req.setDescription(description);
        req.setAddress(address);

        return ResponseEntity.ok(sellerService.register(req, documents));
    }

    // ── Seller Login ──────────────────────────────────────────────────────────
    @PostMapping("/seller/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest req) {
        return ResponseEntity.ok(sellerService.login(req));
    }

    // ── Forgot Password ───────────────────────────────────────────────────────
    @PostMapping("/seller/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(
            @RequestBody ForgotPasswordRequest req) {
        return ResponseEntity.ok(sellerService.forgotPassword(req.getEmail()));
    }

    // ── Verify OTP ────────────────────────────────────────────────────────────
    @PostMapping("/seller/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody VerifyOtpRequest req) {
        return ResponseEntity.ok(sellerService.verifyOtp(req.getEmail(), req.getOtp()));
    }

    // ── Reset Password ────────────────────────────────────────────────────────
    @PostMapping("/seller/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(
            @RequestBody ResetPasswordRequest req) {
        return ResponseEntity.ok(sellerService.resetPassword(req));
    }

    // ── Admin — Get All Sellers ───────────────────────────────────────────────
    @GetMapping("/admin/sellers")
    public ResponseEntity<List<Seller>> getAllSellers() {
        return ResponseEntity.ok(sellerService.getAllSellers());
    }

    // ── Admin — Get Pending Sellers ───────────────────────────────────────────
    @GetMapping("/admin/sellers/pending")
    public ResponseEntity<List<Seller>> getPendingSellers() {
        return ResponseEntity.ok(sellerService.getPendingSellers());
    }

    // ── Admin — Approve Seller ────────────────────────────────────────────────
    @PostMapping("/admin/sellers/{id}/approve")
    public ResponseEntity<Map<String, Object>> approveSeller(@PathVariable Long id) {
        return ResponseEntity.ok(sellerService.approveSeller(id));
    }

    // ── Admin — Reject Seller ─────────────────────────────────────────────────
    @PostMapping("/admin/sellers/{id}/reject")
    public ResponseEntity<Map<String, Object>> rejectSeller(
            @PathVariable Long id,
            @RequestParam(value = "reason", defaultValue = "Does not meet requirements") String reason) {
        return ResponseEntity.ok(sellerService.rejectSeller(id, reason));
    }

    // ── Admin — Get Seller Documents ──────────────────────────────────────────
    @GetMapping("/admin/sellers/{id}")
    public ResponseEntity<?> getSellerById(@PathVariable Long id) {
        return sellerService.getAllSellers().stream()
                .filter(s -> s.getId().equals(id))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── Seller Add Product ──────────────────────────────────────────────────
    @PostMapping("/seller/products/add")
    public ResponseEntity<Map<String, Object>> addProduct(
            @RequestParam("sellerId") Long sellerId,
            @RequestParam("sellerEmail") String sellerEmail,
            @RequestParam("sellerName") String sellerName,
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("subcategory") String subcategory,
            @RequestParam("price") Double price,
            @RequestParam("finalPrice") Double finalPrice,
            @RequestParam("discount") Integer discount,
            @RequestParam("stock") Integer stock,
            @RequestParam(value = "weight", required = false, defaultValue = "") String weight,
            @RequestParam("description") String description,
            @RequestParam(value = "material", required = false, defaultValue = "") String material,
            @RequestParam(value = "color", required = false, defaultValue = "") String color,
            @RequestParam(value = "size", required = false, defaultValue = "") String size,
            @RequestParam(value = "status", required = false, defaultValue = "PENDING") String status,
            @RequestParam(value = "active", required = false, defaultValue = "true") Boolean active,
            @RequestParam(value = "paymentStatus", required = false, defaultValue = "Paid") String paymentStatus,
            @RequestParam(value = "uploadFee", required = false, defaultValue = "0") Double uploadFee,
            @RequestParam(value = "paymentMethod", required = false, defaultValue = "upi") String paymentMethod,
            @RequestParam(value = "paidAt", required = false) String paidAt,
            @RequestParam(value = "images", required = false) List<MultipartFile> images
    ) throws IOException {

        Map<String, Object> data = new HashMap<>();
        data.put("name", name);
        data.put("category", category);
        data.put("subcategory", subcategory);
        data.put("price", price);
        data.put("finalPrice", finalPrice);
        data.put("discount", discount);
        data.put("stock", stock);
        data.put("weight", weight);
        data.put("description", description);
        data.put("material", material);
        data.put("color", color);
        data.put("size", size);
        data.put("status", status);
        data.put("active", active);
        data.put("paymentStatus", paymentStatus);
        data.put("uploadFee", uploadFee);
        data.put("paymentMethod", paymentMethod);
        data.put("paidAt", parseClientDateTime(paidAt));

        return ResponseEntity.ok(
            sellerService.addProduct(sellerId, sellerEmail, sellerName, data, images)
        );
    }

    @GetMapping("/admin/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(sellerService.getAllProducts());
    }

    @GetMapping("/products/approved")
    public ResponseEntity<List<Product>> getApprovedProducts() {
        return ResponseEntity.ok(sellerService.getApprovedProducts());
    }

    @PostMapping("/admin/products/{id}/approve")
    public ResponseEntity<Map<String, Object>> approveProduct(@PathVariable Long id) {
        return ResponseEntity.ok(sellerService.approveProduct(id));
    }

    @PostMapping("/admin/products/{id}/reject")
    public ResponseEntity<Map<String, Object>> rejectProduct(@PathVariable Long id) {
        return ResponseEntity.ok(sellerService.rejectProduct(id));
    }

    private LocalDateTime parseClientDateTime(String value) {
        if (value == null || value.isBlank()) {
            return LocalDateTime.now();
        }

        try {
            return OffsetDateTime.parse(value).toLocalDateTime();
        } catch (Exception ignored) {
            return LocalDateTime.parse(value);
        }
    }
    @GetMapping("/seller/products/{sellerId}")
    public ResponseEntity<List<Product>> getSellerProducts(@PathVariable Long sellerId) {
        return ResponseEntity.ok(sellerService.getSellerProducts(sellerId));
    }

    @GetMapping("/seller/profile/{sellerId}")
    public ResponseEntity<Map<String, Object>> getSellerProfile(@PathVariable Long sellerId) {
        return ResponseEntity.ok(sellerService.getSellerProfile(sellerId));
    }

    @PutMapping("/seller/profile/{sellerId}")
    public ResponseEntity<Map<String, Object>> updateSellerProfile(
            @PathVariable Long sellerId,
            @RequestBody Map<String, Object> payload
    ) {
        return ResponseEntity.ok(sellerService.updateSellerProfile(sellerId, payload));
    }

    @GetMapping("/seller/settings/{sellerId}")
    public ResponseEntity<Map<String, Object>> getSellerSettings(@PathVariable Long sellerId) {
        return ResponseEntity.ok(sellerService.getSellerSettings(sellerId));
    }

    @PutMapping("/seller/settings/{sellerId}")
    public ResponseEntity<Map<String, Object>> updateSellerSettings(
            @PathVariable Long sellerId,
            @RequestBody Map<String, Object> payload
    ) {
        return ResponseEntity.ok(sellerService.updateSellerSettings(sellerId, payload));
    }

    @GetMapping("/seller/support")
    public ResponseEntity<Map<String, Object>> getSellerSupportContent() {
        return ResponseEntity.ok(sellerService.getSellerSupportContent());
    }

    @PutMapping("/seller/products/{productId}")
    public ResponseEntity<Map<String, Object>> updateSellerProduct(
            @PathVariable Long productId,
            @RequestBody Map<String, Object> request
    ) {
        Boolean active = request.containsKey("active") ? Boolean.valueOf(String.valueOf(request.get("active"))) : null;
        Integer stock = request.containsKey("stock") ? Integer.valueOf(String.valueOf(request.get("stock"))) : null;
        return ResponseEntity.ok(sellerService.updateSellerProductStatus(productId, active, stock));
    }

    @DeleteMapping("/seller/products/{productId}")
    public ResponseEntity<Map<String, Object>> deleteSellerProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(sellerService.deleteSellerProduct(productId));
    }

    @GetMapping("/seller/payouts/{sellerId}")
    public ResponseEntity<Map<String, Object>> getSellerPayouts(@PathVariable String sellerId) {
        return ResponseEntity.ok(sellerService.getSellerPayoutSummary(sellerId));
    }

    @PostMapping("/seller/payouts/{sellerId}/withdraw")
    public ResponseEntity<Map<String, Object>> withdrawSellerPayout(
            @PathVariable String sellerId,
            @RequestBody Map<String, Object> request
    ) {
        Double amount = Double.valueOf(String.valueOf(request.getOrDefault("amount", "0")));
        return ResponseEntity.ok(sellerService.createSellerWithdrawal(sellerId, amount));
    }
}
