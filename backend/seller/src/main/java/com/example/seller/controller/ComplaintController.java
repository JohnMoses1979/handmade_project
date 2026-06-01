package com.example.seller.controller;

import com.example.seller.service.ComplaintService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createComplaint(
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "complaintType", required = false) String complaintType,
            @RequestParam(value = "orderId", required = false) String orderId,
            @RequestParam(value = "productId", required = false) String productId,
            @RequestParam(value = "productName", required = false) String productName,
            @RequestParam(value = "customer", required = false) String customer,
            @RequestParam(value = "customerEmail", required = false) String customerEmail,
            @RequestParam(value = "sellerId", required = false) String sellerId,
            @RequestParam(value = "sellerName", required = false) String sellerName,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "images", required = false) List<MultipartFile> images
    ) throws IOException {
        Map<String, Object> payload = new HashMap<>();
        payload.put("title", title);
        payload.put("description", description);
        payload.put("complaintType", complaintType);
        payload.put("orderId", orderId);
        payload.put("productId", productId);
        payload.put("productName", productName);
        payload.put("customer", customer);
        payload.put("customerEmail", customerEmail);
        payload.put("sellerId", sellerId);
        payload.put("sellerName", sellerName);
        payload.put("status", status);
        return ResponseEntity.ok(complaintService.createComplaint(payload, images));
    }

    @PostMapping("/support")
    public ResponseEntity<Map<String, Object>> createSupportRequest(
            @RequestBody Map<String, Object> payload
    ) throws IOException {
        payload.putIfAbsent("title", "Help & Support Request");
        payload.putIfAbsent("complaintType", "Support");
        payload.putIfAbsent("sellerName", "Support Team");
        payload.putIfAbsent("status", "Pending");
        return ResponseEntity.ok(complaintService.createComplaint(payload, null));
    }

    @GetMapping("/admin")
    public ResponseEntity<List<Map<String, Object>>> getAdminComplaints() {
        return ResponseEntity.ok(complaintService.getAdminComplaints());
    }

    @GetMapping("/seller")
    public ResponseEntity<List<Map<String, Object>>> getSellerComplaints(@RequestParam String sellerId) {
        return ResponseEntity.ok(complaintService.getSellerComplaints(sellerId));
    }

    @GetMapping("/customer")
    public ResponseEntity<List<Map<String, Object>>> getCustomerComplaints(@RequestParam String customerEmail) {
        return ResponseEntity.ok(complaintService.getCustomerComplaints(customerEmail));
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<Map<String, Object>> resolveComplaint(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload
    ) {
        return ResponseEntity.ok(
                complaintService.resolveComplaint(id, String.valueOf(payload.getOrDefault("resolution", "")))
        );
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<Map<String, Object>> markComplaintRead(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.markRead(id));
    }
}
