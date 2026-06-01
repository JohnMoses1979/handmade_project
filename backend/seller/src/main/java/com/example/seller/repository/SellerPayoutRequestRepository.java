package com.example.seller.repository;

import com.example.seller.entity.SellerPayoutRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SellerPayoutRequestRepository extends JpaRepository<SellerPayoutRequest, Long> {
    List<SellerPayoutRequest> findBySellerIdOrderByCreatedAtDesc(String sellerId);
}
