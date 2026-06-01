package com.example.seller.repository;

import com.example.seller.entity.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
    List<ProductReview> findAllByOrderByCreatedAtDesc();
    List<ProductReview> findByProductIdOrderByCreatedAtDesc(String productId);
    List<ProductReview> findByOrderCodeOrderByCreatedAtDesc(String orderCode);
}
