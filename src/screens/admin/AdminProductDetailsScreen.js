// // src/screens/admin/AdminProductDetailsScreen.js
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   Image,
//   Alert,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// const C = {
//   primary: "#0e3243",
//   accent: "#1a9e6e",
//   accentOrange: "#f5a623",
//   white: "#FFFFFF",
//   bg: "#f4f6f9",
//   card: "#FFFFFF",
//   text: "#0e3243",
//   muted: "#7a93a0",
//   border: "#e2eaf0",
//   red: "#e74c3c",
//   green: "#1a9e6e",
// };

// const recentOrders = [
//   { id: "ORD12345", date: "30 May 2024", qty: 1, price: 2499, status: "Delivered" },
//   { id: "ORD12310", date: "29 May 2024", qty: 2, price: 4998, status: "Delivered" },
//   { id: "ORD12280", date: "28 May 2024", qty: 1, price: 2499, status: "Processing" },
//   { id: "ORD12250", date: "27 May 2024", qty: 3, price: 7497, status: "Delivered" },
// ];

// export default function AdminProductDetailsScreen({ navigation, route }) {
//   const product = route?.params?.product || {
//     name: "Wireless Headphones",
//     seller: "Tech Store",
//     category: "Electronics",
//     status: "Active",
//     price: 2499,
//     stock: 20,
//     soldQty: 45,
//     totalOrderAmount: 112455,
//     adminEarnings: 11246,
//     sellerPayout: 101209,
//     image: null,
//   };

//   const [status, setStatus] = useState(product.status);

//   const statusColor = status === "Active" ? C.green : C.red;

//   const toggleStatus = () => {
//     Alert.alert(
//       "Change Status",
//       `Set product to ${status === "Active" ? "Inactive" : "Active"}?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Confirm",
//           onPress: () => setStatus(status === "Active" ? "Inactive" : "Active"),
//         },
//       ]
//     );
//   };

//   const getOrderStatusColor = (s) => {
//     if (s === "Delivered") return C.green;
//     if (s === "Processing") return C.accentOrange;
//     if (s === "Cancelled") return C.red;
//     return C.muted;
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="light-content" backgroundColor={C.primary} />
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color={C.white} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Product Details</Text>
//         <TouchableOpacity>
//           <Ionicons name="ellipsis-vertical" size={22} color={C.white} />
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
//         {/* Product Card */}
//         <View style={styles.productCard}>
//           <View style={styles.productImageWrap}>
//             {product.image ? (
//               <Image source={{ uri: product.image }} style={styles.productImage} />
//             ) : (
//               <View style={styles.productImagePlaceholder}>
//                 <Ionicons name="headset" size={60} color={C.muted} />
//               </View>
//             )}
//           </View>
//           <View style={styles.productInfo}>
//             <Text style={styles.productName}>{product.name}</Text>
//             <Text style={styles.productSeller}>Seller: {product.seller}</Text>
//             <Text style={styles.productCategory}>Category: {product.category}</Text>
//             <TouchableOpacity
//               style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}
//               onPress={toggleStatus}
//             >
//               <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
//               <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Price & Stock */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Price & Stock</Text>
//           <View style={styles.infoGrid}>
//             <View style={styles.infoItem}>
//               <Text style={styles.infoLabel}>Price</Text>
//               <Text style={styles.infoValue}>₹{product.price.toLocaleString()}</Text>
//             </View>
//             <View style={styles.infoItem}>
//               <Text style={styles.infoLabel}>Stock</Text>
//               <Text style={[styles.infoValue, { color: product.stock < 10 ? C.red : C.text }]}>
//                 {product.stock}
//               </Text>
//             </View>
//             <View style={styles.infoItem}>
//               <Text style={styles.infoLabel}>Sold Quantity</Text>
//               <Text style={styles.infoValue}>{product.soldQty}</Text>
//             </View>
//             <View style={styles.infoItem}>
//               <Text style={styles.infoLabel}>Total Order Amount</Text>
//               <Text style={styles.infoValue}>₹{product.totalOrderAmount.toLocaleString()}</Text>
//             </View>
//           </View>
//         </View>

