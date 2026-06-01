package com.example.seller.service;

import com.example.seller.entity.AppNotification;
import com.example.seller.repository.AppNotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final AppNotificationRepository appNotificationRepository;

    public NotificationService(AppNotificationRepository appNotificationRepository) {
        this.appNotificationRepository = appNotificationRepository;
    }

    public Map<String, Object> createNotification(Map<String, Object> payload) {
        String audienceValue = String.valueOf(payload.getOrDefault("audience", "")).trim().toUpperCase();
        if (audienceValue.isBlank()) {
          return Map.of("success", false, "message", "Audience is required");
        }

        AppNotification notification = new AppNotification();
        notification.setAudience(AppNotification.Audience.valueOf(audienceValue));
        notification.setAudienceKey(String.valueOf(payload.getOrDefault("audienceKey", "")).trim());
        notification.setTitle(String.valueOf(payload.getOrDefault("title", "Notification")).trim());
        notification.setMessage(String.valueOf(payload.getOrDefault("message", "")).trim());
        notification.setType(String.valueOf(payload.getOrDefault("type", "info")).trim());
        notification.setIcon(String.valueOf(payload.getOrDefault("icon", "notifications-outline")).trim());
        notification.setIconBg(String.valueOf(payload.getOrDefault("iconBg", "#EFF6FF")).trim());
        notification.setIconColor(String.valueOf(payload.getOrDefault("iconColor", "#2563EB")).trim());
        notification.setReadFlag(Boolean.TRUE.equals(payload.get("read")));
        notification.setRelatedId(String.valueOf(payload.getOrDefault("relatedId", "")).trim());
        notification.setSellerId(String.valueOf(payload.getOrDefault("sellerId", "")).trim());
        notification.setCustomerEmail(String.valueOf(payload.getOrDefault("customerEmail", "")).trim().toLowerCase());

        AppNotification saved = appNotificationRepository.save(notification);
        return Map.of("success", true, "notification", toResponse(saved));
    }

    public List<Map<String, Object>> getAdminNotifications() {
        return appNotificationRepository.findByAudienceOrderByCreatedAtDesc(AppNotification.Audience.ADMIN)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getSellerNotifications(String sellerId) {
        return appNotificationRepository.findByAudienceAndAudienceKeyOrderByCreatedAtDesc(AppNotification.Audience.SELLER, safeValue(sellerId))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getCustomerNotifications(String customerEmail) {
        return appNotificationRepository.findByAudienceAndAudienceKeyOrderByCreatedAtDesc(AppNotification.Audience.CUSTOMER, safeValue(customerEmail).toLowerCase())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Map<String, Object> markRead(Long id) {
        Optional<AppNotification> optional = appNotificationRepository.findById(id);
        if (optional.isEmpty()) {
            return Map.of("success", false, "message", "Notification not found");
        }

        AppNotification notification = optional.get();
        notification.setReadFlag(true);
        appNotificationRepository.save(notification);
        return Map.of("success", true, "notification", toResponse(notification));
    }

    public Map<String, Object> markAllRead(String audience, String audienceKey) {
        AppNotification.Audience target = AppNotification.Audience.valueOf(safeValue(audience).toUpperCase());
        List<AppNotification> notifications;

        if (target == AppNotification.Audience.ADMIN) {
            notifications = appNotificationRepository.findByAudienceOrderByCreatedAtDesc(target);
        } else {
            notifications = appNotificationRepository.findByAudienceAndAudienceKeyOrderByCreatedAtDesc(target, safeValue(audienceKey));
        }

        notifications.forEach(item -> item.setReadFlag(true));
        appNotificationRepository.saveAll(notifications);
        return Map.of("success", true, "count", notifications.size());
    }

    private Map<String, Object> toResponse(AppNotification item) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", item.getId());
        map.put("type", item.getType());
        map.put("title", item.getTitle());
        map.put("message", item.getMessage());
        map.put("icon", item.getIcon());
        map.put("iconBg", item.getIconBg());
        map.put("iconColor", item.getIconColor());
        map.put("time", formatTime(item.getCreatedAt()));
        map.put("createdAt", item.getCreatedAt());
        map.put("read", item.isReadFlag());
        map.put("unread", !item.isReadFlag());
        map.put("sellerId", item.getSellerId());
        map.put("customerEmail", item.getCustomerEmail());
        map.put("relatedId", item.getRelatedId());
        return map;
    }

    private String formatTime(LocalDateTime createdAt) {
        if (createdAt == null) {
            return "Just now";
        }
        return createdAt.format(DateTimeFormatter.ofPattern("dd MMM, hh:mm a"));
    }

    private String safeValue(String value) {
        return value == null ? "" : value.trim();
    }
}
