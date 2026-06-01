package com.example.seller.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "wishlist_items")
@Data
public class WishlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerEmail;
    private String customerName;

    private String productId;
    private String productName;

    private String sellerId;
    private String sellerName;

    private String imagePath;

    private Double price;
    private Double finalPrice;

    private LocalDateTime addedAt = LocalDateTime.now();
}
