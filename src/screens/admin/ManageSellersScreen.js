

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
import { showAlert } from "../../utils/showAlert";
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

const statusColor = (s) => (s === "Active" ? C.green : C.red);
const statusBg = (s) => (s === "Active" ? "#e8f5e9" : "#fdecea");

export default function ManageSellersScreen({ navigation }) {
  const {
    approvedSellers = [],
    rejectedSellers = [],
    pendingSellers = [],
    sellerProducts = [],
    orders = [],
    cleanPrice,
  } = useShop();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Active", "Suspended"];

  const realSellers = useMemo(() => {
    const source = [...approvedSellers, ...rejectedSellers];
    return source.map((seller) => {
      const sellerId = String(seller.id ?? "");
      const sellerOrders = orders.filter((order) =>
        (order.products || []).some((item) => String(item.sellerId ?? "") === sellerId)
      );
      const sales = sellerOrders.reduce((sum, order) => {
        const sellerLineTotal = (order.products || []).reduce((lineSum, item) => {
          if (String(item.sellerId ?? "") !== sellerId) return lineSum;
          return lineSum + cleanPrice(item.finalPrice || item.price) * Number(item.qty || item.quantity || 1);
        }, 0);
        return sum + sellerLineTotal;
      }, 0);
      const products = sellerProducts.filter((product) => String(product.sellerId ?? "") === sellerId).length;
      const status = String(seller.status ?? "").toUpperCase() === "REJECTED" ? "Suspended" : "Active";

      return {
        ...seller,
        shop: seller.shopName || seller.shop || seller.name || "Seller Shop",
        rating: Number(seller.rating ?? 0).toFixed(1),
        products,
        orders: sellerOrders.length,
        sales,
        status,
        joined: seller.createdAt ? new Date(seller.createdAt).toLocaleDateString("en-IN") : "",
      };
    });
  }, [approvedSellers, rejectedSellers, sellerProducts, orders, cleanPrice]);

  const filtered = realSellers.filter((s) => {
    const matchFilter = filter === "All" || s.status === filter;
    const matchSearch =
      (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.shop || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.category || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleNavigateToDetails = (seller) => {
    navigation.navigate("SellerDetails", { seller });
  };

  const handleSuspendActivate = (seller) => {
    showAlert(
      seller.status === "Active" ? "Suspend Seller" : "Activate Seller",
      `${seller.status === "Active" ? "Suspend" : "Activate"} ${seller.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", style: "destructive", onPress: () => {} },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={C.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Sellers</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SellerApprovals")}>
          <View style={styles.approvalBtn}>
              <Ionicons name="checkmark-circle-outline" size={20} color={C.white} />
            <View style={styles.approvalBadge}>
              <Text style={styles.approvalBadgeText}>{pendingSellers.length}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={16} color={C.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search sellers, shops, categories..."
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

      {/* Filter */}
      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.countText}>{filtered.length} sellers</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {filtered.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={styles.sellerCard}
            onPress={() => handleNavigateToDetails(s)}
            activeOpacity={0.8}
          >
            <View style={styles.sellerTop}>
              <View style={styles.avatarWrap}>
                <Text style={styles.avatarText}>{s.name.charAt(0)}</Text>
              </View>
              <View style={styles.sellerInfo}>
                <View style={styles.sellerNameRow}>
                  <Text style={styles.sellerName}>{s.name}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusBg(s.status) }]}>
                    <Text style={[styles.statusText, { color: statusColor(s.status) }]}>
                      {s.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.shopName}>{s.shop}</Text>
                <Text style={styles.category}>{s.category}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={12} color={C.accentOrange} />
                  <Text style={styles.ratingText}>{s.rating}</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons name="ellipsis-vertical" size={18} color={C.muted} />
              </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{s.products}</Text>
                <Text style={styles.statLabel}>Products</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{s.orders}</Text>
                <Text style={styles.statLabel}>Orders</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>₹{(s.sales / 1000).toFixed(0)}K</Text>
                <Text style={styles.statLabel}>Sales</Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.viewBtn}
                onPress={() => handleNavigateToDetails(s)}
              >
                <Text style={styles.viewBtnText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.viewBtn,
                  {
                    backgroundColor:
                      s.status === "Active" ? C.red + "15" : C.green + "15",
                  },
                ]}
                onPress={() => handleSuspendActivate(s)}
              >
                <Text
                  style={[
                    styles.viewBtnText,
                    { color: s.status === "Active" ? C.red : C.green },
                  ]}
                >
                  {s.status === "Active" ? "Suspend" : "Activate"}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyWrap}>
            <Ionicons name="storefront-outline" size={60} color={C.muted} />
            <Text style={styles.emptyText}>No sellers found</Text>
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
  headerTitle: { color: C.white, fontSize: 18, fontWeight: "700" },
  approvalBtn: { position: "relative" },
  approvalBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: C.red,
    borderRadius: 6,
    width: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  approvalBadgeText: {
    color: C.white,
    fontSize: 8,
    fontWeight: "700",
  },
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
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    alignItems: "center",
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
  countText: { fontSize: 11, color: C.muted, marginLeft: "auto" },
  scroll: { flex: 1, backgroundColor: C.bg },
  sellerCard: {
    backgroundColor: C.card,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 18,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sellerTop: { flexDirection: "row", gap: 12, marginBottom: 12 },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: { color: C.white, fontSize: 20, fontWeight: "800" },
  sellerInfo: { flex: 1, gap: 2 },
  sellerNameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sellerName: { fontSize: 14, fontWeight: "800", color: C.text, flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: "700" },
  shopName: { fontSize: 12, fontWeight: "700", color: C.primary },
  category: { fontSize: 11, color: C.muted },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 },
  ratingText: { fontSize: 12, color: C.text, fontWeight: "700" },
  statsRow: {
    flexDirection: "row",
    backgroundColor: C.bg,
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 14, fontWeight: "800", color: C.text },
  statLabel: { fontSize: 10, color: C.muted, marginTop: 1 },
  statDivider: { width: 1, backgroundColor: C.border },
  actionRow: { flexDirection: "row", gap: 10 },
  viewBtn: {
    flex: 1,
    backgroundColor: C.bg,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  viewBtnText: { fontSize: 12, fontWeight: "700", color: C.primary },
  emptyWrap: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, color: C.muted, fontWeight: "600" },
});
