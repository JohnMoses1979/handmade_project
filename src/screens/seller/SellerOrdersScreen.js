

// // screens/seller/SellerOrdersScreen.js

// import React, { useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   StatusBar,
//   Platform,
//   Image,
//   SafeAreaView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useShop } from "../../context/ShopContext";

// const C = {
//   primary: "#082843",
//   white: "#FFFFFF",
//   bg: "#FFFFFF",
//   text: "#111827",
//   muted: "#6B7280",
//   border: "#F3D6E2",
//   soft: "#FFFFFF",
//   success: "#22C55E",
//   warning: "#F59E0B",
//   danger: "#EF4444",
// };

// const getImageSource = (image) => {
//   if (!image) return null;
//   if (typeof image === "string") return { uri: image };
//   return image;
// };

// const getAmount = (order) => {
//   return order?.totalAmount || order?.amount || order?.price || "₹0";
// };

// export default function SellerOrdersScreen({ navigation }) {
//   const shop = useShop() || {};

//   const {
//     orders = [],
//     updateOrderStatus = () => {},
//     updateDeliveryStatus = () => {},
//   } = shop;

//   const [tab, setTab] = useState("All");
//   const [search, setSearch] = useState("");

//   const counts = useMemo(() => {
//     return {
//       All: orders.length,
//       Processing: orders.filter((o) => (o.status || "Processing") === "Processing").length,
//       Completed: orders.filter((o) => o.status === "Completed").length,
//       Cancelled: orders.filter((o) => o.status === "Cancelled").length,
//     };
//   }, [orders]);

//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();

//     return orders.filter((order) => {
//       const products = order.products || order.items || [];
//       const productText = products
//         .map((p) => p?.name || p?.title || "")
//         .join(" ")
//         .toLowerCase();

//       const status = order.status || "Processing";
//       const byTab = tab === "All" || status === tab;

//       const bySearch =
//         !q ||
//         String(order.id || "").toLowerCase().includes(q) ||
//         String(order.customer || "").toLowerCase().includes(q) ||
//         String(order.customerName || "").toLowerCase().includes(q) ||
//         String(order.title || "").toLowerCase().includes(q) ||
//         productText.includes(q);

//       return byTab && bySearch;
//     });
//   }, [orders, tab, search]);

//   const changeStatus = (orderId, status) => {
//     updateOrderStatus(orderId, status);
//   };

//   const changeDelivery = (orderId, status) => {
//     updateDeliveryStatus(orderId, status);
//   };

//   const tabs = ["All", "Processing", "Completed", "Cancelled"];

//   return (
//     <SafeAreaView style={styles.safe}>
//       <View style={styles.root}>
//         <StatusBar barStyle="dark-content" backgroundColor={C.white} />

//         <View style={styles.header}>
//           <TouchableOpacity
//             onPress={() => navigation?.goBack?.()}
//             style={styles.iconBtn}
//             activeOpacity={0.85}
//           >
//             <Ionicons name="chevron-back" size={24} color={C.text} />
//           </TouchableOpacity>

//           <View style={styles.headerCenter}>
//             <Text style={styles.headerTitle}>Seller Orders</Text>
//             <Text style={styles.headerSub}>{orders.length} total orders</Text>
//           </View>

//           <TouchableOpacity
//             style={styles.iconBtn}
//             activeOpacity={0.85}
//             onPress={() => navigation?.navigate?.("SellerDeliveryScreen")}
//           >
//             <Ionicons name="bicycle" size={21} color={C.primary} />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.searchBox}>
//           <Ionicons name="search" size={18} color={C.muted} />
//           <TextInput
//             value={search}
//             onChangeText={setSearch}
//             placeholder="Search order, customer, product"
//             placeholderTextColor={C.muted}
//             style={styles.searchInput}
//           />
//         </View>

//         <View style={styles.tabsWrapper}>
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             style={styles.tabsScroll}
//             contentContainerStyle={styles.tabsContent}
//           >
//             {tabs.map((item) => {
//               const active = tab === item;

//               return (
//                 <TouchableOpacity
//                   key={item}
//                   style={[styles.tabBtn, active && styles.tabBtnActive]}
//                   onPress={() => setTab(item)}
//                   activeOpacity={0.85}
//                 >
//                   <Text style={[styles.tabText, active && styles.tabTextActive]}>
//                     {item} ({counts[item]})
//                   </Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </ScrollView>
//         </View>

