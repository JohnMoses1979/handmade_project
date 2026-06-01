package com.example.seller.repository;

import com.example.seller.entity.AppNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppNotificationRepository extends JpaRepository<AppNotification, Long> {
    List<AppNotification> findByAudienceAndAudienceKeyOrderByCreatedAtDesc(AppNotification.Audience audience, String audienceKey);
    List<AppNotification> findByAudienceOrderByCreatedAtDesc(AppNotification.Audience audience);
}
