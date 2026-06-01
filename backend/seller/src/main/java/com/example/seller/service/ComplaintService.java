package com.example.seller.service;

import com.example.seller.entity.Complaint;
import com.example.seller.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final NotificationService notificationService;

    @Value("${file.upload.dir}")
    private String uploadDir;

    public ComplaintService(
            ComplaintRepository complaintRepository,
            NotificationService notificationService
    ) {
        this.complaintRepository = complaintRepository;
        this.notificationService = notificationService;
    }

    public Map<String, Object> createComplaint(Map<String, Object> payload, List<MultipartFile> images) throws IOException {
        String sellerId = asString(payload.get("sellerId"));
        String customerEmail = normalizeEmail(asString(payload.get("customerEmail")));

        Complaint complaint = new Complaint();
        complaint.setTitle(firstNonBlank(asString(payload.get("title")), sellerId.isBlank() ? "Help & Support Request" : "Customer Complaint"));
        complaint.setDescription(firstNonBlank(asString(payload.get("description")), "A complaint has been raised."));
        complaint.setComplaintType(firstNonBlank(asString(payload.get("complaintType")), sellerId.isBlank() ? "Support" : ""));
        complaint.setOrderId(asString(payload.get("orderId")));
        complaint.setProductId(asString(payload.get("productId")));
        complaint.setProductName(asString(payload.get("productName")));
        complaint.setCustomerName(firstNonBlank(asString(payload.get("customer")), asString(payload.get("customerName")), "Customer"));
        complaint.setCustomerEmail(customerEmail);
        complaint.setSellerId(sellerId);
        complaint.setSellerName(firstNonBlank(asString(payload.get("sellerName")), sellerId.isBlank() ? "Support Team" : "Seller"));
        complaint.setStatus(firstNonBlank(asString(payload.get("status")), "Pending"));
        complaint.setImagePaths(storeFiles(images));

        Complaint saved = complaintRepository.save(complaint);

        String productName = saved.getProductName();
        String complaintText = saved.getCustomerName() + " raised a complaint" +
                (productName.isBlank() ? "." : " about \"" + productName + "\".");

        notificationService.createNotification(mapOf(
                "audience", "ADMIN",
                "audienceKey", "global",
                "title", sellerId.isBlank() ? "New Help & Support Request" : "New Customer Complaint",
                "message", complaintText,
                "type", "complaint",
                "icon", "alert-circle-outline",
                "iconBg", "#fdecea",
                "iconColor", "#EF4444",
                "relatedId", String.valueOf(saved.getId()),
                "sellerId", saved.getSellerId(),
                "customerEmail", saved.getCustomerEmail()
        ));

        if (!sellerId.isBlank()) {
            notificationService.createNotification(mapOf(
                    "audience", "SELLER",
                    "audienceKey", saved.getSellerId(),
                    "title", "Customer Complaint Received",
                    "message", complaintText,
                    "type", "complaint",
                    "icon", "alert-circle-outline",
                    "iconBg", "#fdecea",
                    "iconColor", "#EF4444",
                    "relatedId", String.valueOf(saved.getId()),
                    "sellerId", saved.getSellerId(),
                    "customerEmail", saved.getCustomerEmail()
            ));
        }

        if (!customerEmail.isBlank()) {
            notificationService.createNotification(mapOf(
                    "audience", "CUSTOMER",
                    "audienceKey", saved.getCustomerEmail(),
                    "title", "Support Request Received",
                    "message", "We received your support request and our team will review it shortly.",
                    "type", "complaint",
                    "icon", "chatbubble-ellipses-outline",
                    "iconBg", "#EFF6FF",
                    "iconColor", "#2563EB",
                    "relatedId", String.valueOf(saved.getId()),
                    "sellerId", saved.getSellerId(),
                    "customerEmail", saved.getCustomerEmail()
            ));
        }

        return Map.of("success", true, "complaint", toResponse(saved));
    }

    public List<Map<String, Object>> getAdminComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getSellerComplaints(String sellerId) {
        return complaintRepository.findBySellerIdOrderByCreatedAtDesc(asString(sellerId))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getCustomerComplaints(String customerEmail) {
        return complaintRepository.findByCustomerEmailOrderByCreatedAtDesc(normalizeEmail(customerEmail))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Map<String, Object> resolveComplaint(Long complaintId, String resolution) {
        Optional<Complaint> optionalComplaint = complaintRepository.findById(complaintId);
        if (optionalComplaint.isEmpty()) {
            return Map.of("success", false, "message", "Complaint not found");
        }

        Complaint complaint = optionalComplaint.get();
        complaint.setStatus("Resolved");
        complaint.setReadFlag(true);
        complaint.setResolution(firstNonBlank(resolution, "Issue resolved by seller"));
        complaint.setResolvedAt(LocalDateTime.now());
        Complaint saved = complaintRepository.save(complaint);

        notificationService.createNotification(mapOf(
                "audience", "SELLER",
                "audienceKey", saved.getSellerId(),
                "title", "Complaint Resolved",
                "message", "Complaint for order " + firstNonBlank(saved.getOrderId(), String.valueOf(saved.getId())) + " marked as resolved.",
                "type", "complaint",
                "icon", "checkmark-done-outline",
                "iconBg", "#ECFDF5",
                "iconColor", "#16A34A",
                "relatedId", String.valueOf(saved.getId()),
                "sellerId", saved.getSellerId(),
                "customerEmail", saved.getCustomerEmail()
        ));

        return Map.of("success", true, "complaint", toResponse(saved));
    }

    public Map<String, Object> markRead(Long complaintId) {
        Optional<Complaint> optionalComplaint = complaintRepository.findById(complaintId);
        if (optionalComplaint.isEmpty()) {
            return Map.of("success", false, "message", "Complaint not found");
        }

        Complaint complaint = optionalComplaint.get();
        complaint.setReadFlag(true);
        Complaint saved = complaintRepository.save(complaint);
        return Map.of("success", true, "complaint", toResponse(saved));
    }

    private Map<String, Object> toResponse(Complaint complaint) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", complaint.getId());
        map.put("title", complaint.getTitle());
        map.put("description", complaint.getDescription());
        map.put("complaintType", complaint.getComplaintType());
        map.put("issue", complaint.getComplaintType());
        map.put("orderId", complaint.getOrderId());
        map.put("productId", complaint.getProductId());
        map.put("product", complaint.getProductName());
        map.put("productName", complaint.getProductName());
        map.put("customer", complaint.getCustomerName());
        map.put("customerName", complaint.getCustomerName());
        map.put("customerEmail", complaint.getCustomerEmail());
        map.put("sellerId", complaint.getSellerId());
        map.put("sellerName", complaint.getSellerName());
        map.put("status", complaint.getStatus());
        map.put("read", complaint.isReadFlag());
        map.put("adminForwarded", complaint.isAdminForwarded());
        map.put("resolution", complaint.getResolution());
        map.put("images", complaint.getImagePaths());
        map.put("time", formatDateTime(complaint.getCreatedAt()));
        map.put("createdAt", complaint.getCreatedAt());
        map.put("resolvedAt", complaint.getResolvedAt());
        return map;
    }

    private List<String> storeFiles(List<MultipartFile> files) throws IOException {
        List<String> paths = new ArrayList<>();
        if (files == null || files.isEmpty()) {
            return paths;
        }

        Path complaintDir = Paths.get(uploadDir, "complaints").toAbsolutePath().normalize();
        if (!Files.exists(complaintDir)) {
            Files.createDirectories(complaintDir);
        }

        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                continue;
            }
            String safeName = UUID.randomUUID() + "_" + Objects.requireNonNullElse(file.getOriginalFilename(), "complaint.jpg");
            Path target = complaintDir.resolve(safeName);
            file.transferTo(target.toFile());
            paths.add("/uploads/complaints/" + safeName);
        }

        return paths;
    }

    private String formatDateTime(LocalDateTime value) {
        if (value == null) {
            return "Just now";
        }
        return value.format(DateTimeFormatter.ofPattern("dd MMM, hh:mm a"));
    }

    private String normalizeEmail(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }

    private String asString(Object value) {
        return value == null ? "" : String.valueOf(value).trim();
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return "";
    }

    private Map<String, Object> mapOf(Object... entries) {
        Map<String, Object> map = new LinkedHashMap<>();
        for (int index = 0; index + 1 < entries.length; index += 2) {
            map.put(String.valueOf(entries[index]), entries[index + 1]);
        }
        return map;
    }
}
