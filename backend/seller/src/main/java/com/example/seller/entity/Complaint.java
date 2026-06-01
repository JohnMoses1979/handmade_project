package com.example.seller.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "complaints")
@Data
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 4000)
    private String description;

    private String complaintType;
    private String orderId;
    private String productId;
    private String productName;
    private String customerName;
    private String customerEmail;
    private String sellerId;
    private String sellerName;
    private String status = "Pending";
    private boolean readFlag = false;
    private boolean adminForwarded = true;

    @Column(length = 4000)
    private String resolution;

    private LocalDateTime forwardedAt = LocalDateTime.now();
    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt = LocalDateTime.now();

    @ElementCollection
    @CollectionTable(name = "complaint_images", joinColumns = @JoinColumn(name = "complaint_id"))
    @Column(name = "image_path")
    private List<String> imagePaths = new ArrayList<>();
}