//         <ScrollView
//           contentContainerStyle={styles.list}
//           showsVerticalScrollIndicator={false}
//         >
//           {filtered.length === 0 ? (
//             <View style={styles.emptyBox}>
//               <Ionicons name="receipt-outline" size={46} color={C.primary} />
//               <Text style={styles.emptyTitle}>No orders found</Text>
//               <Text style={styles.emptySub}>
//                 Customer placed orders will appear here automatically.
//               </Text>
//             </View>
//           ) : (
//             filtered.map((order, orderIndex) => {
//               const products = order.products || order.items || [];
//               const status = order.status || "Processing";
//               const customerName =
//                 order.customer ||
//                 order.customerName ||
//                 order.address?.name ||
//                 "Customer";

//               const customerPhone =
//                 order.customerPhone || order.phone || order.address?.phone || "No phone";

//               const addressText = `${order.address?.line1 || order.address || "Address"}${
//                 order.address?.city ? ` • ${order.address.city}` : ""
//               }`;

//               const orderId = order.id || `ORDER-${orderIndex + 1}`;

//               return (
//                 <View key={String(orderId)} style={styles.card}>
//                   <View style={styles.orderTop}>
//                     <View style={styles.orderInfo}>
//                       <Text style={styles.orderId}>{orderId}</Text>
//                       <Text style={styles.date}>{order.date || "Today"}</Text>
//                     </View>

//                     <View style={styles.amountBox}>
//                       <Text style={styles.amount}>{getAmount(order)}</Text>
//                       <StatusPill status={status} />
//                     </View>
//                   </View>

//                   <View style={styles.customerBox}>
//                     <Ionicons
//                       name="person-circle-outline"
//                       size={28}
//                       color={C.primary}
//                     />

//                     <View style={styles.customerInfo}>
//                       <Text style={styles.customer}>{customerName}</Text>
//                       <Text style={styles.phone}>{customerPhone}</Text>
//                       <Text style={styles.address} numberOfLines={2}>
//                         {addressText}
//                       </Text>
//                     </View>
//                   </View>

//                   <Text style={styles.sectionTitle}>Ordered Products</Text>

//                   {products.length === 0 ? (
//                     <Text style={styles.noProducts}>No product details found.</Text>
//                   ) : (
//                     products.map((item, index) => {
//                       const img = getImageSource(
//                         item?.image ||
//                           item?.coverImage ||
//                           item?.thumbnail ||
//                           item?.images?.[0]
//                       );

//                       const qty = item?.qty || item?.quantity || 1;

//                       return (
//                         <View
//                           key={`${orderId}-${item?.id || index}`}
//                           style={styles.productRow}
//                         >
//                           <View style={styles.productImageBox}>
//                             {img ? (
//                               <Image source={img} style={styles.productImage} />
//                             ) : (
//                               <Ionicons
//                                 name="cube-outline"
//                                 size={24}
//                                 color={C.primary}
//                               />
//                             )}
//                           </View>

//                           <View style={styles.productInfo}>
//                             <Text style={styles.productName} numberOfLines={1}>
//                               {item?.name || item?.title || "Product"}
//                             </Text>

//                             <Text style={styles.productMeta}>
//                               Qty: {qty} • {item?.category || "Category"}
//                             </Text>
//                           </View>

//                           <Text style={styles.productPrice}>
//                             {item?.finalPrice || item?.price || "₹0"}
//                           </Text>
//                         </View>
//                       );
//                     })
//                   )}

//                   <View style={styles.deliveryBox}>
//                     <View style={styles.deliveryInfo}>
//                       <Text style={styles.deliveryLabel}>Delivery Status</Text>
//                       <Text style={styles.deliveryValue} numberOfLines={1}>
//                         {order.deliveryStatus || "Need Delivery"}
//                         {order.deliveryPersonName
//                           ? ` • ${order.deliveryPersonName}`
//                           : ""}
//                       </Text>
//                     </View>

//                     <TouchableOpacity
//                       style={styles.assignBtn}
//                       onPress={() =>
//                         navigation?.navigate?.("SellerDeliveryScreen", { order })
//                       }
//                       activeOpacity={0.85}
//                     >
//                       <Ionicons name="bicycle" size={15} color={C.white} />
//                       <Text style={styles.assignText}>Assign</Text>
//                     </TouchableOpacity>
//                   </View>

