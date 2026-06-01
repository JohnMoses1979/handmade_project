
// // // src/screens/admin/ManageOrdersScreen.js
// // import React, { useState } from "react";
// // import {
// //   View, Text, StyleSheet, FlatList, TouchableOpacity,
// //   SafeAreaView, TextInput,
// // } from "react-native";
// // import { Ionicons } from "@expo/vector-icons";

// // const ADMIN = "#145DA0";

// // const ORDERS = [
// //   { id: "#ORD-1001", customer: "John Doe", date: "May 29, 2024", amount: "$125.50", status: "Delivered" },
// //   { id: "#ORD-1002", customer: "Alice Smith", date: "May 29, 2024", amount: "$89.99", status: "Processing" },
// //   { id: "#ORD-1003", customer: "Bob Johnson", date: "May 29, 2024", amount: "$230.00", status: "Shipped" },
// //   { id: "#ORD-1004", customer: "Emma Brown", date: "May 28, 2024", amount: "$75.25", status: "Pending" },
// //   { id: "#ORD-1005", customer: "Michael Lee", date: "May 27, 2024", amount: "$110.00", status: "Delivered" },
// //   { id: "#ORD-1006", customer: "Sarah Davis", date: "May 27, 2024", amount: "$198.00", status: "Shipped" },
// //   { id: "#ORD-1007", customer: "James Wilson", date: "May 26, 2024", amount: "$56.00", status: "Pending" },
// //   { id: "#ORD-1008", customer: "Olivia Taylor", date: "May 26, 2024", amount: "$342.00", status: "Delivered" },
// // ];

// // const TABS = ["All", "Pending", "Processing", "Shipped", "Delivered"];

// // const STATUS_COLORS = {
// //   Delivered: { bg: "#ECFDF5", text: "#10B981" },
// //   Processing: { bg: "#FFF7ED", text: "#F59E0B" },
// //   Shipped: { bg: "#EFF6FF", text: "#3B82F6" },
// //   Pending: { bg: "#FEF2F2", text: "#EF4444" },
// // };

// // export default function ManageOrdersScreen({ navigation }) {
// //   const [activeTab, setActiveTab] = useState("All");
// //   const [search, setSearch] = useState("");

// //   const filtered = ORDERS.filter((o) => {
// //     const matchTab = activeTab === "All" || o.status === activeTab;
// //     const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
// //       o.customer.toLowerCase().includes(search.toLowerCase());
// //     return matchTab && matchSearch;
// //   });

// //   const renderOrder = ({ item }) => {
// //     const sc = STATUS_COLORS[item.status];
// //     return (
// //       <TouchableOpacity style={styles.orderCard} onPress={() => navigation.navigate("AdminCommission", { order: item })}>
// //         <View style={styles.orderLeft}>
// //           <Text style={styles.orderId}>{item.id}</Text>
// //           <Text style={styles.orderCustomer}>{item.customer}</Text>
// //           <Text style={styles.orderDate}>{item.date}</Text>
// //         </View>
// //         <View style={styles.orderRight}>
// //           <Text style={styles.orderAmt}>{item.amount}</Text>
// //           <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
// //             <Text style={[styles.statusText, { color: sc.text }]}>{item.status}</Text>
// //           </View>
// //         </View>
// //       </TouchableOpacity>
// //     );
// //   };

// //   return (
// //     <SafeAreaView style={styles.safe}>
// //       {/* Header */}
// //       <View style={styles.header}>
// //         <Text style={styles.headerTitle}>Manage Orders</Text>
// //         <TouchableOpacity style={styles.searchBtn} onPress={() => {}}>
// //           <Ionicons name="search" size={22} color="#1F2937" />
// //         </TouchableOpacity>
// //       </View>

// //       {/* Search */}
// //       <View style={styles.searchRow}>
// //         <Ionicons name="search-outline" size={16} color="#9CA3AF" style={{ marginRight: 8 }} />
// //         <TextInput
// //           style={styles.searchInput}
// //           placeholder="Search by order ID or customer..."
// //           placeholderTextColor="#9CA3AF"
// //           value={search}
// //           onChangeText={setSearch}
// //         />
// //         {search ? (
// //           <TouchableOpacity onPress={() => setSearch("")}>
// //             <Ionicons name="close-circle" size={16} color="#9CA3AF" />
// //           </TouchableOpacity>
// //         ) : null}
// //       </View>

