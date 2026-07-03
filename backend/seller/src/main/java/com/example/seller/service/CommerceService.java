package com.example.seller.service;

import com.example.seller.entity.CustomerOrder;
import com.example.seller.entity.CustomerOrderItem;
import com.example.seller.entity.CustomerAddress;
import com.example.seller.entity.ProductReview;
import com.example.seller.entity.ReturnRequest;
import com.example.seller.entity.WishlistItem;
import com.example.seller.repository.CustomerAddressRepository;
import com.example.seller.repository.CustomerOrderRepository;
import com.example.seller.repository.ProductReviewRepository;
import com.example.seller.repository.ReturnRequestRepository;
import com.example.seller.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CommerceService {

    private final WishlistRepository wishlistRepository;
    private final CustomerOrderRepository customerOrderRepository;
    private final ProductReviewRepository productReviewRepository;
    private final ReturnRequestRepository returnRequestRepository;
    private final CustomerAddressRepository customerAddressRepository;

    @Value("${file.upload.dir}")
    private String uploadDir;

    public CommerceService(
            WishlistRepository wishlistRepository,
            CustomerOrderRepository customerOrderRepository,
            ProductReviewRepository productReviewRepository,
            ReturnRequestRepository returnRequestRepository,
            CustomerAddressRepository customerAddressRepository
    ) {
        this.wishlistRepository = wishlistRepository;
        this.customerOrderRepository = customerOrderRepository;
        this.productReviewRepository = productReviewRepository;
        this.returnRequestRepository = returnRequestRepository;
        this.customerAddressRepository = customerAddressRepository;
    }

    public List<Map<String, Object>> getWishlist(String customerEmail) {
        return wishlistRepository.findByCustomerEmailOrderByAddedAtDesc(normalizeEmail(customerEmail))
                .stream()
                .map(this::toWishlistResponse)
                .collect(Collectors.toList());
    }

    public Map<String, Object> addWishlistItem(Map<String, Object> payload) {
        String customerEmail = normalizeEmail(asString(payload.get("customerEmail")));
        String productId = asString(payload.get("productId"));

        if (customerEmail.isBlank() || productId.isBlank()) {
            return Map.of("success", false, "message", "Customer email and product id are required");
        }

        if (wishlistRepository.existsByCustomerEmailAndProductId(customerEmail, productId)) {
            return Map.of("success", true, "message", "Already in wishlist");
        }

        WishlistItem item = new WishlistItem();
        item.setCustomerEmail(customerEmail);
        item.setCustomerName(asString(payload.get("customerName")));
        item.setProductId(productId);
        item.setProductName(asString(payload.get("productName")));
        item.setSellerId(asString(payload.get("sellerId")));
        item.setSellerName(asString(payload.get("sellerName")));
        item.setImagePath(asString(payload.get("imagePath")));
        item.setPrice(asDouble(payload.get("price")));
        item.setFinalPrice(asDouble(payload.get("finalPrice")));

        wishlistRepository.save(item);
        return Map.of("success", true, "message", "Added to wishlist");
    }

    public Map<String, Object> removeWishlistItem(String customerEmail, String productId) {
        wishlistRepository.deleteByCustomerEmailAndProductId(normalizeEmail(customerEmail), asString(productId));
        return Map.of("success", true, "message", "Removed from wishlist");
    }

    public Map<String, Object> createOrder(Map<String, Object> payload) {
        String customerEmail = normalizeEmail(asString(payload.get("customerEmail")));
        if (customerEmail.isBlank()) {
            return Map.of("success", false, "message", "Customer email is required");
        }

        List<Map<String, Object>> productMaps = asMapList(payload.get("products"));
        if (productMaps.isEmpty()) {
            productMaps = asMapList(payload.get("items"));
        }
        if (productMaps.isEmpty()) {
            return Map.of("success", false, "message", "Order items are required");
        }

        CustomerOrder order = new CustomerOrder();
        order.setOrderCode(asString(payload.get("id")).isBlank() ? generateOrderCode() : asString(payload.get("id")));
        order.setCustomerEmail(customerEmail);
        order.setCustomerName(asString(payload.get("customerName")));
        order.setCustomerPhone(asString(payload.get("customerPhone")));
        order.setTitle(asString(payload.get("title")));
        order.setStatus(defaultIfBlank(asString(payload.get("status")), "Processing"));
        order.setDeliveryStatus(defaultIfBlank(asString(payload.get("deliveryStatus")), "Need Delivery"));
        order.setPayment(asString(payload.get("payment")));
        order.setPaymentMethod(asString(payload.get("paymentMethod")));
        order.setPaymentStatus(asString(payload.get("paymentStatus")));
        order.setRazorpayOrderId(asString(payload.get("razorpayOrderId")));
        order.setRazorpayPaymentId(asString(payload.get("razorpayPaymentId")));
        order.setRazorpaySignature(asString(payload.get("razorpaySignature")));
        order.setItemTotal(asDouble(payload.get("itemTotal")));
        order.setDeliveryCharge(asDouble(payload.get("deliveryCharge")));
        order.setTotalAmount(asDouble(payload.get("totalAmount")));
        order.setAdminCommission(asDouble(payload.get("adminCommission")));
        order.setSellerEarning(asDouble(payload.get("sellerEarning")));
        order.setCommissionRate(asInteger(payload.get("commissionRate"), 10));

        Map<String, Object> address = asMap(payload.get("address"));
        order.setAddressName(asString(address.get("name")));
        order.setAddressLine1(asString(address.get("line1")));
        order.setAddressLine2(asString(address.get("line2")));
        order.setAddressCity(asString(address.get("city")));
        order.setAddressState(asString(address.get("state")));
        order.setAddressPincode(asString(address.get("pincode")));

        List<CustomerOrderItem> items = new ArrayList<>();
        for (Map<String, Object> productMap : productMaps) {
            CustomerOrderItem item = new CustomerOrderItem();
            item.setOrder(order);
            item.setProductId(firstNonBlank(
                    asString(productMap.get("productId")),
                    asString(productMap.get("id")),
                    asString(productMap.get("originalId")),
                    asString(productMap.get("name"))
            ));
            item.setProductName(firstNonBlank(asString(productMap.get("name")), asString(productMap.get("title")), "Product"));
            item.setImagePath(firstNonBlank(
                    asString(productMap.get("image")),
                    firstStringFromList(productMap.get("images"))
            ));
            item.setSize(asString(productMap.get("selectedSize")).isBlank() ? asString(productMap.get("size")) : asString(productMap.get("selectedSize")));
            item.setPrice(asDouble(productMap.get("price")));
            item.setFinalPrice(asDouble(productMap.get("finalPrice")));
            item.setQuantity(asInteger(productMap.get("qty"), asInteger(productMap.get("quantity"), 1)));
            item.setSellerId(asString(productMap.get("sellerId")));
            item.setSellerName(firstNonBlank(asString(productMap.get("sellerName")), asString(productMap.get("seller")), ""));
            items.add(item);
        }
        order.setItems(items);

        CustomerOrder saved = customerOrderRepository.save(order);
        return Map.of(
                "success", true,
                "message", "Order created successfully",
                "order", toOrderResponse(saved)
        );
    }

    public List<Map<String, Object>> getCustomerOrders(String customerEmail) {
        return customerOrderRepository.findByCustomerEmailOrderByCreatedAtDesc(normalizeEmail(customerEmail))
                .stream()
                .map(this::toOrderResponse)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getAllOrders() {
        return customerOrderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toOrderResponse)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getSellerOrders(String sellerId) {
        return customerOrderRepository.findOrdersForSeller(asString(sellerId))
                .stream()
                .map(order -> toOrderResponse(order, asString(sellerId)))
                .collect(Collectors.toList());
    }

    public Map<String, Object> updateOrderStatus(String orderCode, String status) {
        Optional<CustomerOrder> opt = customerOrderRepository.findByOrderCode(orderCode);
        if (opt.isEmpty()) {
            return Map.of("success", false, "message", "Order not found");
        }

        CustomerOrder order = opt.get();
        order.setStatus(status);
        if ("Delivered".equalsIgnoreCase(status)) {
            order.setDeliveredAt(LocalDateTime.now());
        }
        customerOrderRepository.save(order);
        return Map.of("success", true, "order", toOrderResponse(order));
    }

    public Map<String, Object> updateDeliveryStatus(String orderCode, String deliveryStatus) {
        Optional<CustomerOrder> opt = customerOrderRepository.findByOrderCode(orderCode);
        if (opt.isEmpty()) {
            return Map.of("success", false, "message", "Order not found");
        }

        CustomerOrder order = opt.get();
        order.setDeliveryStatus(deliveryStatus);
        if ("Delivered".equalsIgnoreCase(deliveryStatus)) {
            order.setDeliveredAt(LocalDateTime.now());
            if (!"Delivered".equalsIgnoreCase(order.getStatus())) {
                order.setStatus("Delivered");
            }
        }
        customerOrderRepository.save(order);
        return Map.of("success", true, "order", toOrderResponse(order));
    }

    public Map<String, Object> createReturnRequest(Map<String, Object> payload) {
        String orderId = asString(payload.get("orderId"));
        String productId = asString(payload.get("productId"));
        String customerEmail = normalizeEmail(asString(payload.get("customerEmail")));
        String sellerId = asString(payload.get("sellerId"));

        if (orderId.isBlank()) {
            return Map.of("success", false, "message", "Order id is required");
        }
        if (productId.isBlank()) {
            productId = asString(payload.get("product"));
        }
        if (customerEmail.isBlank()) {
            return Map.of("success", false, "message", "Customer email is required");
        }

        Optional<ReturnRequest> existing = returnRequestRepository.findByOrderIdAndProductId(orderId, productId);
        if (existing.isPresent()) {
            return Map.of("success", true, "request", toReturnResponse(existing.get()));
        }

        Optional<CustomerOrder> orderOpt = customerOrderRepository.findByOrderCode(orderId);
        CustomerOrder order = orderOpt.orElse(null);
        String returnCode = firstNonBlank(asString(payload.get("id")), "#RET" + String.valueOf(System.currentTimeMillis()).substring(6));
        String resolvedSellerId = firstNonBlank(sellerId, order == null ? "" : asString(order.getItems().isEmpty() ? null : order.getItems().get(0).getSellerId()));
        String resolvedSellerName = firstNonBlank(asString(payload.get("sellerName")), order == null ? "" : asString(order.getItems().isEmpty() ? null : order.getItems().get(0).getSellerName()));
        String resolvedCustomer = firstNonBlank(asString(payload.get("customer")), order == null ? "" : order.getCustomerName(), "Customer");
        String resolvedProduct = firstNonBlank(asString(payload.get("product")), "Product");
        String priceText = firstNonBlank(asString(payload.get("price")), formatPrice(asDouble(payload.get("refundAmount"))));

        ReturnRequest request = new ReturnRequest();
        request.setReturnCode(returnCode);
        request.setOrderId(orderId);
        request.setOrderCode(orderId);
        request.setProductId(productId);
        request.setCustomer(resolvedCustomer);
        request.setCustomerEmail(customerEmail);
        request.setSellerId(resolvedSellerId);
        request.setSellerName(resolvedSellerName);
        request.setProduct(resolvedProduct);
        request.setPrice(priceText);
        request.setImage(asString(payload.get("image")));
        request.setReason(firstNonBlank(asString(payload.get("reason")), "No reason added"));
        request.setStatus(firstNonBlank(asString(payload.get("status")), "Return Requested"));
        request.setRequestedOn(firstNonBlank(asString(payload.get("requestedOn")), "Today"));
        request.setRefundAmount(asDouble(payload.get("refundAmount")));
        request.setRefundAmountText(firstNonBlank(asString(payload.get("refundAmountText")), formatPrice(request.getRefundAmount())));
        request.setRefundStatus(firstNonBlank(asString(payload.get("refundStatus")), "Not Credited"));
        request.setRefundCredited(Boolean.TRUE.equals(asBoolean(payload.get("refundCredited"))));
        request.setRefundMethod(firstNonBlank(asString(payload.get("refundMethod")), "Razorpay"));
        request.setPaymentMethod(firstNonBlank(asString(payload.get("paymentMethod")), order == null ? "" : order.getPaymentMethod()));
        request.setRazorpayPaymentId(firstNonBlank(asString(payload.get("razorpayPaymentId")), order == null ? "" : order.getRazorpayPaymentId()));
        request.setRazorpayOrderId(firstNonBlank(asString(payload.get("razorpayOrderId")), order == null ? "" : order.getRazorpayOrderId()));
        request.setRazorpayRefundId(asString(payload.get("razorpayRefundId")));
        request.setCreditedOn(asString(payload.get("creditedOn")));
        request.setCreatedAt(LocalDateTime.now());
        request.setUpdatedAt(LocalDateTime.now());

        ReturnRequest saved = returnRequestRepository.save(request);
        return Map.of("success", true, "request", toReturnResponse(saved));
    }

    public List<Map<String, Object>> getSellerReturnRequests(String sellerId) {
        String resolvedSellerId = asString(sellerId);
        return returnRequestRepository.findBySellerIdOrderByCreatedAtDesc(resolvedSellerId)
                .stream()
                .map(this::toReturnResponse)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getCustomerReturnRequests(String customerEmail) {
        String resolvedCustomerEmail = normalizeEmail(customerEmail);
        return returnRequestRepository.findByCustomerEmailOrderByCreatedAtDesc(resolvedCustomerEmail)
                .stream()
                .map(this::toReturnResponse)
                .collect(Collectors.toList());
    }

    public Map<String, Object> updateReturnStatus(String returnCode, Map<String, Object> payload) {
        Optional<ReturnRequest> optional = returnRequestRepository.findByReturnCode(returnCode);
        if (optional.isEmpty()) {
            return Map.of("success", false, "message", "Return request not found");
        }

        ReturnRequest request = optional.get();
        String status = firstNonBlank(asString(payload.get("status")), request.getStatus());
        request.setStatus(status);
        request.setRefundStatus(firstNonBlank(asString(payload.get("refundStatus")), request.getRefundStatus()));
        request.setRefundCredited(Boolean.TRUE.equals(asBoolean(payload.get("refundCredited"))) || request.isRefundCredited());
        request.setRefundMethod(firstNonBlank(asString(payload.get("refundMethod")), request.getRefundMethod()));
        request.setRazorpayRefundId(firstNonBlank(asString(payload.get("razorpayRefundId")), request.getRazorpayRefundId()));
        request.setCreditedOn(firstNonBlank(asString(payload.get("creditedOn")), request.getCreditedOn()));
        request.setUpdatedAt(LocalDateTime.now());

        if ("Product Received".equalsIgnoreCase(status) && request.isRefundCredited()) {
            request.setRefundStatus("Credited");
        }

        ReturnRequest saved = returnRequestRepository.save(request);
        return Map.of("success", true, "request", toReturnResponse(saved));
    }

    public Map<String, Object> assignDeliveryPerson(String orderCode, Map<String, Object> payload) {
        Optional<CustomerOrder> opt = customerOrderRepository.findByOrderCode(orderCode);
        if (opt.isEmpty()) {
            return Map.of("success", false, "message", "Order not found");
        }

        CustomerOrder order = opt.get();
        order.setDeliveryPersonId(asString(payload.get("deliveryPersonId")));
        order.setDeliveryPersonName(asString(payload.get("deliveryPersonName")));
        order.setDeliveryPersonPhone(asString(payload.get("deliveryPersonPhone")));
        order.setDeliveryFee(asDouble(payload.get("deliveryFee")));
        order.setDeliveryStatus(defaultIfBlank(asString(payload.get("deliveryStatus")), "Assigned"));
        customerOrderRepository.save(order);
        return Map.of("success", true, "order", toOrderResponse(order));
    }

    public Map<String, Object> addProductReview(
            String orderCode,
            String productId,
            String productName,
            String customerEmail,
            String customerName,
            Integer rating,
            String comment,
            List<MultipartFile> images
    ) throws IOException {
        if (productId == null || productId.isBlank()) {
            return Map.of("success", false, "message", "Product id is required");
        }

        ProductReview review = new ProductReview();
        review.setOrderCode(orderCode);
        review.setProductId(productId);
        review.setProductName(productName);
        review.setCustomerEmail(normalizeEmail(customerEmail));
        review.setCustomerName(customerName);
        review.setRating(rating == null ? 0 : rating);
        review.setComment(comment);
        review.setImagePaths(storeFiles(images));

        ProductReview saved = productReviewRepository.save(review);
        return Map.of(
                "success", true,
                "message", "Review added successfully",
                "review", toReviewResponse(saved)
        );
    }

    public List<Map<String, Object>> getAllReviews() {
        return productReviewRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toReviewResponse)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getCustomerAddresses(String customerEmail) {
        String email = normalizeEmail(customerEmail);
        if (email.isBlank()) {
            return new ArrayList<>();
        }

        return sortAddresses(customerAddressRepository.findByCustomerEmailOrderByCreatedAtDesc(email))
                .stream()
                .map(this::toAddressResponse)
                .collect(Collectors.toList());
    }

    public Map<String, Object> saveCustomerAddress(Map<String, Object> payload) {
        String customerEmail = normalizeEmail(asString(payload.get("customerEmail")));
        if (customerEmail.isBlank()) {
            return Map.of("success", false, "message", "Customer email is required");
        }

        String addressId = asString(payload.get("addressId"));
        boolean requestedDefault = asBoolean(payload.get("isDefault"));
        boolean targetWasDefault = false;

        CustomerAddress address;
        if (!addressId.isBlank()) {
            Long parsedAddressId = parseLong(addressId);
            if (parsedAddressId == null) {
                return Map.of("success", false, "message", "Address not found");
            }

            Optional<CustomerAddress> existing = customerAddressRepository.findByIdAndCustomerEmail(parsedAddressId, customerEmail);
            if (existing.isEmpty()) {
                return Map.of("success", false, "message", "Address not found");
            }

            address = existing.get();
            targetWasDefault = address.isDefaultAddress();
        } else {
            address = new CustomerAddress();
            address.setCustomerEmail(customerEmail);
        }

        address.setCustomerEmail(customerEmail);
        address.setType(defaultIfBlank(asString(payload.get("type")), "other"));
        address.setName(asString(payload.get("name")));
        address.setPhone(asString(payload.get("phone")));
        address.setLine1(asString(payload.get("line1")));
        address.setLine2(asString(payload.get("line2")));
        address.setCity(asString(payload.get("city")));
        address.setState(asString(payload.get("state")));
        address.setPincode(asString(payload.get("pincode")));
        address.setDefaultAddress(requestedDefault);

        CustomerAddress saved = customerAddressRepository.save(address);
        List<CustomerAddress> refreshedAddresses = customerAddressRepository.findByCustomerEmailOrderByCreatedAtDesc(customerEmail);

        if (requestedDefault) {
            setDefaultAddressInternal(customerEmail, saved.getId());
        } else if (targetWasDefault || refreshedAddresses.stream().noneMatch(CustomerAddress::isDefaultAddress)) {
            ensureDefaultCustomerAddress(customerEmail);
        }

        CustomerAddress reloaded = customerAddressRepository.findByIdAndCustomerEmail(saved.getId(), customerEmail).orElse(saved);
        return Map.of(
                "success", true,
                "message", addressId.isBlank() ? "Address saved successfully" : "Address updated successfully",
                "address", toAddressResponse(reloaded)
        );
    }

    public Map<String, Object> deleteCustomerAddress(String customerEmail, Long addressId) {
        String email = normalizeEmail(customerEmail);
        if (email.isBlank() || addressId == null) {
            return Map.of("success", false, "message", "Customer email and address id are required");
        }

        Optional<CustomerAddress> existing = customerAddressRepository.findByIdAndCustomerEmail(addressId, email);
        if (existing.isEmpty()) {
            return Map.of("success", false, "message", "Address not found");
        }

        boolean wasDefault = existing.get().isDefaultAddress();
        customerAddressRepository.delete(existing.get());

        if (wasDefault) {
            ensureDefaultCustomerAddress(email);
        }

        return Map.of("success", true, "message", "Address deleted successfully");
    }

    public Map<String, Object> setDefaultCustomerAddress(String customerEmail, Long addressId) {
        String email = normalizeEmail(customerEmail);
        if (email.isBlank() || addressId == null) {
            return Map.of("success", false, "message", "Customer email and address id are required");
        }

        Optional<CustomerAddress> existing = customerAddressRepository.findByIdAndCustomerEmail(addressId, email);
        if (existing.isEmpty()) {
            return Map.of("success", false, "message", "Address not found");
        }

        setDefaultAddressInternal(email, addressId);
        CustomerAddress selected = customerAddressRepository.findByIdAndCustomerEmail(addressId, email).orElse(existing.get());
        return Map.of(
                "success", true,
                "message", "Default address updated successfully",
                "address", toAddressResponse(selected)
        );
    }

    private List<String> storeFiles(List<MultipartFile> files) throws IOException {
        List<String> paths = new ArrayList<>();
        if (files == null || files.isEmpty()) {
            return paths;
        }

        Path dirPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        if (!Files.exists(dirPath)) {
            Files.createDirectories(dirPath);
        }

        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                continue;
            }
            String originalName = Objects.requireNonNullElse(file.getOriginalFilename(), "image.jpg");
            String safeOriginalName = Paths.get(originalName).getFileName().toString();
            String safeName = UUID.randomUUID() + "_" + safeOriginalName;
            Path target = dirPath.resolve(safeName);
            file.transferTo(target.toFile());
            paths.add(target.toString());
        }

        return paths;
    }

    private Map<String, Object> toWishlistResponse(WishlistItem item) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", item.getProductId());
        map.put("productId", item.getProductId());
        map.put("name", item.getProductName());
        map.put("sellerId", item.getSellerId());
        map.put("sellerName", item.getSellerName());
        map.put("price", item.getPrice());
        map.put("finalPrice", item.getFinalPrice());
        map.put("image", item.getImagePath());
        map.put("addedAt", item.getAddedAt());
        return map;
    }

    private Map<String, Object> toOrderResponse(CustomerOrder order) {
        return toOrderResponse(order, null);
    }

    private Map<String, Object> toOrderResponse(CustomerOrder order, String sellerFilterId) {
        Map<String, ProductReview> reviewsByProduct = productReviewRepository.findByOrderCodeOrderByCreatedAtDesc(order.getOrderCode())
                .stream()
                .collect(Collectors.toMap(
                        ProductReview::getProductId,
                        review -> review,
                        (first, second) -> first,
                        LinkedHashMap::new
                ));

        List<Map<String, Object>> products = order.getItems().stream()
                .filter(item -> sellerFilterId == null || sellerFilterId.isBlank() || sellerFilterId.equals(item.getSellerId()))
                .map(item -> {
                    Map<String, Object> product = new LinkedHashMap<>();
                    product.put("id", item.getProductId());
                    product.put("productId", item.getProductId());
                    product.put("name", item.getProductName());
                    product.put("qty", item.getQuantity());
                    product.put("quantity", item.getQuantity());
                    product.put("price", item.getPrice());
                    product.put("finalPrice", item.getFinalPrice());
                    product.put("image", item.getImagePath());
                    product.put("images", item.getImagePath() == null || item.getImagePath().isBlank() ? List.of() : List.of(item.getImagePath()));
                    product.put("size", item.getSize());
                    product.put("sellerId", item.getSellerId());
                    product.put("sellerName", item.getSellerName());
                    ProductReview review = reviewsByProduct.get(item.getProductId());
                    if (review != null) {
                        product.put("customerReview", toReviewResponse(review));
                    }
                    return product;
                })
                .collect(Collectors.toList());

        Map<String, Object> reviews = new LinkedHashMap<>();
        for (Map.Entry<String, ProductReview> entry : reviewsByProduct.entrySet()) {
            reviews.put(entry.getKey(), toReviewResponse(entry.getValue()));
        }

        Map<String, Object> address = new LinkedHashMap<>();
        address.put("name", order.getAddressName());
        address.put("line1", order.getAddressLine1());
        address.put("line2", order.getAddressLine2());
        address.put("city", order.getAddressCity());
        address.put("state", order.getAddressState());
        address.put("pincode", order.getAddressPincode());
        address.put("phone", order.getCustomerPhone());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", order.getOrderCode());
        response.put("title", firstNonBlank(order.getTitle(), products.isEmpty() ? "Product Order" : asString(products.get(0).get("name"))));
        response.put("customer", order.getCustomerName());
        response.put("customerName", order.getCustomerName());
        response.put("customerEmail", order.getCustomerEmail());
        response.put("customerPhone", order.getCustomerPhone());
        response.put("status", order.getStatus());
        response.put("deliveryStatus", order.getDeliveryStatus());
        response.put("deliveryPersonId", order.getDeliveryPersonId());
        response.put("deliveryPersonName", order.getDeliveryPersonName());
        response.put("deliveryPersonPhone", order.getDeliveryPersonPhone());
        response.put("deliveryFee", order.getDeliveryFee());
        response.put("payment", order.getPayment());
        response.put("paymentMethod", order.getPaymentMethod());
        response.put("paymentStatus", order.getPaymentStatus());
        response.put("razorpayOrderId", order.getRazorpayOrderId());
        response.put("razorpayPaymentId", order.getRazorpayPaymentId());
        response.put("razorpaySignature", order.getRazorpaySignature());
        response.put("itemTotal", order.getItemTotal());
        response.put("deliveryCharge", order.getDeliveryCharge());
        response.put("totalAmount", order.getTotalAmount());
        response.put("adminCommission", order.getAdminCommission());
        response.put("sellerEarning", order.getSellerEarning());
        response.put("commissionRate", order.getCommissionRate());
        response.put("products", products);
        response.put("items", products);
        response.put("address", address);
        response.put("createdAt", order.getCreatedAt());
        response.put("date", formatDate(order.getCreatedAt()));
        response.put("time", formatTime(order.getCreatedAt()));
        response.put("reviews", reviews);
        response.put("returns", Map.of());
        response.put("deliveredAt", order.getDeliveredAt());
        return response;
    }

    private Map<String, Object> toReviewResponse(ProductReview review) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", review.getId());
        map.put("orderId", review.getOrderCode());
        map.put("productId", review.getProductId());
        map.put("product", review.getProductName());
        map.put("customer", review.getCustomerName());
        map.put("customerEmail", review.getCustomerEmail());
        map.put("rating", review.getRating());
        map.put("comment", review.getComment());
        map.put("text", review.getComment());
        map.put("images", review.getImagePaths());
        map.put("createdAt", review.getCreatedAt());
        map.put("createdOn", formatDate(review.getCreatedAt()));
        return map;
    }

    private Map<String, Object> toAddressResponse(CustomerAddress address) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", address.getId());
        map.put("customerEmail", address.getCustomerEmail());
        map.put("type", defaultIfBlank(address.getType(), "other"));
        map.put("name", address.getName());
        map.put("phone", address.getPhone());
        map.put("line1", address.getLine1());
        map.put("line2", address.getLine2());
        map.put("city", address.getCity());
        map.put("state", address.getState());
        map.put("pincode", address.getPincode());
        map.put("isDefault", address.isDefaultAddress());
        map.put("createdAt", address.getCreatedAt());
        map.put("updatedAt", address.getUpdatedAt());
        return map;
    }

    private Map<String, Object> toReturnResponse(ReturnRequest request) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", request.getReturnCode());
        map.put("returnCode", request.getReturnCode());
        map.put("orderId", request.getOrderId());
        map.put("orderCode", request.getOrderCode());
        map.put("productId", request.getProductId());
        map.put("customer", request.getCustomer());
        map.put("customerEmail", request.getCustomerEmail());
        map.put("sellerId", request.getSellerId());
        map.put("sellerName", request.getSellerName());
        map.put("product", request.getProduct());
        map.put("price", request.getPrice());
        map.put("image", request.getImage());
        map.put("reason", request.getReason());
        map.put("status", request.getStatus());
        map.put("requestedOn", request.getRequestedOn());
        map.put("refundAmount", request.getRefundAmount());
        map.put("refundAmountText", request.getRefundAmountText());
        map.put("refundStatus", request.getRefundStatus());
        map.put("refundCredited", request.isRefundCredited());
        map.put("refundMethod", request.getRefundMethod());
        map.put("paymentMethod", request.getPaymentMethod());
        map.put("razorpayPaymentId", request.getRazorpayPaymentId());
        map.put("razorpayOrderId", request.getRazorpayOrderId());
        map.put("razorpayRefundId", request.getRazorpayRefundId());
        map.put("creditedOn", request.getCreditedOn());
        map.put("createdAt", request.getCreatedAt());
        map.put("updatedAt", request.getUpdatedAt());
        return map;
    }

    private String formatDate(LocalDateTime value) {
        if (value == null) {
            return "";
        }
        return value.format(DateTimeFormatter.ofPattern("dd MMM yyyy"));
    }

    private String formatTime(LocalDateTime value) {
        if (value == null) {
            return "";
        }
        return value.format(DateTimeFormatter.ofPattern("hh:mm a"));
    }

    private String formatPrice(double amount) {
        if (amount <= 0) {
            return "₹0";
        }
        if (Math.abs(amount - Math.rint(amount)) < 0.0001) {
            return "₹" + String.format(Locale.ENGLISH, "%.0f", amount);
        }
        return "₹" + String.format(Locale.ENGLISH, "%.2f", amount);
    }

    private String generateOrderCode() {
        return "#ORD" + String.valueOf(System.currentTimeMillis()).substring(6);
    }

    private String normalizeEmail(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }

    private String asString(Object value) {
        return value == null ? "" : String.valueOf(value).trim();
    }

    private String defaultIfBlank(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private Double asDouble(Object value) {
        if (value == null) {
            return 0.0;
        }
        if (value instanceof Number number) {
            return number.doubleValue();
        }
        String cleaned = String.valueOf(value).replaceAll("[^\\d.-]", "").trim();
        if (cleaned.isBlank()) {
            return 0.0;
        }
        try {
            return Double.parseDouble(cleaned);
        } catch (Exception ignored) {
            return 0.0;
        }
    }

    private Integer asInteger(Object value, Integer fallback) {
        if (value == null) {
            return fallback;
        }
        if (value instanceof Number number) {
            return number.intValue();
        }
        String cleaned = String.valueOf(value).replaceAll("[^\\d-]", "").trim();
        if (cleaned.isBlank()) {
            return fallback;
        }
        try {
            return Integer.parseInt(cleaned);
        } catch (Exception ignored) {
            return fallback;
        }
    }

    private Boolean asBoolean(Object value) {
        if (value instanceof Boolean bool) {
            return bool;
        }
        if (value == null) {
            return false;
        }
        return "true".equalsIgnoreCase(String.valueOf(value).trim())
                || "1".equals(String.valueOf(value).trim());
    }

    private Long parseLong(String value) {
        try {
            return Long.parseLong(value);
        } catch (Exception ignored) {
            return null;
        }
    }

    private List<CustomerAddress> sortAddresses(List<CustomerAddress> addresses) {
        List<CustomerAddress> sorted = new ArrayList<>(addresses == null ? List.of() : addresses);
        sorted.sort(Comparator
                .comparing(CustomerAddress::isDefaultAddress).reversed()
                .thenComparing(CustomerAddress::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));
        return sorted;
    }

    private void ensureDefaultCustomerAddress(String customerEmail) {
        List<CustomerAddress> addresses = customerAddressRepository.findByCustomerEmailOrderByCreatedAtDesc(customerEmail);
        if (addresses.isEmpty()) {
            return;
        }

        if (addresses.stream().anyMatch(CustomerAddress::isDefaultAddress)) {
            return;
        }

        setDefaultAddressInternal(customerEmail, addresses.get(0).getId());
    }

    private void setDefaultAddressInternal(String customerEmail, Long addressId) {
        List<CustomerAddress> addresses = customerAddressRepository.findByCustomerEmailOrderByCreatedAtDesc(customerEmail);
        for (CustomerAddress address : addresses) {
            address.setDefaultAddress(Objects.equals(address.getId(), addressId));
        }
        customerAddressRepository.saveAll(addresses);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> asMap(Object value) {
        if (value instanceof Map<?, ?> map) {
            return (Map<String, Object>) map;
        }
        return new LinkedHashMap<>();
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> asMapList(Object value) {
        if (!(value instanceof List<?> list)) {
            return new ArrayList<>();
        }

        List<Map<String, Object>> maps = new ArrayList<>();
        for (Object item : list) {
            if (item instanceof Map<?, ?> map) {
                maps.add((Map<String, Object>) map);
            }
        }
        return maps;
    }

    private String firstStringFromList(Object value) {
        if (!(value instanceof List<?> list) || list.isEmpty()) {
            return "";
        }
        Object first = list.get(0);
        if (first instanceof String stringValue) {
            return stringValue;
        }
        if (first instanceof Map<?, ?> map) {
            Object uri = map.get("uri");
            return uri == null ? "" : String.valueOf(uri);
        }
        return String.valueOf(first);
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return "";
    }
}
