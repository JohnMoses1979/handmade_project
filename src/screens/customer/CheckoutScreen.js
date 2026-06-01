


// screens/customer/CheckoutScreen.js

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppState, Linking, View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Header from "../../components/Header";
import Button from "../../components/Button";
import { COLORS } from "../../constants/colors";
import { useShop } from "../../context/ShopContext";
import {
  createRazorpayOrderAPI,
  createRazorpayMobileSessionAPI,
  fetchRazorpayMobileSessionAPI,
  verifyRazorpayPaymentAPI,
} from "../../api/paymentApi";

const DELIVERY_CHARGE = 40;

const cleanPrice = (price) => {
  if (typeof price === "number") return price;
  const value = String(price || "0").replace(/[^\d.]/g, "");
  const number = Number(value);
  return Number.isNaN(number) ? 0 : number;
};

export default function CheckoutScreen({ navigation, route }) {
  const {
    cartItems,
    createOrder,
    clearCart,
    getCustomerIdentity,
    selectedDeliveryAddress,
  } = useShop();

  const product = route?.params?.product;
  const cartItemsFromParams = route?.params?.cartItems;
  const action = route?.params?.action;

  const items = useMemo(() => {
    if (Array.isArray(cartItemsFromParams) && cartItemsFromParams.length > 0) {
      return cartItemsFromParams;
    }

    if (product) return [product];

    return cartItems || [];
  }, [cartItemsFromParams, product, cartItems]);

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [message, setMessage] = useState("");
  const pendingPaymentRef = useRef(null);
  const syncingPaymentRef = useRef(false);
  const appState = useRef(AppState.currentState);

  const address = useMemo(() => {
    if (selectedDeliveryAddress) {
      return selectedDeliveryAddress;
    }

    const customer = getCustomerIdentity?.() || {};
    return {
      name: customer?.name || "John Doe",
      phone: customer?.phone || "",
      line1: "123, Street, Andheri East",
      line2: "",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400069",
    };
  }, [getCustomerIdentity, selectedDeliveryAddress]);

  const itemTotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const qty = item?.qty || item?.quantity || 1;
      return sum + cleanPrice(item?.price) * qty;
    }, 0);
  }, [items]);

  const totalAmount = itemTotal + DELIVERY_CHARGE;

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2400);
  };

  const submitOrder = useCallback(
    async (method, paymentStatus, paymentMeta = {}) => {
      return await createOrder({
        items,
        paymentMethod: method,
        deliveryCharge: DELIVERY_CHARGE,
        clearOrderedCart: action !== "buyNow",
        address,
        paymentStatus,
        paymentMeta,
      });
    },
    [action, address, createOrder, items]
  );

  const clearPendingPayment = useCallback(() => {
    pendingPaymentRef.current = null;
    syncingPaymentRef.current = false;
  }, []);

  const syncPendingNativePayment = useCallback(async () => {
    const pending = pendingPaymentRef.current;
    if (!pending || syncingPaymentRef.current) return;

    syncingPaymentRef.current = true;
    try {
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const result = await fetchRazorpayMobileSessionAPI(pending.sessionId);
        if (result?.success && String(result?.status || "").toLowerCase() === "paid") {
          const payment = result?.payment || {};

          const newOrder = await submitOrder(pending.paymentMethod, "Paid", {
            razorpayOrderId: result.orderId || pending.orderId,
            razorpayPaymentId: payment.razorpay_payment_id || null,
            razorpaySignature: payment.razorpay_signature || null,
          });

          if (!newOrder) {
            throw new Error("Order could not be created after payment.");
          }

          if (action === "buyNow") {
            clearCart();
          }

          clearPendingPayment();
          navigation.navigate("MyOrders", {
            latestOrder: newOrder,
            hasPurchased: true,
          });
          return;
        }

        if (result?.success && ["cancelled", "expired"].includes(String(result?.status || "").toLowerCase())) {
          clearPendingPayment();
          showMessage("Payment was not completed.");
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      showMessage("Payment is still pending. Please return to the payment page and complete it.");
    } catch (error) {
      showMessage(error?.message || "Unable to verify mobile payment.");
    } finally {
      syncingPaymentRef.current = false;
    }
  }, [action, clearCart, clearPendingPayment, navigation, submitOrder]);

  const loadRazorpayCheckout = () =>
    new Promise((resolve, reject) => {
      if (typeof window === "undefined" || Platform.OS !== "web") {
        reject(new Error("Online payment is configured for web in this app."));
        return;
      }

      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Unable to load Razorpay Checkout."));
      document.body.appendChild(script);
    });

  const handlePlaceOrder = async () => {
    if (!items.length) {
      showMessage("No products found for checkout.");
      return;
    }

    if (Platform.OS !== "web" && pendingPaymentRef.current) {
      showMessage("A payment is already in progress. Please complete it in your browser.");
      return;
    }

    try {
      if (paymentMethod === "COD") {
        const newOrder = await submitOrder("COD", "Pending");
        if (!newOrder) {
          showMessage("Order failed. Please try again.");
          return;
        }

        if (action === "buyNow") {
          clearCart();
        }

        navigation.navigate("MyOrders", {
          latestOrder: newOrder,
          hasPurchased: true,
        });
        return;
      }

      if (Platform.OS !== "web") {
        const customer = getCustomerIdentity?.() || {};
        const receipt = `customer_order_${Date.now()}`;
        const session = await createRazorpayMobileSessionAPI({
          amount: totalAmount,
          receipt,
          description: "Customer product order payment",
          customer: {
            name: customer?.name || "Customer",
            email: customer?.email || "",
            contact: customer?.phone || "",
          },
        });

        if (!session?.success) {
          throw new Error(session?.message || "Unable to create payment session.");
        }

        const checkoutUrl = String(session?.checkoutUrl || "").trim();
        if (!checkoutUrl) {
          throw new Error("Payment page is not available.");
        }

        pendingPaymentRef.current = {
          sessionId: session.sessionId,
          orderId: session.orderId || null,
          paymentMethod,
        };

        await Linking.openURL(checkoutUrl);
        showMessage("Complete the payment in your browser, then return to the app.");
        return;
      }

      await loadRazorpayCheckout();

      const customer = getCustomerIdentity?.() || {};
      const razorpayOrder = await createRazorpayOrderAPI({
        amount: totalAmount,
        receipt: `customer_order_${Date.now()}`,
      });

      if (!razorpayOrder?.success) {
        throw new Error(razorpayOrder?.message || "Unable to create Razorpay order.");
      }

      const checkout = new window.Razorpay({
        key: razorpayOrder.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Selfbusiness",
        description: "Customer product order payment",
        order_id: razorpayOrder.orderId,
        prefill: {
          name: customer?.name || "Customer",
          email: customer?.email || "",
          contact: customer?.phone || "",
        },
        theme: { color: COLORS.customer || "#E83E7C" },
        handler: async (paymentResponse) => {
          try {
            const verification = await verifyRazorpayPaymentAPI(paymentResponse);
            if (!verification?.success) {
              throw new Error(verification?.message || "Payment verification failed.");
            }

            const newOrder = await submitOrder(paymentMethod, "Paid", {
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature,
            });
            if (!newOrder) {
              throw new Error("Order could not be created after payment.");
            }

            if (action === "buyNow") {
              clearCart();
            }

            navigation.navigate("MyOrders", {
              latestOrder: newOrder,
              hasPurchased: true,
            });
          } catch (error) {
            showMessage(error?.message || "Payment succeeded but order creation failed.");
          }
        },
      });

      checkout.open();
    } catch (error) {
      clearPendingPayment();
      showMessage(error?.message || "Unable to process checkout.");
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (appState.current === "background" && nextState === "active" && pendingPaymentRef.current) {
        syncPendingNativePayment();
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [syncPendingNativePayment]);

  return (
    <View style={styles.container}>
      <Header title="Checkout" navigation={navigation} color={COLORS.customer} />

      {message ? (
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      ) : null}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location-outline" size={24} color={COLORS.customer || "#E83E7C"} />
            <Text style={styles.title}>Delivery Address</Text>
            <TouchableOpacity
              style={styles.changeBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("CustomerSavedAddress", { returnTo: "Checkout" })}
            >
              <Text style={styles.changeBtnText}>Change</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{address?.name || "Customer"}</Text>
          <Text style={styles.text}>{address?.line1 || "Add delivery address"}</Text>
          {address?.line2 ? <Text style={styles.text}>{address.line2}</Text> : null}
          <Text style={styles.text}>
            {[address?.city, address?.state, address?.pincode].filter(Boolean).join(" - ")}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="bag-handle-outline" size={24} color={COLORS.customer || "#E83E7C"} />
            <Text style={styles.title}>Order Items</Text>
          </View>

          {items.map((item, index) => (
            <View key={`${item?.id || item?.name || index}`} style={styles.itemRow}>
              <View style={styles.itemIcon}>
                <Ionicons name="cube-outline" size={22} color={COLORS.customer || "#E83E7C"} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item?.name || "Product"}
                </Text>
                <Text style={styles.itemQty}>Qty: {item?.qty || item?.quantity || 1}</Text>
              </View>

              <Text style={styles.itemPrice}>
                {String(item?.price || "").includes("₹") ? item?.price : `₹${item?.price || 0}`}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="wallet-outline" size={24} color={COLORS.customer || "#E83E7C"} />
            <Text style={styles.title}>Payment Method</Text>
          </View>

          <PaymentOption title="UPI" subtitle="Pay using PhonePe, Google Pay, Paytm" icon="phone-portrait-outline" active={paymentMethod === "UPI"} onPress={() => setPaymentMethod("UPI")} />
          <PaymentOption title="Credit / Debit Card" subtitle="Pay securely using your bank card" icon="card-outline" active={paymentMethod === "CARD"} onPress={() => setPaymentMethod("CARD")} />
          <PaymentOption title="Cash on Delivery" subtitle="Pay when your order reaches your address" icon="cash-outline" active={paymentMethod === "COD"} onPress={() => setPaymentMethod("COD")} />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="receipt-outline" size={24} color={COLORS.customer || "#E83E7C"} />
            <Text style={styles.title}>Price Details</Text>
          </View>

          <PriceRow label="Item Total" value={`₹${itemTotal}`} />
          <PriceRow label="Delivery Charges" value={`₹${DELIVERY_CHARGE}`} />

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.total}>₹{totalAmount}</Text>
          </View>

          <View style={styles.buttonGap}>
            <Button
              title={paymentMethod === "COD" ? "Order with Cash on Delivery" : `Pay ₹${totalAmount}`}
              color={paymentMethod === "COD" ? "#16A34A" : COLORS.customer}
              onPress={handlePlaceOrder}
            />
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
}

function PaymentOption({ title, subtitle, icon, active, onPress }) {
  return (
    <TouchableOpacity style={[styles.paymentOption, active && styles.activePaymentOption]} activeOpacity={0.85} onPress={onPress}>
      <View style={[styles.paymentIcon, active && styles.activePaymentIcon]}>
        <Ionicons name={icon} size={22} color={active ? "#FFFFFF" : COLORS.customer || "#E83E7C"} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.paymentTitle}>{title}</Text>
        <Text style={styles.paymentSubtitle}>{subtitle}</Text>
      </View>

      <Ionicons name={active ? "radio-button-on" : "radio-button-off"} size={23} color={active ? COLORS.customer || "#E83E7C" : "#9CA3AF"} />
    </TouchableOpacity>
  );
}

function PriceRow({ label, value }) {
  return (
    <View style={styles.priceRow}>
      <Text style={styles.priceLabel}>{label}</Text>
      <Text style={styles.priceValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scroll: { paddingBottom: 20 },

  messageBox: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#111827",
  },
  messageText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 18,
    borderRadius: 22,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  title: { fontSize: 18, fontWeight: "900", color: COLORS.text || "#111827" },
  changeBtn: {
    marginLeft: "auto",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  changeBtnText: {
    color: COLORS.customer || "#E83E7C",
    fontSize: 12,
    fontWeight: "900",
  },
  name: {
    fontSize: 15,
    fontWeight: "900",
    color: COLORS.text || "#111827",
    marginBottom: 6,
  },
  text: {
    color: COLORS.muted || "#6B7280",
    marginBottom: 7,
    fontSize: 13,
    fontWeight: "700",
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFF4F8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemName: { fontSize: 14, fontWeight: "900", color: COLORS.text || "#111827" },
  itemQty: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.muted || "#6B7280",
  },
  itemPrice: { fontSize: 14, fontWeight: "900", color: COLORS.customer || "#E83E7C" },

  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
  },
  activePaymentOption: {
    borderColor: COLORS.customer || "#E83E7C",
    backgroundColor: "#FFF4F8",
  },
  paymentIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFF4F8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activePaymentIcon: { backgroundColor: COLORS.customer || "#E83E7C" },
  paymentTitle: { fontSize: 14, fontWeight: "900", color: COLORS.text || "#111827" },
  paymentSubtitle: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.muted || "#6B7280",
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  priceLabel: { fontSize: 14, fontWeight: "700", color: COLORS.muted || "#6B7280" },
  priceValue: { fontSize: 14, fontWeight: "900", color: COLORS.text || "#111827" },
  divider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 8 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 17, fontWeight: "900", color: COLORS.text || "#111827" },
  total: { fontSize: 20, fontWeight: "900", color: COLORS.customer || "#E83E7C" },
  buttonGap: { marginTop: 18 },
});

























// // src/screens/customer/CheckoutScreen.js
// // ✅ FIXED:
// //  - createOrder() automatically records Admin 10% / Seller 90% via ShopContext
// //  - Shows commission breakdown in price details
// //  - Order goes to admin & seller notifications after payment

// import React, { useMemo, useState } from "react";
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useShop } from "../../context/ShopContext";

// const DELIVERY_CHARGE = 40;
// const ADMIN_COMMISSION_RATE = 0.1;  // 10%
// const SELLER_COMMISSION_RATE = 0.9; // 90%

// // Safe colors fallback
// const COLORS = {
//   customer: "#E83E7C",
//   text: "#111827",
//   muted: "#6B7280",
// };

// const cleanPrice = (price) => {
//   if (typeof price === "number") return price;
//   const value = String(price || "0").replace(/[₹,\s]/g, "");
//   const number = Number(value);
//   return Number.isNaN(number) ? 0 : number;
// };

// export default function CheckoutScreen({ navigation, route }) {
//   const { cartItems, createOrder, clearCart } = useShop();

//   const product = route?.params?.product;
//   const cartItemsFromParams = route?.params?.cartItems;
//   const action = route?.params?.action;

//   const items = useMemo(() => {
//     if (Array.isArray(cartItemsFromParams) && cartItemsFromParams.length > 0) {
//       return cartItemsFromParams;
//     }
//     if (product) return [product];
//     return cartItems || [];
//   }, [cartItemsFromParams, product, cartItems]);

//   const [paymentMethod, setPaymentMethod] = useState("UPI");
//   const [message, setMessage] = useState("");

//   const itemTotal = useMemo(() => {
//     return items.reduce((sum, item) => {
//       const qty = item?.qty || item?.quantity || 1;
//       return sum + cleanPrice(item?.finalPrice || item?.price) * qty;
//     }, 0);
//   }, [items]);

//   const totalAmount = itemTotal + DELIVERY_CHARGE;

//   // ✅ Commission preview
//   const adminCommission = Math.round(totalAmount * ADMIN_COMMISSION_RATE);
//   const sellerEarning = totalAmount - adminCommission;

//   const showMessage = (text) => {
//     setMessage(text);
//     setTimeout(() => setMessage(""), 2400);
//   };

//   const handlePlaceOrder = () => {
//     if (!items.length) {
//       showMessage("No products found for checkout.");
//       return;
//     }

//     // ✅ createOrder in ShopContext automatically records:
//     //    adminCommission = 10%, sellerEarning = 90%
//     const newOrder = createOrder({
//       items,
//       paymentMethod,
//       deliveryCharge: DELIVERY_CHARGE,
//       clearOrderedCart: action !== "buyNow",
//       address: {
//         name: "John Doe",
//         line1: "123, Street, Andheri East",
//         city: "Mumbai - 400069",
//       },
//     });

//     if (!newOrder) {
//       showMessage("Order failed. Please try again.");
//       return;
//     }

//     if (action === "buyNow") clearCart();

//     navigation.navigate("MyOrders", {
//       latestOrder: newOrder,
//       hasPurchased: true,
//     });
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//           <Ionicons name="arrow-back" size={22} color="#111827" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Checkout</Text>
//         <View style={{ width: 40 }} />
//       </View>

//       {message ? (
//         <View style={styles.messageBox}>
//           <Text style={styles.messageText}>{message}</Text>
//         </View>
//       ) : null}

//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
//         {/* Delivery Address */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <Ionicons name="location-outline" size={24} color={COLORS.customer} />
//             <Text style={styles.title}>Delivery Address</Text>
//           </View>
//           <Text style={styles.name}>John Doe</Text>
//           <Text style={styles.text}>123, Street, Andheri East</Text>
//           <Text style={styles.text}>Mumbai - 400069</Text>
//         </View>

//         {/* Order Items */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <Ionicons name="bag-handle-outline" size={24} color={COLORS.customer} />
//             <Text style={styles.title}>Order Items</Text>
//           </View>

//           {items.length === 0 ? (
//             <Text style={styles.text}>No items in cart.</Text>
//           ) : (
//             items.map((item, index) => (
//               <View key={`${item?.id || item?.name || index}`} style={styles.itemRow}>
//                 <View style={styles.itemIcon}>
//                   <Ionicons name="cube-outline" size={22} color={COLORS.customer} />
//                 </View>
//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.itemName} numberOfLines={1}>
//                     {item?.name || "Product"}
//                   </Text>
//                   <Text style={styles.itemQty}>
//                     Qty: {item?.qty || item?.quantity || 1}
//                   </Text>
//                 </View>
//                 <Text style={styles.itemPrice}>
//                   {String(item?.finalPrice || item?.price || "").includes("₹")
//                     ? item?.finalPrice || item?.price
//                     : `₹${item?.finalPrice || item?.price || 0}`}
//                 </Text>
//               </View>
//             ))
//           )}
//         </View>

//         {/* Payment Method */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <Ionicons name="wallet-outline" size={24} color={COLORS.customer} />
//             <Text style={styles.title}>Payment Method</Text>
//           </View>

//           <PaymentOption
//             title="UPI"
//             subtitle="Pay using PhonePe, Google Pay, Paytm"
//             icon="phone-portrait-outline"
//             active={paymentMethod === "UPI"}
//             onPress={() => setPaymentMethod("UPI")}
//           />
//           <PaymentOption
//             title="Credit / Debit Card"
//             subtitle="Pay securely using your bank card"
//             icon="card-outline"
//             active={paymentMethod === "CARD"}
//             onPress={() => setPaymentMethod("CARD")}
//           />
//           <PaymentOption
//             title="Cash on Delivery"
//             subtitle="Pay when your order reaches your address"
//             icon="cash-outline"
//             active={paymentMethod === "COD"}
//             onPress={() => setPaymentMethod("COD")}
//           />
//         </View>

//         {/* Price Details */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <Ionicons name="receipt-outline" size={24} color={COLORS.customer} />
//             <Text style={styles.title}>Price Details</Text>
//           </View>

//           <PriceRow label="Item Total" value={`₹${itemTotal}`} />
//           <PriceRow label="Delivery Charges" value={`₹${DELIVERY_CHARGE}`} />

//           <View style={styles.divider} />

//           <View style={styles.totalRow}>
//             <Text style={styles.totalLabel}>Total Amount</Text>
//             <Text style={styles.total}>₹{totalAmount}</Text>
//           </View>

//           {/* ✅ Commission breakdown visible to customer */}
//           <View style={styles.commissionBox}>
//             <Text style={styles.commissionTitle}>💼 Platform Commission</Text>
//             <View style={styles.commissionRow}>
//               <Text style={styles.commissionLabel}>Admin Commission (10%)</Text>
//               <Text style={[styles.commissionValue, { color: "#F97316" }]}>
//                 ₹{adminCommission}
//               </Text>
//             </View>
//             <View style={styles.commissionRow}>
//               <Text style={styles.commissionLabel}>Seller Earnings (90%)</Text>
//               <Text style={[styles.commissionValue, { color: "#16A34A" }]}>
//                 ₹{sellerEarning}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.buttonGap}>
//             <TouchableOpacity
//               style={[
//                 styles.placeOrderBtn,
//                 { backgroundColor: paymentMethod === "COD" ? "#16A34A" : COLORS.customer },
//               ]}
//               onPress={handlePlaceOrder}
//               activeOpacity={0.88}
//             >
//               <Ionicons name="checkmark-circle" size={22} color="#fff" />
//               <Text style={styles.placeOrderText}>
//                 {paymentMethod === "COD"
//                   ? "Order with Cash on Delivery"
//                   : `Pay ₹${totalAmount}`}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={{ height: 110 }} />
//       </ScrollView>
//     </View>
//   );
// }

// function PaymentOption({ title, subtitle, icon, active, onPress }) {
//   return (
//     <TouchableOpacity
//       style={[styles.paymentOption, active && styles.activePaymentOption]}
//       activeOpacity={0.85}
//       onPress={onPress}
//     >
//       <View style={[styles.paymentIcon, active && styles.activePaymentIcon]}>
//         <Ionicons name={icon} size={22} color={active ? "#FFFFFF" : COLORS.customer} />
//       </View>
//       <View style={{ flex: 1 }}>
//         <Text style={styles.paymentTitle}>{title}</Text>
//         <Text style={styles.paymentSubtitle}>{subtitle}</Text>
//       </View>
//       <Ionicons
//         name={active ? "radio-button-on" : "radio-button-off"}
//         size={23}
//         color={active ? COLORS.customer : "#9CA3AF"}
//       />
//     </TouchableOpacity>
//   );
// }

// function PriceRow({ label, value }) {
//   return (
//     <View style={styles.priceRow}>
//       <Text style={styles.priceLabel}>{label}</Text>
//       <Text style={styles.priceValue}>{value}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#FFFFFF" },
//   header: {
//     flexDirection: "row", alignItems: "center", justifyContent: "space-between",
//     paddingHorizontal: 16, paddingTop: 52, paddingBottom: 14,
//     backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#F3F4F6",
//   },
//   backBtn: {
//     width: 40, height: 40, borderRadius: 20, backgroundColor: "#F3F4F6",
//     alignItems: "center", justifyContent: "center",
//   },
//   headerTitle: { fontSize: 18, fontWeight: "900", color: "#111827" },
//   scroll: { paddingBottom: 20 },
//   messageBox: {
//     marginHorizontal: 16, marginTop: 10, padding: 12,
//     borderRadius: 14, backgroundColor: "#111827",
//   },
//   messageText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900", textAlign: "center" },
//   card: {
//     backgroundColor: "#FFFFFF", marginHorizontal: 16, marginTop: 16,
//     padding: 18, borderRadius: 22, elevation: 3,
//     shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8,
//   },
//   cardHeader: {
//     flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14,
//   },
//   title: { fontSize: 18, fontWeight: "900", color: "#111827" },
//   name: { fontSize: 15, fontWeight: "900", color: "#111827", marginBottom: 6 },
//   text: { color: "#6B7280", marginBottom: 7, fontSize: 13, fontWeight: "700" },
//   itemRow: {
//     flexDirection: "row", alignItems: "center",
//     paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F3F4F6",
//   },
//   itemIcon: {
//     width: 42, height: 42, borderRadius: 14, backgroundColor: "#FFF4F8",
//     alignItems: "center", justifyContent: "center", marginRight: 12,
//   },
//   itemName: { fontSize: 14, fontWeight: "900", color: "#111827" },
//   itemQty: { marginTop: 4, fontSize: 12, fontWeight: "700", color: "#6B7280" },
//   itemPrice: { fontSize: 14, fontWeight: "900", color: COLORS.customer },
//   paymentOption: {
//     flexDirection: "row", alignItems: "center", padding: 12,
//     borderRadius: 18, borderWidth: 1, borderColor: "#F3F4F6",
//     backgroundColor: "#FFFFFF", marginBottom: 10,
//   },
//   activePaymentOption: { borderColor: COLORS.customer, backgroundColor: "#FFF4F8" },
//   paymentIcon: {
//     width: 42, height: 42, borderRadius: 14, backgroundColor: "#FFF4F8",
//     alignItems: "center", justifyContent: "center", marginRight: 12,
//   },
//   activePaymentIcon: { backgroundColor: COLORS.customer },
//   paymentTitle: { fontSize: 14, fontWeight: "900", color: "#111827" },
//   paymentSubtitle: { marginTop: 3, fontSize: 12, fontWeight: "700", color: "#6B7280" },
//   priceRow: {
//     flexDirection: "row", justifyContent: "space-between", marginBottom: 10,
//   },
//   priceLabel: { fontSize: 14, fontWeight: "700", color: "#6B7280" },
//   priceValue: { fontSize: 14, fontWeight: "900", color: "#111827" },
//   divider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 8 },
//   totalRow: {
//     flexDirection: "row", justifyContent: "space-between", alignItems: "center",
//   },
//   totalLabel: { fontSize: 17, fontWeight: "900", color: "#111827" },
//   total: { fontSize: 20, fontWeight: "900", color: COLORS.customer },
//   // ✅ Commission breakdown box
//   commissionBox: {
//     backgroundColor: "#F8FAFC", borderRadius: 14, padding: 12,
//     marginTop: 12, borderWidth: 1, borderColor: "#E2E8F0",
//   },
//   commissionTitle: { fontSize: 12, fontWeight: "800", color: "#64748B", marginBottom: 8 },
//   commissionRow: {
//     flexDirection: "row", justifyContent: "space-between", marginBottom: 4,
//   },
//   commissionLabel: { fontSize: 12, color: "#64748B", fontWeight: "600" },
//   commissionValue: { fontSize: 12, fontWeight: "800" },
//   buttonGap: { marginTop: 18 },
//   placeOrderBtn: {
//     flexDirection: "row", alignItems: "center", justifyContent: "center",
//     gap: 8, paddingVertical: 16, borderRadius: 18,
//   },
//   placeOrderText: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
// });
