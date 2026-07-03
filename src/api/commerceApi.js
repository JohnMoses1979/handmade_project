import { Platform } from "react-native";
import { BASE_URL, SERVER_URL } from "./config";

const serverUrl = SERVER_URL;

const parseJsonSafe = async (response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { success: false, message: text.slice(0, 160) };
  }
};

const cleanPrice = (value) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const cleaned = String(value ?? "").replace(/[^\d.-]/g, "").trim();
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toServerImageUrl = (value) => {
  if (!value) return null;
  if (typeof value !== "string") return value;
  if (/^https?:\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
    if (value.includes("/uploads/documents/")) {
      const fileName = value.split("/").pop();
      return fileName ? `${serverUrl}/uploads/${encodeURIComponent(fileName)}` : value;
    }
    return value;
  }
  if (value.startsWith("/uploads/documents/") || value.startsWith("uploads/documents/")) {
    const fileName = value.split("/").pop();
    return fileName ? `${serverUrl}/uploads/${encodeURIComponent(fileName)}` : value;
  }
  const fileName = value.split("/").pop()?.split("\\").pop();
  return fileName ? `${serverUrl}/uploads/${fileName}` : value;
};

const normalizeReview = (review = {}) => ({
  ...review,
  id: review.id ?? `REV${Date.now()}`,
  orderId: review.orderId ?? review.orderCode,
  productId: String(review.productId ?? review.product ?? ""),
  product: review.product ?? "Product",
  customer: review.customer ?? "Customer",
  rating: Number(review.rating ?? 0),
  comment: review.comment ?? review.text ?? "",
  text: review.text ?? review.comment ?? "",
  images: Array.isArray(review.images) ? review.images.map(toServerImageUrl).filter(Boolean) : [],
  createdOn: review.createdOn ?? "Today",
});

const normalizeOrder = (order = {}) => {
  const products = Array.isArray(order.products || order.items)
    ? (order.products || order.items).map((item) => ({
        ...item,
        id: item.id ?? item.productId,
        productId: String(item.productId ?? item.id ?? item.name ?? ""),
        image: toServerImageUrl(item.image || item.images?.[0]),
        images: Array.isArray(item.images)
          ? item.images.map(toServerImageUrl).filter(Boolean)
          : toServerImageUrl(item.image)
          ? [toServerImageUrl(item.image)]
          : [],
        qty: Number(item.qty ?? item.quantity ?? 1),
        quantity: Number(item.quantity ?? item.qty ?? 1),
        price: typeof item.price === "number" ? `₹${item.price}` : item.price,
        finalPrice:
          typeof item.finalPrice === "number" ? `₹${item.finalPrice}` : item.finalPrice ?? item.price,
        customerReview: item.customerReview ? normalizeReview(item.customerReview) : item.customerReview,
      }))
    : [];

  const reviews = Object.fromEntries(
    Object.entries(order.reviews || {}).map(([key, value]) => [key, normalizeReview(value)])
  );

  return {
    ...order,
    id: order.id,
    customer: order.customer ?? order.customerName,
    customerPhone: order.customerPhone ?? order.address?.phone ?? "",
    price:
      typeof order.totalAmount === "number"
        ? `₹${order.totalAmount}`
        : order.price || `₹${cleanPrice(order.totalAmount)}`,
    products,
    items: products,
    reviews,
    address: order.address || {},
  };
};

