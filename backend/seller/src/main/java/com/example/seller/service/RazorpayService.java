package com.example.seller.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.HexFormat;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RazorpayService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Value("${razorpay.currency:INR}")
    private String currency;

    @Value("${razorpay.payout.account-number:}")
    private String payoutAccountNumber;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, Map<String, Object>> mobileCheckoutSessions = new ConcurrentHashMap<>();

    public Map<String, Object> createOrder(Double amount, String receipt) {
        try {
            long amountInPaise = Math.round((amount == null ? 0 : amount) * 100);
            if (amountInPaise <= 0) {
                return Map.of("success", false, "message", "Invalid payment amount");
            }

            Map<String, Object> payload = new HashMap<>();
            payload.put("amount", amountInPaise);
            payload.put("currency", currency);
            payload.put("receipt", receipt == null || receipt.isBlank() ? "selfbusiness_receipt" : receipt);
            payload.put("payment_capture", 1);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.razorpay.com/v1/orders"))
                    .header("Authorization", "Basic " + razorpayCredentials())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            Map<String, Object> razorpayResponse =
                    objectMapper.readValue(response.body(), new TypeReference<Map<String, Object>>() {});

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return Map.of(
                        "success", false,
                        "message", formatRazorpayError(response.statusCode(), razorpayResponse, "Unable to create Razorpay order")
                );
            }

            return Map.of(
                    "success", true,
                    "keyId", keyId,
                    "orderId", razorpayResponse.get("id"),
                    "amount", razorpayResponse.get("amount"),
                    "currency", razorpayResponse.get("currency")
            );
        } catch (Exception e) {
            return Map.of("success", false, "message", e.getMessage());
        }
    }

    public Map<String, Object> createPaymentLink(Double amount, String receipt, Map<String, Object> customer, String description) {
        try {
            long amountInPaise = Math.round((amount == null ? 0 : amount) * 100);
            if (amountInPaise <= 0) {
                return Map.of("success", false, "message", "Invalid payment amount");
            }

            Map<String, Object> payload = new HashMap<>();
            payload.put("amount", amountInPaise);
            payload.put("currency", currency);
            payload.put("reference_id", receipt == null || receipt.isBlank() ? "selfbusiness_payment" : receipt);
            payload.put("description", description == null || description.isBlank() ? "Selfbusiness order payment" : description);
            payload.put("accept_partial", false);
            payload.put("reminder_enable", false);

            if (customer != null && !customer.isEmpty()) {
                payload.put("customer", customer);
            }

            Map<String, Object> notify = new HashMap<>();
            notify.put("sms", true);
            notify.put("email", true);
            payload.put("notify", notify);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.razorpay.com/v1/payment_links/"))
                    .header("Authorization", "Basic " + razorpayCredentials())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            Map<String, Object> razorpayResponse =
                    objectMapper.readValue(response.body(), new TypeReference<Map<String, Object>>() {});

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return Map.of(
                        "success", false,
                        "message", formatRazorpayError(response.statusCode(), razorpayResponse, "Unable to create Razorpay payment link")
                );
            }

            return Map.of(
                    "success", true,
                    "keyId", keyId,
                    "paymentLinkId", razorpayResponse.get("id"),
                    "referenceId", razorpayResponse.get("reference_id"),
                    "shortUrl", razorpayResponse.get("short_url"),
                    "status", razorpayResponse.get("status"),
                    "amount", razorpayResponse.get("amount"),
                    "currency", razorpayResponse.get("currency")
            );
        } catch (Exception e) {
            return Map.of("success", false, "message", e.getMessage());
        }
    }

    public Map<String, Object> createMobileCheckoutSession(Double amount, String receipt, Map<String, Object> customer, String description) {
        Map<String, Object> order = createOrder(amount, receipt);
        if (!Boolean.TRUE.equals(order.get("success"))) {
            return order;
        }

        String sessionId = UUID.randomUUID().toString();
        Map<String, Object> session = new ConcurrentHashMap<>();
        session.put("sessionId", sessionId);
        session.put("status", "pending");
        session.put("receipt", receipt);
        session.put("description", description == null ? "" : description);
        session.put("customer", customer == null ? Collections.emptyMap() : new HashMap<>(customer));
        session.put("orderId", order.get("orderId"));
        session.put("amount", order.get("amount"));
        session.put("currency", order.get("currency"));
        session.put("keyId", order.get("keyId"));
        session.put("paymentMethod", "Razorpay");
        mobileCheckoutSessions.put(sessionId, session);

        return Map.of(
                "success", true,
                "sessionId", sessionId,
                "checkoutUrl", "/api/payments/razorpay/mobile-checkout/" + sessionId
        );
    }

    public Map<String, Object> getMobileCheckoutSession(String sessionId) {
        Map<String, Object> session = mobileCheckoutSessions.get(sessionId);
        if (session == null) {
            return Map.of("success", false, "message", "Mobile checkout session not found");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("sessionId", session.get("sessionId"));
        response.put("status", session.get("status"));
        response.put("receipt", session.get("receipt"));
        response.put("description", session.get("description"));
        response.put("customer", session.get("customer"));
        response.put("orderId", session.get("orderId"));
        response.put("amount", session.get("amount"));
        response.put("currency", session.get("currency"));
        response.put("keyId", session.get("keyId"));
        response.put("payment", session.get("payment"));
        response.put("message", session.get("message"));
        return response;
    }

    public String renderMobileCheckoutPage(String sessionId, String baseUrl) {
        Map<String, Object> session = mobileCheckoutSessions.get(sessionId);
        if (session == null) {
            return simpleHtmlPage("Session not found", "This payment session expired or does not exist.");
        }

        Map<String, Object> customer = safeMap(session.get("customer"));
        Map<String, Object> config = new HashMap<>();
        config.put("sessionId", sessionId);
        config.put("keyId", session.get("keyId"));
        config.put("orderId", session.get("orderId"));
        config.put("amount", session.get("amount"));
        config.put("currency", session.get("currency"));
        config.put("description", session.get("description"));
        config.put("completeUrl", baseUrl + "/api/payments/razorpay/mobile-complete/" + sessionId);
        config.put("customer", Map.of(
                "name", String.valueOf(customer.getOrDefault("name", "Customer")),
                "email", String.valueOf(customer.getOrDefault("email", "")),
                "contact", String.valueOf(customer.getOrDefault("contact", ""))
        ));

        try {
            String configJson = objectMapper.writeValueAsString(config);
            String orderId = String.valueOf(session.get("orderId"));
            String amount = String.valueOf(session.get("amount"));
            String html = """
                <!doctype html>
                <html>
                <head>
                  <meta charset="utf-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1" />
                  <title>Selfbusiness Payment</title>
                  <style>
                    body { font-family: Arial, sans-serif; background:#f6f8fb; margin:0; padding:24px; color:#0f172a; }
                    .card { max-width:480px; margin:40px auto; background:#fff; border:1px solid #e2e8f0; border-radius:20px; padding:24px; box-shadow:0 12px 30px rgba(15,23,42,.08); }
                    .title { font-size:22px; font-weight:800; margin:0 0 8px; }
                    .sub { color:#64748b; margin:0 0 20px; line-height:1.5; }
                    .btn { display:inline-block; width:100%%; padding:14px 16px; border-radius:14px; border:0; background:#082843; color:#fff; font-size:16px; font-weight:700; cursor:pointer; }
                    .meta { margin-top:16px; font-size:13px; color:#475569; }
                    .error { color:#b91c1c; font-weight:700; margin-top:12px; }
                  </style>
                  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
                </head>
                <body>
                  <div class="card">
                    <h1 class="title">Complete your payment</h1>
                    <p class="sub">A secure Razorpay checkout will open now. After payment, return to the app.</p>
                    <button class="btn" id="payBtn">Pay now</button>
                    <div class="meta">Order: %s</div>
                    <div class="meta">Amount: ₹%s</div>
                    <div class="error" id="errorBox" style="display:none;"></div>
                  </div>
                  <script>
                    const config = %s;
                    function showError(message) {
                      const box = document.getElementById('errorBox');
                      box.style.display = 'block';
                      box.textContent = message;
                    }
                    function startCheckout() {
                      if (!window.Razorpay) {
                        showError('Razorpay checkout did not load. Please refresh and try again.');
                        return;
                      }
                      const checkout = new Razorpay({
                        key: config.keyId,
                        amount: config.amount,
                        currency: config.currency,
                        name: 'Selfbusiness',
                        description: config.description || 'Payment',
                        order_id: config.orderId,
                        prefill: config.customer,
                        theme: { color: '#082843' },
                        handler: function(response) {
                          const params = new URLSearchParams(response).toString();
                          window.location.href = config.completeUrl + '?' + params;
                        },
                        modal: {
                          ondismiss: function() {
                            showError('Payment was cancelled.');
                          }
                        }
                      });
                      checkout.open();
                    }
                    document.getElementById('payBtn').addEventListener('click', startCheckout);
                    window.addEventListener('load', startCheckout);
                  </script>
                </body>
                </html>
                """.formatted(orderId, amount, configJson);
            return html;
        } catch (Exception e) {
            return simpleHtmlPage("Unable to start payment", e.getMessage() == null ? "Unknown error" : e.getMessage());
        }
    }

    public Map<String, Object> completeMobileCheckout(String sessionId, String orderId, String paymentId, String signature) {
        Map<String, Object> verification = verifyPayment(orderId, paymentId, signature);
        if (!Boolean.TRUE.equals(verification.get("success"))) {
            Map<String, Object> session = mobileCheckoutSessions.computeIfAbsent(sessionId, key -> new ConcurrentHashMap<>());
            session.put("status", "failed");
            session.put("message", verification.getOrDefault("message", "Payment verification failed"));
            return verification;
        }

        Map<String, Object> session = mobileCheckoutSessions.computeIfAbsent(sessionId, key -> new ConcurrentHashMap<>());
        session.put("status", "paid");
        session.put("payment", Map.of(
                "razorpay_order_id", orderId,
                "razorpay_payment_id", paymentId,
                "razorpay_signature", signature
        ));
        session.put("verification", verification);
        return Map.of("success", true, "message", "Payment completed");
    }

    private Map<String, Object> safeMap(Object value) {
        if (value instanceof Map<?, ?> rawMap) {
            Map<String, Object> copy = new HashMap<>();
            rawMap.forEach((key, entryValue) -> {
                if (key != null) {
                    copy.put(String.valueOf(key), entryValue);
                }
            });
            return copy;
        }
        return Collections.emptyMap();
    }

    private String simpleHtmlPage(String title, String message) {
        return "<!doctype html><html><head><meta charset=\"utf-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" /><title>"
                + escapeHtml(title)
                + "</title></head><body style=\"font-family:Arial,sans-serif;padding:24px;background:#f6f8fb;color:#0f172a;\">"
                + "<div style=\"max-width:480px;margin:40px auto;background:#fff;border:1px solid #e2e8f0;border-radius:20px;padding:24px;\">"
                + "<h1 style=\"margin-top:0;\">"
                + escapeHtml(title)
                + "</h1><p>"
                + escapeHtml(message)
                + "</p></div></body></html>";
    }

    private String escapeHtml(String value) {
        if (value == null) return "";
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }

    public Map<String, Object> fetchPaymentLink(String paymentLinkId) {
        try {
            if (paymentLinkId == null || paymentLinkId.isBlank()) {
                return Map.of("success", false, "message", "Payment link id is required");
            }

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.razorpay.com/v1/payment_links/" + paymentLinkId))
                    .header("Authorization", "Basic " + razorpayCredentials())
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            Map<String, Object> razorpayResponse =
                    objectMapper.readValue(response.body(), new TypeReference<Map<String, Object>>() {});

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return Map.of(
                        "success", false,
                        "message", formatRazorpayError(response.statusCode(), razorpayResponse, "Unable to fetch Razorpay payment link")
                );
            }

            return Map.of(
                    "success", true,
                    "paymentLinkId", razorpayResponse.get("id"),
                    "referenceId", razorpayResponse.get("reference_id"),
                    "shortUrl", razorpayResponse.get("short_url"),
                    "status", razorpayResponse.get("status"),
                    "amount", razorpayResponse.get("amount"),
                    "currency", razorpayResponse.get("currency"),
                    "payments", razorpayResponse.get("payments")
            );
        } catch (Exception e) {
            return Map.of("success", false, "message", e.getMessage());
        }
    }

    public Map<String, Object> verifyPayment(String orderId, String paymentId, String signature) {
        try {
            String payload = orderId + "|" + paymentId;
            Mac hmac = Mac.getInstance("HmacSHA256");
            hmac.init(new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            String expectedSignature = HexFormat.of().formatHex(hmac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
            boolean verified = expectedSignature.equals(signature);

            return Map.of(
                    "success", verified,
                    "message", verified ? "Payment verified" : "Payment verification failed"
            );
        } catch (Exception e) {
            return Map.of("success", false, "message", e.getMessage());
        }
    }

    public Map<String, Object> refundPayment(String paymentId, Double amount, String receipt) {
        try {
            if (paymentId == null || paymentId.isBlank()) {
                return Map.of("success", false, "message", "Razorpay payment id is required");
            }

            long requestedAmountInPaise = Math.round((amount == null ? 0 : amount) * 100);
            if (requestedAmountInPaise <= 0) {
                return Map.of("success", false, "message", "Invalid refund amount");
            }

            Map<String, Object> paymentDetails = fetchPaymentDetails(paymentId);
            long paymentAmountInPaise = toLong(paymentDetails.get("amount"));
            long refundedAmountInPaise = toLong(paymentDetails.get("amount_refunded"));
            long remainingRefundableInPaise = paymentAmountInPaise > 0
                    ? Math.max(paymentAmountInPaise - refundedAmountInPaise, 0)
                    : requestedAmountInPaise;

            long amountInPaise = Math.min(requestedAmountInPaise, remainingRefundableInPaise);
            if (amountInPaise <= 0) {
                return Map.of(
                        "success", true,
                        "refundId", paymentDetails.getOrDefault("last_refund_id", ""),
                        "paymentId", paymentId,
                        "amount", 0,
                        "currency", paymentDetails.getOrDefault("currency", currency),
                        "status", "processed",
                        "message", "Payment already fully refunded"
                );
            }

            Map<String, Object> payload = new HashMap<>();
            payload.put("amount", amountInPaise);
            payload.put("speed", "optimum");
            if (receipt != null && !receipt.isBlank()) {
                payload.put("receipt", receipt);
            }

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.razorpay.com/v1/payments/" + paymentId + "/refund"))
                    .header("Authorization", "Basic " + razorpayCredentials())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            Map<String, Object> razorpayResponse =
                    objectMapper.readValue(response.body(), new TypeReference<Map<String, Object>>() {});

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                String message = extractRazorpayMessage(razorpayResponse);
                if (isAlreadyRefundedMessage(message)) {
                    return Map.of(
                            "success", true,
                            "refundId", razorpayResponse.getOrDefault("id", ""),
                            "paymentId", paymentId,
                            "amount", amountInPaise,
                            "currency", razorpayResponse.getOrDefault("currency", currency),
                            "status", "processed",
                            "message", message
                    );
                }
                return Map.of(
                        "success", false,
                        "message", "HTTP " + response.statusCode() + ": " + message
                );
            }

            return Map.of(
                    "success", true,
                    "refundId", razorpayResponse.get("id"),
                    "paymentId", razorpayResponse.get("payment_id"),
                    "amount", razorpayResponse.get("amount"),
                    "currency", razorpayResponse.get("currency"),
                    "status", razorpayResponse.get("status")
            );
        } catch (Exception e) {
            return Map.of("success", false, "message", e.getMessage());
        }
    }

    private Map<String, Object> fetchPaymentDetails(String paymentId) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.razorpay.com/v1/payments/" + paymentId))
                    .header("Authorization", "Basic " + razorpayCredentials())
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            Map<String, Object> razorpayResponse =
                    objectMapper.readValue(response.body(), new TypeReference<Map<String, Object>>() {});

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return Map.of();
            }

            return razorpayResponse;
        } catch (Exception e) {
            return Map.of();
        }
    }

    private long toLong(Object value) {
        if (value == null) return 0L;
        if (value instanceof Number number) return number.longValue();
        try {
            return Math.round(Double.parseDouble(String.valueOf(value)));
        } catch (Exception e) {
            return 0L;
        }
    }

    private String extractRazorpayMessage(Map<String, Object> razorpayResponse) {
        Object error = razorpayResponse.get("error");
        if (error instanceof Map<?, ?> errorMap) {
            Object description = errorMap.get("description");
            if (description != null) {
                return String.valueOf(description);
            }
            Object message = errorMap.get("message");
            if (message != null) {
                return String.valueOf(message);
            }
            return errorMap.toString();
        }

        if (error != null) {
            return String.valueOf(error);
        }

        Object message = razorpayResponse.get("message");
        if (message != null) {
            return String.valueOf(message);
        }

        return "Unable to create Razorpay refund";
    }

    private String formatRazorpayError(int statusCode, Map<String, Object> responseBody, String fallbackMessage) {
        String message = extractRazorpayMessage(responseBody);
        if (message == null || message.isBlank()) {
            message = fallbackMessage;
        }
        return "HTTP " + statusCode + ": " + message;
    }

    private boolean isAlreadyRefundedMessage(String message) {
        String value = message == null ? "" : message.toLowerCase();
        return value.contains("already been refunded") || value.contains("already refunded");
    }
    public Map<String, Object> createPayout(
            Double amount,
            String reference,
            String notes,
            String contactName,
            String contactEmail,
            String contactPhone,
            String bankAccountHolderName,
            String bankAccountNumber,
            String bankIfscCode
    ) {
        try {
            long amountInPaise = Math.round((amount == null ? 0 : amount) * 100);
            if (amountInPaise <= 0) {
                return Map.of("success", false, "message", "Invalid payout amount");
            }

            if (payoutAccountNumber == null || payoutAccountNumber.isBlank()) {
                return Map.of(
                        "success", false,
                        "message", "Razorpay payout account number is not configured."
                );
            }

            if (bankAccountNumber == null || bankAccountNumber.isBlank() || bankIfscCode == null || bankIfscCode.isBlank()) {
                return Map.of(
                        "success", false,
                        "message", "Seller bank account details are required for Razorpay payouts."
                );
            }

            Map<String, Object> contactResponse = createContact(
                    contactName,
                    contactEmail,
                    contactPhone,
                    reference
            );
            if (!Boolean.TRUE.equals(contactResponse.get("success"))) {
                return contactResponse;
            }

            String contactId = String.valueOf(contactResponse.getOrDefault("contactId", ""));
            Map<String, Object> fundAccountResponse = createBankFundAccount(
                    contactId,
                    bankAccountHolderName,
                    bankIfscCode,
                    bankAccountNumber
            );
            if (!Boolean.TRUE.equals(fundAccountResponse.get("success"))) {
                return fundAccountResponse;
            }

            String fundAccountId = String.valueOf(fundAccountResponse.getOrDefault("fundAccountId", ""));

            Map<String, Object> payload = new HashMap<>();
            payload.put("account_number", payoutAccountNumber);
            payload.put("fund_account_id", fundAccountId);
            payload.put("amount", amountInPaise);
            payload.put("currency", currency);
            payload.put("mode", "IMPS");
            payload.put("purpose", "vendor bill");
            payload.put("queue_if_low_balance", true);
            payload.put("reference_id", reference == null || reference.isBlank() ? "seller_withdrawal" : reference);
            payload.put("narration", firstNonBlank(notes, "Seller payout withdrawal"));
            Map<String, Object> noteMap = new HashMap<>();
            noteMap.put("seller_name", firstNonBlank(contactName, "Seller"));
            noteMap.put("reference", firstNonBlank(reference, ""));
            payload.put("notes", noteMap);

            HttpRequest request = signedJsonRequest(
                    "https://api.razorpay.com/v1/payouts",
                    payload,
                    reference
            );
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            Map<String, Object> razorpayResponse = parseJsonResponse(response.body());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return Map.of(
                        "success", false,
                        "message", String.valueOf(razorpayResponse.getOrDefault("error", razorpayResponse.getOrDefault("message", "Unable to create Razorpay payout")))
                );
            }

            return Map.of(
                    "success", true,
                    "contactId", contactId,
                    "fundAccountId", fundAccountId,
                    "payoutId", String.valueOf(razorpayResponse.getOrDefault("id", "pout_" + UUID.randomUUID())),
                    "reference", reference == null ? "" : reference,
                    "amount", razorpayResponse.getOrDefault("amount", amountInPaise),
                    "currency", razorpayResponse.getOrDefault("currency", currency),
                    "status", razorpayResponse.getOrDefault("status", "queued"),
                    "message", "Payout request created"
            );
        } catch (Exception e) {
            return Map.of("success", false, "message", e.getMessage());
        }
    }

    private Map<String, Object> createContact(String name, String email, String contact, String referenceId) throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("name", firstNonBlank(name, "Seller"));
        if (email != null && !email.isBlank()) {
            payload.put("email", email);
        }
        if (contact != null && !contact.isBlank()) {
            payload.put("contact", contact);
        }
        payload.put("type", "vendor");
        payload.put("reference_id", firstNonBlank(referenceId, "seller_contact"));

        HttpRequest request = signedJsonRequest("https://api.razorpay.com/v1/contacts", payload, referenceId);
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        Map<String, Object> razorpayResponse = parseJsonResponse(response.body());

        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            return Map.of(
                    "success", false,
                    "message", String.valueOf(razorpayResponse.getOrDefault("error", razorpayResponse.getOrDefault("message", "Unable to create Razorpay contact")))
            );
        }

        return Map.of(
                "success", true,
                "contactId", String.valueOf(razorpayResponse.getOrDefault("id", "")),
                "contact", razorpayResponse
        );
    }

    private Map<String, Object> createBankFundAccount(String contactId, String name, String ifsc, String accountNumber) throws Exception {
        Map<String, Object> bankAccount = new HashMap<>();
        bankAccount.put("name", firstNonBlank(name, "Seller"));
        bankAccount.put("ifsc", ifsc);
        bankAccount.put("account_number", accountNumber);

        Map<String, Object> payload = new HashMap<>();
        payload.put("contact_id", contactId);
        payload.put("account_type", "bank_account");
        payload.put("bank_account", bankAccount);

        HttpRequest request = signedJsonRequest("https://api.razorpay.com/v1/fund_accounts", payload, contactId);
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        Map<String, Object> razorpayResponse = parseJsonResponse(response.body());

        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            return Map.of(
                    "success", false,
                    "message", String.valueOf(razorpayResponse.getOrDefault("error", razorpayResponse.getOrDefault("message", "Unable to create Razorpay fund account")))
            );
        }

        return Map.of(
                "success", true,
                "fundAccountId", String.valueOf(razorpayResponse.getOrDefault("id", "")),
                "fundAccount", razorpayResponse
        );
    }

    private HttpRequest signedJsonRequest(String url, Map<String, Object> payload, String idempotencySeed) throws Exception {
        String credentials = Base64.getEncoder()
                .encodeToString((keyId + ":" + keySecret).getBytes(StandardCharsets.UTF_8));
        String idempotencyKey = UUID.nameUUIDFromBytes(
                firstNonBlank(idempotencySeed, url, UUID.randomUUID().toString()).getBytes(StandardCharsets.UTF_8)
        ).toString();

        return HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", "Basic " + credentials)
                .header("Content-Type", "application/json")
                .header("X-Payout-Idempotency", idempotencyKey)
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                .build();
    }

    private Map<String, Object> parseJsonResponse(String body) {
        try {
            return objectMapper.readValue(body, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            Map<String, Object> map = new HashMap<>();
            map.put("message", body == null ? "" : body);
            return map;
        }
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return "";
    }

    private String razorpayCredentials() {
        return Base64.getEncoder()
                .encodeToString((keyId + ":" + keySecret).getBytes(StandardCharsets.UTF_8));
    }
}