//                   {status === "Processing" && (
//                     <View style={styles.actionRow}>
//                       <TouchableOpacity
//                         style={[styles.smallBtn, styles.completeBtn]}
//                         onPress={() => changeStatus(orderId, "Completed")}
//                         activeOpacity={0.85}
//                       >
//                         <Text style={[styles.smallBtnText, { color: C.success }]}>
//                           Accept / Complete
//                         </Text>
//                       </TouchableOpacity>

//                       <TouchableOpacity
//                         style={[styles.smallBtn, styles.cancelBtn]}
//                         onPress={() => changeStatus(orderId, "Cancelled")}
//                         activeOpacity={0.85}
//                       >
//                         <Text style={[styles.smallBtnText, { color: C.danger }]}>
//                           Cancel
//                         </Text>
//                       </TouchableOpacity>
//                     </View>
//                   )}

//                   {status === "Completed" && (
//                     <TouchableOpacity
//                       style={styles.shipBtn}
//                       activeOpacity={0.85}
//                       onPress={() => changeDelivery(orderId, "Delivered")}
//                     >
//                       <Text style={styles.shipText}>Mark Delivered</Text>
//                     </TouchableOpacity>
//                   )}
//                 </View>
//               );
//             })
//           )}
//         </ScrollView>
//       </View>
//     </SafeAreaView>
//   );
// }

// function StatusPill({ status }) {
//   const bg =
//     status === "Completed"
//       ? "#ECFDF5"
//       : status === "Cancelled"
//       ? "#FEF2F2"
//       : "#FFF7ED";

//   const color =
//     status === "Completed"
//       ? C.success
//       : status === "Cancelled"
//       ? C.danger
//       : C.warning;

//   return (
//     <View style={[styles.statusPill, { backgroundColor: bg }]}>
//       <Text style={[styles.statusText, { color }]}>{status}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: C.bg,
//   },

//   root: {
//     flex: 1,
//     backgroundColor: C.bg,
//   },