const normalizeReturnRequest = (request = {}) => ({
  ...request,
  id: String(request.id ?? request.returnCode ?? `RET${Date.now()}`),
  returnCode: String(request.returnCode ?? request.id ?? ""),
  orderId: String(request.orderId ?? request.orderCode ?? ""),
  orderCode: String(request.orderCode ?? request.orderId ?? ""),
  productId: String(request.productId ?? ""),
  customer: request.customer ?? "Customer",
  customerEmail: request.customerEmail ?? "",
  sellerId: String(request.sellerId ?? ""),
  sellerName: request.sellerName ?? "Seller",
  product: request.product ?? "Product",
  price: request.price ?? `₹${cleanPrice(request.refundAmount ?? 0)}`,
  image: toServerImageUrl(request.image || request.productImage),
  reason: request.reason ?? "No reason added",
  status: request.status ?? "Return Requested",
  requestedOn: request.requestedOn ?? "Today",
  refundAmount: Number(request.refundAmount ?? 0),
  refundAmountText: request.refundAmountText ?? `₹${cleanPrice(request.refundAmount ?? 0)}`,
  refundStatus: request.refundStatus ?? "Not Credited",
  refundCredited: Boolean(request.refundCredited ?? false),
  refundMethod: request.refundMethod ?? "Razorpay",
  paymentMethod: request.paymentMethod ?? "",
  razorpayPaymentId: request.razorpayPaymentId ?? "",
  razorpayOrderId: request.razorpayOrderId ?? "",
  razorpayRefundId: request.razorpayRefundId ?? "",
  creditedOn: request.creditedOn ?? null,
});

const normalizeWishlistItem = (item = {}) => ({
  ...item,
  id: String(item.id ?? item.productId ?? item.name ?? Date.now()),
  productId: String(item.productId ?? item.id ?? item.name ?? ""),
  image: toServerImageUrl(item.image || item.images?.[0]),
  images: item.image ? [toServerImageUrl(item.image)] : [],
  price: typeof item.price === "number" ? `₹${item.price}` : item.price,
  finalPrice: typeof item.finalPrice === "number" ? `₹${item.finalPrice}` : item.finalPrice ?? item.price,
});

const normalizeCustomerAddress = (address = {}) => ({
  ...address,
  id: String(address.id ?? Date.now()),
  customerEmail: address.customerEmail ?? "",
  type: address.type ?? "other",
  name: address.name ?? "",
  phone: address.phone ?? "",
  line1: address.line1 ?? "",
  line2: address.line2 ?? "",
  city: address.city ?? "",
  state: address.state ?? "",
  pincode: address.pincode ?? "",
  isDefault: Boolean(address.isDefault ?? address.defaultAddress),
});

const buildReviewFormData = async (reviewData = {}) => {
  const formData = new FormData();
  formData.append("productId", String(reviewData.productId ?? ""));
  formData.append("productName", reviewData.product ?? reviewData.productName ?? "Product");
  formData.append("customerEmail", reviewData.customerEmail ?? "");
  formData.append("customerName", reviewData.customer ?? reviewData.customerName ?? "Customer");
  formData.append("rating", String(Number(reviewData.rating ?? 0)));
  formData.append("comment", reviewData.comment ?? reviewData.text ?? "");

  const images = Array.isArray(reviewData.images) ? reviewData.images : [];
  for (let index = 0; index < images.length; index += 1) {
    const image = images[index];
    if (!image) continue;

    if (Platform.OS === "web") {
      let blob = null;
      if (typeof image === "string" && (image.startsWith("blob:") || image.startsWith("data:") || image.startsWith("http"))) {
        try {
          blob = await fetch(image).then((res) => res.blob());
        } catch (error) {
          console.warn("Unable to read review image on web", error);
          continue;
        }
      }
      if (blob) {
        formData.append("images", blob, `review_image_${index}.jpg`);
      }
      continue;
    }

    if (typeof image === "string") {
      formData.append("images", {
        uri: Platform.OS === "android" ? image : image.replace("file://", ""),
        type: "image/jpeg",
        name: `review_image_${index}.jpg`,
      });
    }
  }

  return formData;
};

export const getCustomerWishlistAPI = async (customerEmail) => {
  try {
    const response = await fetch(`${BASE_URL}/customer/wishlist?customerEmail=${encodeURIComponent(customerEmail)}`);
    const data = await parseJsonSafe(response);
    return Array.isArray(data) ? data.map(normalizeWishlistItem) : [];
  } catch (error) {
    console.error("getCustomerWishlistAPI error:", error);
    return [];
  }
};

export const addWishlistItemAPI = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/customer/wishlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await parseJsonSafe(response);
  } catch (error) {
    console.error("addWishlistItemAPI error:", error);
    return { success: false, message: "Unable to update wishlist." };
  }
};

