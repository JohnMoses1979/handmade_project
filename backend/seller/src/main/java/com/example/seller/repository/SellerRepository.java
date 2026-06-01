package com.example.seller.repository;

import com.example.seller.entity.Seller;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SellerRepository extends JpaRepository<Seller, Long> {

    Optional<Seller> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Seller> findByStatus(Seller.SellerStatus status);
}