//   header: {
//     paddingTop: Platform.OS === "android" ? 18 : 8,
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   headerCenter: {
//     alignItems: "center",
//     flex: 1,
//   },

//   iconBtn: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: C.soft,
//     borderWidth: 1,
//     borderColor: C.border,
//   },

//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "900",
//     color: C.text,
//   },

//   headerSub: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: C.muted,
//     marginTop: 2,
//   },

//   searchBox: {
//     marginHorizontal: 18,
//     height: 50,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: C.border,
//     paddingHorizontal: 14,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: C.white,
//   },

//   searchInput: {
//     flex: 1,
//     marginLeft: 8,
//     color: C.text,
//     fontSize: 14,
//     fontWeight: "700",
//     height: "100%",
//   },

//   tabsWrapper: {
//     height: 62,
//     justifyContent: "center",
//     backgroundColor: C.bg,
//   },

//   tabsScroll: {
//     flexGrow: 0,
//   },

//   tabsContent: {
//     paddingHorizontal: 18,
//     gap: 10,
//     alignItems: "center",
//   },

//   tabBtn: {
//     height: 42,
//     paddingHorizontal: 18,
//     borderRadius: 24,
//     backgroundColor: "#F8F8FA",
//     borderWidth: 1,
//     borderColor: "#F1F1F3",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   tabBtnActive: {
//     backgroundColor: C.primary,
//     borderColor: C.primary,
//   },

//   tabText: {
//     fontSize: 13,
//     color: C.muted,
//     fontWeight: "900",
//   },

//   tabTextActive: {
//     color: C.white,
//   },

//   list: {
//     paddingHorizontal: 18,
//     paddingTop: 4,
//     paddingBottom: 120,
//   },

//   card: {
//     backgroundColor: C.white,
//     borderRadius: 22,
//     padding: 14,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: C.border,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 4 },
//   },

//   orderTop: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 12,
//     gap: 10,
//   },

//   orderInfo: {
//     flex: 1,
//   },

//   orderId: {
//     fontSize: 14,
//     fontWeight: "900",
//     color: C.text,
//   },

//   date: {
//     fontSize: 11,
//     color: C.muted,
//     fontWeight: "700",
//     marginTop: 3,
//   },

//   amountBox: {
//     alignItems: "flex-end",
//   },

//   amount: {
//     fontSize: 15,
//     fontWeight: "900",
//     color: C.text,
//   },

//   statusPill: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 999,
//     marginTop: 7,
//   },

//   statusText: {
//     fontSize: 10,
//     fontWeight: "900",
//   },

//   customerBox: {
//     flexDirection: "row",
//     gap: 10,
//     backgroundColor: C.soft,
//     borderRadius: 16,
//     padding: 12,
//     marginBottom: 12,
//   },

//   customerInfo: {
//     flex: 1,
//   },

//   customer: {
//     fontSize: 14,
//     fontWeight: "900",
//     color: C.text,
//   },

//   phone: {
//     fontSize: 12,
//     fontWeight: "800",
//     color: C.primary,
//     marginTop: 2,
//   },

//   address: {
//     fontSize: 11,
//     color: C.muted,
//     marginTop: 3,
//     fontWeight: "700",
//     lineHeight: 16,
//   },

//   sectionTitle: {
//     fontSize: 13,
//     fontWeight: "900",
//     color: C.text,
//     marginBottom: 8,
//   },

//   noProducts: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: C.muted,
//     marginBottom: 10,
//   },

//   productRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//     backgroundColor: "#FAFAFA",
//     borderRadius: 14,
//     padding: 9,
//   },

//   productImageBox: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     backgroundColor: C.soft,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 10,
//     overflow: "hidden",
//   },

//   productImage: {
//     width: "100%",
//     height: "100%",
//   },

//   productInfo: {
//     flex: 1,
//   },

//   productName: {
//     fontSize: 13,
//     fontWeight: "900",
//     color: C.text,
//   },

//   productMeta: {
//     fontSize: 11,
//     color: C.muted,
//     fontWeight: "700",
//     marginTop: 2,
//   },

//   productPrice: {
//     fontSize: 12,
//     fontWeight: "900",
//     color: C.primary,
//     marginLeft: 8,
//   },

//   deliveryBox: {
//     marginTop: 6,
//     borderRadius: 16,
//     backgroundColor: "#FAFAFA",
//     padding: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#F1F5F9",
//     gap: 10,
//   },

//   deliveryInfo: {
//     flex: 1,
//   },

//   deliveryLabel: {
//     fontSize: 11,
//     color: C.muted,
//     fontWeight: "800",
//   },

//   deliveryValue: {
//     fontSize: 12.5,
//     color: C.text,
//     fontWeight: "900",
//     marginTop: 3,
//   },

//   assignBtn: {
//     height: 36,
//     backgroundColor: C.primary,
//     paddingHorizontal: 13,
//     borderRadius: 18,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   assignText: {
//     color: C.white,
//     fontWeight: "900",
//     fontSize: 12,
//     marginLeft: 5,
//   },

//   actionRow: {
//     flexDirection: "row",
//     gap: 10,
//     marginTop: 12,
//   },

//   smallBtn: {
//     flex: 1,
//     height: 42,
//     borderRadius: 14,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//   },

//   completeBtn: {
//     backgroundColor: "#ECFDF5",
//     borderColor: "#BBF7D0",
//   },

//   cancelBtn: {
//     backgroundColor: "#FEF2F2",
//     borderColor: "#FECACA",
//   },

//   smallBtnText: {
//     fontSize: 12,
//     fontWeight: "900",
//   },

//   shipBtn: {
//     marginTop: 12,
//     height: 42,
//     borderRadius: 14,
//     backgroundColor: C.primary,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   shipText: {
//     color: C.white,
//     fontSize: 13,
//     fontWeight: "900",
//   },

//   emptyBox: {
//     marginTop: 60,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: C.white,
//     borderWidth: 1,
//     borderColor: C.border,
//     borderRadius: 22,
//     padding: 32,
//   },

//   emptyTitle: {
//     color: C.text,
//     fontSize: 16,
//     fontWeight: "900",
//     marginTop: 10,
//   },

//   emptySub: {
//     color: C.muted,
//     fontSize: 12,
//     fontWeight: "700",
//     marginTop: 4,
//     textAlign: "center",
//     lineHeight: 18,
//   },
// });



























// screens/seller/SellerOrdersScreen.js

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
  Image,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useShop } from "../../context/ShopContext";

