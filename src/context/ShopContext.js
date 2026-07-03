


// src/context/ShopContext.js

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Platform } from "react-native";
import {
  getAllSellersAPI,
  registerSellerAPI,
  loginSellerAPI,
  approveSellerAPI,
  rejectSellerAPI,
  getSellerProfileAPI,
  updateSellerProfileAPI,
  getSellerSettingsAPI,
  updateSellerSettingsAPI,
  getSellerSupportContentAPI,
} from "../api/sellerApi";
import {
  addProductAPI,
  getAllProductsAPI,
  getApprovedProductsAPI,
  getProductCatalogAPI,
  approveProductAPI,
  rejectProductAPI,
  getSellerProductsAPI,
  updateSellerProductAPI,
  deleteSellerProductAPI,
} from "../api/productApi";
import {
  addProductReviewAPI,
  addWishlistItemAPI,
  addDeliveryPartnerAPI,
  assignDeliveryPersonAPI,
  createCustomerOrderAPI,
  createReturnRequestAPI,
  deleteCustomerAddressAPI,
  getDeliveryPartnersAPI,
  getAdminOrdersAPI,
  getAllReviewsAPI,
  getCustomerAddressesAPI,
  getCustomerOrdersAPI,
  getCustomerReturnRequestsAPI,
  getCustomerWishlistAPI,
  getSellerOrdersAPI,
  getSellerReturnRequestsAPI,
  removeWishlistItemAPI,
  saveCustomerAddressAPI,
  updateDeliveryStatusAPI,
  updateOrderStatusAPI,
  updateReturnStatusAPI,
  setDefaultCustomerAddressAPI,
} from "../api/commerceApi";
import {
  createNotificationAPI,
  getAdminNotificationsAPI,
  getCustomerNotificationsAPI,
  getSellerNotificationsAPI,
  markAllNotificationsReadAPI,
  markNotificationReadAPI,
} from "../api/notificationApi";
import {
  createComplaintAPI,
  getAdminComplaintsAPI,
  getSellerComplaintsAPI,
  markComplaintReadAPI,
  resolveComplaintAPI,
} from "../api/complaintApi";
import { createRazorpayRefundAPI, getSellerPayoutSummaryAPI } from "../api/paymentApi";
import {
  getAuthSession,
  getCustomerAccount,
  setAuthSession,
  setCustomerAccount,
} from "../utils/authSession";
import {
  buildCategoryCatalogFromEntries,
  buildCategoryCatalogFromProducts,
} from "../utils/categoryCatalog";
import { SERVER_URL } from "../api/config";

const ShopContext = createContext(null);

// ─── Pure helpers ─────────────────────────────────────────────────────────────
const cleanPrice = (price) => {
  if (typeof price === "number") return price;
  const value = String(price ?? "0").replace(/[^\d.]/g, "");
  const number = Number(value);
  return Number.isNaN(number) ? 0 : number;
};

const formatPrice = (amount) =>
  `₹${Number(amount ?? 0).toLocaleString("en-IN")}`;

const getDiscountedPrice = (price, discount = 0) => {
  const amount = cleanPrice(price);
  const off = Number(discount ?? 0);
  return Math.max(amount - (amount * off) / 100, 0);
};

const resolveImageUri = (image) => {
  if (!image) return null;
  if (typeof image === "string") {
    if (image.includes("/uploads/documents/")) {
      const fileName = image.split("/").pop();
      return fileName ? `${SERVER_URL}/uploads/${encodeURIComponent(fileName)}` : image;
    }
    return image;
  }
  if (typeof image === "object") {
    const value = image.uri || image.url || image.path || null;
    if (typeof value === "string" && value.includes("/uploads/documents/")) {
      const fileName = value.split("/").pop();
      return fileName ? `${SERVER_URL}/uploads/${encodeURIComponent(fileName)}` : value;
    }
    return value;
  }
  return null;
};

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function nowLabel() {
  return new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function isServerSellerId(value) {
  return /^\d+$/.test(String(value ?? "").trim());
}

function getCustomerIdentity() {
  const session = getAuthSession();
  const savedCustomer = getCustomerAccount();
  const rawEmail =
    session?.role === "customer"
      ? session?.email || savedCustomer?.email || ""
      : savedCustomer?.email ?? session?.email ?? "";
  const email = String(rawEmail ?? "").trim().toLowerCase();
  const rawName =
    savedCustomer?.name ??
    session?.name ??
    (email ? email.split("@")[0].replace(/[._-]+/g, " ") : "Customer");
  const name = rawName
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "Customer";

  return {
    email,
    name,
    phone: savedCustomer?.phone ?? session?.phone ?? "",
    location: savedCustomer?.location ?? session?.location ?? "",
    bio: savedCustomer?.bio ?? session?.bio ?? "",
    avatar: savedCustomer?.avatar ?? session?.avatar ?? null,
  };
}

function buildReviewMap(reviews = []) {
  return reviews.reduce((acc, review) => {
    const key = String(review.productId ?? review.product ?? "");
    if (!key) return acc;
    acc[key] = [...(acc[key] ?? []), review];
    return acc;
  }, {});
}

function getNotificationAppearance(type = "info") {
  const iconMap = {
    approval: { icon: "storefront-outline", iconBg: "#e8f5e9", iconColor: "#16A34A" },
    order: { icon: "receipt-outline", iconBg: "#e3f2fd", iconColor: "#1976d2" },
    complaint: { icon: "alert-circle-outline", iconBg: "#fdecea", iconColor: "#EF4444" },
    payout: { icon: "wallet-outline", iconBg: "#fff8e1", iconColor: "#F97316" },
    product: { icon: "cube-outline", iconBg: "#f3e5f5", iconColor: "#7b1fa2" },
    alert: { icon: "warning-outline", iconBg: "#fdecea", iconColor: "#EF4444" },
    report: { icon: "bar-chart-outline", iconBg: "#e3f2fd", iconColor: "#1976d2" },
    user: { icon: "person-outline", iconBg: "#f3e5f5", iconColor: "#7b1fa2" },
    review: { icon: "star-outline", iconBg: "#FFF7ED", iconColor: "#F59E0B" },
    wishlist: { icon: "heart-outline", iconBg: "#FCE7F3", iconColor: "#E83E7C" },
    delivery: { icon: "car-outline", iconBg: "#DBEAFE", iconColor: "#2563EB" },
    return: { icon: "return-up-back-outline", iconBg: "#FFF7ED", iconColor: "#F97316" },
    refund: { icon: "wallet-outline", iconBg: "#ECFDF5", iconColor: "#16A34A" },
  };

  return iconMap[type] ?? {
    icon: "notifications-outline",
    iconBg: "#EFF6FF",
    iconColor: "#2563EB",
  };
}

function attachReviewsToProducts(products = [], reviewsByProduct = {}) {
  return products.map((product) => {
    const productKey = String(product.id ?? product.productId ?? product.name ?? "");
    const reviewList = Array.isArray(reviewsByProduct[productKey])
      ? reviewsByProduct[productKey]
      : Array.isArray(product.customerReviews)
      ? product.customerReviews
      : [];

    if (reviewList.length === 0) {
      return normalizeProduct(product);
    }

    const averageRating =
      reviewList.reduce((sum, review) => sum + Number(review.rating ?? 0), 0) /
      reviewList.length;

    return normalizeProduct({
      ...product,
      customerReviews: reviewList,
      reviews: reviewList.length,
      rating: Number(averageRating.toFixed(1)),
    });
  });
}

function splitSellersByStatus(sellers = []) {
  const nextPending = [];
  const nextApproved = [];
  const nextRejected = [];

  sellers.forEach((seller) => {
    const status = String(seller?.status ?? "").toUpperCase();
    if (status === "APPROVED") {
      nextApproved.push({ ...seller, status: "Approved" });
      return;
    }
    if (status === "REJECTED") {
      nextRejected.push({ ...seller, status: "Rejected" });
      return;
    }

    nextPending.push({ ...seller, status: "Pending" });
  });

  return { nextPending, nextApproved, nextRejected };
}

function splitProductsByStatus(products = []) {
  const nextPending = [];
  const nextSellerProducts = [];

  products.forEach((product) => {
    const normalized = normalizeProduct(product);
    nextSellerProducts.push(normalized);
    if (!normalized.visibleToCustomer) {
      nextPending.push(normalized);
    }
  });

  return { nextPending, nextSellerProducts };
}

const normalizeProduct = (product = {}) => {
  const priceNumber = cleanPrice(product.price ?? product.originalPrice ?? 0);
  const discount = Number(product.discount ?? 0);
  const finalPriceNumber = getDiscountedPrice(priceNumber, discount);

  const rawImages =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];

  const normalizedImages = rawImages
    .map(resolveImageUri)
    .filter(Boolean);

  return {
    id: product.id ?? `P${Date.now().toString().slice(-6)}`,
    name: product.name ?? "New Product",
    price: formatPrice(priceNumber),
    originalPrice: formatPrice(priceNumber),
    discount,
    finalPrice: formatPrice(finalPriceNumber),
    image: normalizedImages[0] ?? null,
    images: normalizedImages,
    rawImages:
      Array.isArray(product.rawImages) && product.rawImages.length > 0
        ? product.rawImages
        : rawImages,
    stock: Number(product.stock ?? 1),
    category: product.category ?? "Decor",
    subcategory: product.subcategory ?? "",
    sellerId: product.sellerId ?? "SELLER001",
    sellerName: product.sellerName ?? "Seller Hub",
    visibleToCustomer:
      typeof product.visibleToCustomer === "boolean"
        ? product.visibleToCustomer
        : true,
    active: typeof product.active === "boolean" ? product.active : true,
    status: product.status ?? "Live",
    description: product.description ?? "",
    weight: product.weight ?? "",
    size: product.size ?? "Medium",
    material: product.material ?? "Handmade / Premium Quality",
    color: product.color ?? "As shown in image",
    delivery: product.delivery ?? "Delivery in 3 - 5 days",
    returnPolicy: product.returnPolicy ?? "7 days replacement available",
    rating: product.rating ?? 4.5,
    reviews: product.reviews ?? 0,
    customerReviews: product.customerReviews ?? [],
    sku: product.sku ?? "",
    paymentStatus: product.paymentStatus ?? null,
    uploadFee: product.uploadFee ?? null,
    paymentMethod: product.paymentMethod ?? null,
    paidAt: product.paidAt ?? null,
    createdAt: product.createdAt ?? new Date().toISOString(),
    updatedAt: product.updatedAt ?? new Date().toISOString(),
  };
};

const getOrderItems = (order = {}) => {
  if (Array.isArray(order.products) && order.products.length > 0) {
    return order.products;
  }
  if (Array.isArray(order.items) && order.items.length > 0) {
    return order.items;
  }
  return [];
};

const getOrderItemLineTotal = (item = {}) => {
  const unitPrice = cleanPrice(item.finalPrice ?? item.price);
  const quantity = Number(item.qty ?? item.quantity ?? 1);
  return unitPrice * (Number.isFinite(quantity) && quantity > 0 ? quantity : 1);
};

const calculateSellerOrderAmount = (order = {}) => {
  const itemsTotal = getOrderItems(order).reduce(
    (sum, item) => sum + getOrderItemLineTotal(item),
    0
  );

  if (itemsTotal > 0) {
    return itemsTotal;
  }

  const sellerEarning = Number(order.sellerEarning);
  if (Number.isFinite(sellerEarning) && sellerEarning > 0) {
    return sellerEarning;
  }

  return cleanPrice(order.price ?? order.totalAmount) * 0.9;
};

const toValidDate = (value) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

// ─── Initial seed data ────────────────────────────────────────────────────────
const initialProducts = [];

const initialDeliveryPartners = [];

const initialOrders = [];

const initialSellerNotifications = [];

const initialAdminNotifications = [];

