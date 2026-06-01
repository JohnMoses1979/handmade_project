package com.example.seller.repository;

import com.example.seller.entity.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {
    List<CustomerOrder> findAllByOrderByCreatedAtDesc();

    List<CustomerOrder> findByCustomerEmailOrderByCreatedAtDesc(String customerEmail);

    @Query("select distinct o from CustomerOrder o join o.items i where i.sellerId = :sellerId order by o.createdAt desc")
    List<CustomerOrder> findOrdersForSeller(@Param("sellerId") String sellerId);

    @Query("select distinct o from CustomerOrder o join o.items i where i.sellerId = :sellerId and upper(coalesce(o.paymentStatus, '')) = 'PAID' order by o.createdAt desc")
    List<CustomerOrder> findPaidOrdersForSeller(@Param("sellerId") String sellerId);

    Optional<CustomerOrder> findByOrderCode(String orderCode);
}

