package com.example.seller.repository;

import com.example.seller.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
    Optional<ProductCategory> findByNameIgnoreCaseAndParentCategoryIsNull(String name);
    Optional<ProductCategory> findByNameIgnoreCaseAndParentCategory_Id(String name, Long parentCategoryId);
    List<ProductCategory> findByParentCategoryIsNullOrderByNameAsc();
    List<ProductCategory> findByParentCategory_IdOrderByNameAsc(Long parentCategoryId);
}