export const removeWishlistItemAPI = async (customerEmail, productId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/customer/wishlist/${encodeURIComponent(productId)}?customerEmail=${encodeURIComponent(customerEmail)}`,
      { method: "DELETE" }
    );
    return await parseJsonSafe(response);
  } catch (error) {
    console.error("removeWishlistItemAPI error:", error);
    return { success: false, message: "Unable to update wishlist." };
  }
};

export const createCustomerOrderAPI = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/customer/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await parseJsonSafe(response);
    if (data?.order) {
      return { ...data, order: normalizeOrder(data.order) };
    }
    return data;
  } catch (error) {
    console.error("createCustomerOrderAPI error:", error);
    return { success: false, message: "Unable to place order." };
  }
};

export const getCustomerOrdersAPI = async (customerEmail) => {
  try {
    const response = await fetch(`${BASE_URL}/customer/orders?customerEmail=${encodeURIComponent(customerEmail)}`);
    const data = await parseJsonSafe(response);
    return Array.isArray(data) ? data.map(normalizeOrder) : [];
  } catch (error) {
    console.error("getCustomerOrdersAPI error:", error);
    return [];
  }
};

export const createReturnRequestAPI = async (payload = {}) => {
  try {
    const response = await fetch(`${BASE_URL}/customer/returns`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await parseJsonSafe(response);
    if (data?.request) {
      return { ...data, request: normalizeReturnRequest(data.request) };
    }
    return data;
  } catch (error) {
    console.error("createReturnRequestAPI error:", error);
    return { success: false, message: "Unable to create return request." };
  }
};

export const getCustomerReturnRequestsAPI = async (customerEmail) => {
  try {
    const response = await fetch(`${BASE_URL}/customer/returns?customerEmail=${encodeURIComponent(customerEmail)}`);
    const data = await parseJsonSafe(response);
    return Array.isArray(data) ? data.map(normalizeReturnRequest) : [];
  } catch (error) {
    console.error("getCustomerReturnRequestsAPI error:", error);
    return [];
  }
};

export const getSellerReturnRequestsAPI = async (sellerId) => {
  try {
    const response = await fetch(`${BASE_URL}/seller/returns?sellerId=${encodeURIComponent(sellerId)}`);
    const data = await parseJsonSafe(response);
    return Array.isArray(data) ? data.map(normalizeReturnRequest) : [];
  } catch (error) {
    console.error("getSellerReturnRequestsAPI error:", error);
    return [];
  }
};

export const updateReturnStatusAPI = async (returnCode, payload = {}) => {
  try {
    const response = await fetch(`${BASE_URL}/returns/${encodeURIComponent(returnCode)}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await parseJsonSafe(response);
    if (data?.request) {
      return { ...data, request: normalizeReturnRequest(data.request) };
    }
    return data;
  } catch (error) {
    console.error("updateReturnStatusAPI error:", error);
    return { success: false, message: "Unable to update return status." };
  }
};

export const getCustomerAddressesAPI = async (customerEmail) => {
  try {
    const response = await fetch(
      `${BASE_URL}/customer/addresses?customerEmail=${encodeURIComponent(customerEmail)}`
    );
    const data = await parseJsonSafe(response);
    return Array.isArray(data) ? data.map(normalizeCustomerAddress) : [];
  } catch (error) {
    console.error("getCustomerAddressesAPI error:", error);
    return [];
  }
};

export const saveCustomerAddressAPI = async (payload = {}, addressId = null) => {
  try {
    const method = addressId ? "PUT" : "POST";
    const url = addressId
      ? `${BASE_URL}/customer/addresses/${encodeURIComponent(addressId)}`
      : `${BASE_URL}/customer/addresses`;

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        addressId: addressId ?? payload.addressId ?? null,
      }),
    });
    return await parseJsonSafe(response);
  } catch (error) {
    console.error("saveCustomerAddressAPI error:", error);
    return { success: false, message: "Unable to save address." };
  }
};

