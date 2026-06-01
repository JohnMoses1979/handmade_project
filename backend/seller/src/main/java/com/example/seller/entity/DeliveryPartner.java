package com.example.seller.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_partners")
@Data
public class DeliveryPartner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sellerId;
    private String name;
    private String phone;
    private String area;
    private String vehicle;
    private String vehicleNumber;
    private Double price = 40.0;
    private String status = "Available";
    private String rating = "New";
    private Integer completedOrders = 0;
    private String experience;
    private String idProof = "Pending Verification";
    private LocalDateTime createdAt = LocalDateTime.now();
}
