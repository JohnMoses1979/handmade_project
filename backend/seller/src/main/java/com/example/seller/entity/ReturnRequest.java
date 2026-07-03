package com.example.seller.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "return_requests")
@Data
public class ReturnRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String returnCode;

    private String orderId;
    private String orderCode;
    private String productId;
    private String customer;
    private String customerEmail;
    private String sellerId;
    private String sellerName;
    private String product;
    private String price;
    private String image;
    private String reason;
    private String status = "Return Requested";
    private String requestedOn = "Today";

    private Double refundAmount = 0.0;
    private String refundAmountText;
    private String refundStatus = "Not Credited";
    private boolean refundCredited = false;
    private String refundMethod = "Razorpay";
    private String paymentMethod;
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String razorpayRefundId;
    private String creditedOn;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
