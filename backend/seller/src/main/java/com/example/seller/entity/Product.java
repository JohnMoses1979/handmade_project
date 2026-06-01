package com.example.seller.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private String subcategory;
    private Double price;
    private Double finalPrice;
    private Integer discount;
    private Integer stock;
    private String weight;
    private String description;
    private String material;
    private String color;
    private String size;

    @ElementCollection
    @CollectionTable(name = "product_images", 
                     joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_path")
    private List<String> imagePaths;

    @Enumerated(EnumType.STRING)
    private ProductStatus status = ProductStatus.PENDING;

    private Long sellerId;
    private String sellerEmail;
    private String sellerName;
    private String paymentStatus;
    private Double uploadFee;
    private String paymentMethod;
    private LocalDateTime paidAt;
    private LocalDateTime approvedAt;
    private Boolean active = true;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum ProductStatus {
        PENDING, APPROVED, REJECTED
    }
}