// //       {/* Tabs */}
// //       <View style={styles.tabsWrapper}>
// //         <FlatList
// //           horizontal
// //           showsHorizontalScrollIndicator={false}
// //           data={TABS}
// //           keyExtractor={(t) => t}
// //           contentContainerStyle={styles.tabs}
// //           renderItem={({ item }) => (
// //             <TouchableOpacity
// //               style={[styles.tab, activeTab === item && styles.tabActive]}
// //               onPress={() => setActiveTab(item)}
// //             >
// //               <Text style={[styles.tabText, activeTab === item && styles.tabTextActive]}>{item}</Text>
// //             </TouchableOpacity>
// //           )}
// //         />
// //       </View>

// //       {/* List */}
// //       <FlatList
// //         data={filtered}
// //         keyExtractor={(o) => o.id}
// //         renderItem={renderOrder}
// //         contentContainerStyle={styles.list}
// //         ListEmptyComponent={<Text style={styles.empty}>No orders found.</Text>}
// //       />

// //       {/* Footer CTA */}
// //       <View style={styles.footer}>
// //         <TouchableOpacity style={styles.footerBtn}>
// //           <Text style={styles.footerBtnText}>View All Orders</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   safe: { flex: 1, backgroundColor: "#F5F8FF" },
// //   header: {
// //     flexDirection: "row", alignItems: "center", justifyContent: "space-between",
// //     paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10, backgroundColor: "#fff",
// //   },
// //   headerTitle: { fontSize: 20, fontWeight: "800", color: "#1F2937" },
// //   searchBtn: { padding: 4 },
// //   searchRow: {
// //     flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
// //     marginHorizontal: 16, marginVertical: 10, borderRadius: 14, paddingHorizontal: 14,
// //     paddingVertical: 10, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05,
// //     shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
// //   },
// //   searchInput: { flex: 1, fontSize: 13, color: "#1F2937" },
// //   tabsWrapper: { marginBottom: 4 },
// //   tabs: { paddingHorizontal: 16, gap: 8 },
// //   tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#E5E7EB" },
// //   tabActive: { backgroundColor: ADMIN },
// //   tabText: { fontSize: 13, color: "#6B7280", fontWeight: "600" },
// //   tabTextActive: { color: "#fff", fontWeight: "700" },
// //   list: { padding: 16, gap: 12, paddingBottom: 100 },
// //   orderCard: {
// //     backgroundColor: "#fff", borderRadius: 16, padding: 16,
// //     flexDirection: "row", justifyContent: "space-between", alignItems: "center",
// //     elevation: 3, shadowColor: ADMIN, shadowOpacity: 0.07, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
// //   },
// //   orderLeft: { flex: 1 },
// //   orderId: { fontSize: 14, fontWeight: "800", color: "#1F2937" },
// //   orderCustomer: { fontSize: 12, color: "#6B7280", marginTop: 2 },
// //   orderDate: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },
// //   orderRight: { alignItems: "flex-end", gap: 8 },
// //   orderAmt: { fontSize: 15, fontWeight: "900", color: "#1F2937" },
// //   statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
// //   statusText: { fontSize: 11, fontWeight: "700" },
// //   empty: { textAlign: "center", color: "#9CA3AF", marginTop: 40, fontSize: 14 },
// //   footer: { position: "absolute", bottom: 24, left: 20, right: 20 },
// //   footerBtn: { backgroundColor: ADMIN, borderRadius: 16, height: 52, alignItems: "center", justifyContent: "center" },
// //   footerBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },
// // });























// // src/screens/admin/ManageOrdersScreen.js
// import React, { useState, useMemo } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   SafeAreaView,
//   TextInput,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useShop } from "../../context/ShopContext";

// const ADMIN = "#145DA0";
// const TABS = ["All", "Pending", "Processing", "Shipped", "Delivered"];

// const STATUS_COLORS = {
//   Delivered: { bg: "#ECFDF5", text: "#10B981" },
//   Processing: { bg: "#FFF7ED", text: "#F59E0B" },
//   Shipped: { bg: "#EFF6FF", text: "#3B82F6" },
//   Pending: { bg: "#FEF2F2", text: "#EF4444" },
// };

// export default function ManageOrdersScreen({ navigation }) {
//   const [activeTab, setActiveTab] = useState("All");
//   const [search, setSearch] = useState("");
//   const { orders } = useShop();

