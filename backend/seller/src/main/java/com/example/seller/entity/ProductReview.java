package com.example.seller.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product_reviews")
@Data
public class ProductReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderCode;
    private String productId;
    private String productName;

    private String customerEmail;
    private String customerName;

    private Integer rating;

    @Column(length = 4000)
    private String comment;

    private LocalDateTime createdAt = LocalDateTime.now();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_review_images", joinColumns = @JoinColumn(name = "review_id"))
    @Column(name = "image_path")
    private List<String> imagePaths = new ArrayList<>();
}
