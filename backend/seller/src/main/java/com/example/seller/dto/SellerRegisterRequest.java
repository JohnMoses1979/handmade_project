package com.example.seller.dto;

import lombok.Data;

@Data
public class SellerRegisterRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String shopName;
    private String category;
    private String gst;
    private String description;
    private String address;
}