//         {/* Earnings Breakdown */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Earnings Breakdown</Text>
//           <View style={styles.earningsRow}>
//             <View style={[styles.earningsCard, { backgroundColor: "#fff8e1" }]}>
//               <Text style={styles.earningsLabel}>Admin Earnings (10%)</Text>
//               <Text style={[styles.earningsValue, { color: C.accentOrange }]}>
//                 ₹{product.adminEarnings.toLocaleString()}
//               </Text>
//             </View>
//             <View style={[styles.earningsCard, { backgroundColor: "#e8f5e9" }]}>
//               <Text style={styles.earningsLabel}>Seller Payout (90%)</Text>
//               <Text style={[styles.earningsValue, { color: C.green }]}>
//                 ₹{product.sellerPayout.toLocaleString()}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Recent Orders */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Recent Orders</Text>
//             <TouchableOpacity onPress={() => navigation.navigate("ManageOrdersScreen")}>
//               <Text style={styles.viewAllText}>View All</Text>
//             </TouchableOpacity>
//           </View>
//           {recentOrders.map((o) => (
//             <View key={o.id} style={styles.orderRow}>
//               <View>
//                 <Text style={styles.orderId}>Order #{o.id}</Text>
//                 <Text style={styles.orderDate}>{o.date}</Text>
//               </View>
//               <View style={styles.orderRight}>
//                 <Text style={styles.orderQty}>{o.qty} × ₹{product.price.toLocaleString()}</Text>
//                 <Text style={styles.orderPrice}>₹{o.price.toLocaleString()}</Text>
//               </View>
//               <View style={[styles.orderStatus, { backgroundColor: getOrderStatusColor(o.status) + "20" }]}>
//                 <Text style={[styles.orderStatusText, { color: getOrderStatusColor(o.status) }]}>
//                   {o.status}
//                 </Text>
//               </View>
//             </View>
//           ))}
//         </View>

//         {/* Action Buttons */}
//         <View style={styles.actionRow}>
//           <TouchableOpacity
//             style={[styles.actionBtn, { backgroundColor: C.red + "15", borderColor: C.red }]}
//             onPress={() =>
//               Alert.alert("Remove Product", "Are you sure you want to remove this product?", [
//                 { text: "Cancel", style: "cancel" },
//                 { text: "Remove", style: "destructive" },
//               ])
//             }
//           >
//             <Ionicons name="trash-outline" size={18} color={C.red} />
//             <Text style={[styles.actionBtnText, { color: C.red }]}>Remove Product</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={[styles.actionBtn, { backgroundColor: C.primary, borderColor: C.primary }]}>
//             <Ionicons name="create-outline" size={18} color={C.white} />
//             <Text style={[styles.actionBtnText, { color: C.white }]}>Edit Product</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={{ height: 100 }} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: C.primary },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     paddingVertical: 14,
//     backgroundColor: C.primary,
//   },
//   headerTitle: { color: C.white, fontSize: 18, fontWeight: "700" },
//   scroll: { flex: 1, backgroundColor: C.bg },
//   productCard: {
//     backgroundColor: C.card,
//     margin: 16,
//     borderRadius: 18,
//     padding: 16,
//     flexDirection: "row",
//     gap: 16,
//     shadowColor: "#000",
//     shadowOpacity: 0.07,
//     shadowRadius: 10,
//     elevation: 4,
//   },
//   productImageWrap: { width: 90, height: 90 },
//   productImage: { width: 90, height: 90, borderRadius: 14 },
//   productImagePlaceholder: {
//     width: 90,
//     height: 90,
//     borderRadius: 14,
//     backgroundColor: C.bg,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   productInfo: { flex: 1, gap: 4 },
//   productName: { fontSize: 16, fontWeight: "800", color: C.text },
//   productSeller: { fontSize: 12, color: C.muted },
//   productCategory: { fontSize: 12, color: C.muted },
//   statusBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 5,
//     alignSelf: "flex-start",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 20,
//     marginTop: 4,
//   },
//   statusDot: { width: 6, height: 6, borderRadius: 3 },
//   statusText: { fontSize: 12, fontWeight: "700" },
//   section: {
//     backgroundColor: C.card,
//     marginHorizontal: 16,
//     marginBottom: 12,
//     borderRadius: 18,
//     padding: 16,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
//   sectionTitle: { fontSize: 15, fontWeight: "800", color: C.text, marginBottom: 12 },
//   viewAllText: { fontSize: 12, color: C.primary, fontWeight: "700" },
//   infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
//   infoItem: { width: "45%" },
//   infoLabel: { fontSize: 11, color: C.muted, marginBottom: 2 },
//   infoValue: { fontSize: 15, fontWeight: "800", color: C.text },
//   earningsRow: { flexDirection: "row", gap: 12 },
//   earningsCard: { flex: 1, borderRadius: 14, padding: 14, gap: 6 },
//   earningsLabel: { fontSize: 11, color: C.muted },
//   earningsValue: { fontSize: 18, fontWeight: "800" },
//   orderRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: C.border,
//     gap: 8,
//   },
//   orderId: { fontSize: 12, fontWeight: "700", color: C.text },
//   orderDate: { fontSize: 10, color: C.muted, marginTop: 2 },
//   orderRight: { flex: 1, alignItems: "center" },
//   orderQty: { fontSize: 11, color: C.muted },
//   orderPrice: { fontSize: 13, fontWeight: "700", color: C.text },
//   orderStatus: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
//   orderStatusText: { fontSize: 10, fontWeight: "700" },
//   actionRow: {
//     flexDirection: "row",
//     marginHorizontal: 16,
//     marginBottom: 12,
//     gap: 12,
//   },
//   actionBtn: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 6,
//     paddingVertical: 14,
//     borderRadius: 14,
//     borderWidth: 1.5,
//   },
//   actionBtnText: { fontSize: 13, fontWeight: "700" },
// });


































