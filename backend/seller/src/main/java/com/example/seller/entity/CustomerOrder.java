package com.example.seller.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "customer_orders")
@Data
public class CustomerOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String orderCode;

    private String customerEmail;
    private String customerName;
    private String customerPhone;

    private String title;

    private String addressName;
    private String addressLine1;
    private String addressLine2;
    private String addressCity;
    private String addressState;
    private String addressPincode;

    private String status = "Processing";
    private String deliveryStatus = "Need Delivery";

    private String deliveryPersonId;
    private String deliveryPersonName;
    private String deliveryPersonPhone;
    private Double deliveryFee = 0.0;

    private String payment;
    private String paymentMethod;
    private String paymentStatus;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;

    private Double itemTotal = 0.0;
    private Double deliveryCharge = 0.0;
    private Double totalAmount = 0.0;
    private Double adminCommission = 0.0;
    private Double sellerEarning = 0.0;
    private Integer commissionRate = 10;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime deliveredAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<CustomerOrderItem> items = new ArrayList<>();
}