//   const filtered = useMemo(() => {
//     return orders.filter((o) => {
//       const matchTab = activeTab === "All" || o.status === activeTab;
//       const matchSearch =
//         (o.id || "").toLowerCase().includes(search.toLowerCase()) ||
//         (o.customer || "").toLowerCase().includes(search.toLowerCase());
//       return matchTab && matchSearch;
//     });
//   }, [orders, activeTab, search]);

//   const renderOrder = ({ item }) => {
//     const sc = STATUS_COLORS[item.status] || { bg: "#F3F4F6", text: "#6B7280" };
//     return (
//       <TouchableOpacity
//         style={styles.orderCard}
//         onPress={() => navigation.navigate("AdminCommission", { order: item })}
//       >
//         <View style={styles.orderLeft}>
//           <Text style={styles.orderId}>{item.id}</Text>
//           <Text style={styles.orderCustomer}>{item.customer}</Text>
//           <Text style={styles.orderDate}>{item.date || "Today"}</Text>
//         </View>
//         <View style={styles.orderRight}>
//           <Text style={styles.orderAmt}>{item.price}</Text>
//           <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
//             <Text style={[styles.statusText, { color: sc.text }]}>{item.status}</Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       {/* Header — added back button */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#1F2937" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Manage Orders</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       {/* Search */}
//       <View style={styles.searchRow}>
//         <Ionicons name="search-outline" size={16} color="#9CA3AF" style={{ marginRight: 8 }} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search by order ID or customer..."
//           placeholderTextColor="#9CA3AF"
//           value={search}
//           onChangeText={setSearch}
//         />
//         {search ? (
//           <TouchableOpacity onPress={() => setSearch("")}>
//             <Ionicons name="close-circle" size={16} color="#9CA3AF" />
//           </TouchableOpacity>
//         ) : null}
//       </View>

//       {/* Tabs */}
//       <View style={styles.tabsWrapper}>
//         <FlatList
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           data={TABS}
//           keyExtractor={(t) => t}
//           contentContainerStyle={styles.tabs}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={[styles.tab, activeTab === item && styles.tabActive]}
//               onPress={() => setActiveTab(item)}
//             >
//               <Text style={[styles.tabText, activeTab === item && styles.tabTextActive]}>
//                 {item}
//               </Text>
//             </TouchableOpacity>
//           )}
//         />
//       </View>

//       {/* List */}
//       <FlatList
//         data={filtered}
//         keyExtractor={(o) => o.id}
//         renderItem={renderOrder}
//         contentContainerStyle={styles.list}
//         ListEmptyComponent={<Text style={styles.empty}>No orders found.</Text>}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: "#F5F8FF" },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     paddingTop: 16,
//     paddingBottom: 10,
//     backgroundColor: "#fff",
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   headerTitle: { fontSize: 20, fontWeight: "800", color: "#1F2937", flex: 1, textAlign: "center" },
//   searchRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     marginHorizontal: 16,
//     marginVertical: 10,
//     borderRadius: 14,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   searchInput: { flex: 1, fontSize: 13, color: "#1F2937" },
//   tabsWrapper: { marginBottom: 4 },
//   tabs: { paddingHorizontal: 16, gap: 8 },
//   tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#E5E7EB" },
//   tabActive: { backgroundColor: ADMIN },
//   tabText: { fontSize: 13, color: "#6B7280", fontWeight: "600" },
//   tabTextActive: { color: "#fff", fontWeight: "700" },
//   list: { padding: 16, gap: 12, paddingBottom: 32 },
//   orderCard: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 16,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     elevation: 3,
//     shadowColor: ADMIN,
//     shadowOpacity: 0.07,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   orderLeft: { flex: 1 },
//   orderId: { fontSize: 14, fontWeight: "800", color: "#1F2937" },
//   orderCustomer: { fontSize: 12, color: "#6B7280", marginTop: 2 },
//   orderDate: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },
//   orderRight: { alignItems: "flex-end", gap: 8 },
//   orderAmt: { fontSize: 15, fontWeight: "900", color: "#1F2937" },
//   statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
//   statusText: { fontSize: 11, fontWeight: "700" },
//   empty: { textAlign: "center", color: "#9CA3AF", marginTop: 40, fontSize: 14 },
// });




























// src/screens/admin/ManageOrdersScreen.js
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useShop } from "../../context/ShopContext";

