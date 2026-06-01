package com.example.seller.service;

import com.example.seller.entity.DeliveryPartner;
import com.example.seller.repository.DeliveryPartnerRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DeliveryPartnerService {

    private final DeliveryPartnerRepository deliveryPartnerRepository;

    public DeliveryPartnerService(DeliveryPartnerRepository deliveryPartnerRepository) {
        this.deliveryPartnerRepository = deliveryPartnerRepository;
    }

    public List<Map<String, Object>> getPartners(String sellerId) {
        return deliveryPartnerRepository.findBySellerIdOrderByCreatedAtDesc(sellerId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public Map<String, Object> createPartner(Map<String, Object> payload) {
        String sellerId = asString(payload.get("sellerId"));
        String name = asString(payload.get("name"));
        String phone = asString(payload.get("phone"));
        String area = asString(payload.get("area"));
        String vehicle = asString(payload.get("vehicle"));

        if (sellerId.isBlank()) {
            return Map.of("success", false, "message", "Seller id is required");
        }
        if (name.isBlank() || phone.isBlank() || area.isBlank() || vehicle.isBlank()) {
            return Map.of("success", false, "message", "Name, phone, area and vehicle are required");
        }

        DeliveryPartner partner = new DeliveryPartner();
        partner.setSellerId(sellerId);
        partner.setName(name);
        partner.setPhone(phone);
        partner.setArea(area);
        partner.setVehicle(vehicle);
        partner.setVehicleNumber(defaultIfBlank(asString(payload.get("vehicleNumber")), "Not Added"));
        partner.setPrice(asDouble(payload.get("price"), 40.0));
        partner.setStatus(defaultIfBlank(asString(payload.get("status")), "Available"));
        partner.setRating(defaultIfBlank(asString(payload.get("rating")), "New"));
        partner.setCompletedOrders(asInteger(payload.get("completedOrders"), 0));
        partner.setExperience(defaultIfBlank(asString(payload.get("experience")), "New Partner"));
        partner.setIdProof(defaultIfBlank(asString(payload.get("idProof")), "Pending Verification"));

        DeliveryPartner saved = deliveryPartnerRepository.save(partner);
        return Map.of("success", true, "partner", toResponse(saved));
    }

    private Map<String, Object> toResponse(DeliveryPartner partner) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", String.valueOf(partner.getId()));
        response.put("sellerId", partner.getSellerId());
        response.put("name", partner.getName());
        response.put("phone", partner.getPhone());
        response.put("area", partner.getArea());
        response.put("vehicle", partner.getVehicle());
        response.put("vehicleNumber", partner.getVehicleNumber());
        response.put("price", partner.getPrice());
        response.put("status", partner.getStatus());
        response.put("rating", partner.getRating());
        response.put("completedOrders", partner.getCompletedOrders());
        response.put("experience", partner.getExperience());
        response.put("idProof", partner.getIdProof());
        response.put("createdAt", partner.getCreatedAt());
        return response;
    }

    private String asString(Object value) {
        return value == null ? "" : String.valueOf(value).trim();
    }

    private String defaultIfBlank(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private Double asDouble(Object value, Double fallback) {
        try {
            if (value == null || String.valueOf(value).isBlank()) return fallback;
            return Double.valueOf(String.valueOf(value));
        } catch (Exception ignored) {
            return fallback;
        }
    }

    private Integer asInteger(Object value, Integer fallback) {
        try {
            if (value == null || String.valueOf(value).isBlank()) return fallback;
            return Integer.valueOf(String.valueOf(value));
        } catch (Exception ignored) {
            return fallback;
        }
    }
}
