package com.example.seller.controller;

import com.example.seller.service.CommerceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CommerceController {

    private final CommerceService commerceService;

    public CommerceController(CommerceService commerceService) {
        this.commerceService = commerceService;
    }

    @GetMapping("/customer/wishlist")
    public ResponseEntity<List<Map<String, Object>>> getWishlist(@RequestParam String customerEmail) {
        return ResponseEntity.ok(commerceService.getWishlist(customerEmail));
    }

    @PostMapping("/customer/wishlist")
    public ResponseEntity<Map<String, Object>> addWishlistItem(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(commerceService.addWishlistItem(payload));
    }

    @DeleteMapping("/customer/wishlist/{productId}")
    public ResponseEntity<Map<String, Object>> removeWishlistItem(
            @PathVariable String productId,
            @RequestParam String customerEmail
    ) {
        return ResponseEntity.ok(commerceService.removeWishlistItem(customerEmail, productId));
    }

    @PostMapping("/customer/orders")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(commerceService.createOrder(payload));
    }

    @GetMapping("/customer/orders")
    public ResponseEntity<List<Map<String, Object>>> getCustomerOrders(@RequestParam String customerEmail) {
        return ResponseEntity.ok(commerceService.getCustomerOrders(customerEmail));
    }

    @GetMapping("/customer/addresses")
    public ResponseEntity<List<Map<String, Object>>> getCustomerAddresses(@RequestParam String customerEmail) {
        return ResponseEntity.ok(commerceService.getCustomerAddresses(customerEmail));
    }

    @PostMapping("/customer/addresses")
    public ResponseEntity<Map<String, Object>> saveCustomerAddress(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(commerceService.saveCustomerAddress(payload));
    }

    @PutMapping("/customer/addresses/{addressId}")
    public ResponseEntity<Map<String, Object>> updateCustomerAddress(
            @PathVariable Long addressId,
            @RequestBody Map<String, Object> payload
    ) {
        Map<String, Object> body = new java.util.LinkedHashMap<>(payload);
        body.put("addressId", addressId);
        return ResponseEntity.ok(commerceService.saveCustomerAddress(body));
    }

    @DeleteMapping("/customer/addresses/{addressId}")
    public ResponseEntity<Map<String, Object>> deleteCustomerAddress(
            @PathVariable Long addressId,
            @RequestParam String customerEmail
    ) {
        return ResponseEntity.ok(commerceService.deleteCustomerAddress(customerEmail, addressId));
    }

    @PostMapping("/customer/addresses/{addressId}/default")
    public ResponseEntity<Map<String, Object>> setDefaultCustomerAddress(
            @PathVariable Long addressId,
            @RequestParam String customerEmail
    ) {
        return ResponseEntity.ok(commerceService.setDefaultCustomerAddress(customerEmail, addressId));
    }

    @GetMapping("/admin/orders")
    public ResponseEntity<List<Map<String, Object>>> getAllOrders() {
        return ResponseEntity.ok(commerceService.getAllOrders());
    }

    @GetMapping("/seller/orders")
    public ResponseEntity<List<Map<String, Object>>> getSellerOrders(@RequestParam String sellerId) {
        return ResponseEntity.ok(commerceService.getSellerOrders(sellerId));
    }

    @PostMapping("/orders/{orderId}/status")
    public ResponseEntity<Map<String, Object>> updateOrderStatus(
            @PathVariable String orderId,
            @RequestBody Map<String, Object> payload
    ) {
        return ResponseEntity.ok(commerceService.updateOrderStatus(orderId, String.valueOf(payload.get("status"))));
    }

    @PostMapping("/orders/{orderId}/delivery-status")
    public ResponseEntity<Map<String, Object>> updateDeliveryStatus(
            @PathVariable String orderId,
            @RequestBody Map<String, Object> payload
    ) {
        return ResponseEntity.ok(commerceService.updateDeliveryStatus(orderId, String.valueOf(payload.get("deliveryStatus"))));
    }

    @PostMapping("/orders/{orderId}/assign-delivery")
    public ResponseEntity<Map<String, Object>> assignDeliveryPerson(
            @PathVariable String orderId,
            @RequestBody Map<String, Object> payload
    ) {
        return ResponseEntity.ok(commerceService.assignDeliveryPerson(orderId, payload));
    }

    @PostMapping("/orders/{orderId}/reviews")
    public ResponseEntity<Map<String, Object>> addReview(
            @PathVariable String orderId,
            @RequestParam("productId") String productId,
            @RequestParam("productName") String productName,
            @RequestParam("customerEmail") String customerEmail,
            @RequestParam("customerName") String customerName,
            @RequestParam("rating") Integer rating,
            @RequestParam("comment") String comment,
            @RequestParam(value = "images", required = false) List<MultipartFile> images
    ) throws IOException {
        return ResponseEntity.ok(
                commerceService.addProductReview(orderId, productId, productName, customerEmail, customerName, rating, comment, images)
        );
    }

    @GetMapping("/reviews")
    public ResponseEntity<List<Map<String, Object>>> getAllReviews() {
        return ResponseEntity.ok(commerceService.getAllReviews());
    }
}