const C = {
  primary: "#0e3243",
  accent: "#1a9e6e",
  accentOrange: "#f5a623",
  white: "#FFFFFF",
  bg: "#f4f6f9",
  card: "#FFFFFF",
  text: "#0e3243",
  muted: "#7a93a0",
  border: "#e2eaf0",
  red: "#e74c3c",
  green: "#1a9e6e",
};

const statusColor = (s) => {
  if (s === "Delivered") return C.green;
  if (s === "Processing") return C.accentOrange;
  if (s === "Cancelled") return C.red;
  if (s === "Refunded") return "#9c27b0";
  return C.muted;
};

const statusBg = (s) => {
  if (s === "Delivered") return "#e8f5e9";
  if (s === "Processing") return "#fff8e1";
  if (s === "Cancelled") return "#fdecea";
  if (s === "Refunded") return "#f3e5f5";
  return "#f0f4f8";
};

export default function ManageOrdersScreen({ navigation }) {
  const { orders = [], cleanPrice } = useShop();
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const filters = ["All", "Processing", "Delivered", "Cancelled", "Refunded"];

  const realOrders = useMemo(
    () =>
      orders.map((order) => ({
        ...order,
        total: cleanPrice(order.totalAmount || order.total || order.price),
        product: order.title || order.products?.[0]?.name || "Product Order",
        customer: order.customer || order.customerName || "Customer",
        date: order.date || (order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN") : ""),
      })),
    [orders, cleanPrice]
  );

  const filtered = realOrders.filter((o) => {
    const matchFilter = activeFilter === "All" || o.status === activeFilter;
    const matchSearch =
      String(o.id || "").toLowerCase().includes(search.toLowerCase()) ||
      String(o.customer || "").toLowerCase().includes(search.toLowerCase()) ||
      String(o.product || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={C.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orders</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="search-outline" size={20} color={C.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="funnel-outline" size={20} color={C.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={16} color={C.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search orders, customers..."
          placeholderTextColor={C.muted}
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={16} color={C.muted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, activeFilter === f && styles.filterBtnActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {filtered.map((o) => (
          <TouchableOpacity
            key={o.id}
            style={styles.orderCard}
            onPress={() => navigation.navigate("OrderDetail", { order: o })}
            activeOpacity={0.8}
          >
            <View style={styles.orderTop}>
              <View style={styles.orderIcon}>
                <Ionicons name="receipt-outline" size={18} color={C.primary} />
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.orderId}>#{o.id}</Text>
                <Text style={styles.orderDate}>{o.date}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusBg(o.status) }]}>
                <Text style={[styles.statusText, { color: statusColor(o.status) }]}>{o.status}</Text>
              </View>
            </View>
            <View style={styles.orderDivider} />
            <View style={styles.orderBottom}>
              <View>
                <Text style={styles.customerLabel}>Customer</Text>
                <Text style={styles.customerName}>{o.customer}</Text>
                <Text style={styles.productName}>{o.product}</Text>
              </View>
              <Text style={styles.orderTotal}>₹{o.total.toLocaleString()}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyWrap}>
            <Ionicons name="receipt-outline" size={60} color={C.muted} />
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.primary },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: C.primary,
  },
  headerTitle: { color: C.white, fontSize: 18, fontWeight: "700", flex: 1, textAlign: "center" },
  headerActions: { flexDirection: "row", gap: 8 },
  headerBtn: { padding: 2 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.card,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 13, color: C.text },
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: C.bg,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  filterBtnActive: { backgroundColor: C.primary, borderColor: C.primary },
  filterText: { fontSize: 12, color: C.muted, fontWeight: "600" },
  filterTextActive: { color: C.white, fontWeight: "800" },
  scroll: { flex: 1, backgroundColor: C.bg },
  orderCard: {
    backgroundColor: C.card,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  orderIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  orderInfo: { flex: 1 },
  orderId: { fontSize: 13, fontWeight: "800", color: C.text },
  orderDate: { fontSize: 10, color: C.muted, marginTop: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: "700" },
  orderDivider: { height: 1, backgroundColor: C.border, marginVertical: 10 },
  orderBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  customerLabel: { fontSize: 10, color: C.muted },
  customerName: { fontSize: 13, fontWeight: "700", color: C.text },
  productName: { fontSize: 11, color: C.muted, marginTop: 1 },
  orderTotal: { fontSize: 16, fontWeight: "800", color: C.primary },
  emptyWrap: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, color: C.muted, fontWeight: "600" },
});
