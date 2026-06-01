package com.example.seller.repository;

import com.example.seller.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findAllByOrderByCreatedAtDesc();
    List<Complaint> findBySellerIdOrderByCreatedAtDesc(String sellerId);
    List<Complaint> findByCustomerEmailOrderByCreatedAtDesc(String customerEmail);
}
