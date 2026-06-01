package com.example.seller.repository;

import com.example.seller.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByCustomerEmailOrderByAddedAtDesc(String customerEmail);
    boolean existsByCustomerEmailAndProductId(String customerEmail, String productId);
    void deleteByCustomerEmailAndProductId(String customerEmail, String productId);
}
