package com.example.seller.repository;

import com.example.seller.entity.RefundTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RefundTransactionRepository extends JpaRepository<RefundTransaction, Long> {
    List<RefundTransaction> findBySellerIdOrderByCreatedAtDesc(String sellerId);
}