const initialCustomerAddresses = [];

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ShopProvider({ children }) {

  // ── Core state ─────────────────────────────────────────────────────────────
  const [cartItems, setCartItems]           = useState([]);
  const [wishlistItems, setWishlistItems]   = useState([]);
  const [orders, setOrders]                 = useState([]);
  const [productReviews, setProductReviews] = useState({});
  const [sellerProducts, setSellerProducts] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [productCatalog, setProductCatalog] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState(initialDeliveryPartners);
  const [returnRequests, setReturnRequests] = useState([]);
  const [customerWallet, setCustomerWallet] = useState(0);
  const [refundHistory, setRefundHistory]   = useState([]);

  const [commissionRecords, setCommissionRecords] = useState([]);

  const [currentSeller, setCurrentSeller]                 = useState(null);
  const [currentCustomer, setCurrentCustomer]             = useState(getCustomerIdentity());
  const [customerAddresses, setCustomerAddresses]         = useState(initialCustomerAddresses);

  useEffect(() => {
    const session = getAuthSession();
    if (session?.role === "seller" && session?.seller) {
      setCurrentSeller(session.seller);
    }
    setCurrentCustomer(getCustomerIdentity());
  }, []);
  const [sellerNotifications, setSellerNotifications]     = useState([]);
  const [adminNotifications, setAdminNotifications]       = useState([]);
  const [customerNotifications, setCustomerNotifications] = useState([]);
  const [complaints, setComplaints]                       = useState([]);
  const [sellerSettings, setSellerSettings]               = useState({
    orderNotifications: true,
    promotionalUpdates: false,
    smsAlerts: true,
    emailUpdates: true,
    darkMode: false,
    autoAcceptOrders: false,
  });
  const [sellerSupportContent, setSellerSupportContent]   = useState({
    faqs: [],
    quickActions: [],
    supportHours: [],
  });

  // ── Seller approval state ──────────────────────────────────────────────────
  const [pendingSellers, setPendingSellers]   = useState([]);
  const [approvedSellers, setApprovedSellers] = useState([]);
  const [rejectedSellers, setRejectedSellers] = useState([]);

  // Use a ref to always access the latest seller lists inside callbacks
  // without needing them as deps (avoids stale-closure bugs in approve/reject).
  const pendingSellersRef   = useRef(pendingSellers);
  const rejectedSellersRef  = useRef(rejectedSellers);

  // Keep refs in sync
  pendingSellersRef.current  = pendingSellers;
  rejectedSellersRef.current = rejectedSellers;

  const reloadSellers = useCallback(async () => {
    const sellers = await getAllSellersAPI();
    const { nextPending, nextApproved, nextRejected } =
      splitSellersByStatus(Array.isArray(sellers) ? sellers : []);

    setPendingSellers(nextPending);
    setApprovedSellers(nextApproved);
    setRejectedSellers(nextRejected);

    const session = getAuthSession();
    if (session?.role === "seller" && !session?.seller && session?.email) {
      const restoredSeller = nextApproved.find(
        (seller) => seller.email?.trim().toLowerCase() === session.email.trim().toLowerCase()
      );
      if (restoredSeller) {
        setCurrentSeller(restoredSeller);
      }
    }

    return {
      pending: nextPending,
      approved: nextApproved,
      rejected: nextRejected,
    };
  }, []);

  const reloadCustomerCommerceData = useCallback(async () => {
    const customer = getCustomerIdentity();
    setCurrentCustomer(customer);
    if (!customer.email) {
      setWishlistItems([]);
      setReturnRequests([]);
      return [];
    }

    const [wishlist, customerOrders, customerReturns] = await Promise.all([
      getCustomerWishlistAPI(customer.email),
      getCustomerOrdersAPI(customer.email),
      getCustomerReturnRequestsAPI(customer.email),
    ]);

    setWishlistItems(Array.isArray(wishlist) ? wishlist : []);
    setOrders(Array.isArray(customerOrders) ? customerOrders : []);
    setReturnRequests(Array.isArray(customerReturns) ? customerReturns : []);
    return customerOrders;
  }, []);

  const reloadCustomerAddresses = useCallback(async (customerEmailArg) => {
    const customerEmail = String(customerEmailArg ?? getCustomerIdentity().email ?? "")
      .trim()
      .toLowerCase();

    if (!customerEmail) {
      setCustomerAddresses([]);
      return [];
    }

    const addresses = await getCustomerAddressesAPI(customerEmail);
    setCustomerAddresses(Array.isArray(addresses) ? addresses : []);
    return addresses;
  }, []);

  const reloadSellerOrders = useCallback(async (sellerIdArg) => {
    const sellerId = String(sellerIdArg ?? currentSeller?.id ?? "").trim();
    if (!sellerId || !isServerSellerId(sellerId)) {
      return [];
    }

    const sellerOrders = await getSellerOrdersAPI(sellerId);
    setOrders(Array.isArray(sellerOrders) ? sellerOrders : []);
    return sellerOrders;
  }, [currentSeller]);

  const reloadSellerReturnRequests = useCallback(async (sellerIdArg) => {
    const sellerId = String(sellerIdArg ?? currentSeller?.id ?? "").trim();
    if (!sellerId || !isServerSellerId(sellerId)) {
      return [];
    }

    const sellerReturns = await getSellerReturnRequestsAPI(sellerId);
    setReturnRequests(Array.isArray(sellerReturns) ? sellerReturns : []);
    return sellerReturns;
  }, [currentSeller]);

  const reloadAdminOrders = useCallback(async () => {
    const adminOrders = await getAdminOrdersAPI();
    setOrders(Array.isArray(adminOrders) ? adminOrders : []);
    return adminOrders;
  }, []);

  const reloadProductsWithReviews = useCallback(async () => {
    try {
      const [products, reviews, catalog] = await Promise.all([
        getAllProductsAPI(),
        getAllReviewsAPI(),
        getProductCatalogAPI(),
      ]);

      const reviewsByProduct = buildReviewMap(Array.isArray(reviews) ? reviews : []);
      const mergedProducts = attachReviewsToProducts(
        Array.isArray(products) ? products : [],
        reviewsByProduct
      );
      const { nextPending, nextSellerProducts } = splitProductsByStatus(mergedProducts);

      setProductReviews(reviewsByProduct);
      setPendingProducts(nextPending);
      setSellerProducts(nextSellerProducts);
      setProductCatalog(Array.isArray(catalog) ? catalog : []);
    } catch (error) {
      console.error("Failed to reload products and reviews:", error);
    }
  }, []);

  const reloadCurrentSellerProducts = useCallback(async (sellerIdArg) => {
    const sellerId = String(sellerIdArg ?? currentSeller?.id ?? "").trim();
    if (!sellerId || !isServerSellerId(sellerId)) {
      return [];
    }

    try {
      const products = await getSellerProductsAPI(sellerId);
      setSellerProducts(Array.isArray(products) ? products : []);
      return products;
    } catch (error) {
      console.error("Failed to reload current seller products:", error);
      return [];
    }
  }, [currentSeller]);

  const reloadAdminNotifications = useCallback(async () => {
    const items = await getAdminNotificationsAPI();
    setAdminNotifications(Array.isArray(items) ? items : []);
    return items;
  }, []);

  const reloadSellerNotifications = useCallback(async (sellerIdArg) => {
    const sellerId = String(sellerIdArg ?? currentSeller?.id ?? "").trim();
    if (!sellerId || !isServerSellerId(sellerId)) {
      setSellerNotifications([]);
      return [];
    }

    const items = await getSellerNotificationsAPI(sellerId);
    setSellerNotifications(Array.isArray(items) ? items : []);
    return items;
  }, [currentSeller]);

  const reloadDeliveryPartners = useCallback(async (sellerIdArg) => {
    const sellerId = String(sellerIdArg ?? currentSeller?.id ?? "").trim();
    if (!sellerId || !isServerSellerId(sellerId)) {
      setDeliveryPartners([]);
      return [];
    }

    const items = await getDeliveryPartnersAPI(sellerId);
    setDeliveryPartners(Array.isArray(items) ? items : []);
    return items;
  }, [currentSeller]);

  const reloadCustomerNotifications = useCallback(async (customerEmailArg) => {
    const customerEmail = String(customerEmailArg ?? getCustomerIdentity().email ?? "")
      .trim()
      .toLowerCase();

    if (!customerEmail) {
      setCustomerNotifications([]);
      return [];
    }

    const items = await getCustomerNotificationsAPI(customerEmail);
    setCustomerNotifications(Array.isArray(items) ? items : []);
    return items;
  }, []);

  const reloadComplaints = useCallback(async (sellerIdArg) => {
    const session = getAuthSession();
    if (session?.role === "admin") {
      const items = await getAdminComplaintsAPI();
      setComplaints(Array.isArray(items) ? items : []);
      return items;
    }

    const sellerId = String(sellerIdArg ?? currentSeller?.id ?? "").trim();
    if (!sellerId || !isServerSellerId(sellerId)) {
      setComplaints([]);
      return [];
    }

    const items = await getSellerComplaintsAPI(sellerId);
    setComplaints(Array.isArray(items) ? items : []);
    return items;
  }, [currentSeller]);

  const reloadSellerProfile = useCallback(async (sellerIdArg) => {
    const sellerId = String(sellerIdArg ?? currentSeller?.id ?? "").trim();
    if (!sellerId || !isServerSellerId(sellerId)) {
      return null;
    }

    const result = await getSellerProfileAPI(sellerId);
    if (result?.success && result?.seller) {
      setCurrentSeller((prev) => {
        const mergedSeller = { ...(prev ?? {}), ...result.seller };
        const session = getAuthSession();
        if (session?.role === "seller") {
          setAuthSession({
            ...session,
            seller: mergedSeller,
            email: mergedSeller.email ?? session.email,
          });
        }
        return mergedSeller;
      });
      if (result.settings) {
        setSellerSettings((prev) => ({ ...prev, ...result.settings }));
      }
      return result.seller;
    }

    return null;
  }, [currentSeller]);

  const reloadSellerSettings = useCallback(async (sellerIdArg) => {
    const sellerId = String(sellerIdArg ?? currentSeller?.id ?? "").trim();
    if (!sellerId || !isServerSellerId(sellerId)) {
      return null;
    }

    const result = await getSellerSettingsAPI(sellerId);
    if (result?.success && result?.settings) {
      setSellerSettings((prev) => ({ ...prev, ...result.settings }));
      return result.settings;
    }
    return null;
  }, [currentSeller]);

  const reloadSellerSupportContent = useCallback(async () => {
    const result = await getSellerSupportContentAPI();
    if (result?.success) {
      setSellerSupportContent({
        faqs: Array.isArray(result.faqs) ? result.faqs : [],
        quickActions: Array.isArray(result.quickActions) ? result.quickActions : [],
        supportHours: Array.isArray(result.supportHours) ? result.supportHours : [],
      });
      return result;
    }
    return null;
  }, []);

  const reloadSellerPayoutSummary = useCallback(async (sellerIdArg) => {
    const sellerId = String(sellerIdArg ?? "").trim();
    if (!sellerId) {
      return null;
    }

    const result = await getSellerPayoutSummaryAPI(sellerId);
    if (result?.success) {
      setRefundHistory(Array.isArray(result.refundHistory) ? result.refundHistory : []);
      return result;
    }

    return null;
  }, []);

  const selectedDeliveryAddress = useMemo(
    () =>
      customerAddresses.find((address) => address.isDefault) ??
      customerAddresses[0] ??
      null,
    [customerAddresses]
  );

  useEffect(() => {
    let isMounted = true;

    const loadSellers = async () => {
      try {
        if (!isMounted) {
          return;
        }
        await reloadSellers();
      } catch (error) {
        console.error("Failed to load sellers into ShopContext:", error);
      }
    };

    loadSellers();

    return () => {
      isMounted = false;
    };
  }, [reloadSellers]);

  useEffect(() => {
    reloadProductsWithReviews();
  }, [reloadProductsWithReviews]);

  useEffect(() => {
    const session = getAuthSession();
    setCurrentCustomer(getCustomerIdentity());

    if (session?.role === "customer") {
      reloadCustomerCommerceData();
      reloadCustomerNotifications();
      reloadCustomerAddresses();
    }
  }, [reloadCustomerAddresses, reloadCustomerCommerceData, reloadCustomerNotifications]);

  useEffect(() => {
    if (currentSeller?.id && isServerSellerId(currentSeller.id)) {
      reloadSellerOrders(currentSeller.id);
      reloadSellerReturnRequests(currentSeller.id);
      reloadSellerNotifications(currentSeller.id);
      reloadDeliveryPartners(currentSeller.id);
      reloadCurrentSellerProducts(currentSeller.id);
      reloadComplaints(currentSeller.id);
      reloadSellerProfile(currentSeller.id);
      reloadSellerSettings(currentSeller.id);
    }
  }, [currentSeller, reloadSellerOrders, reloadSellerReturnRequests, reloadSellerNotifications, reloadDeliveryPartners, reloadCurrentSellerProducts, reloadComplaints, reloadSellerProfile, reloadSellerSettings]);

  useEffect(() => {
    reloadAdminNotifications();
  }, [reloadAdminNotifications]);

  useEffect(() => {
    const session = getAuthSession();
    if (session?.role === "admin") {
      reloadAdminOrders();
      reloadComplaints();
    }
  }, [reloadAdminOrders, reloadComplaints]);

  useEffect(() => {
    reloadSellerSupportContent();
  }, [reloadSellerSupportContent]);

  // ─── Notification helpers ──────────────────────────────────────────────────
  useEffect(() => {
    if (!currentSeller?.id) {
      setRefundHistory([]);
      return;
    }

    reloadSellerPayoutSummary(currentSeller.id);
  }, [currentSeller?.id, reloadSellerPayoutSummary]);

  const addSellerNotification = useCallback((title, message, type = "info", extra = {}) => {
    const appearance = getNotificationAppearance(type);
    const targetSellerId = String(extra?.sellerId ?? currentSeller?.id ?? "").trim();
    const localNotification = {
      id: `SN${Date.now()}`,
      title,
      message,
      time: "Just now",
      read: false,
      unread: true,
      type,
      ...appearance,
      ...extra,
    };

    if (!targetSellerId || String(currentSeller?.id ?? "") === targetSellerId) {
      setSellerNotifications((prev) => [localNotification, ...prev]);
    }

    if (targetSellerId && isServerSellerId(targetSellerId)) {
      createNotificationAPI({
        audience: "SELLER",
        audienceKey: targetSellerId,
        title,
        message,
        type,
        ...appearance,
        ...extra,
        sellerId: targetSellerId,
      })
        .then(() => {
          if (String(currentSeller?.id ?? "") === targetSellerId) {
            reloadSellerNotifications(targetSellerId);
          }
        })
        .catch((error) => console.error("Seller notification sync failed:", error));
    }
  }, [currentSeller, reloadSellerNotifications]);

  const addCustomerNotification = useCallback((title, message, type = "info", extra = {}) => {
    const customer = getCustomerIdentity();
    const targetCustomerEmail = String(extra?.customerEmail ?? customer.email ?? "")
      .trim()
      .toLowerCase();
    const appearance = getNotificationAppearance(type);
    const localNotification = {
      id: `CN${Date.now()}`,
      title,
      message,
      time: "Just now",
      read: false,
      unread: true,
      type,
      ...appearance,
      ...extra,
    };

    if (!targetCustomerEmail || customer.email === targetCustomerEmail) {
      setCustomerNotifications((prev) => [localNotification, ...prev]);
    }

    if (targetCustomerEmail) {
      createNotificationAPI({
        audience: "CUSTOMER",
        audienceKey: targetCustomerEmail,
        title,
        message,
        type,
        ...appearance,
        ...extra,
        customerEmail: targetCustomerEmail,
      })
        .then(() => {
          if (customer.email === targetCustomerEmail) {
            reloadCustomerNotifications(targetCustomerEmail);
          }
        })
        .catch((error) => console.error("Customer notification sync failed:", error));
    }
  }, [reloadCustomerNotifications]);

  const addAdminNotification = useCallback(
    (title, message, type = "info", extra = {}) => {
      const iconConfig = getNotificationAppearance(type);
      setAdminNotifications((prev) => [
        {
          id: `AN${Date.now()}`,
          type,
          ...iconConfig,
          title,
          message,
          time: "Just now",
          unread: true,
          ...extra,
        },
        ...prev,
      ]);

      createNotificationAPI({
        audience: "ADMIN",
        audienceKey: "global",
        title,
        message,
        type,
        ...iconConfig,
        ...extra,
      })
        .then(() => reloadAdminNotifications())
        .catch((error) => console.error("Admin notification sync failed:", error));
    },
    [reloadAdminNotifications]
  );

  const markSellerNotificationRead = useCallback((id) => {
    setSellerNotifications((prev) =>
      prev.map((n) =>
        String(n.id) === String(id) ? { ...n, read: true, unread: false } : n
      )
    );
    if (/^\d+$/.test(String(id))) {
      markNotificationReadAPI(id)
        .then(() => {
          if (currentSeller?.id) {
            reloadSellerNotifications(currentSeller.id);
          }
        })
        .catch((error) => console.error("Mark seller notification failed:", error));
    }
  }, [currentSeller, reloadSellerNotifications]);

  const markAllSellerNotificationsRead = useCallback(() => {
    setSellerNotifications((prev) => prev.map((n) => ({ ...n, read: true, unread: false })));
    if (currentSeller?.id) {
      markAllNotificationsReadAPI({
        audience: "SELLER",
        audienceKey: String(currentSeller.id),
      })
        .then(() => reloadSellerNotifications(currentSeller.id))
        .catch((error) => console.error("Mark all seller notifications failed:", error));
    }
  }, [currentSeller, reloadSellerNotifications]);

  const markAdminNotificationRead = useCallback((id) => {
    setAdminNotifications((prev) =>
      prev.map((n) =>
        String(n.id) === String(id) ? { ...n, unread: false, read: true } : n
      )
    );
    if (/^\d+$/.test(String(id))) {
      markNotificationReadAPI(id)
        .then(() => reloadAdminNotifications())
        .catch((error) => console.error("Mark admin notification failed:", error));
    }
  }, [reloadAdminNotifications]);

  const markAllAdminNotificationsRead = useCallback(() => {
    setAdminNotifications((prev) => prev.map((n) => ({ ...n, unread: false, read: true })));
    markAllNotificationsReadAPI({
      audience: "ADMIN",
      audienceKey: "global",
    })
      .then(() => reloadAdminNotifications())
      .catch((error) => console.error("Mark all admin notifications failed:", error));
  }, [reloadAdminNotifications]);

  const markCustomerNotificationRead = useCallback((id) => {
    setCustomerNotifications((prev) =>
      prev.map((n) =>
        String(n.id) === String(id) ? { ...n, unread: false, read: true } : n
      )
    );
    if (/^\d+$/.test(String(id))) {
      markNotificationReadAPI(id)
        .then(() => reloadCustomerNotifications())
        .catch((error) => console.error("Mark customer notification failed:", error));
    }
  }, [reloadCustomerNotifications]);

  const markAllCustomerNotificationsRead = useCallback(() => {
    const customer = getCustomerIdentity();
    setCustomerNotifications((prev) => prev.map((n) => ({ ...n, unread: false, read: true })));
    if (customer.email) {
      markAllNotificationsReadAPI({
        audience: "CUSTOMER",
        audienceKey: customer.email,
      })
        .then(() => reloadCustomerNotifications(customer.email))
        .catch((error) => console.error("Mark all customer notifications failed:", error));
    }
  }, [reloadCustomerNotifications]);

  // Backwards-compat aliases
  const addNotification          = addSellerNotification;
  const markNotificationRead     = markSellerNotificationRead;
  const markAllNotificationsRead = markAllSellerNotificationsRead;

  // ─── Seller Registration ───────────────────────────────────────────────────
  const registerSeller = useCallback(
    ({
      name,
      shopName,
      email,
      phone,
      password,
      category,
      gst,
      description,
      address,
      documents,
    }) => {
      const newSeller = {
        id: `SELLER_${uid()}`,
        name: name ?? "Seller",
        shopName: shopName ?? `${name ?? "Seller"}'s Shop`,
        email: email ?? "",
        phone: phone ?? "",
        password: password ?? "",
        category: category ?? "General",
        gst: gst ?? "",
        description: description ?? "",
        address: address ?? {},
        documents: Array.isArray(documents) ? documents : [],
        status: "Pending",
        registeredAt: Date.now(),
        registeredAtLabel: nowLabel(),
        rating: "0.0",
        totalProducts: 0,
        totalOrders: 0,
        totalSales: "₹0",
        commission: "₹0",
        joined: new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };

      setPendingSellers((prev) => [newSeller, ...prev]);

      addAdminNotification(
        "New Seller Registration",
        `${name ?? "Seller"} from ${shopName ?? `${name ?? "Seller"}'s Shop`} (${
          category ?? "General"
        }) has applied. ${
          Array.isArray(documents) && documents.length > 0
            ? `${documents.length} document(s) uploaded.`
            : "No documents uploaded."
        }`,
        "approval",
        { sellerId: newSeller.id }
      );

      return newSeller;
    },
    [addAdminNotification]
  );

  // ─── Admin Approves Seller ─────────────────────────────────────────────────
  // FIX: Use functional updates + refs to avoid stale closures. Previously
  // setRejectedSellers was called inside setPendingSellers's updater which
  // could read a stale copy of rejectedSellers.
  const approveSeller = useCallback(
    async (sellerId) => {
      const id = String(sellerId);
      let approvedSeller = null;
      let syncedFromServer = false;

      if (isServerSellerId(id)) {
        const response = await approveSellerAPI(sellerId);
        if (!response?.success) {
          throw new Error(response?.message || "Approval request failed");
        }

        const sellers = await getAllSellersAPI();
        const { nextPending, nextApproved, nextRejected } =
          splitSellersByStatus(sellers);
        setPendingSellers(nextPending);
        setApprovedSellers(nextApproved);
        setRejectedSellers(nextRejected);
        approvedSeller =
          nextApproved.find((seller) => String(seller.id) === id) ?? null;
        syncedFromServer = true;
      }

      // Try pending first
      const pendingMatch = !approvedSeller
        ? pendingSellersRef.current.find((s) => String(s.id) === id)
        : null;
      if (pendingMatch) {
        approvedSeller = {
          ...pendingMatch,
          status: "Approved",
          approvedAt: Date.now(),
          approvedAtLabel: nowLabel(),
        };
        setPendingSellers((prev) => prev.filter((s) => String(s.id) !== id));
      }

      // Try rejected (re-consider flow)
      if (!approvedSeller) {
        const rejectedMatch = rejectedSellersRef.current.find(
          (s) => String(s.id) === id
        );
        if (rejectedMatch) {
          approvedSeller = {
            ...rejectedMatch,
            status: "Approved",
            approvedAt: Date.now(),
            approvedAtLabel: nowLabel(),
            rejectionReason: undefined,
          };
          setRejectedSellers((prev) => prev.filter((s) => String(s.id) !== id));
        }
      }

      if (!approvedSeller) return null;

      if (!syncedFromServer) {
        setApprovedSellers((prev) => [approvedSeller, ...prev]);
      }

      // Mark related admin notifications as read
      setAdminNotifications((prev) =>
        prev.map((n) =>
          String(n.sellerId) === id ? { ...n, unread: false } : n
        )
      );

      addAdminNotification(
        "Seller Approved ✅",
        `${approvedSeller.name} from ${approvedSeller.shopName} has been approved.`,
        "approval"
      );

      addSellerNotification(
        "Account Approved! 🎉",
        `Congratulations ${approvedSeller.name}! Your seller account has been approved. You can now log in and start selling.`,
        "approval",
        { sellerId: approvedSeller.id }
      );

      return approvedSeller;
    },
    [addAdminNotification, addSellerNotification]
    // intentionally NOT including pendingSellers / rejectedSellers — we use refs
  );

  // ─── Admin Rejects Seller ──────────────────────────────────────────────────
  const rejectSeller = useCallback(
    async (sellerId, reason = "Does not meet requirements") => {
      const id = String(sellerId);
      let rejectedSeller = null;
      let syncedFromServer = false;

      if (isServerSellerId(id)) {
        const response = await rejectSellerAPI(sellerId, reason);
        if (!response?.success) {
          throw new Error(response?.message || "Rejection request failed");
        }

        const sellers = await getAllSellersAPI();
        const { nextPending, nextApproved, nextRejected } =
          splitSellersByStatus(sellers);
        setPendingSellers(nextPending);
        setApprovedSellers(nextApproved);
        setRejectedSellers(nextRejected);
        rejectedSeller =
          nextRejected.find((seller) => String(seller.id) === id) ?? null;
        syncedFromServer = true;
      }

      const pendingMatch = !rejectedSeller
        ? pendingSellersRef.current.find((s) => String(s.id) === id)
        : null;
      if (pendingMatch) {
        rejectedSeller = {
          ...pendingMatch,
          status: "Rejected",
          rejectedAt: Date.now(),
          rejectedAtLabel: nowLabel(),
          rejectionReason: reason,
        };
        setPendingSellers((prev) => prev.filter((s) => String(s.id) !== id));
      }

      if (!rejectedSeller) return null;

      if (!syncedFromServer) {
        setRejectedSellers((prev) => [rejectedSeller, ...prev]);
      }

      setAdminNotifications((prev) =>
        prev.map((n) =>
          String(n.sellerId) === id ? { ...n, unread: false } : n
        )
      );

      addAdminNotification(
        "Seller Rejected",
        `${rejectedSeller.name} from ${rejectedSeller.shopName} was rejected. Reason: ${reason}`,
        "alert"
      );

      addSellerNotification(
        "Application Update",
        `Your application was not approved. Reason: ${reason}. Please contact support for more details.`,
        "alert",
        { sellerId: rejectedSeller.id }
      );

      return rejectedSeller;
    },
    [addAdminNotification, addSellerNotification]
  );

  // ─── Seller Login ──────────────────────────────────────────────────────────
  // FIX: Added null-guards on email/phone/password before comparison.
  const loginSeller = useCallback(
    async (emailOrPhone, password) => {
      if (!emailOrPhone || !password) {
        return { error: "invalid_input", message: "Email/phone and password are required." };
      }

      const normalizedInput = emailOrPhone.trim().toLowerCase();

      const serverResult = await loginSellerAPI(normalizedInput, password);
      if (serverResult?.success && serverResult?.seller) {
        const seller = {
          ...serverResult.seller,
          status: "Approved",
          token: serverResult.token,
        };
        setCurrentSeller(seller);
        if (isServerSellerId(seller.id)) {
          getSellerOrdersAPI(String(seller.id))
            .then((sellerOrders) => setOrders(Array.isArray(sellerOrders) ? sellerOrders : []))
            .catch((error) => console.error("Failed to load seller orders after login:", error));
        }
        return seller;
      }

      if (
        serverResult?.message === "Your account is pending admin approval" ||
        serverResult?.message === "Your account has been rejected"
      ) {
        return {
          error: serverResult.message.includes("rejected") ? "rejected" : "pending",
          message: serverResult.message,
        };
      }

      // Check approved sellers
      const found = approvedSellers.find(
        (s) =>
          (s.email?.trim().toLowerCase() === normalizedInput ||
            s.phone?.trim() === emailOrPhone.trim()) &&
          s.password === password
      );
      if (found) {
        setCurrentSeller(found);
        return found;
      }

      // Check if pending (wrong password or correct — both get "pending" message)
      const isPending = pendingSellers.find(
        (s) =>
          s.email?.trim().toLowerCase() === normalizedInput ||
          s.phone?.trim() === emailOrPhone.trim()
      );
      if (isPending) {
        return {
          error: "pending",
          message: "Your account is pending admin approval.",
        };
      }

      // Check if rejected
      const isRejected = rejectedSellers.find(
        (s) =>
          s.email?.trim().toLowerCase() === normalizedInput ||
          s.phone?.trim() === emailOrPhone.trim()
      );
      if (isRejected) {
        return {
          error: "rejected",
          message: `Your application was rejected. Reason: ${
            isRejected.rejectionReason ?? "Does not meet requirements"
          }`,
        };
      }

      // Demo seller fallback
      if (
        normalizedInput === "demo@seller.com" ||
        emailOrPhone.trim() === "9999999999"
      ) {
        const demoSeller = {
          id: "SELLER001",
          name: "Demo Seller",
          shopName: "Demo Shop",
          email: emailOrPhone,
          phone: "",
          category: "General",
          status: "Approved",
        };
        setCurrentSeller(demoSeller);
        return demoSeller;
      }

      return { error: "not_found", message: "Invalid credentials." };
    },
    [approvedSellers, pendingSellers, rejectedSellers]
  );

  const saveSellerProfile = useCallback(
    async (payload = {}) => {
      const sellerId = String(currentSeller?.id ?? "").trim();
      if (!sellerId || !isServerSellerId(sellerId)) {
        throw new Error("Seller login missing. Please login again.");
      }

      const result = await updateSellerProfileAPI(sellerId, payload);
      if (!result?.success || !result?.seller) {
        throw new Error(result?.message || "Unable to update store details.");
      }

      const mergedSeller = { ...(currentSeller ?? {}), ...result.seller };
      setCurrentSeller(mergedSeller);
      const session = getAuthSession();
      if (session?.role === "seller") {
        setAuthSession({
          ...session,
          seller: mergedSeller,
          email: mergedSeller.email ?? session.email,
        });
      }
      return mergedSeller;
    },
    [currentSeller]
  );

  const saveSellerSettings = useCallback(
    async (payload = {}) => {
      const sellerId = String(currentSeller?.id ?? "").trim();
      if (!sellerId || !isServerSellerId(sellerId)) {
        throw new Error("Seller login missing. Please login again.");
      }

      const result = await updateSellerSettingsAPI(sellerId, payload);
      if (!result?.success || !result?.settings) {
        throw new Error(result?.message || "Unable to update settings.");
      }

      setSellerSettings((prev) => ({ ...prev, ...result.settings }));
      if (result.seller) {
        const mergedSeller = { ...(currentSeller ?? {}), ...result.seller };
        setCurrentSeller(mergedSeller);
        const session = getAuthSession();
        if (session?.role === "seller") {
          setAuthSession({
            ...session,
            seller: mergedSeller,
            email: mergedSeller.email ?? session.email,
          });
        }
      }
      return result.settings;
    },
    [currentSeller]
  );

  const logoutSeller = useCallback(() => {
    setCurrentSeller(null);
    setOrders([]);
  }, []);

  // ─── Products ──────────────────────────────────────────────────────────────
  const addSellerProduct = useCallback(
    (product) => {
      const seller = product.sellerId
        ? { sellerId: product.sellerId, sellerName: product.sellerName }
        : currentSeller
        ? {
            sellerId: currentSeller.id,
            sellerName: currentSeller.shopName ?? currentSeller.name,
          }
        : { sellerId: "SELLER001", sellerName: "Demo Shop" };

      const newProduct = normalizeProduct({
        ...product,
        ...seller,
        active: true,
        visibleToCustomer: true,
        status: "Live",
      });

      setSellerProducts((prev) => [newProduct, ...prev]);

      addSellerNotification(
        "Product is live",
        `${newProduct.name} is now visible to customers.`,
        "product"
      );
      addAdminNotification(
        "New Product Listed",
        `${newProduct.name} listed by ${newProduct.sellerName}.`,
        "product"
      );

      return newProduct;
    },
    [addSellerNotification, addAdminNotification, currentSeller]
  );

  const addSellerProductPending = useCallback(
    async (product) => {
      if (!currentSeller?.id) {
        throw new Error("Please login as an approved seller before adding products.");
      }

      const seller = currentSeller
        ? {
            sellerId: currentSeller.id,
            sellerEmail: currentSeller.email,
            sellerName: currentSeller.shopName ?? currentSeller.name,
          }
        : { sellerId: "SELLER001", sellerEmail: "demo@seller.com", sellerName: "Demo Shop" };

      const shouldPublishNow = product.visibleToCustomer || product.status === "Live";
      let pendingProduct = normalizeProduct({
        ...product,
        ...seller,
        active: shouldPublishNow,
        visibleToCustomer: shouldPublishNow,
        status: shouldPublishNow ? "Live" : "Pending Approval",
        paymentStatus: product.paymentStatus ?? "Paid",
        uploadFee: product.uploadFee ?? 0,
        paymentMethod: product.paymentMethod ?? "upi",
        paidAt: product.paidAt ?? new Date().toISOString(),
      });

      if (isServerSellerId(seller.sellerId)) {
        const result = await addProductAPI(
          pendingProduct,
          Array.isArray(product.rawImages) && product.rawImages.length > 0
            ? product.rawImages
            : Array.isArray(product.images)
            ? product.images
            : [],
          seller.sellerId,
          seller.sellerEmail ?? "",
          seller.sellerName
        );

        if (result?.success) {
          const products = await getAllProductsAPI();
          const { nextPending, nextSellerProducts } = splitProductsByStatus(products);
          setPendingProducts(nextPending);
          setSellerProducts(nextSellerProducts);
          pendingProduct =
            nextSellerProducts.find((item) => String(item.id) === String(result.productId)) ??
            pendingProduct;
        } else {
          throw new Error(
            result?.message ||
              "Product could not be saved to the server. Please try again."
          );
        }
      } else {
        if (!pendingProduct.visibleToCustomer) {
          setPendingProducts((prev) => [pendingProduct, ...prev]);
        }
        setSellerProducts((prev) => [pendingProduct, ...prev]);
      }

      const uploadFee = cleanPrice(pendingProduct.uploadFee);
      if (uploadFee > 0 && pendingProduct.paymentStatus === "Paid") {
        setCommissionRecords((prev) => [
          {
            id: `FEE${Date.now()}`,
            productId: pendingProduct.id,
            productName: pendingProduct.name,
            sellerId: seller.sellerId,
            sellerName: seller.sellerName,
            totalAmount: uploadFee,
            adminCommission: uploadFee,
            sellerEarning: 0,
            paymentMethod: pendingProduct.paymentMethod ?? "razorpay",
            status: "Paid",
            type: "product_upload_fee",
            createdAt: pendingProduct.paidAt ?? new Date().toISOString(),
          },
          ...prev,
        ]);
      }

      addSellerNotification(
        "Product Under Review 🕐",
        `"${pendingProduct.name}" has been sent to admin for approval.`,
        "product"
      );
      addAdminNotification(
        "New Product Awaiting Approval 🔔",
        `Seller submitted "${pendingProduct.name}" after paying ₹${pendingProduct.uploadFee}. Review required.`,
        "product",
        { productId: pendingProduct.id }
      );

      return pendingProduct;
    },
    [addSellerNotification, addAdminNotification, currentSeller]
  );

  const approveSellerProduct = useCallback(
    async (productId) => {
      const id = String(productId);
      let approvedProduct = null;

      if (isServerSellerId(id)) {
        const response = await approveProductAPI(productId);
        if (!response?.success) {
          throw new Error(response?.message || "Product approval failed");
        }
      }

      setPendingProducts((prev) =>
        prev.filter((p) => {
          if (String(p.id) === id) {
            approvedProduct = p;
            return false;
          }
          return true;
        })
      );

      setSellerProducts((prev) =>
        prev.map((p) =>
          String(p.id) === id
            ? {
                ...p,
                active: true,
                visibleToCustomer: true,
                status: "Live",
                approvedAt: new Date().toISOString(),
              }
            : p
        )
      );

      if (approvedProduct) {
        addSellerNotification(
          "Product Approved! 🎉",
          `"${approvedProduct.name}" is now live and visible to customers.`,
          "product",
          { sellerId: approvedProduct.sellerId, relatedId: approvedProduct.id }
        );
        addAdminNotification(
          "Product Approved",
          `"${approvedProduct.name}" has been approved and is now live.`,
          "product"
        );
      }

      return approvedProduct;
    },
    [addSellerNotification, addAdminNotification]
  );

  const rejectSellerProduct = useCallback(
    async (productId, reason = "Does not meet quality standards") => {
      const id = String(productId);
      let rejectedProduct = null;

      if (isServerSellerId(id)) {
        const response = await rejectProductAPI(productId);
        if (!response?.success) {
          throw new Error(response?.message || "Product rejection failed");
        }
      }

      setPendingProducts((prev) =>
        prev.filter((p) => {
          if (String(p.id) === id) {
            rejectedProduct = p;
            return false;
          }
          return true;
        })
      );

      setSellerProducts((prev) =>
        prev.map((p) =>
          String(p.id) === id
            ? { ...p, status: "Rejected", active: false, visibleToCustomer: false }
            : p
        )
      );

      if (rejectedProduct) {
        addSellerNotification(
          "Product Rejected",
          `"${rejectedProduct.name}" was rejected. Reason: ${reason}.`,
          "product",
          { sellerId: rejectedProduct.sellerId, relatedId: rejectedProduct.id }
        );
      }
    },
    [addSellerNotification]
  );

  const updateSellerProduct = useCallback(
    (productId, updates = {}) => {
      let updatedProduct = null;
      setSellerProducts((prev) =>
        prev.map((item) => {
          if (String(item.id) !== String(productId)) return item;
          updatedProduct = normalizeProduct({
            ...item,
            ...updates,
            id: item.id,
            createdAt: item.createdAt,
            updatedAt: new Date().toISOString(),
          });
          return updatedProduct;
        })
      );
      addSellerNotification(
        "Product updated",
        `${updates.name ?? "Product"} updated successfully.`,
        "product"
      );
      return updatedProduct;
    },
    [addSellerNotification]
  );

  const removeSellerProduct = useCallback((productId) => {
    setSellerProducts((prev) =>
      prev.filter((item) => String(item.id) !== String(productId))
    );
  }, []);

  const deleteSellerProduct = useCallback(async (productId) => {
    const previous = sellerProducts;
    removeSellerProduct(productId);

    if (isServerSellerId(currentSeller?.id)) {
      const result = await deleteSellerProductAPI(productId);
      if (!result?.success) {
        setSellerProducts(previous);
        throw new Error(result?.message || "Delete product failed");
      }
    }
  }, [sellerProducts, removeSellerProduct, currentSeller]);

  const toggleProductVisibility = useCallback((productId) => {
    setSellerProducts((prev) =>
      prev.map((item) =>
        String(item.id) === String(productId)
          ? {
              ...item,
              visibleToCustomer: !item.visibleToCustomer,
              status: !item.visibleToCustomer ? "Live" : "Hidden",
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  }, []);

  const toggleSellerProductActive = useCallback((productId) => {
    let updatedActive = null;
    setSellerProducts((prev) =>
      prev.map((item) => {
        if (String(item.id) !== String(productId)) return item;
        updatedActive = !item.active;
        const soldOut = Number(item.stock ?? 0) <= 0;
        return {
          ...item,
          active: updatedActive,
          visibleToCustomer: updatedActive && !soldOut,
          status: soldOut ? "Sold Out" : updatedActive ? "Live" : "Hidden",
          updatedAt: new Date().toISOString(),
        };
      })
    );

    if (updatedActive != null && isServerSellerId(currentSeller?.id)) {
      updateSellerProductAPI(productId, { active: updatedActive }).catch((error) =>
        console.error("Seller product active sync failed:", error)
      );
    }
  }, [currentSeller]);

  // ─── Complaints ────────────────────────────────────────────────────────────
  const submitComplaint = useCallback(
    async ({
      title,
      description,
      complaintType,
      orderId,
      productId,
      productName,
      customer,
      customerEmail,
      sellerId,
      sellerName,
      images = [],
    }) => {
      const result = await createComplaintAPI({
        title,
        description,
        complaintType,
        orderId,
        productId,
        productName,
        customer,
        customerEmail,
        sellerId,
        sellerName,
        status: "Pending",
        images,
      });

      if (!result?.success || !result?.complaint) {
        throw new Error(result?.message || "Unable to submit complaint.");
      }

      const session = getAuthSession();
      if (session?.role === "admin") {
        await reloadComplaints();
      } else if (sellerId) {
        await reloadComplaints(sellerId);
      }

      return result.complaint;
    },
    [reloadComplaints]
  );

  const addComplaintNotification = useCallback(
    ({ title, description, complaintType, orderId, productId, productName, customer, customerEmail, sellerId, sellerName, images }) =>
      submitComplaint({ title, description, complaintType, orderId, productId, productName, customer, customerEmail, sellerId, sellerName, images }),
    [submitComplaint]
  );

  const forwardComplaintToSeller = useCallback(
    (complaintId) => {
      let forwardedComplaint = null;
      setComplaints((prev) =>
        prev.map((c) => {
          if (String(c.id) === String(complaintId)) {
            forwardedComplaint = {
              ...c,
              status: "Forwarded to Seller",
              adminForwarded: true,
              forwardedAt: new Date().toISOString(),
            };
            return forwardedComplaint;
          }
          return c;
        })
      );
      if (forwardedComplaint) {
        addSellerNotification(
          "Complaint Forwarded to You 🔔",
          `Admin forwarded a complaint from ${forwardedComplaint.customer}. Please review.`,
          "complaint"
        );
        addAdminNotification(
          "Complaint Forwarded",
          `Complaint ${complaintId} forwarded to seller.`,
          "complaint"
        );
      }
      return forwardedComplaint;
    },
    [addSellerNotification, addAdminNotification]
  );

  const resolveComplaintLocal = useCallback(
    (complaintId, resolution = "Issue resolved by seller") => {
      setComplaints((prev) =>
        prev.map((c) =>
          String(c.id) === String(complaintId)
            ? {
                ...c,
                status: "Resolved",
                read: true,
                resolution,
                resolvedAt: new Date().toISOString(),
              }
            : c
        )
      );
      addAdminNotification(
        "Complaint Resolved ✅",
        `Complaint resolved. Resolution: ${resolution}`,
        "complaint"
      );
    },
    [addAdminNotification]
  );

  const markComplaintReadLocal = useCallback((complaintId) => {
    setComplaints((prev) =>
      prev.map((c) =>
        String(c.id) === String(complaintId) ? { ...c, read: true } : c
      )
    );
  }, []);

  // ─── Cart ──────────────────────────────────────────────────────────────────
  const resolveComplaint = useCallback(
    async (complaintId, resolution = "Issue resolved by seller") => {
      const result = await resolveComplaintAPI(complaintId, resolution);
      if (!result?.success || !result?.complaint) {
        throw new Error(result?.message || "Unable to resolve complaint.");
      }

      setComplaints((prev) =>
        prev.map((c) =>
          String(c.id) === String(complaintId) ? result.complaint : c
        )
      );
      return result.complaint;
    },
    []
  );

  const markComplaintRead = useCallback((complaintId) => {
    setComplaints((prev) =>
      prev.map((c) =>
        String(c.id) === String(complaintId) ? { ...c, read: true } : c
      )
    );
    if (/^\d+$/.test(String(complaintId))) {
      markComplaintReadAPI(complaintId).catch((error) =>
        console.error("Mark complaint read failed:", error)
      );
    }
  }, []);

  const markAllComplaintsRead = useCallback(() => {
    setComplaints((prev) => prev.map((complaint) => ({ ...complaint, read: true })));

    complaints
      .filter((complaint) => /^\d+$/.test(String(complaint.id)) && !complaint.read)
      .forEach((complaint) => {
        markComplaintReadAPI(complaint.id).catch((error) =>
          console.error("Mark complaint read failed:", error)
        );
      });
  }, [complaints]);

  const addToCart = useCallback((product) => {
    if (!product) return;
    const productId = String(product.id ?? product.name ?? Date.now());
    setCartItems((prev) => {
      const exists = prev.find((item) => String(item.id) === productId);
      if (exists) {
        return prev.map((item) =>
          String(item.id) === productId
            ? { ...item, qty: (item.qty ?? 1) + 1 }
            : item
        );
      }
      return [...prev, { ...product, id: productId, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) =>
      prev.filter((item) => String(item.id) !== String(productId))
    );
  }, []);

  const increaseQty = useCallback((productId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        String(item.id) === String(productId)
          ? { ...item, qty: (item.qty ?? 1) + 1 }
          : item
      )
    );
  }, []);

  const decreaseQty = useCallback((productId) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          String(item.id) === String(productId)
            ? { ...item, qty: Math.max((item.qty ?? 1) - 1, 0) }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const updateCustomerProfile = useCallback((updates = {}) => {
    const currentProfile = getCustomerIdentity();
    const nextProfile = {
      ...currentProfile,
      ...updates,
      email: String(updates?.email ?? currentProfile.email ?? "").trim().toLowerCase(),
      phone: String(updates?.phone ?? currentProfile.phone ?? "").trim(),
      name: String(updates?.name ?? currentProfile.name ?? "Customer").trim() || "Customer",
    };

    setCustomerAccount(nextProfile);

    const session = getAuthSession();
    if (session?.role === "customer" || nextProfile.email) {
      setAuthSession({
        ...session,
        role: "customer",
        email: nextProfile.email,
        phone: nextProfile.phone,
        name: nextProfile.name,
        location: nextProfile.location ?? "",
        bio: nextProfile.bio ?? "",
        avatar: nextProfile.avatar ?? null,
      });
    }

    setCurrentCustomer(nextProfile);
    return nextProfile;
  }, []);

  const saveCustomerAddress = useCallback(async (address, editingId = null) => {
    const customerEmail = getCustomerIdentity().email;
    if (!customerEmail) {
      return null;
    }

    const payload = {
      ...address,
      customerEmail,
      isDefault: Boolean(address?.isDefault),
    };

    const result = await saveCustomerAddressAPI(payload, editingId);
    if (!result?.success || !result?.address) {
      return null;
    }

    setCustomerAddresses((prev) => {
      const nextAddress = { ...result.address };

      if (editingId) {
        let updated = prev.map((item) =>
          String(item.id) === String(editingId)
            ? nextAddress
            : nextAddress.isDefault
            ? { ...item, isDefault: false }
            : item
        );

        if (!updated.some((item) => item.isDefault) && updated.length > 0) {
          updated = updated.map((item, index) =>
            index === 0 ? { ...item, isDefault: true } : item
          );
        }

        return updated;
      }

      const withoutDefault = nextAddress.isDefault
        ? prev.map((item) => ({ ...item, isDefault: false }))
        : prev;
      const next = [...withoutDefault, nextAddress];

      if (!next.some((item) => item.isDefault) && next.length > 0) {
        next[0] = { ...next[0], isDefault: true };
      }

      return next;
    });

    await reloadCustomerAddresses(customerEmail);
    return result.address;
  }, [reloadCustomerAddresses]);

  const deleteCustomerAddress = useCallback(async (addressId) => {
    const customerEmail = getCustomerIdentity().email;
    if (!customerEmail) {
      return null;
    }

    const result = await deleteCustomerAddressAPI(customerEmail, addressId);
    if (!result?.success) {
      return null;
    }

    setCustomerAddresses((prev) => {
      const filtered = prev.filter((item) => String(item.id) !== String(addressId));
      if (filtered.length > 0 && !filtered.some((item) => item.isDefault)) {
        filtered[0] = { ...filtered[0], isDefault: true };
      }
      return filtered;
    });

    await reloadCustomerAddresses(customerEmail);
    return result;
  }, [reloadCustomerAddresses]);

  const setDefaultCustomerAddress = useCallback(async (addressId) => {
    const customerEmail = getCustomerIdentity().email;
    if (!customerEmail) {
      return null;
    }

    const result = await setDefaultCustomerAddressAPI(customerEmail, addressId);
    if (!result?.success) {
      return null;
    }

    setCustomerAddresses((prev) =>
      prev.map((item) => ({
        ...item,
        isDefault: String(item.id) === String(addressId),
      }))
    );

    await reloadCustomerAddresses(customerEmail);
    return result.address ?? null;
  }, [reloadCustomerAddresses]);

  // ─── Wishlist ──────────────────────────────────────────────────────────────
  const toggleWishlist = useCallback((product) => {
    if (!product) return;
    const productId = String(product.id ?? product.productId ?? product.name ?? Date.now());
    const customer = getCustomerIdentity();
    const exists = wishlistItems.some((item) => String(item.id) === productId);

    setWishlistItems((prev) => {
      if (exists) {
        return prev.filter((item) => String(item.id) !== productId);
      }
      return [...prev, { ...product, id: productId }];
    });

    if (!customer.email) return;

    if (exists) {
      removeWishlistItemAPI(customer.email, productId).catch((error) =>
        console.error("Wishlist remove sync failed:", error)
      );
      return;
    }

    addWishlistItemAPI({
      customerEmail: customer.email,
      customerName: customer.name,
      productId,
      productName: product.name ?? product.title ?? "Product",
      sellerId: product.sellerId ?? "",
      sellerName: product.sellerName ?? product.seller ?? "",
      imagePath: resolveImageUri(product.image ?? product.images?.[0]) ?? "",
      price: cleanPrice(product.price),
      finalPrice: cleanPrice(product.finalPrice ?? product.price),
    }).catch((error) => console.error("Wishlist add sync failed:", error));
  }, [wishlistItems]);

  const removeFromWishlist = useCallback((productId) => {
    const customer = getCustomerIdentity();
    setWishlistItems((prev) =>
      prev.filter((item) => String(item.id) !== String(productId))
    );

    if (customer.email) {
      removeWishlistItemAPI(customer.email, productId).catch((error) =>
        console.error("Wishlist remove sync failed:", error)
      );
    }
  }, []);

  const isInWishlist = useCallback(
    (productId) =>
      wishlistItems.some((item) => String(item.id) === String(productId)),
    [wishlistItems]
  );

  // ─── Orders + Commission Split ─────────────────────────────────────────────
  const createOrder = useCallback(
    async ({
      items = [],
      paymentMethod = "COD",
      paymentStatus,
      paymentMeta = {},
      deliveryCharge = 40,
      address = { name: "Customer", line1: "Customer address", city: "Hyderabad" },
      clearOrderedCart = false,
    }) => {
      const safeItems = Array.isArray(items) ? items : [];
      if (safeItems.length === 0) return null;

      const itemTotal = safeItems.reduce(
        (total, item) =>
          total + cleanPrice(item.finalPrice ?? item.price) * (item.qty ?? 1),
        0
      );
      const totalAmount      = itemTotal + deliveryCharge;
      const adminCommission  = Math.round(totalAmount * 0.1);
      const sellerEarning    = totalAmount - adminCommission;

      const customer = getCustomerIdentity();
      if (!customer.email) {
        throw new Error("Please login as customer before placing an order.");
      }

      const orderPayload = {
        id: `#ORD${Date.now().toString().slice(-5)}`,
        title:
          safeItems.length === 1
            ? safeItems[0]?.name ?? "Product Order"
            : `${safeItems.length} Products Order`,
        customerName: address?.name ?? customer.name ?? "Customer",
        customerPhone: address?.phone ?? customer.phone ?? "",
        customerEmail: customer.email,
        status: "Processing",
        deliveryStatus: "Need Delivery",
        deliveryPersonId: null,
        deliveryPersonName: "",
        deliveryFee: 0,
        payment:
          paymentMethod === "COD"
            ? "Cash on Delivery"
            : `${paymentMethod} Paid`,
        paymentMethod,
        paymentStatus: paymentStatus ?? (paymentMethod === "COD" ? "Pending" : "Paid"),
        ...paymentMeta,
        itemTotal,
        deliveryCharge,
        totalAmount,
        adminCommission,
        sellerEarning,
        commissionRate: 10,
        items: safeItems.length,
        products: safeItems,
        returns: {},
        reviews: {},
        address,
        createdAt: new Date().toISOString(),
      };

      const result = await createCustomerOrderAPI(orderPayload);
      if (!result?.success || !result?.order) {
        throw new Error(result?.message || "Order failed. Please try again.");
      }

      const order = result.order;
      setOrders((prev) => [order, ...prev.filter((item) => String(item.id) !== String(order.id))]);

      const sellerId   = safeItems[0]?.sellerId   ?? currentSeller?.id       ?? "SELLER001";
      const sellerName = safeItems[0]?.sellerName ?? currentSeller?.shopName ?? "Demo Shop";

      setCommissionRecords((prev) => [
        {
          id: `COM${Date.now()}`,
          orderId: order.id,
          totalAmount,
          adminCommission,
          sellerEarning,
          sellerId,
          sellerName,
          paymentMethod,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);

      addSellerNotification(
        "New order received",
        `${order.id} placed by ${order.customer}. Earnings: ${formatPrice(sellerEarning)}.`,
        "order",
        {
          sellerId,
          relatedId: order.id,
          customerEmail: customer.email,
        }
      );
      addAdminNotification(
        "New Order Placed",
        `Order ${order.id} worth ${order.price}. Commission: ${formatPrice(adminCommission)}.`,
        "order"
      );
      addCustomerNotification(
        "Order Confirmed",
        `${order.id} placed successfully. We will keep you updated on shipping.`,
        "order",
        { relatedId: order.id }
      );

      if (clearOrderedCart) setCartItems([]);
      return order;
    },
    [addSellerNotification, addAdminNotification, addCustomerNotification, currentSeller]
  );

  const updateOrderStatus = useCallback(
    (orderId, status) => {
      const matchingOrder = orders.find((order) => String(order.id) === String(orderId));
      const isCancelled = String(status).toLowerCase() === "cancelled";
      setOrders((prev) =>
        prev.map((order) =>
          String(order.id) === String(orderId) ? { ...order, status } : order
        )
      );
      addSellerNotification(
        "Order status updated",
        isCancelled
          ? `Order ${orderId} was cancelled by the customer.`
          : `${orderId} status changed to ${status}.`,
        isCancelled ? "warning" : "order"
      );
      addCustomerNotification(
        "Order Update",
        `${orderId} is now ${status}.`,
        status === "Delivered" ? "delivery" : "order",
        {
          relatedId: orderId,
          customerEmail: matchingOrder?.customerEmail,
        }
      );

      updateOrderStatusAPI(orderId, status).then((result) => {
        if (result?.success && result?.order) {
          setOrders((prev) =>
            prev.map((order) =>
              String(order.id) === String(orderId) ? result.order : order
            )
          );
        }
      }).catch((error) => console.error("Order status sync failed:", error));
    },
    [addSellerNotification, addCustomerNotification, orders]
  );

  const assignDeliveryPerson = useCallback(
    (orderId, deliveryPersonId) => {
      const partner = deliveryPartners.find(
        (p) => String(p.id) === String(deliveryPersonId)
      );
      if (!partner) return null;
      setOrders((prev) =>
        prev.map((order) =>
          String(order.id) === String(orderId)
            ? {
                ...order,
                deliveryStatus: "Assigned",
                deliveryPersonId: partner.id,
                deliveryPersonName: partner.name,
                deliveryPersonPhone: partner.phone,
                deliveryFee: partner.price,
              }
            : order
        )
      );

      assignDeliveryPersonAPI(orderId, {
        deliveryPersonId: partner.id,
        deliveryPersonName: partner.name,
        deliveryPersonPhone: partner.phone,
        deliveryFee: partner.price,
        deliveryStatus: "Assigned",
      }).then((result) => {
        if (result?.success && result?.order) {
          setOrders((prev) =>
            prev.map((order) =>
              String(order.id) === String(orderId) ? result.order : order
            )
          );
        }
      }).catch((error) => console.error("Assign delivery sync failed:", error));

      return partner;
    },
    [deliveryPartners]
  );

  const addDeliveryPartner = useCallback(
    async (partnerData = {}) => {
      const sellerId = String(partnerData.sellerId ?? currentSeller?.id ?? "").trim();
      if (!sellerId || !isServerSellerId(sellerId)) {
        throw new Error("Seller login missing. Please logout and login again.");
      }

      const payload = {
        sellerId,
        ...partnerData,
        price: cleanPrice(partnerData.price || 40),
      };
      const result = await addDeliveryPartnerAPI(payload);
      if (!result?.success || !result?.partner) {
        throw new Error(result?.message || "Unable to save delivery person.");
      }

      setDeliveryPartners((prev) => [
        result.partner,
        ...prev.filter((item) => String(item.id) !== String(result.partner.id)),
      ]);
      return result.partner;
    },
    [currentSeller]
  );

  const updateDeliveryStatus = useCallback((orderId, deliveryStatus) => {
    const matchingOrder = orders.find((order) => String(order.id) === String(orderId));
    setOrders((prev) =>
      prev.map((order) =>
        String(order.id) === String(orderId)
          ? {
              ...order,
              deliveryStatus,
              status:
                deliveryStatus === "Delivered"
                  ? "Delivered"
                  : deliveryStatus === "Shipped"
                  ? "Shipped"
                  : order.status,
            }
          : order
      )
    );
    updateDeliveryStatusAPI(orderId, deliveryStatus).then((result) => {
      if (result?.success && result?.order) {
        setOrders((prev) =>
          prev.map((order) =>
            String(order.id) === String(orderId) ? result.order : order
          )
        );
      }
    }).catch((error) => console.error("Delivery status sync failed:", error));
    addCustomerNotification(
      "Delivery Update",
      `${orderId} delivery status changed to ${deliveryStatus}.`,
      "delivery",
      {
        relatedId: orderId,
        customerEmail: matchingOrder?.customerEmail,
      }
    );
  }, [addCustomerNotification, orders]);

  const clearOrders = useCallback(() => setOrders([]), []);

  // ─── Returns ───────────────────────────────────────────────────────────────
  const createReturnRequest = useCallback(
    async ({
      orderId,
      customer,
      customerEmail,
      sellerId,
      product,
      productId,
      price,
      reason,
      image,
      productImage,
      paymentMethod,
      razorpayPaymentId,
      razorpayOrderId,
    }) => {
      const refundAmount = cleanPrice(price);
      const returnId     = `#RET${Date.now().toString().slice(-4)}`;
      const key          = String(productId ?? product ?? returnId);
      const matchingOrder = orders.find((order) => String(order.id) === String(orderId));
      const resolvedSellerId = sellerId ?? matchingOrder?.sellerId;
      const resolvedCustomerEmail = String(
        customerEmail ?? matchingOrder?.customerEmail ?? ""
      ).trim().toLowerCase();
      const resolvedPaymentMethod = paymentMethod ?? matchingOrder?.paymentMethod ?? "Razorpay";
      const resolvedRazorpayPaymentId = razorpayPaymentId ?? matchingOrder?.razorpayPaymentId ?? null;
      const resolvedRazorpayOrderId = razorpayOrderId ?? matchingOrder?.razorpayOrderId ?? null;

      const request = {
        id: returnId,
        orderId,
        productId: productId ?? key,
        customer: customer ?? "Customer",
        customerEmail: resolvedCustomerEmail,
        sellerId: resolvedSellerId,
        sellerName: matchingOrder?.sellerName ?? "Seller",
        product: product ?? "Product",
        price: price ?? formatPrice(refundAmount),
        image: image ?? productImage ?? null,
        reason: reason ?? "No reason added",
        status: "Return Requested",
        requestedOn: "Today",
        refundAmount,
        refundAmountText: formatPrice(refundAmount),
        refundStatus: "Not Credited",
        refundCredited: false,
        refundMethod: "Razorpay",
        paymentMethod: resolvedPaymentMethod,
        razorpayPaymentId: resolvedRazorpayPaymentId,
        razorpayOrderId: resolvedRazorpayOrderId,
        razorpayRefundId: null,
        creditedOn: null,
      };

      const result = await createReturnRequestAPI({
        ...request,
        sellerName: request.sellerName,
        refundAmount: request.refundAmount,
        refundAmountText: request.refundAmountText,
      });
      if (!result?.success) {
        throw new Error(result?.message || "Unable to create return request.");
      }

      const savedRequest = result.request || request;

      setReturnRequests((prev) => {
        const alreadyExists = prev.some(
          (item) =>
            String(item.orderId) === String(orderId) &&
            String(item.productId ?? item.product) === String(productId ?? product)
        );
        if (alreadyExists) return prev;
        return [savedRequest, ...prev];
      });

      setOrders((prev) =>
        prev.map((order) => {
          if (String(order.id) !== String(orderId)) return order;
          return { ...order, returns: { ...(order.returns ?? {}), [key]: savedRequest } };
        })
      );

      addSellerNotification(
        "Return requested",
        `${savedRequest.customer} requested return for ${savedRequest.product}.`,
        "return",
        {
          sellerId: resolvedSellerId,
          relatedId: orderId,
          customerEmail: resolvedCustomerEmail,
        }
      );
      addCustomerNotification(
        "Return Requested",
        `Your return for ${savedRequest.product} was sent to the seller.`,
        "return",
        {
          relatedId: orderId,
          customerEmail: resolvedCustomerEmail,
        }
      );

      return savedRequest;
    },
    [addSellerNotification, addCustomerNotification, orders]
  );

  const updateReturnStatus = useCallback(
    async (returnId, status) => {
      const existingRequest = returnRequests.find(
        (item) => String(item.id) === String(returnId)
      );
      if (!existingRequest) {
        return { success: false, message: "Return request not found" };
      }

      let razorpayRefund = null;
      const shouldCreditRefund =
        status === "Product Received" && !existingRequest.refundCredited;
      if (shouldCreditRefund && existingRequest.razorpayPaymentId) {
        razorpayRefund = await createRazorpayRefundAPI({
          paymentId: existingRequest.razorpayPaymentId,
          amount: Number(existingRequest.refundAmount ?? 0),
          receipt: `return_${String(existingRequest.id).replace(/[^A-Za-z0-9]/g, "")}`,
          sellerId: existingRequest.sellerId ?? "",
          sellerName: existingRequest.sellerName ?? "",
          orderId: existingRequest.orderId ?? "",
          orderCode: existingRequest.orderId ?? "",
          productId: existingRequest.productId ?? "",
          productName: existingRequest.product ?? "",
          customerEmail: existingRequest.customerEmail ?? "",
          customerName: existingRequest.customer ?? "",
        });
        if (!razorpayRefund?.success) {
          throw new Error(razorpayRefund?.message || "Razorpay refund failed.");
        }
      }

      const backendPayload = shouldCreditRefund
        ? {
            status: "Product Received",
            refundStatus: "Credited",
            refundCredited: true,
            refundMethod: "Razorpay",
            razorpayRefundId: razorpayRefund?.refundId || `rfnd_${Date.now()}`,
            creditedOn: "Today",
          }
        : { status };

      const result = await updateReturnStatusAPI(existingRequest.id, backendPayload);
      if (!result?.success) {
        throw new Error(result?.message || "Unable to update return status.");
      }

      const updatedRequest =
        result.request ||
        {
          ...existingRequest,
          ...backendPayload,
        };

      setReturnRequests((prev) =>
        prev.map((item) =>
          String(item.id) === String(returnId) ? updatedRequest : item
        )
      );

      setOrders((prev) =>
        prev.map((order) => {
          if (String(order.id) !== String(updatedRequest.orderId)) return order;
          const key = String(
            updatedRequest.productId ?? updatedRequest.product ?? updatedRequest.id
          );
          return {
            ...order,
            returns: { ...(order.returns ?? {}), [key]: updatedRequest },
          };
        })
      );

      if (status === "Return Pickup Started" && updatedRequest) {
        addSellerNotification(
          "Return pickup started",
          `${updatedRequest.product} return pickup has been started.`,
          "return",
          {
            relatedId: updatedRequest.orderId,
            customerEmail: updatedRequest.customerEmail,
          }
        );
        addCustomerNotification(
          "Return Pickup Started",
          `Pickup started for ${updatedRequest.product}. Refund will be credited after seller receives the product.`,
          "return",
          {
            relatedId: updatedRequest.orderId,
            customerEmail: updatedRequest.customerEmail,
          }
        );
      }

      if (status === "Product Received" && updatedRequest.refundCredited) {
        const amountFromGateway = Number(razorpayRefund?.amount ?? 0);
        const amount =
          amountFromGateway > 0
            ? amountFromGateway > 1000
              ? amountFromGateway / 100
              : amountFromGateway
            : Number(existingRequest.refundAmount ?? 0);
        setCustomerWallet((prev) => prev + amount);
        setRefundHistory((prev) => [
          {
            id: `RF${Date.now()}`,
            returnId: updatedRequest.id,
            orderId: updatedRequest.orderId,
            sellerId: updatedRequest.sellerId,
            sellerName: updatedRequest.sellerName,
            product: updatedRequest.product,
            customer: updatedRequest.customer,
            amount,
            amountText: formatPrice(amount),
            creditedOn: "Today",
            status: "Credited",
            method: "Razorpay",
            razorpayRefundId: updatedRequest.razorpayRefundId,
          },
          ...prev,
        ]);
        await reloadSellerPayoutSummary(updatedRequest.sellerId);
        addSellerNotification(
          "Refund credited",
          `${formatPrice(amount)} credited to customer via Razorpay after product received.`,
          "refund",
          {
            relatedId: updatedRequest.orderId,
            customerEmail: updatedRequest.customerEmail,
          }
        );
        addCustomerNotification(
          "Refund Credited",
          `${formatPrice(amount)} credited via Razorpay for ${updatedRequest.product}.`,
          "refund",
          {
            relatedId: updatedRequest.orderId,
            customerEmail: updatedRequest.customerEmail,
            refundAmount: amount,
            razorpayRefundId: updatedRequest.razorpayRefundId,
          }
        );
      }

      return {
        success: true,
        request: updatedRequest,
        razorpayRefund,
      };
    },
    [addSellerNotification, addCustomerNotification, returnRequests, reloadSellerPayoutSummary]
  );

  // ─── Reviews ───────────────────────────────────────────────────────────────
  const addProductReview = useCallback(
    async ({ orderId, productId, product, customer, rating, comment, text, images = [] }) => {
      const key = String(productId ?? product ?? Date.now());
      const customerIdentity = getCustomerIdentity();
      const payload = {
        orderId,
        productId: key,
        product: product ?? "Product",
        customer: customer ?? customerIdentity.name ?? "Customer",
        customerEmail: customerIdentity.email,
        rating: Number(rating ?? 0),
        comment: comment ?? text ?? "",
        text: text ?? comment ?? "",
        images,
      };

      const result = await addProductReviewAPI(payload);
      if (!result?.success || !result?.review) {
        throw new Error(result?.message || "Unable to save review.");
      }

      const review = result.review;

      setOrders((prev) =>
        prev.map((order) => {
          if (String(order.id) !== String(orderId)) return order;
          return {
            ...order,
            reviews: { ...(order.reviews ?? {}), [key]: review },
            products: (order.products ?? []).map((item) =>
              String(item.id ?? item.productId ?? item.name) === key
                ? { ...item, customerReview: review }
                : item
            ),
          };
        })
      );

      setSellerProducts((prev) =>
        prev.map((item) => {
          if (String(item.id ?? item.name) !== key) return item;
          const oldReviews = Array.isArray(item.customerReviews) ? item.customerReviews : [];
          const nextReviews = [review, ...oldReviews];
          const avgRating =
            nextReviews.reduce((sum, r) => sum + Number(r.rating ?? 0), 0) /
            nextReviews.length;
          return {
            ...item,
            customerReviews: nextReviews,
            reviews: nextReviews.length,
            rating: Number(avgRating.toFixed(1)),
          };
        })
      );

      setProductReviews((prev) => ({
        ...prev,
        [key]: [review, ...(prev[key] ?? [])],
      }));

      addSellerNotification(
        "New product review",
        `${review.customer} reviewed ${review.product}.`,
        "review"
      );
      addCustomerNotification(
        "Review Submitted",
        `Your review for ${review.product} was posted successfully.`,
        "review",
        { relatedId: orderId }
      );

      reloadProductsWithReviews();
      return review;
    },
    [addSellerNotification, addCustomerNotification, reloadProductsWithReviews]
  );

  // ─── Derived values ────────────────────────────────────────────────────────
  const customerVisibleProducts = useMemo(
    () => sellerProducts.filter((item) => item.visibleToCustomer && item.active),
    [sellerProducts]
  );

  const customerCategoryCatalog = useMemo(() => {
    if (Array.isArray(productCatalog) && productCatalog.length > 0) {
      return buildCategoryCatalogFromEntries(productCatalog);
    }

    return buildCategoryCatalogFromProducts(customerVisibleProducts);
  }, [productCatalog, customerVisibleProducts]);

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + (item.qty ?? 1), 0),
    [cartItems]
  );

  const wishlistCount = useMemo(() => wishlistItems.length, [wishlistItems]);

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total + cleanPrice(item.finalPrice ?? item.price) * (item.qty ?? 1),
        0
      ),
    [cartItems]
  );

  const ordersCount = useMemo(() => orders.length, [orders]);

  const unreadNotifications = useMemo(
    () => sellerNotifications.filter((n) => !n.read).length,
    [sellerNotifications]
  );

  const unreadAdminNotifications = useMemo(
    () => adminNotifications.filter((n) => n.unread).length,
    [adminNotifications]
  );

  const unreadCustomerNotifications = useMemo(
    () => customerNotifications.filter((n) => n.unread).length,
    [customerNotifications]
  );

  const unreadComplaints = useMemo(
    () => complaints.filter((c) => !c.read).length,
    [complaints]
  );

  const orderCommissionRecords = useMemo(
    () =>
      orders
        .filter((order) => order.status !== "Cancelled")
        .map((order, index) => {
          const total = cleanPrice(order.totalAmount ?? order.price);
          const adminCommission = cleanPrice(order.adminCommission) || total * ((Number(order.commissionRate ?? 10) || 10) / 100);
          const sellerEarning = cleanPrice(order.sellerEarning) || Math.max(total - adminCommission, 0);
          return {
            id: order.id || `ORDER-COM-${index + 1}`,
            orderId: order.id,
            productName: order.title || order.products?.[0]?.name || "Product Order",
            totalAmount: total,
            adminCommission,
            sellerEarning,
            sellerId: order.products?.[0]?.sellerId ?? "",
            sellerName: order.products?.[0]?.sellerName ?? "Seller",
            status: order.paymentStatus || "Paid",
            createdAt: order.createdAt,
          };
        }),
    [orders]
  );

  const platformCommissionRecords = useMemo(
    () => [...orderCommissionRecords, ...commissionRecords],
    [orderCommissionRecords, commissionRecords]
  );

  const totalAdminCommission = useMemo(
    () => platformCommissionRecords.reduce((sum, r) => sum + cleanPrice(r.adminCommission), 0),
    [platformCommissionRecords]
  );

  const totalSellerPayout = useMemo(
    () => {
      const gross = platformCommissionRecords.reduce(
        (sum, r) => sum + cleanPrice(r.sellerEarning),
        0
      );
      const activeSellerId = String(currentSeller?.id ?? "").trim();
      const refunded = activeSellerId
        ? refundHistory
            .filter((item) => !item?.sellerId || String(item.sellerId) === activeSellerId)
            .reduce((sum, item) => sum + cleanPrice(item.amount), 0)
        : 0;
      return Math.max(gross - refunded, 0);
    },
    [platformCommissionRecords, refundHistory, currentSeller?.id]
  );

  const sellerStats = useMemo(() => {
    const totalOrders        = orders.length;
    const completed          = orders.filter((o) => o.status === "Delivered").length;
    const processing         = orders.filter((o) => o.status === "Processing").length;
    const cancelled          = orders.filter((o) => o.status === "Cancelled").length;
    const sellerId           = String(currentSeller?.id ?? "").trim();
    const returns            = returnRequests.filter(
      (r) =>
        r.status !== "Product Received" &&
        (!sellerId || !r.sellerId || String(r.sellerId) === sellerId)
    ).length;
    const liveProducts       = sellerProducts.filter((p) => p.visibleToCustomer && p.active).length;
    const pendingApprovalCount = pendingProducts.length;
    const totalEarnings      = orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((sum, order) => sum + calculateSellerOrderAmount(order), 0);
    const refundedAmount     = refundHistory
      .filter((item) => !sellerId || !item?.sellerId || String(item.sellerId) === sellerId)
      .reduce((sum, item) => sum + cleanPrice(item.amount), 0);

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    let currentMonthEarnings = 0;
    let previousMonthEarnings = 0;

    orders.forEach((order) => {
      if (order.status === "Cancelled") {
        return;
      }

      const createdAt = toValidDate(order.createdAt);
      if (!createdAt) {
        return;
      }

      const amount = calculateSellerOrderAmount(order);
      if (createdAt >= currentMonthStart && createdAt < currentMonthEnd) {
        currentMonthEarnings += amount;
      } else if (createdAt >= previousMonthStart && createdAt < currentMonthStart) {
        previousMonthEarnings += amount;
      }
    });

    const monthlyGrowthPercent =
      previousMonthEarnings > 0
        ? ((currentMonthEarnings - previousMonthEarnings) / previousMonthEarnings) * 100
        : currentMonthEarnings > 0
        ? 100
        : 0;

    return {
      totalOrders,
      completed,
      processing,
      cancelled,
      returns,
      liveProducts,
      pendingApprovalCount,
      totalEarnings: Math.max(totalEarnings - refundedAmount, 0),
      monthlyGrowthPercent,
      monthlyGrowthPositive: monthlyGrowthPercent >= 0,
    };
  }, [orders, returnRequests, sellerProducts, pendingProducts, currentSeller, refundHistory]);

  const sellerDashboard = useMemo(() => {
    const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
    const currentWeekTotals = Array(7).fill(0);
    const previousWeekTotals = Array(7).fill(0);
    const currentDate = new Date();
    const currentWeekday = (currentDate.getDay() + 6) % 7;
    const currentWeekStart = new Date(currentDate);
    currentWeekStart.setHours(0, 0, 0, 0);
    currentWeekStart.setDate(currentDate.getDate() - currentWeekday);
    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(currentWeekStart.getDate() - 7);

    const productsById = sellerProducts.reduce((acc, product) => {
      acc[String(product.id ?? "")] = product;
      return acc;
    }, {});

    const productSales = new Map();

    orders.forEach((order) => {
      const createdAt = toValidDate(order.createdAt);
      const orderAmount = calculateSellerOrderAmount(order);

      if (createdAt) {
        const orderDay = new Date(createdAt);
        orderDay.setHours(0, 0, 0, 0);
        const currentDiffDays = Math.floor(
          (orderDay.getTime() - currentWeekStart.getTime()) / 86400000
        );
        const previousDiffDays = Math.floor(
          (orderDay.getTime() - previousWeekStart.getTime()) / 86400000
        );

        if (currentDiffDays >= 0 && currentDiffDays < 7) {
          currentWeekTotals[currentDiffDays] += orderAmount;
        } else if (previousDiffDays >= 0 && previousDiffDays < 7) {
          previousWeekTotals[previousDiffDays] += orderAmount;
        }
      }

      getOrderItems(order).forEach((item) => {
        const productKey = String(item.productId ?? item.id ?? item.name ?? "").trim();
        if (!productKey) {
          return;
        }

        const existing = productSales.get(productKey) ?? {
          id: productKey,
          name: item.name ?? item.productName ?? "Product",
          sold: 0,
          revenue: 0,
          image: item.image ?? item.images?.[0] ?? null,
          price: item.finalPrice ?? item.price ?? 0,
        };

        existing.sold += Number(item.qty ?? item.quantity ?? 1) || 0;
        existing.revenue += getOrderItemLineTotal(item);
        existing.image = existing.image || item.image || item.images?.[0] || null;
        existing.price = existing.price || item.finalPrice || item.price || 0;
        productSales.set(productKey, existing);
      });
    });

    const currentWeekAmount = currentWeekTotals.reduce((sum, value) => sum + value, 0);
    const previousWeekAmount = previousWeekTotals.reduce((sum, value) => sum + value, 0);
    const weekGrowthPercent =
      previousWeekAmount > 0
        ? ((currentWeekAmount - previousWeekAmount) / previousWeekAmount) * 100
        : currentWeekAmount > 0
        ? 100
        : 0;

    const maxWeekAmount = Math.max(...currentWeekTotals, 0);
    const highlightIndex = currentWeekTotals.reduce(
      (bestIndex, value, index, all) =>
        value > all[bestIndex] ? index : bestIndex,
      0
    );

    let topSellingProducts = Array.from(productSales.values())
      .sort((first, second) => {
        if (second.sold !== first.sold) {
          return second.sold - first.sold;
        }
        return second.revenue - first.revenue;
      })
      .slice(0, 3)
      .map((item) => {
        const linkedProduct = productsById[String(item.id)] ?? {};
        return {
          id: item.id,
          name: item.name || linkedProduct.name || "Product",
          price: formatPrice(cleanPrice(item.price || linkedProduct.finalPrice || linkedProduct.price)),
          sold: String(item.sold),
          image: item.image || linkedProduct.image || linkedProduct.images?.[0] || null,
        };
      });

    if (topSellingProducts.length === 0) {
      topSellingProducts = sellerProducts.slice(0, 3).map((product) => ({
        id: product.id,
        name: product.name,
        price: product.finalPrice || product.price || formatPrice(0),
        sold: "0",
        image: product.image || product.images?.[0] || null,
      }));
    }

    return {
      salesOverview: {
        amount: currentWeekAmount,
        previousAmount: previousWeekAmount,
        growthPercent: weekGrowthPercent,
        isPositive: weekGrowthPercent >= 0,
        highlightIndex,
        bars: dayLabels.map((label, index) => ({
          label,
          value: currentWeekTotals[index],
          height:
            maxWeekAmount > 0
              ? Math.max((currentWeekTotals[index] / maxWeekAmount) * 95, currentWeekTotals[index] > 0 ? 16 : 8)
              : 8,
        })),
      },
      topSellingProducts,
    };
  }, [orders, sellerProducts]);

  // ─── Context value ─────────────────────────────────────────────────────────
  // FIX: Split the giant useMemo into a plain object. The previous approach
  // had a huge deps array that was error-prone. Since all the individual
  // values are already memoised (useState / useCallback / useMemo), a plain
  // object reference here is fine — React only re-renders consumers when a
  // context value changes by reference, and our state + callback refs already
  // control that correctly.
  const value = {
    // ── State ──
    cartItems,
    wishlistItems,
    orders,
    productReviews,
    sellerProducts,
    pendingProducts,
    pendingSellerProducts: pendingProducts,
    customerVisibleProducts,
    customerCategoryCatalog,
    deliveryPartners,
    returnRequests,
    customerWallet,
    refundHistory,
    currentSeller,
    sellerSettings,
    sellerSupportContent,
    currentCustomer,
    customerAddresses,
    selectedDeliveryAddress,
    commissionRecords: platformCommissionRecords,
    totalAdminCommission,
    totalSellerPayout,

    // ── Seller registration / approval ──
    pendingSellers,
    approvedSellers,
    rejectedSellers,
    sellers: [...approvedSellers, ...pendingSellers, ...rejectedSellers],

    // ── Notifications (seller) ──
    notifications: sellerNotifications,
    sellerNotifications,
    unreadNotifications,

    // ── Notifications (admin) ──
    adminNotifications,
    unreadAdminNotifications,
    customerNotifications,
    unreadCustomerNotifications,

    // ── Complaints ──
    complaints,
    complaintNotifications: complaints,
    unreadComplaints,

    // ── Cart ──
    addToCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
    saveCustomerAddress,
    updateCustomerProfile,
    deleteCustomerAddress,
    setDefaultCustomerAddress,

    // ── Wishlist ──
    toggleWishlist,
    removeFromWishlist,
    isInWishlist,

    // ── Products ──
    addSellerProduct,
    addSellerProductPending,
    approveSellerProduct,
    rejectSellerProduct,
    updateSellerProduct,
    removeSellerProduct,
    deleteSellerProduct,
    toggleProductVisibility,
    toggleSellerProductActive,

    // ── Orders ──
    createOrder,
    updateOrderStatus,
    addDeliveryPartner,
    assignDeliveryPerson,
    updateDeliveryStatus,
    clearOrders,

    // ── Returns & Reviews ──
    createReturnRequest,
    updateReturnStatus,
    addProductReview,

    // ── Seller auth ──
    registerSeller,
    approveSeller,
    rejectSeller,
    reloadSellers,
    reloadCustomerCommerceData,
    reloadCustomerAddresses,
    reloadAdminOrders,
    reloadSellerOrders,
    reloadAdminNotifications,
    reloadSellerNotifications,
    reloadDeliveryPartners,
    reloadCustomerNotifications,
    reloadComplaints,
    reloadSellerProfile,
    reloadSellerSettings,
    reloadSellerSupportContent,
    loginSeller,
    logoutSeller,
    saveSellerProfile,
    saveSellerSettings,

    // ── Notification actions ──
    addNotification,
    addSellerNotification,
    addCustomerNotification,
    markNotificationRead,
    markSellerNotificationRead,
    markAllNotificationsRead,
    markAllSellerNotificationsRead,
    addAdminNotification,
    markAdminNotificationRead,
    markAllAdminNotificationsRead,
    markCustomerNotificationRead,
    markAllCustomerNotificationsRead,

    // ── Complaint actions ──
    submitComplaint,
    addComplaintNotification,
    forwardComplaintToSeller,
    markComplaintRead,
    markAllComplaintsRead,
    resolveComplaint,

    // ── Utilities ──
    cleanPrice,
    formatPrice,
    getDiscountedPrice,
    getCustomerIdentity,

    // ── Derived ──
    cartCount,
    wishlistCount,
    cartTotal,
    ordersCount,
    sellerStats,
    sellerDashboard,
  };

  return (
    <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context)
    throw new Error("useShop must be used inside ShopProvider");
  return context;
}

