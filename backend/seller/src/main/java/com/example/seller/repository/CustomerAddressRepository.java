package com.example.seller.repository;

import com.example.seller.entity.CustomerAddress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerAddressRepository extends JpaRepository<CustomerAddress, Long> {
    List<CustomerAddress> findByCustomerEmailOrderByCreatedAtDesc(String customerEmail);

    Optional<CustomerAddress> findByIdAndCustomerEmail(Long id, String customerEmail);
}
