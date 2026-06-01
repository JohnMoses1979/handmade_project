package com.example.seller.repository;

import com.example.seller.entity.DeliveryPartner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeliveryPartnerRepository extends JpaRepository<DeliveryPartner, Long> {
    List<DeliveryPartner> findBySellerIdOrderByCreatedAtDesc(String sellerId);
}
