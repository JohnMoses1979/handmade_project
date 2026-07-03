package com.example.seller.service;

import com.example.seller.dto.*;
import com.example.seller.entity.CustomerOrder;
import com.example.seller.entity.CustomerOrderItem;
import com.example.seller.entity.Product;
import com.example.seller.entity.ProductCategory;
import com.example.seller.entity.RefundTransaction;
import com.example.seller.entity.Seller;
import com.example.seller.entity.SellerPayoutRequest;
import com.example.seller.repository.CustomerOrderRepository;
import com.example.seller.repository.ProductCategoryRepository;
import com.example.seller.repository.ProductRepository;
import com.example.seller.repository.RefundTransactionRepository;
import com.example.seller.repository.SellerPayoutRequestRepository;
import com.example.seller.repository.SellerRepository;
import com.example.seller.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SellerService {
    private static final SecureRandom OTP_RANDOM = new SecureRandom();

    private final SellerRepository sellerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private final CustomerOrderRepository customerOrderRepository;
    private final SellerPayoutRequestRepository sellerPayoutRequestRepository;
    private final RefundTransactionRepository refundTransactionRepository;
    private final RazorpayService razorpayService;
    private final ProductCategoryRepository productCategoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Value("${file.upload.dir}")
    private String uploadDir;

    public SellerService(SellerRepository sellerRepository,
                         PasswordEncoder passwordEncoder,
                         JwtUtil jwtUtil,
                         EmailService emailService,
                         CustomerOrderRepository customerOrderRepository,
                         SellerPayoutRequestRepository sellerPayoutRequestRepository,
                         RefundTransactionRepository refundTransactionRepository,
                         RazorpayService razorpayService,
                         ProductCategoryRepository productCategoryRepository) {
        this.sellerRepository = sellerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
        this.customerOrderRepository = customerOrderRepository;
        this.sellerPayoutRequestRepository = sellerPayoutRequestRepository;
        this.refundTransactionRepository = refundTransactionRepository;
        this.razorpayService = razorpayService;
        this.productCategoryRepository = productCategoryRepository;
    }

    public Map<String, Object> register(SellerRegisterRequest req,
                                        List<MultipartFile> documents) throws IOException {
        String normalizedEmail = req.getEmail() == null ? "" : req.getEmail().trim().toLowerCase();
        if (normalizedEmail.isBlank()) {
            return Map.of("success", false, "message", "Email is required");
        }
        if (req.getPassword() == null || req.getPassword().trim().length() < 6) {
            return Map.of("success", false, "message", "Password must be at least 6 characters");
        }
        if (sellerRepository.existsByEmail(normalizedEmail)) {
            return Map.of("success", false, "message", "Email already registered");
        }

        List<String> docPaths = new ArrayList<>();
        if (documents != null) {
            java.nio.file.Path dirPath = java.nio.file.Paths.get(uploadDir).toAbsolutePath().normalize();
            java.io.File dir = dirPath.toFile();
            if (!dir.exists()) dir.mkdirs();

            for (MultipartFile file : documents) {
                if (!file.isEmpty()) {
                    String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                    java.nio.file.Path targetPath = dirPath.resolve(fileName);
                    file.transferTo(targetPath.toFile());
                    docPaths.add(targetPath.toString());
                }
            }
        }

        Seller seller = new Seller();
        seller.setName(req.getName());
        seller.setEmail(normalizedEmail);
        seller.setPassword(passwordEncoder.encode(req.getPassword()));
        seller.setPhone(req.getPhone());
        seller.setShopName(req.getShopName());
        seller.setCategory(req.getCategory());
        seller.setGst(req.getGst());
        seller.setDescription(req.getDescription());
        seller.setAddress(req.getAddress());
        seller.setDocumentPaths(docPaths);
        seller.setStatus(Seller.SellerStatus.PENDING);

        sellerRepository.save(seller);

        return Map.of("success", true,
                "message", "Registration successful. Waiting for admin approval.");
    }

    public Map<String, Object> login(LoginRequest req) {
        Optional<Seller> opt = sellerRepository.findByEmail(req.getEmail().trim().toLowerCase());
        if (opt.isEmpty()) return Map.of("success", false, "message", "Seller not found");

        Seller seller = opt.get();
        if (!passwordEncoder.matches(req.getPassword(), seller.getPassword())) {
            return Map.of("success", false, "message", "Invalid password");
        }

        if (seller.getStatus() != Seller.SellerStatus.APPROVED) {
            return Map.of("success", false, "message", "Seller is not approved yet");
        }

        String token = jwtUtil.generateToken(seller.getEmail());
        return Map.of("success", true, "token", token, "seller", seller);
    }

    public Map<String, Object> forgotPassword(String email) {
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase();
        Optional<Seller> optionalSeller = sellerRepository.findByEmail(normalizedEmail);
        if (optionalSeller.isEmpty()) {
            return Map.of("success", false, "message", "Seller not found");
        }

        Seller seller = optionalSeller.get();
        String otp = String.format("%06d", OTP_RANDOM.nextInt(1_000_000));
        seller.setOtp(otp);
        seller.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        sellerRepository.save(seller);

        emailService.sendOtpEmail(seller.getEmail(), otp);
        return Map.of("success", true, "message", "OTP sent to email");
    }

    public Map<String, Object> verifyOtp(String email, String otp) {
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase();
        Optional<Seller> optionalSeller = sellerRepository.findByEmail(normalizedEmail);
        if (optionalSeller.isEmpty()) {
            return Map.of("success", false, "message", "Seller not found");
        }

        Seller seller = optionalSeller.get();
        if (seller.getOtp() == null || !seller.getOtp().equals(otp)) {
            return Map.of("success", false, "message", "Invalid OTP");
        }
        if (seller.getOtpExpiry() == null || seller.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return Map.of("success", false, "message", "OTP expired");
        }

        return Map.of("success", true, "message", "OTP verified");
    }

    public Map<String, Object> resetPassword(String email, String newPassword) {
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase();
        Optional<Seller> optionalSeller = sellerRepository.findByEmail(normalizedEmail);
        if (optionalSeller.isEmpty()) {
            return Map.of("success", false, "message", "Seller not found");
        }

        Seller seller = optionalSeller.get();
        if (seller.getOtpExpiry() == null || seller.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return Map.of("success", false, "message", "OTP expired");
        }

        seller.setPassword(passwordEncoder.encode(newPassword));
        seller.setOtp(null);
        seller.setOtpExpiry(null);
        sellerRepository.save(seller);

        return Map.of("success", true, "message", "Password reset successfully");
    }

    public Map<String, Object> resetPassword(ResetPasswordRequest req) {
        Map<String, Object> otpResult = verifyOtp(req.getEmail(), req.getOtp());
        if (!Boolean.TRUE.equals(otpResult.get("success"))) {
            return otpResult;
        }

        return resetPassword(req.getEmail(), req.getNewPassword());
    }

    public List<Seller> getAllSellers() {
        return sellerRepository.findAll();
    }

    public List<Seller> getPendingSellers() {
        return sellerRepository.findByStatus(Seller.SellerStatus.PENDING);
    }

    public Map<String, Object> getSellerProfile(Long sellerId) {
        Optional<Seller> optionalSeller = sellerRepository.findById(sellerId);
        if (optionalSeller.isEmpty()) {
            return Map.of("success", false, "message", "Seller not found");
        }

        Seller seller = optionalSeller.get();
        return Map.of("success", true, "seller", seller, "settings", buildSellerSettings(seller));
    }

    public Map<String, Object> updateSellerProfile(Long sellerId, Map<String, Object> payload) {
        Optional<Seller> optionalSeller = sellerRepository.findById(sellerId);
        if (optionalSeller.isEmpty()) {
            return Map.of("success", false, "message", "Seller not found");
        }

        Seller seller = optionalSeller.get();
        String shopName = asString(payload.get("shopName"));
        String description = asString(payload.get("description"));
        String category = asString(payload.get("category"));
        String phone = asString(payload.get("phone"));
        String email = asString(payload.get("email"));
        String bankAccountHolderName = asString(payload.get("bankAccountHolderName"));
        String bankName = asString(payload.get("bankName"));
        String bankAccountNumber = asString(payload.get("bankAccountNumber"));
        String bankIfscCode = asString(payload.get("bankIfscCode"));

        if (!shopName.isBlank()) {
            seller.setShopName(shopName);
        }
        if (!description.isBlank()) {
            seller.setDescription(description);
        }
        if (!category.isBlank()) {
            seller.setCategory(category);
        }
        if (!phone.isBlank()) {
            seller.setPhone(phone);
        }
        if (!email.isBlank()) {
            seller.setEmail(email.toLowerCase());
        }
        if (!bankAccountHolderName.isBlank()) {
            seller.setBankAccountHolderName(bankAccountHolderName);
        }
        if (!bankName.isBlank()) {
            seller.setBankName(bankName);
        }
        if (!bankAccountNumber.isBlank()) {
            seller.setBankAccountNumber(bankAccountNumber);
        }
        if (!bankIfscCode.isBlank()) {
            seller.setBankIfscCode(bankIfscCode.toUpperCase());
        }

        Seller saved = sellerRepository.save(seller);
        return Map.of("success", true, "seller", saved);
    }

    public Map<String, Object> getSellerSettings(Long sellerId) {
        Optional<Seller> optionalSeller = sellerRepository.findById(sellerId);
        if (optionalSeller.isEmpty()) {
            return Map.of("success", false, "message", "Seller not found");
        }

        return Map.of("success", true, "settings", buildSellerSettings(optionalSeller.get()));
    }

    public Map<String, Object> updateSellerSettings(Long sellerId, Map<String, Object> payload) {
        Optional<Seller> optionalSeller = sellerRepository.findById(sellerId);
        if (optionalSeller.isEmpty()) {
            return Map.of("success", false, "message", "Seller not found");
        }

        Seller seller = optionalSeller.get();
        if (payload.containsKey("orderNotifications")) {
            seller.setOrderNotifications(asBoolean(payload.get("orderNotifications"), true));
        }
        if (payload.containsKey("promotionalUpdates")) {
            seller.setPromotionalUpdates(asBoolean(payload.get("promotionalUpdates"), false));
        }
        if (payload.containsKey("smsAlerts")) {
            seller.setSmsAlerts(asBoolean(payload.get("smsAlerts"), true));
        }
        if (payload.containsKey("emailUpdates")) {
            seller.setEmailUpdates(asBoolean(payload.get("emailUpdates"), true));
        }
        if (payload.containsKey("darkMode")) {
            seller.setDarkMode(asBoolean(payload.get("darkMode"), false));
        }
        if (payload.containsKey("autoAcceptOrders")) {
            seller.setAutoAcceptOrders(asBoolean(payload.get("autoAcceptOrders"), false));
        }

        Seller saved = sellerRepository.save(seller);
        return Map.of("success", true, "settings", buildSellerSettings(saved), "seller", saved);
    }

    public Map<String, Object> getSellerSupportContent() {
        return Map.of(
                "success", true,
                "faqs", List.of(
                        Map.of("q", "How do I add a new product?", "a", "Go to Dashboard -> Add Product. Fill in product details, images, price and stock, then submit for admin approval."),
                        Map.of("q", "When will my product go live?", "a", "After admin approval, the product becomes visible to customers automatically."),
                        Map.of("q", "How do I update bank details for payouts?", "a", "Open Payouts, enter your account holder name, bank name, account number and IFSC, then save the details."),
                        Map.of("q", "Why is my withdrawal disabled?", "a", "Withdrawals stay disabled until your available balance is ready and your bank details are saved."),
                        Map.of("q", "How are payments processed?", "a", "Customer payments are settled through the platform and reflected in your earnings and payouts."),
                        Map.of("q", "How do I handle returns?", "a", "Return requests appear in the Returns section where you can review and update them."),
                        Map.of("q", "Where can I view customer complaints?", "a", "Open the Complaints screen to see live complaints and respond quickly."),
                        Map.of("q", "What happens after resolving a complaint?", "a", "The complaint is marked resolved for both seller and admin, and the status updates in the dashboard."),
                        Map.of("q", "What is the 10% admin commission?", "a", "It covers platform operations, support, marketing and payment processing."),
                        Map.of("q", "How do I contact admin?", "a", "Use the quick contact options below or email support@craftymarketplace.in.")
                ),
                "quickActions", List.of(
                        Map.of("label", "Chat with Support", "type", "chat", "value", "live_chat"),
                        Map.of("label", "Email Us", "type", "email", "value", "support@craftymarketplace.in"),
                        Map.of("label", "Call Support", "type", "phone", "value", "+911800123456"),
                        Map.of("label", "Report a Bug", "type", "bug", "value", "support@craftymarketplace.in")
                ),
                "supportHours", List.of(
                        Map.of("day", "Monday - Saturday", "time", "9:00 AM - 9:00 PM"),
                        Map.of("day", "Sunday", "time", "Holiday"),
                        Map.of("day", "Emergency Help", "time", "24/7 in-app")
                )
        );
    }

    public Map<String, Object> approveSeller(Long sellerId) {
        Optional<Seller> optionalSeller = sellerRepository.findById(sellerId);
        if (optionalSeller.isEmpty()) {
            return Map.of("success", false, "message", "Seller not found");
        }

        Seller seller = optionalSeller.get();
        seller.setStatus(Seller.SellerStatus.APPROVED);
        sellerRepository.save(seller);

        return Map.of("success", true, "message", "Seller approved successfully");
    }

    public Map<String, Object> rejectSeller(Long sellerId, String reason) {
        Optional<Seller> optionalSeller = sellerRepository.findById(sellerId);
        if (optionalSeller.isEmpty()) {
            return Map.of("success", false, "message", "Seller not found");
        }

        Seller seller = optionalSeller.get();
        seller.setStatus(Seller.SellerStatus.REJECTED);
        sellerRepository.save(seller);

        return Map.of(
                "success", true,
                "message", "Seller rejected successfully",
                "reason", reason == null ? "" : reason
        );
    }

    public Map<String, Object> addProduct(Long sellerId,
                                          String sellerEmail,
                                          String sellerName,
                                          Map<String, Object> data,
                                          List<MultipartFile> images) throws IOException {
        List<String> imagePaths = new ArrayList<>();
        if (images != null) {
            java.nio.file.Path dirPath = java.nio.file.Paths.get(uploadDir).toAbsolutePath().normalize();
            java.io.File dir = dirPath.toFile();
            if (!dir.exists()) dir.mkdirs();

            for (MultipartFile file : images) {
                if (!file.isEmpty()) {
                    String originalName = Objects.requireNonNullElse(file.getOriginalFilename(), "image.jpg");
                    String safeOriginalName = sanitizeFileName(originalName);
                    String fileName = UUID.randomUUID() + "_" + safeOriginalName;
                    java.nio.file.Path targetPath = dirPath.resolve(fileName);
                    file.transferTo(targetPath.toFile());
                    imagePaths.add(targetPath.toString());
                }
            }
        }

        Product product = new Product();
        product.setSellerId(sellerId);
        product.setSellerEmail(sellerEmail);
        product.setSellerName(sellerName);
        product.setName((String) data.get("name"));
        product.setCategory(normalizeCatalogCategory((String) data.get("category")));
        product.setSubcategory((String) data.get("subcategory"));
        product.setPrice(asDouble(data.get("price")));
        product.setFinalPrice(asDouble(data.get("finalPrice")));
        product.setDiscount(asInteger(data.get("discount")));
        product.setStock(asInteger(data.get("stock")));
        product.setWeight((String) data.get("weight"));
        product.setDescription((String) data.get("description"));
        product.setMaterial((String) data.get("material"));
        product.setColor((String) data.get("color"));
        product.setSize((String) data.get("size"));
        product.setImagePaths(imagePaths);
        String status = String.valueOf(data.getOrDefault("status", "PENDING")).toUpperCase();
        product.setStatus("APPROVED".equals(status) ? Product.ProductStatus.APPROVED : Product.ProductStatus.PENDING);
        product.setPaymentStatus((String) data.get("paymentStatus"));
        product.setUploadFee(asDouble(data.get("uploadFee")));
        product.setPaymentMethod((String) data.get("paymentMethod"));
        product.setActive(data.get("active") == null || Boolean.parseBoolean(String.valueOf(data.get("active"))));
        product.setPaidAt(data.get("paidAt") instanceof LocalDateTime
                ? (LocalDateTime) data.get("paidAt")
                : LocalDateTime.now());
        if (product.getStatus() == Product.ProductStatus.APPROVED) {
            product.setApprovedAt(LocalDateTime.now());
        }

        Product saved = productRepository.save(product);
        syncProductCategories(saved.getCategory(), saved.getSubcategory(), firstImagePath(imagePaths));
        return Map.of("success", true, "message", "Product added successfully and pending approval.", "productId", saved.getId());
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getApprovedProducts() {
        return productRepository.findByStatus(Product.ProductStatus.APPROVED);
    }

    public List<Map<String, Object>> getProductCatalog() {
        List<ProductCategory> rootCategories = productCategoryRepository.findByParentCategoryIsNullOrderByNameAsc();
        List<Product> activeProducts = productRepository.findAll().stream()
                .filter(product -> Product.ProductStatus.APPROVED.equals(product.getStatus()))
                .filter(product -> Boolean.TRUE.equals(product.getActive()))
                .collect(Collectors.toList());

        Map<String, Long> countsByCategory = activeProducts.stream()
                .collect(Collectors.groupingBy(
                        product -> normalizeCatalogCategory(firstNonBlank(product.getCategory(), "Other")),
                        LinkedHashMap::new,
                        Collectors.counting()
                ));

        return rootCategories.stream()
                .sorted((first, second) -> compareCatalogOrder(first.getName(), second.getName()))
                .map(root -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("id", root.getId());
                    item.put("name", root.getName());
                    item.put("label", root.getName());
                    item.put("count", countsByCategory.getOrDefault(root.getName(), 0L));
                    item.put("image", root.getImagePath());

                    List<ProductCategory> childCategories = productCategoryRepository
                            .findByParentCategory_IdOrderByNameAsc(root.getId());
                    item.put(
                            "subcategories",
                            childCategories.stream()
                                    .map(ProductCategory::getName)
                                    .collect(Collectors.toList())
                    );
                    return item;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void backfillProductCategories() {
        if (productCategoryRepository.count() > 0) {
            return;
        }

        List<Product> products = productRepository.findAll();
        for (Product product : products) {
            syncProductCategories(
                    normalizeCatalogCategory(product.getCategory()),
                    product.getSubcategory(),
                    firstImagePath(product.getImagePaths())
            );
        }
    }

    public Map<String, Object> approveProduct(Long productId) {
        Optional<Product> opt = productRepository.findById(productId);
        if (opt.isEmpty()) return Map.of("success", false, "message", "Product not found");

        Product product = opt.get();
        product.setStatus(Product.ProductStatus.APPROVED);
        product.setApprovedAt(LocalDateTime.now());
        productRepository.save(product);

        return Map.of("success", true, "message", "Product approved successfully");
    }

    public Map<String, Object> rejectProduct(Long productId) {
        Optional<Product> opt = productRepository.findById(productId);
        if (opt.isEmpty()) return Map.of("success", false, "message", "Product not found");

        Product product = opt.get();
        product.setStatus(Product.ProductStatus.REJECTED);
        productRepository.save(product);

        return Map.of("success", true, "message", "Product rejected successfully");
    }

    public List<Product> getSellerProducts(Long sellerId) {
        return productRepository.findBySellerId(sellerId);
    }

    public Map<String, Object> updateSellerProductStatus(Long productId, Boolean active, Integer stock) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isEmpty()) {
            return Map.of("success", false, "message", "Product not found");
        }

        Product product = optionalProduct.get();
        if (active != null) {
            product.setActive(active);
        }
        if (stock != null) {
            product.setStock(stock);
        }

        productRepository.save(product);
        return Map.of("success", true, "message", "Product updated", "productId", product.getId());
    }

    public Map<String, Object> deleteSellerProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            return Map.of("success", false, "message", "Product not found");
        }
        productRepository.deleteById(productId);
        return Map.of("success", true, "message", "Product deleted");
    }

    public Map<String, Object> getSellerPayoutSummary(String sellerId) {
        List<CustomerOrder> paidOrders = customerOrderRepository.findPaidOrdersForSeller(sellerId);
        List<SellerPayoutRequest> payouts = sellerPayoutRequestRepository.findBySellerIdOrderByCreatedAtDesc(sellerId);
        List<RefundTransaction> refunds = refundTransactionRepository.findBySellerIdOrderByCreatedAtDesc(sellerId);

        double totalPaidByCustomers = 0.0;
        List<Map<String, Object>> customerPayments = new ArrayList<>();

        for (CustomerOrder order : paidOrders) {
            double sellerAmount = 0.0;
            String customerName = order.getCustomerName() == null || order.getCustomerName().isBlank()
                    ? "Customer"
                    : order.getCustomerName();

            for (CustomerOrderItem item : order.getItems()) {
                if (sellerId.equals(String.valueOf(item.getSellerId()))) {
                    double lineTotal = (item.getPrice() == null ? 0.0 : item.getPrice()) * (item.getQuantity() == null ? 1 : item.getQuantity());
                    sellerAmount += lineTotal;
                }
            }

            totalPaidByCustomers += sellerAmount;
            customerPayments.add(Map.of(
                    "id", order.getOrderCode() == null ? String.valueOf(order.getId()) : order.getOrderCode(),
                    "customerName", customerName,
                    "amount", sellerAmount,
                    "createdAt", order.getCreatedAt(),
                    "status", order.getPaymentStatus() == null ? "Paid" : order.getPaymentStatus()
            ));
        }

        double withdrawnAmount = payouts.stream()
                .filter(item -> item.getAmount() != null)
                .mapToDouble(SellerPayoutRequest::getAmount)
                .sum();

        double refundedAmount = refunds.stream()
                .filter(item -> item.getAmount() != null)
                .mapToDouble(RefundTransaction::getAmount)
                .sum();

        double netEarnings = Math.max(totalPaidByCustomers - refundedAmount, 0.0);
        double availableBalance = Math.max(netEarnings - withdrawnAmount, 0.0);

        return Map.of(
                "success", true,
                "totalPaidByCustomers", totalPaidByCustomers,
                "refundedAmount", refundedAmount,
                "netEarnings", netEarnings,
                "withdrawnAmount", withdrawnAmount,
                "availableBalance", availableBalance,
                "customerPayments", customerPayments,
                "payoutRequests", payouts,
                "refundHistory", refunds
        );
    }

    public Map<String, Object> createSellerWithdrawal(String sellerId, Double amount) {
        if (sellerId == null || sellerId.isBlank()) {
            return Map.of("success", false, "message", "Seller id is required");
        }

        double requestedAmount = amount == null ? 0.0 : amount;
        if (requestedAmount <= 0) {
            return Map.of("success", false, "message", "Invalid amount");
        }

        Map<String, Object> summary = getSellerPayoutSummary(sellerId);
        double availableBalance = ((Number) summary.getOrDefault("availableBalance", 0.0)).doubleValue();
        if (requestedAmount > availableBalance) {
            return Map.of("success", false, "message", "Withdrawal amount exceeds available balance");
        }

        Optional<Seller> sellerOptional = sellerRepository.findById(Long.valueOf(sellerId));
        Seller seller = sellerOptional.orElse(null);
        String sellerName = seller == null
                ? "Seller"
                : (seller.getShopName() != null && !seller.getShopName().isBlank() ? seller.getShopName() : seller.getName());
        String sellerEmail = seller == null ? "" : asString(seller.getEmail());
        String sellerPhone = seller == null ? "" : asString(seller.getPhone());
        String accountHolderName = seller == null ? "" : firstNonBlank(seller.getBankAccountHolderName(), sellerName);
        String bankAccountNumber = seller == null ? "" : asString(seller.getBankAccountNumber());
        String bankIfscCode = seller == null ? "" : asString(seller.getBankIfscCode());

        if (bankAccountNumber.isBlank() || bankIfscCode.isBlank()) {
            return Map.of(
                    "success", false,
                    "message", "Please save your bank account number and IFSC code before withdrawing."
            );
        }

        String reference = "SELLER-WD-" + System.currentTimeMillis();
        Map<String, Object> payoutResponse = razorpayService.createPayout(
                requestedAmount,
                reference,
                sellerName,
                sellerName,
                sellerEmail,
                sellerPhone,
                accountHolderName,
                bankAccountNumber,
                bankIfscCode
        );
        if (!Boolean.TRUE.equals(payoutResponse.get("success"))) {
            return payoutResponse;
        }

        SellerPayoutRequest request = new SellerPayoutRequest();
        request.setSellerId(sellerId);
        request.setSellerName(sellerName);
        request.setAmount(requestedAmount);
        request.setMethod("Razorpay");
        request.setReferenceType("seller_withdrawal");
        request.setStatus(String.valueOf(payoutResponse.getOrDefault("status", "queued")));
        request.setRazorpayPayoutId(String.valueOf(payoutResponse.getOrDefault("payoutId", "")));
        request.setRazorpayContactId(String.valueOf(payoutResponse.getOrDefault("contactId", "")));
        request.setRazorpayFundAccountId(String.valueOf(payoutResponse.getOrDefault("fundAccountId", "")));
        sellerPayoutRequestRepository.save(request);

        return Map.of(
                "success", true,
                "message", "Withdrawal request created successfully",
                "payoutId", request.getRazorpayPayoutId(),
                "requestId", request.getId(),
                "status", request.getStatus()
        );
    }

    private Double asDouble(Object value) {
        if (value == null) return 0.0;
        if (value instanceof Number number) return number.doubleValue();
        try {
            return Double.parseDouble(String.valueOf(value));
        } catch (Exception e) {
            return 0.0;
        }
    }

    private Integer asInteger(Object value) {
        if (value == null) return 0;
        if (value instanceof Number number) return number.intValue();
        try {
            return Integer.parseInt(String.valueOf(value));
        } catch (Exception e) {
            return 0;
        }
    }

    private boolean asBoolean(Object value, boolean fallback) {
        if (value == null) return fallback;
        if (value instanceof Boolean booleanValue) return booleanValue;
        String normalized = String.valueOf(value).trim().toLowerCase();
        if (normalized.isBlank()) return fallback;
        return "true".equals(normalized) || "1".equals(normalized) || "yes".equals(normalized);
    }

    private String asString(Object value) {
        return value == null ? "" : String.valueOf(value).trim();
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return "";
    }

    private Map<String, Object> buildSellerSettings(Seller seller) {
        Map<String, Object> settings = new LinkedHashMap<>();
        settings.put("orderNotifications", Boolean.TRUE.equals(seller.getOrderNotifications()));
        settings.put("promotionalUpdates", Boolean.TRUE.equals(seller.getPromotionalUpdates()));
        settings.put("smsAlerts", Boolean.TRUE.equals(seller.getSmsAlerts()));
        settings.put("emailUpdates", Boolean.TRUE.equals(seller.getEmailUpdates()));
        settings.put("darkMode", Boolean.TRUE.equals(seller.getDarkMode()));
        settings.put("autoAcceptOrders", Boolean.TRUE.equals(seller.getAutoAcceptOrders()));
        return settings;
    }

    private String sanitizeFileName(String fileName) {
        String value = Objects.requireNonNullElse(fileName, "image.jpg").trim();
        if (value.isBlank()) {
            return "image.jpg";
        }

        String normalized = value.replace("\\", "/");
        return normalized.substring(normalized.lastIndexOf('/') + 1);
    }

    private String normalizeCatalogValue(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeCatalogCategory(String value) {
        String raw = normalizeCatalogValue(value);
        if (raw.isBlank()) {
            return "";
        }

        String lower = raw.toLowerCase();
        return switch (lower) {
            case "bag", "bags" -> "Bags";
            case "cake", "cakes" -> "Cakes";
            case "candle", "candles", "candles & soaps", "candle & soaps" -> "Candles";
            case "card", "cards", "greeting cards" -> "Cards";
            case "decor", "home decor", "decoration" -> "Decor";
            case "dress", "dresses" -> "Dresses";
            case "festive", "festival", "festive items" -> "Festive";
            case "jewelry", "jewellery", "handmade jewelry" -> "Jewelry";
            case "painting", "paintings" -> "Paintings";
            case "pickle", "pickles" -> "Pickles";
            case "pottery", "pottery & crafts" -> "Pottery";
            case "sweet", "sweets" -> "Sweets";
            default -> raw;
        };
    }

    private String normalizeCatalogImage(String value) {
        String raw = normalizeCatalogValue(value);
        if (raw.isBlank()) {
            return "";
        }

        String normalized = raw.replace("\\", "/");
        int lastSlash = normalized.lastIndexOf('/');
        String fileName = lastSlash >= 0 ? normalized.substring(lastSlash + 1) : normalized;
        return fileName.isBlank() ? "" : fileName;
    }

    private void syncProductCategories(String categoryName, String subcategoryName, String imagePath) {
        String normalizedCategory = normalizeCatalogCategory(categoryName);
        if (normalizedCategory.isBlank()) {
            return;
        }

        ProductCategory root = ensureCategory(normalizedCategory, null, imagePath);
        if (normalizeCatalogValue(subcategoryName).isBlank()) {
            return;
        }

        ensureCategory(normalizeCatalogValue(subcategoryName), root, "");
    }

    private ProductCategory ensureCategory(String name, ProductCategory parent, String imagePath) {
        String normalizedName = normalizeCatalogValue(name);
        if (normalizedName.isBlank()) {
            return null;
        }

        Optional<ProductCategory> existing = parent == null
                ? productCategoryRepository.findByNameIgnoreCaseAndParentCategoryIsNull(normalizedName)
                : productCategoryRepository.findByNameIgnoreCaseAndParentCategory_Id(normalizedName, parent.getId());

        ProductCategory category = existing.orElseGet(ProductCategory::new);
        category.setName(normalizedName);
        category.setParentCategory(parent);
        if (category.getImagePath() == null || category.getImagePath().isBlank()) {
            String normalizedImage = normalizeCatalogImage(imagePath);
            if (!normalizedImage.isBlank()) {
                category.setImagePath(normalizedImage);
            }
        }
        return productCategoryRepository.save(category);
    }

    private String firstImagePath(List<String> values) {
        if (values == null || values.isEmpty()) {
            return "";
        }

        for (String value : values) {
            String normalized = normalizeCatalogImage(value);
            if (!normalized.isBlank()) {
                return normalized;
            }
        }
        return "";
    }

    private int compareCatalogOrder(String first, String second) {
        List<String> order = List.of(
                "Bags",
                "Cakes",
                "Candles",
                "Cards",
                "Decor",
                "Dresses",
                "Festive",
                "Jewelry",
                "Paintings",
                "Pickles",
                "Pottery",
                "Sweets"
        );

        int firstIndex = order.indexOf(first);
        int secondIndex = order.indexOf(second);

        if (firstIndex != secondIndex) {
            if (firstIndex == -1) return 1;
            if (secondIndex == -1) return -1;
            return Integer.compare(firstIndex, secondIndex);
        }

        return first.compareToIgnoreCase(second);
    }

}