export const deleteCustomerAddressAPI = async (customerEmail, addressId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/customer/addresses/${encodeURIComponent(addressId)}?customerEmail=${encodeURIComponent(customerEmail)}`,
      { method: "DELETE" }
    );
    return await parseJsonSafe(response);
  } catch (error) {
    console.error("deleteCustomerAddressAPI error:", error);
    return { success: false, message: "Unable to delete address." };
  }
};

export const setDefaultCustomerAddressAPI = async (customerEmail, addressId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/customer/addresses/${encodeURIComponent(addressId)}/default?customerEmail=${encodeURIComponent(customerEmail)}`,
      { method: "POST" }
    );
    return await parseJsonSafe(response);
  } catch (error) {
    console.error("setDefaultCustomerAddressAPI error:", error);
    return { success: false, message: "Unable to set default address." };
  }
};

export const getAdminOrdersAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/admin/orders`);
    const data = await parseJsonSafe(response);
    return Array.isArray(data) ? data.map(normalizeOrder) : [];
  } catch (error) {
    console.error("getAdminOrdersAPI error:", error);
    return [];
  }
};

export const getSellerOrdersAPI = async (sellerId) => {
  try {
    const response = await fetch(`${BASE_URL}/seller/orders?sellerId=${encodeURIComponent(sellerId)}`);
    const data = await parseJsonSafe(response);
    return Array.isArray(data) ? data.map(normalizeOrder) : [];
  } catch (error) {
    console.error("getSellerOrdersAPI error:", error);
    return [];
  }
};

export const updateOrderStatusAPI = async (orderId, status) => {
  try {
    const response = await fetch(`${BASE_URL}/orders/${encodeURIComponent(orderId)}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await parseJsonSafe(response);
    return data?.order ? { ...data, order: normalizeOrder(data.order) } : data;
  } catch (error) {
    console.error("updateOrderStatusAPI error:", error);
    return { success: false, message: "Unable to update order status." };
  }
};

export const updateDeliveryStatusAPI = async (orderId, deliveryStatus) => {
  try {
    const response = await fetch(`${BASE_URL}/orders/${encodeURIComponent(orderId)}/delivery-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deliveryStatus }),
    });
    const data = await parseJsonSafe(response);
    return data?.order ? { ...data, order: normalizeOrder(data.order) } : data;
  } catch (error) {
    console.error("updateDeliveryStatusAPI error:", error);
    return { success: false, message: "Unable to update delivery status." };
  }
};

export const assignDeliveryPersonAPI = async (orderId, payload) => {
  try {
    const response = await fetch(`${BASE_URL}/orders/${encodeURIComponent(orderId)}/assign-delivery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await parseJsonSafe(response);
    return data?.order ? { ...data, order: normalizeOrder(data.order) } : data;
  } catch (error) {
    console.error("assignDeliveryPersonAPI error:", error);
    return { success: false, message: "Unable to assign delivery partner." };
  }
};

export const getDeliveryPartnersAPI = async (sellerId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/seller/delivery-partners?sellerId=${encodeURIComponent(sellerId)}`
    );
    const data = await parseJsonSafe(response);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("getDeliveryPartnersAPI error:", error);
    return [];
  }
};

export const addDeliveryPartnerAPI = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/seller/delivery-partners`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await parseJsonSafe(response);
  } catch (error) {
    console.error("addDeliveryPartnerAPI error:", error);
    return { success: false, message: "Unable to save delivery person." };
  }
};

export const addProductReviewAPI = async (reviewData) => {
  try {
    const formData = await buildReviewFormData(reviewData);
    const response = await fetch(`${BASE_URL}/orders/${encodeURIComponent(reviewData.orderId)}/reviews`, {
      method: "POST",
      body: formData,
    });
    const data = await parseJsonSafe(response);
    return data?.review ? { ...data, review: normalizeReview(data.review) } : data;
  } catch (error) {
    console.error("addProductReviewAPI error:", error);
    return { success: false, message: "Unable to save review." };
  }
};

export const getAllReviewsAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/reviews`);
    const data = await parseJsonSafe(response);
    return Array.isArray(data) ? data.map(normalizeReview) : [];
  } catch (error) {
    console.error("getAllReviewsAPI error:", error);
    return [];
  }
};
