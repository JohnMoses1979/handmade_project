package com.example.seller.controller;

import com.example.seller.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createNotification(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(notificationService.createNotification(payload));
    }

    @GetMapping("/admin")
    public ResponseEntity<List<Map<String, Object>>> getAdminNotifications() {
        return ResponseEntity.ok(notificationService.getAdminNotifications());
    }

    @GetMapping("/seller")
    public ResponseEntity<List<Map<String, Object>>> getSellerNotifications(@RequestParam String sellerId) {
        return ResponseEntity.ok(notificationService.getSellerNotifications(sellerId));
    }

    @GetMapping("/customer")
    public ResponseEntity<List<Map<String, Object>>> getCustomerNotifications(@RequestParam String customerEmail) {
        return ResponseEntity.ok(notificationService.getCustomerNotifications(customerEmail));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<Map<String, Object>> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markRead(id));
    }

    @PostMapping("/read-all")
    public ResponseEntity<Map<String, Object>> markAllRead(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(
                notificationService.markAllRead(
                        String.valueOf(payload.getOrDefault("audience", "")),
                        String.valueOf(payload.getOrDefault("audienceKey", ""))
                )
        );
    }
}
