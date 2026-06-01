package com.example.seller.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "app_notifications")
@Data
public class AppNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Audience audience;

    private String audienceKey;
    private String title;

    @Column(length = 4000)
    private String message;

    private String type;
    private String icon;
    private String iconBg;
    private String iconColor;
    private boolean readFlag = false;

    private String relatedId;
    private String sellerId;
    private String customerEmail;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Audience {
        ADMIN,
        SELLER,
        CUSTOMER
    }
}
