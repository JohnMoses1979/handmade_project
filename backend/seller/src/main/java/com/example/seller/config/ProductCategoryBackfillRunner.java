package com.example.seller.config;

import com.example.seller.service.SellerService;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class ProductCategoryBackfillRunner {

    private final SellerService sellerService;

    public ProductCategoryBackfillRunner(SellerService sellerService) {
        this.sellerService = sellerService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void backfillCategoriesAfterStartup() {
        try {
            sellerService.backfillProductCategories();
        } catch (Exception ex) {
            System.err.println("Product category backfill skipped: " + ex.getMessage());
        }
    }
}
