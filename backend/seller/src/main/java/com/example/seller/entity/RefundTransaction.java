package com.example.seller.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "refund_transactions")
@Data
public class RefundTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sellerId;
    private String sellerName;
    private String orderId;
    private String orderCode;
    private String productId;
    private String productName;
    private String customerEmail;
    private String customerName;
    private String refundReceipt;
    private String razorpayPaymentId;
    private String razorpayRefundId;
    private Double amount = 0.0;
    private String currency = "INR";
    private String status = "created";
    private String source = "return_refund";
    private LocalDateTime createdAt = LocalDateTime.now();
}
