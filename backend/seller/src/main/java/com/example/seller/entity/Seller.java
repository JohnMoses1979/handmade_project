package com.example.seller.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "sellers")
@Data
public class Seller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    private String phone;

    private String shopName;

    private String category;

    private String gst;

    private String description;

    private String address;
    private String bankAccountHolderName;
    private String bankName;
    private String bankAccountNumber;
    private String bankIfscCode;

    private Boolean orderNotifications = true;
    private Boolean promotionalUpdates = false;
    private Boolean smsAlerts = true;
    private Boolean emailUpdates = true;
    private Boolean darkMode = false;
    private Boolean autoAcceptOrders = false;

    // Documents — file paths store chestam
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "seller_documents", joinColumns = @JoinColumn(name = "seller_id"))
    @Column(name = "document_path")
    private List<String> documentPaths;

    @Enumerated(EnumType.STRING)
    private SellerStatus status = SellerStatus.PENDING;

    private String otp;

    private LocalDateTime otpExpiry;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum SellerStatus {
        PENDING, APPROVED, REJECTED
    }
}