const C = {
  primary: "#082843",
  white: "#FFFFFF",
  bg: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  border: "#E5E7EB",
  soft: "#F8FAFC",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#2563EB",
};

const getImageSource = (image) => {
  if (!image) return null;
  if (typeof image === "string") return { uri: image };
  return image;
};

const getProductImage = (item) =>
  item?.image ||
  item?.coverImage ||
  item?.thumbnail ||
  item?.images?.[0] ||
  item?.productImages?.[0];

const getAmount = (order) => {
  if (order?.price) return order.price;
  if (order?.totalAmount) return `₹${order.totalAmount}`;
  if (order?.amount) return order.amount;
  return "₹0";
};

const getProductKey = (item, index) =>
  String(item?.id || item?.productId || item?.name || index);

export default function SellerOrdersScreen({ navigation }) {
  const shop = useShop() || {};

  const {
    orders = [],
    returnRequests = [],
    updateOrderStatus = () => {},
    updateDeliveryStatus = () => {},
  } = shop;

  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");

  const tabs = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

  const counts = useMemo(() => {
    return {
      All: orders.length,
      Processing: orders.filter((o) => (o.status || "Processing") === "Processing").length,
      Shipped: orders.filter((o) => o.status === "Shipped").length,
      Delivered: orders.filter((o) => o.status === "Delivered").length,
      Cancelled: orders.filter((o) => o.status === "Cancelled").length,
    };
  }, [orders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return orders.filter((order) => {
      const products = order.products || order.items || [];
      const productText = products
        .map((p) => p?.name || p?.title || "")
        .join(" ")
        .toLowerCase();

      const status = order.status || "Processing";
      const byTab = tab === "All" || status === tab;

      const bySearch =
        !q ||
        String(order.id || "").toLowerCase().includes(q) ||
        String(order.customer || "").toLowerCase().includes(q) ||
        String(order.customerName || "").toLowerCase().includes(q) ||
        String(order.title || "").toLowerCase().includes(q) ||
        productText.includes(q);

      return byTab && bySearch;
    });
  }, [orders, tab, search]);

  const changeStatus = (orderId, status) => {
    updateOrderStatus(orderId, status);

    if (status === "Shipped") {
      updateDeliveryStatus(orderId, "Shipped");
    }

    if (status === "Delivered") {
      updateDeliveryStatus(orderId, "Delivered");
    }
  };

  const getReturnForProduct = (orderId, productName) => {
    return returnRequests.find(
      (r) =>
        String(r.orderId) === String(orderId) &&
        String(r.product || "").toLowerCase() ===
          String(productName || "").toLowerCase()
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        <StatusBar barStyle="dark-content" backgroundColor={C.white} />

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation?.goBack?.()}
            style={styles.iconBtn}
            activeOpacity={0.85}
          >
            <Ionicons name="chevron-back" size={24} color={C.text} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Seller Orders</Text>
            <Text style={styles.headerSub}>{orders.length} total orders</Text>
          </View>

          <TouchableOpacity
            style={styles.iconBtn}
            activeOpacity={0.85}
            onPress={() => navigation?.navigate?.("SellerNotificationScreen")}
          >
            <Ionicons name="notifications-outline" size={21} color={C.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={C.muted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search order, customer, product"
            placeholderTextColor={C.muted}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.tabsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsScroll}
            contentContainerStyle={styles.tabsContent}
          >
            {tabs.map((item) => {
              const active = tab === item;

              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.tabBtn, active && styles.tabBtnActive]}
                  onPress={() => setTab(item)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.tabText, active && styles.tabTextActive]}>
                    {item} ({counts[item] || 0})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {filtered.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="receipt-outline" size={46} color={C.primary} />
              <Text style={styles.emptyTitle}>No orders found</Text>
              <Text style={styles.emptySub}>
                Customer placed orders will appear here automatically.
              </Text>
            </View>
          ) : (
            filtered.map((order, orderIndex) => {
              const products = order.products || order.items || [];
              const status = order.status || "Processing";
              const customerName =
                order.customer ||
                order.customerName ||
                order.address?.name ||
                "Customer";

              const customerPhone =
                order.customerPhone ||
                order.phone ||
                order.address?.phone ||
                "No phone";

              const addressText =
                typeof order.address === "string"
                  ? order.address
                  : `${order.address?.line1 || "Address"}${
                      order.address?.city ? ` • ${order.address.city}` : ""
                    }`;

              const orderId = order.id || `ORDER-${orderIndex + 1}`;

              return (
                <View key={String(orderId)} style={styles.card}>
                  <View style={styles.orderTop}>
                    <View style={styles.orderInfo}>
                      <Text style={styles.orderId}>{orderId}</Text>
                      <Text style={styles.date}>{order.date || "Today"}</Text>
                    </View>

                    <View style={styles.amountBox}>
                      <Text style={styles.amount}>{getAmount(order)}</Text>
                      <StatusPill status={status} />
                    </View>
                  </View>

                  <View style={styles.customerBox}>
                    <Ionicons
                      name="person-circle-outline"
                      size={30}
                      color={C.primary}
                    />

                    <View style={styles.customerInfo}>
                      <Text style={styles.customer}>{customerName}</Text>
                      <Text style={styles.phone}>{customerPhone}</Text>
                      <Text style={styles.address} numberOfLines={2}>
                        {addressText}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.sectionTitle}>Ordered Products</Text>

                  {products.length === 0 ? (
                    <Text style={styles.noProducts}>
                      No product details found.
                    </Text>
                  ) : (
                    products.map((item, index) => {
                      const img = getImageSource(getProductImage(item));
                      const qty = item?.qty || item?.quantity || 1;
                      const productName = item?.name || item?.title || "Product";
                      const productKey = getProductKey(item, index);
                      const productReview =
                        item?.customerReview ||
                        item?.review ||
                        order?.reviews?.[productKey];

                      const productReturn =
                        item?.returnRequest ||
                        order?.returnRequests?.[productKey] ||
                        getReturnForProduct(orderId, productName);

                      const reviewImages =
                        productReview?.images ||
                        productReview?.reviewImages ||
                        [];

                      return (
                        <View key={`${orderId}-${productKey}`} style={styles.productCard}>
                          <View style={styles.productRow}>
                            <View style={styles.productImageBox}>
                              {img ? (
                                <Image source={img} style={styles.productImage} />
                              ) : (
                                <Ionicons
                                  name="cube-outline"
                                  size={25}
                                  color={C.primary}
                                />
                              )}
                            </View>

                            <View style={styles.productInfo}>
                              <Text style={styles.productName} numberOfLines={2}>
                                {productName}
                              </Text>

                              <Text style={styles.productMeta}>
                                Qty: {qty} • {item?.category || "Category"}
                              </Text>
                            </View>

                            <Text style={styles.productPrice}>
                              {item?.finalPrice || item?.price || "₹0"}
                            </Text>
                          </View>

                          {status === "Delivered" && (
                            <View style={styles.afterDeliveryBox}>
                              <Text style={styles.afterTitle}>
                                After Delivery Activity
                              </Text>

                              {productReturn ? (
                                <View style={styles.returnBox}>
                                  <View style={styles.rowCenter}>
                                    <Ionicons
                                      name="return-up-back-outline"
                                      size={16}
                                      color={C.warning}
                                    />
                                    <Text style={styles.returnTitle}>
                                      Return requested
                                    </Text>
                                  </View>

                                  <Text style={styles.returnReason}>
                                    Reason:{" "}
                                    {productReturn.reason ||
                                      productReturn.returnReason ||
                                      "No reason added"}
                                  </Text>

                                  <Text style={styles.returnStatus}>
                                    Status: {productReturn.status || "Pending"}
                                  </Text>
                                </View>
                              ) : (
                                <View style={styles.noActivityBox}>
                                  <Ionicons
                                    name="checkmark-circle-outline"
                                    size={16}
                                    color={C.success}
                                  />
                                  <Text style={styles.noActivityText}>
                                    No return request for this product.
                                  </Text>
                                </View>
                              )}

                              {productReview ? (
                                <View style={styles.reviewBox}>
                                  <View style={styles.rowCenter}>
                                    <Ionicons
                                      name="star"
                                      size={16}
                                      color="#F59E0B"
                                    />
                                    <Text style={styles.reviewTitle}>
                                      Customer Review
                                    </Text>
                                  </View>

                                  <Text style={styles.ratingText}>
                                    {"★".repeat(Number(productReview.rating || 0))}
                                    {"☆".repeat(
                                      Math.max(5 - Number(productReview.rating || 0), 0)
                                    )}
                                  </Text>

                                  <Text style={styles.reviewComment}>
                                    {productReview.text ||
                                      productReview.comment ||
                                      "No comment added"}
                                  </Text>

                                  {reviewImages.length > 0 && (
                                    <ScrollView
                                      horizontal
                                      showsHorizontalScrollIndicator={false}
                                      style={{ marginTop: 8 }}
                                    >
                                      {reviewImages.map((uri, imgIndex) => (
                                        <Image
                                          key={`${uri}-${imgIndex}`}
                                          source={getImageSource(uri)}
                                          style={styles.reviewImage}
                                        />
                                      ))}
                                    </ScrollView>
                                  )}
                                </View>
                              ) : (
                                <View style={styles.noActivityBox}>
                                  <Ionicons
                                    name="star-outline"
                                    size={16}
                                    color={C.muted}
                                  />
                                  <Text style={styles.noActivityText}>
                                    Customer has not reviewed yet.
                                  </Text>
                                </View>
                              )}
                            </View>
                          )}
                        </View>
                      );
                    })
                  )}

                  <View style={styles.deliveryBox}>
                    <View style={styles.deliveryInfo}>
                      <Text style={styles.deliveryLabel}>Delivery Status</Text>
                      <Text style={styles.deliveryValue} numberOfLines={1}>
                        {order.deliveryStatus || status}
                        {order.deliveryPersonName
                          ? ` • ${order.deliveryPersonName}`
                          : ""}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.assignBtn}
                      onPress={() =>
                        navigation?.navigate?.("SellerDeliveryScreen", { order })
                      }
                      activeOpacity={0.85}
                    >
                      <Ionicons name="bicycle" size={15} color={C.white} />
                      <Text style={styles.assignText}>Assign</Text>
                    </TouchableOpacity>
                  </View>

                  {status === "Processing" && (
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={[styles.smallBtn, styles.shipBtnOutline]}
                        onPress={() => changeStatus(orderId, "Shipped")}
                        activeOpacity={0.85}
                      >
                        <Text style={[styles.smallBtnText, { color: C.info }]}>
                          Mark Shipped
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.smallBtn, styles.cancelBtn]}
                        onPress={() => changeStatus(orderId, "Cancelled")}
                        activeOpacity={0.85}
                      >
                        <Text style={[styles.smallBtnText, { color: C.danger }]}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {status === "Shipped" && (
                    <TouchableOpacity
                      style={styles.deliveredBtn}
                      activeOpacity={0.85}
                      onPress={() => changeStatus(orderId, "Delivered")}
                    >
                      <Ionicons name="checkmark-circle" size={18} color={C.white} />
                      <Text style={styles.deliveredText}>Mark Delivered</Text>
                    </TouchableOpacity>
                  )}

                  {status === "Delivered" && (
                    <View style={styles.deliveredDoneBox}>
                      <Ionicons
                        name="checkmark-done-circle"
                        size={18}
                        color={C.success}
                      />
                      <Text style={styles.deliveredDoneText}>
                        Delivered. Customer can now review or request return.
                      </Text>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function StatusPill({ status }) {
  const bg =
    status === "Delivered"
      ? "#ECFDF5"
      : status === "Shipped"
      ? "#EFF6FF"
      : status === "Cancelled"
      ? "#FEF2F2"
      : "#FFF7ED";

  const color =
    status === "Delivered"
      ? C.success
      : status === "Shipped"
      ? C.info
      : status === "Cancelled"
      ? C.danger
      : C.warning;

  return (
    <View style={[styles.statusPill, { backgroundColor: bg }]}>
      <Text style={[styles.statusText, { color }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  root: { flex: 1, backgroundColor: C.bg },

  header: {
    paddingTop: Platform.OS === "android" ? 18 : 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerCenter: { alignItems: "center", flex: 1 },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.soft,
    borderWidth: 1,
    borderColor: C.border,
  },
  headerTitle: { fontSize: 18, fontWeight: "900", color: C.text },
  headerSub: {
    fontSize: 11,
    fontWeight: "700",
    color: C.muted,
    marginTop: 2,
  },

  searchBox: {
    marginHorizontal: 18,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: C.text,
    fontSize: 14,
    fontWeight: "700",
    height: "100%",
  },

  tabsWrapper: {
    height: 62,
    justifyContent: "center",
    backgroundColor: C.bg,
  },
  tabsScroll: { flexGrow: 0 },
  tabsContent: {
    paddingHorizontal: 18,
    gap: 10,
    alignItems: "center",
  },
  tabBtn: {
    height: 42,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: "#F8F8FA",
    borderWidth: 1,
    borderColor: "#F1F1F3",
    alignItems: "center",
    justifyContent: "center",
  },
  tabBtnActive: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  tabText: { fontSize: 13, color: C.muted, fontWeight: "900" },
  tabTextActive: { color: C.white },

  list: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: C.white,
    borderRadius: 22,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  orderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 10,
  },
  orderInfo: { flex: 1 },
  orderId: { fontSize: 14, fontWeight: "900", color: C.text },
  date: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "700",
    marginTop: 3,
  },
  amountBox: { alignItems: "flex-end" },
  amount: { fontSize: 15, fontWeight: "900", color: C.text },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginTop: 7,
  },
  statusText: { fontSize: 10, fontWeight: "900" },

  customerBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: C.soft,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  customerInfo: { flex: 1 },
  customer: { fontSize: 14, fontWeight: "900", color: C.text },
  phone: {
    fontSize: 12,
    fontWeight: "800",
    color: C.primary,
    marginTop: 2,
  },
  address: {
    fontSize: 11,
    color: C.muted,
    marginTop: 3,
    fontWeight: "700",
    lineHeight: 16,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: C.text,
    marginBottom: 8,
  },
  noProducts: {
    fontSize: 12,
    fontWeight: "700",
    color: C.muted,
    marginBottom: 10,
  },

  productCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    marginBottom: 12,
    padding: 9,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImageBox: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.border,
  },
  productImage: { width: "100%", height: "100%" },
  productInfo: { flex: 1 },
  productName: {
    fontSize: 13,
    fontWeight: "900",
    color: C.text,
    lineHeight: 18,
  },
  productMeta: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "700",
    marginTop: 2,
  },
  productPrice: {
    fontSize: 12,
    fontWeight: "900",
    color: C.primary,
    marginLeft: 8,
  },

  afterDeliveryBox: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 10,
    gap: 8,
  },
  afterTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: C.text,
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  returnBox: {
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  returnTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "#B45309",
  },
  returnReason: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "700",
    color: C.text,
    lineHeight: 17,
  },
  returnStatus: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "900",
    color: "#B45309",
  },
  reviewBox: {
    backgroundColor: "#FFF7ED",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#FED7AA",
  },
  reviewTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: C.text,
  },
  ratingText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "900",
    color: "#F59E0B",
  },
  reviewComment: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "700",
    color: C.text,
    lineHeight: 17,
  },
  reviewImage: {
    width: 58,
    height: 58,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: C.white,
  },
  noActivityBox: {
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 9,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  noActivityText: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: "700",
    color: C.muted,
  },

  deliveryBox: {
    marginTop: 6,
    borderRadius: 16,
    backgroundColor: "#FAFAFA",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 10,
  },
  deliveryInfo: { flex: 1 },
  deliveryLabel: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "800",
  },
  deliveryValue: {
    fontSize: 12.5,
    color: C.text,
    fontWeight: "900",
    marginTop: 3,
  },
  assignBtn: {
    height: 36,
    backgroundColor: C.primary,
    paddingHorizontal: 13,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  assignText: {
    color: C.white,
    fontWeight: "900",
    fontSize: 12,
    marginLeft: 5,
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  smallBtn: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  shipBtnOutline: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  cancelBtn: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  smallBtnText: {
    fontSize: 12,
    fontWeight: "900",
  },
  deliveredBtn: {
    marginTop: 12,
    height: 42,
    borderRadius: 14,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },
  deliveredText: {
    color: C.white,
    fontSize: 13,
    fontWeight: "900",
  },
  deliveredDoneBox: {
    marginTop: 12,
    padding: 11,
    borderRadius: 14,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  deliveredDoneText: {
    flex: 1,
    color: "#15803D",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 17,
  },

  emptyBox: {
    marginTop: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 22,
    padding: 32,
  },
  emptyTitle: {
    color: C.text,
    fontSize: 16,
    fontWeight: "900",
    marginTop: 10,
  },
  emptySub: {
    color: C.muted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
    textAlign: "center",
    lineHeight: 18,
  },
});
