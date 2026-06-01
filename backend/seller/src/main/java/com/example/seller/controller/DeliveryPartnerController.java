package com.example.seller.controller;

import com.example.seller.service.DeliveryPartnerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seller/delivery-partners")
@CrossOrigin(origins = "*")
public class DeliveryPartnerController {

    private final DeliveryPartnerService deliveryPartnerService;

    public DeliveryPartnerController(DeliveryPartnerService deliveryPartnerService) {
        this.deliveryPartnerService = deliveryPartnerService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getPartners(@RequestParam String sellerId) {
        return ResponseEntity.ok(deliveryPartnerService.getPartners(sellerId));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createPartner(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(deliveryPartnerService.createPartner(payload));
    }
}