// src/screens/admin/AdminProductDetailsScreen.js

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useShop } from "../../context/ShopContext";

const { width } = Dimensions.get("window");

const C = {
  primary: "#082B67",
  secondary: "#0F3D91",
  accent: "#10B981",
  orange: "#F59E0B",
  white: "#FFFFFF",
  bg: "#F3F6FB",
  card: "#FFFFFF",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  red: "#EF4444",
  green: "#10B981",
};

const resolveImageUri = (image) => {
  if (!image) return null;
  if (typeof image === "string") return image;
  if (typeof image === "object") {
    return image.uri || image.url || image.path || null;
  }
  return null;
};

const formatCurrency = (value) => `\u20b9${Number(value ?? 0).toLocaleString("en-IN")}`;

export default function AdminProductDetailsScreen({
  navigation,
  route,
}) {
  const { orders = [], cleanPrice } = useShop();

  const product = route?.params?.product || {};
  const productImages = (
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : []
  )
    .map(resolveImageUri)
    .filter(Boolean);

  const [status, setStatus] = useState(
    product.status ||
      (product.visibleToCustomer ? "Live" : "Hidden")
  );

  // Related Orders
  const relatedOrders = useMemo(() => {
    return orders.filter((order) =>
      (order.products || []).some(
        (item) =>
          String(item.id || item.name) ===
          String(product.id || product.name)
      )
    );
  }, [orders, product]);

  // Totals
  const totals = useMemo(() => {
    let sold = 0;
    let revenue = 0;

    relatedOrders.forEach((order) => {
      (order.products || []).forEach((item) => {
        if (
          String(item.id || item.name) ===
          String(product.id || product.name)
        ) {
          sold += item.qty || 1;

          revenue +=
            cleanPrice(item.finalPrice || item.price) *
            (item.qty || 1);
        }
      });
    });

    const admin = revenue * 0.1;
    const seller = revenue * 0.9;

    return {
      sold,
      revenue,
      admin,
      seller,
    };
  }, [relatedOrders, cleanPrice, product.id, product.name]);

  const toggleStatus = () => {
    if (status === "Live") {
      setStatus("Hidden");
    } else {
      setStatus("Live");
    }
  };

  const getOrderStatusColor = (status) => {
    if (status === "Delivered") return C.green;
    if (status === "Processing") return C.orange;
    if (status === "Cancelled") return C.red;
    return C.muted;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={C.primary}
      />

      {/* HEADER */}
      <LinearGradient
        colors={[C.primary, C.secondary]}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={C.white}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Product Details
          </Text>

          <TouchableOpacity>
            <Ionicons
              name="ellipsis-vertical"
              size={22}
              color={C.white}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* PRODUCT CARD */}
        <View style={styles.productCard}>
          {/* IMAGE */}
          {productImages.length > 0 ? (
            <View>
              <FlatList
                data={productImages}
                keyExtractor={(item, index) => `${item}_${index}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.productImageSlide}>
                    <Image
                      source={{ uri: item }}
                      style={styles.productImage}
                    />
                  </View>
                )}
              />

              {productImages.length > 1 ? (
                <Text style={styles.galleryHint}>
                  Swipe to view all product images
                </Text>
              ) : null}
            </View>
          ) : (
            <View style={styles.placeholder}>
              <Ionicons
                name="cube-outline"
                size={60}
                color={C.primary}
              />
            </View>
          )}

          {/* INFO */}
          <View style={styles.productInfo}>
            <Text style={styles.productName}>
              {product.name || "Product"}
            </Text>

            <Text style={styles.productSeller}>
              Seller:{" "}
              {product.sellerName || "Unknown Seller"}
            </Text>

            <Text style={styles.productCategory}>
              {product.category || "General"}
            </Text>

            <Text style={styles.productPrice}>
              {formatCurrency(cleanPrice(product.finalPrice || product.price))}
            </Text>

            <TouchableOpacity
              style={[
                styles.statusBtn,
                {
                  backgroundColor:
                    status === "Live"
                      ? "#DCFCE7"
                      : "#E2E8F0",
                },
              ]}
              onPress={toggleStatus}
            >
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      status === "Live"
                        ? C.green
                        : "#94A3B8",
                  },
                ]}
              />

              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      status === "Live"
                        ? C.green
                        : "#64748B",
                  },
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ANALYTICS */}
        <View style={styles.analyticsWrap}>
          <View style={styles.analyticsCard}>
            <Ionicons
              name="bag-check-outline"
              size={24}
              color={C.primary}
            />

            <Text style={styles.analyticsValue}>
              {totals.sold}
            </Text>

            <Text style={styles.analyticsLabel}>
              Products Sold
            </Text>
          </View>

          <View style={styles.analyticsCard}>
            <Ionicons
              name="layers-outline"
              size={24}
              color={C.orange}
            />

            <Text style={styles.analyticsValue}>
              {product.stock || 0}
            </Text>

            <Text style={styles.analyticsLabel}>
              Available Stock
            </Text>
          </View>
        </View>

        {/* REVENUE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Revenue Details
          </Text>

          <View style={styles.revenueCard}>
            <View style={styles.revenueRow}>
              <Text style={styles.revenueLabel}>
                Listed Price
              </Text>

              <Text style={styles.revenueValue}>
                {formatCurrency(cleanPrice(product.finalPrice || product.price))}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.revenueRow}>
              <Text style={styles.revenueLabel}>
                Total Revenue
              </Text>

              <Text style={styles.revenueValue}>
                ₹
                {totals.revenue > 1000
                  ? (
                      totals.revenue / 1000
                    ).toFixed(1) + "K"
                  : totals.revenue.toFixed(0)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.revenueRow}>
              <Text style={styles.revenueLabel}>
                Admin Earnings (10%)
              </Text>

              <Text
                style={[
                  styles.revenueValue,
                  { color: C.orange },
                ]}
              >
                ₹
                {totals.admin > 1000
                  ? (
                      totals.admin / 1000
                    ).toFixed(1) + "K"
                  : totals.admin.toFixed(0)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.revenueRow}>
              <Text style={styles.revenueLabel}>
                Seller Payout (90%)
              </Text>

              <Text
                style={[
                  styles.revenueValue,
                  { color: C.green },
                ]}
              >
                ₹
                {totals.seller > 1000
                  ? (
                      totals.seller / 1000
                    ).toFixed(1) + "K"
                  : totals.seller.toFixed(0)}
              </Text>
            </View>
          </View>
        </View>

        {/* RECENT ORDERS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Recent Orders
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  "ManageOrdersScreen"
                )
              }
            >
              <Text style={styles.viewAll}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {relatedOrders.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Ionicons
                name="receipt-outline"
                size={55}
                color={C.muted}
              />

              <Text style={styles.emptyText}>
                No orders available
              </Text>
            </View>
          ) : (
            relatedOrders.slice(0, 5).map((order, index) => {
              const item = (
                order.products || []
              ).find(
                (p) =>
                  String(p.id || p.name) ===
                  String(product.id || product.name)
              );

              const amount =
                cleanPrice(
                  item?.finalPrice || item?.price
                ) * (item?.qty || 1);

              return (
                <View
                  key={index}
                  style={styles.orderCard}
                >
                  <View>
                    <Text style={styles.orderId}>
                      #{order.id || "ORD-1001"}
                    </Text>

                    <Text style={styles.orderDate}>
                      {order.date ||
                        "30 May 2026"}
                    </Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.orderQty}>
                      Qty: {item?.qty || 1}
                    </Text>

                    <Text style={styles.orderAmount}>
                      ₹
                      {amount > 1000
                        ? (
                            amount / 1000
                          ).toFixed(1) + "K"
                        : amount}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.orderStatus,
                      {
                        backgroundColor:
                          getOrderStatusColor(
                            order.status
                          ) + "20",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.orderStatusText,
                        {
                          color:
                            getOrderStatusColor(
                              order.status
                            ),
                        },
                      ]}
                    >
                      {order.status ||
                        "Delivered"}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.removeBtn}
          >
            <Ionicons
              name="trash-outline"
              size={18}
              color={C.red}
            />

            <Text style={styles.removeText}>
              Remove
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editBtn}
          >
            <Ionicons
              name="create-outline"
              size={18}
              color={C.white}
            />

            <Text style={styles.editText}>
              Edit Product
            </Text>
          </TouchableOpacity>
        </View>

        {/* PAYOUT BUTTON */}
        <TouchableOpacity
          style={styles.payoutBtn}
          onPress={() =>
            navigation.navigate(
              "AdminPayouts",
              {
                product,
              }
            )
          }
        >
          <Ionicons
            name="wallet-outline"
            size={20}
            color={C.white}
          />

          <Text style={styles.payoutText}>
            Open Seller Payouts
          </Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },

  header: {
    paddingTop: 10,
    paddingBottom: 18,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    color: C.white,
    fontSize: 20,
    fontWeight: "800",
  },

  scroll: {
    flex: 1,
  },

  productCard: {
    backgroundColor: C.card,
    margin: 16,
    borderRadius: 28,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },

  productImageSlide: {
    width: width - 68,
  },

  productImage: {
    width: "100%",
    height: 230,
    borderRadius: 22,
    backgroundColor: "#E2E8F0",
  },

  galleryHint: {
    textAlign: "center",
    color: C.muted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 10,
  },

  placeholder: {
    width: "100%",
    height: 230,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
  },

  productInfo: {
    marginTop: 18,
  },

  productName: {
    fontSize: 22,
    fontWeight: "800",
    color: C.text,
  },

  productSeller: {
    marginTop: 8,
    color: C.muted,
    fontSize: 13,
  },

  productCategory: {
    marginTop: 5,
    color: C.primary,
    fontSize: 13,
    fontWeight: "700",
  },

  productPrice: {
    marginTop: 12,
    fontSize: 28,
    fontWeight: "800",
    color: C.primary,
  },

  statusBtn: {
    marginTop: 14,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 30,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "800",
  },

  analyticsWrap: {
    flexDirection: "row",
    marginHorizontal: 16,
    gap: 12,
  },

  analyticsCard: {
    flex: 1,
    backgroundColor: C.card,
    borderRadius: 22,
    paddingVertical: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  analyticsValue: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: "800",
    color: C.text,
  },

  analyticsLabel: {
    marginTop: 6,
    fontSize: 12,
    color: C.muted,
  },

  section: {
    backgroundColor: C.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 24,
    padding: 18,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.text,
  },

  viewAll: {
    color: C.primary,
    fontWeight: "700",
    fontSize: 12,
  },

  revenueCard: {
    marginTop: 18,
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 16,
  },

  revenueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  revenueLabel: {
    color: C.muted,
    fontSize: 13,
  },

  revenueValue: {
    color: C.text,
    fontSize: 17,
    fontWeight: "800",
  },

  divider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 14,
  },

  emptyWrap: {
    alignItems: "center",
    paddingVertical: 35,
  },

  emptyText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "700",
    color: C.muted,
  },

  orderCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 14,
    marginTop: 14,
  },

  orderId: {
    fontSize: 13,
    fontWeight: "800",
    color: C.text,
  },

  orderDate: {
    fontSize: 11,
    color: C.muted,
    marginTop: 4,
  },

  orderQty: {
    fontSize: 12,
    color: C.muted,
  },

  orderAmount: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "800",
    color: C.text,
  },

  orderStatus: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
  },

  orderStatusText: {
    fontSize: 10,
    fontWeight: "800",
  },

  actionRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },

  removeBtn: {
    flex: 1,
    height: 54,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: C.red,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    backgroundColor: "#FEF2F2",
  },

  removeText: {
    color: C.red,
    fontWeight: "800",
  },

  editBtn: {
    flex: 1,
    height: 54,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    backgroundColor: C.primary,
  },

  editText: {
    color: C.white,
    fontWeight: "800",
  },

  payoutBtn: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: C.green,
    height: 58,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },

  payoutText: {
    color: C.white,
    fontSize: 15,
    fontWeight: "800",
  },
});
