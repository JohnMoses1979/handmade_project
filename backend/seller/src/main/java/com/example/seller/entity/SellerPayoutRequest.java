package com.example.seller.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "seller_payout_requests")
@Data
public class SellerPayoutRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sellerId;
    private Double amount = 0.0;
    private String status = "Processing";
    private String method = "Razorpay";
    private String razorpayPayoutId;
    private String razorpayContactId;
    private String razorpayFundAccountId;
    private String sellerName;
    private String referenceType = "seller_withdrawal";
    private LocalDateTime createdAt = LocalDateTime.now();
}

