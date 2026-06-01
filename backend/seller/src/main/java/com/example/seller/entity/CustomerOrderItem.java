package com.example.seller.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "customer_order_items")
@Data
public class CustomerOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private CustomerOrder order;

    private String productId;
    private String productName;
    private String imagePath;
    private String size;

    private Double price = 0.0;
    private Double finalPrice = 0.0;
    private Integer quantity = 1;

    private String sellerId;
    private String sellerName;
}
