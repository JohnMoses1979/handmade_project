package com.example.seller.controller;

import com.example.seller.service.RazorpayService;
import com.example.seller.entity.RefundTransaction;
import com.example.seller.repository.RefundTransactionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final RazorpayService razorpayService;
    private final RefundTransactionRepository refundTransactionRepository;

    public PaymentController(RazorpayService razorpayService, RefundTransactionRepository refundTransactionRepository) {
        this.razorpayService = razorpayService;
        this.refundTransactionRepository = refundTransactionRepository;
    }

    @PostMapping("/razorpay/order")
    public ResponseEntity<Map<String, Object>> createRazorpayOrder(@RequestBody Map<String, Object> request) {
        Double amount = Double.valueOf(String.valueOf(request.getOrDefault("amount", "0")));
        String receipt = String.valueOf(request.getOrDefault("receipt", ""));
        return ResponseEntity.ok(razorpayService.createOrder(amount, receipt));
    }

    @PostMapping("/razorpay/payment-link")
    public ResponseEntity<Map<String, Object>> createRazorpayPaymentLink(@RequestBody Map<String, Object> request) {
        Double amount = Double.valueOf(String.valueOf(request.getOrDefault("amount", "0")));
        String receipt = String.valueOf(request.getOrDefault("receipt", ""));
        String description = String.valueOf(request.getOrDefault("description", ""));
        Map<String, Object> customer = copyMap(request.get("customer"));
        return ResponseEntity.ok(razorpayService.createPaymentLink(amount, receipt, customer, description));
    }

    @PostMapping("/razorpay/mobile-session")
    public ResponseEntity<Map<String, Object>> createMobileCheckoutSession(
            @RequestBody Map<String, Object> request,
            HttpServletRequest httpRequest
    ) {
        Double amount = Double.valueOf(String.valueOf(request.getOrDefault("amount", "0")));
        String receipt = String.valueOf(request.getOrDefault("receipt", ""));
        String description = String.valueOf(request.getOrDefault("description", ""));
        Map<String, Object> customer = copyMap(request.get("customer"));
        Map<String, Object> result = razorpayService.createMobileCheckoutSession(amount, receipt, customer, description);
        if (Boolean.TRUE.equals(result.get("success"))) {
            String baseUrl = ServletUriComponentsBuilder.fromRequestUri(httpRequest)
                    .replacePath(null)
                    .build()
                    .toUriString();
            String checkoutUrl = baseUrl + "/api/payments/razorpay/mobile-checkout/" + result.get("sessionId");
            Map<String, Object> response = new LinkedHashMap<>(result);
            response.put("checkoutUrl", checkoutUrl);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/razorpay/mobile-checkout/{sessionId}")
    public ResponseEntity<String> renderMobileCheckout(@PathVariable String sessionId, HttpServletRequest httpRequest) {
        String baseUrl = ServletUriComponentsBuilder.fromRequestUri(httpRequest)
                .replacePath(null)
                .build()
                .toUriString();
        return ResponseEntity.ok()
                .header("Content-Type", "text/html; charset=utf-8")
                .body(razorpayService.renderMobileCheckoutPage(sessionId, baseUrl));
    }

    @GetMapping("/razorpay/mobile-complete/{sessionId}")
    public ResponseEntity<String> completeMobileCheckout(
            @PathVariable String sessionId,
            @RequestParam(name = "razorpay_order_id") String orderId,
            @RequestParam(name = "razorpay_payment_id") String paymentId,
            @RequestParam(name = "razorpay_signature") String signature
    ) {
        Map<String, Object> result = razorpayService.completeMobileCheckout(sessionId, orderId, paymentId, signature);
        String message = Boolean.TRUE.equals(result.get("success"))
                ? "Payment completed successfully. You can return to the app."
                : String.valueOf(result.getOrDefault("message", "Payment failed."));
        String title = Boolean.TRUE.equals(result.get("success")) ? "Payment Success" : "Payment Failed";
        return ResponseEntity.ok()
                .header("Content-Type", "text/html; charset=utf-8")
                .body("""
                        <!doctype html>
                        <html>
                        <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>%s</title></head>
                        <body style="font-family:Arial,sans-serif;padding:24px;background:#f6f8fb;color:#0f172a;">
                          <div style="max-width:480px;margin:40px auto;background:#fff;border:1px solid #e2e8f0;border-radius:20px;padding:24px;">
                            <h1 style="margin-top:0;">%s</h1>
                            <p>%s</p>
                          </div>
                        </body>
                        </html>
                        """.formatted(title, title, message));
    }

    @GetMapping("/razorpay/mobile-status/{sessionId}")
    public ResponseEntity<Map<String, Object>> getMobileCheckoutStatus(@PathVariable String sessionId) {
        return ResponseEntity.ok(razorpayService.getMobileCheckoutSession(sessionId));
    }

    @GetMapping("/razorpay/payment-link/{paymentLinkId}")
    public ResponseEntity<Map<String, Object>> fetchRazorpayPaymentLink(@PathVariable String paymentLinkId) {
        return ResponseEntity.ok(razorpayService.fetchPaymentLink(paymentLinkId));
    }

    @PostMapping("/razorpay/verify")
    public ResponseEntity<Map<String, Object>> verifyRazorpayPayment(@RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(razorpayService.verifyPayment(
                String.valueOf(request.get("razorpay_order_id")),
                String.valueOf(request.get("razorpay_payment_id")),
                String.valueOf(request.get("razorpay_signature"))
        ));
    }

    @PostMapping("/razorpay/payments/{paymentId}/refund")
    public ResponseEntity<Map<String, Object>> refundRazorpayPayment(
            @PathVariable String paymentId,
            @RequestBody Map<String, Object> request
    ) {
        Double amount = Double.valueOf(String.valueOf(request.getOrDefault("amount", "0")));
        String receipt = String.valueOf(request.getOrDefault("receipt", ""));
        Map<String, Object> refundResponse = razorpayService.refundPayment(paymentId, amount, receipt);

        if (Boolean.TRUE.equals(refundResponse.get("success"))) {
            String sellerId = String.valueOf(request.getOrDefault("sellerId", ""));
            if (!sellerId.isBlank()) {
                RefundTransaction transaction = new RefundTransaction();
                transaction.setSellerId(sellerId);
                transaction.setSellerName(String.valueOf(request.getOrDefault("sellerName", "")));
                transaction.setOrderId(String.valueOf(request.getOrDefault("orderId", "")));
                transaction.setOrderCode(String.valueOf(request.getOrDefault("orderCode", request.getOrDefault("orderId", ""))));
                transaction.setProductId(String.valueOf(request.getOrDefault("productId", "")));
                transaction.setProductName(String.valueOf(request.getOrDefault("productName", "")));
                transaction.setCustomerEmail(String.valueOf(request.getOrDefault("customerEmail", "")));
                transaction.setCustomerName(String.valueOf(request.getOrDefault("customerName", "")));
                transaction.setRefundReceipt(receipt);
                transaction.setRazorpayPaymentId(paymentId);
                transaction.setRazorpayRefundId(String.valueOf(refundResponse.getOrDefault("refundId", "")));
                transaction.setAmount(amount);
                transaction.setCurrency(String.valueOf(refundResponse.getOrDefault("currency", "INR")));
                transaction.setStatus(String.valueOf(refundResponse.getOrDefault("status", "created")));
                transaction.setSource("return_refund");
                transaction.setCreatedAt(LocalDateTime.now());
                refundTransactionRepository.save(transaction);
                Map<String, Object> normalized = new LinkedHashMap<>();
                normalized.put("success", true);
                normalized.put("refundId", refundResponse.get("refundId"));
                normalized.put("paymentId", refundResponse.get("paymentId"));
                normalized.put("amount", refundResponse.get("amount"));
                normalized.put("currency", refundResponse.get("currency"));
                normalized.put("status", refundResponse.get("status"));
                normalized.put("recorded", true);
                refundResponse = normalized;
            }
        }

        return ResponseEntity.ok(refundResponse);
    }

    private Map<String, Object> copyMap(Object value) {
        Map<String, Object> copy = new LinkedHashMap<>();
        if (value instanceof Map<?, ?> rawMap) {
            rawMap.forEach((key, entryValue) -> {
                if (key != null) {
                    copy.put(String.valueOf(key), entryValue);
                }
            });
        }
        return copy;
    }
}
