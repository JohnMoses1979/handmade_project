package com.example.seller.repository;

import com.example.seller.entity.ReturnRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, Long> {
    List<ReturnRequest> findBySellerIdOrderByCreatedAtDesc(String sellerId);

    List<ReturnRequest> findByCustomerEmailOrderByCreatedAtDesc(String customerEmail);

    Optional<ReturnRequest> findByReturnCode(String returnCode);

    Optional<ReturnRequest> findByOrderIdAndProductId(String orderId, String productId);
}
