

// src/screens/admin/ManageProductsScreen.js

import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useShop } from "../../context/ShopContext";

const { width } = Dimensions.get("window");

const C = {
  primary: "#0e3243",
  secondary: "#0e3243",
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
  shadow: "rgba(0,0,0,0.08)",
};

const statusColor = (s) => {
  if (s === "Live" || s === "In Stock") return C.green;
  if (s === "Low Stock") return C.orange;
  if (s === "Hidden") return "#94A3B8";
  return C.red;
};

const statusBg = (s) => {
  if (s === "Live" || s === "In Stock") return "#DCFCE7";
  if (s === "Low Stock") return "#FEF3C7";
  if (s === "Hidden") return "#E2E8F0";
  return "#FEE2E2";
};

const resolveImageUri = (product) => {
  if (typeof product?.image === "string" && product.image.trim()) {
    return product.image;
  }

  if (Array.isArray(product?.images)) {
    const firstImage = product.images.find((item) => {
      if (typeof item === "string") return item.trim().length > 0;
      return Boolean(item?.uri || item?.url || item?.path);
    });

    if (typeof firstImage === "string") return firstImage;
    return firstImage?.uri || firstImage?.url || firstImage?.path || null;
  }

  return null;
};

const formatCurrency = (value) => `\u20b9${Number(value ?? 0).toLocaleString("en-IN")}`;

const formatCompactCurrency = (value) => {
  const amount = Number(value ?? 0);
  if (amount >= 1000) {
    return `\u20b9${(amount / 1000).toFixed(1)}K`;
  }
  return formatCurrency(amount);
};

export default function ManageProductsScreen({ navigation }) {
  const { sellerProducts = [], orders = [], cleanPrice } = useShop();

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("All");

  const stockFilters = ["All", "Live", "Hidden", "Low Stock"];

  // Product Sales Map
  const productSalesMap = useMemo(() => {
    const map = {};

    orders.forEach((order) => {
      (order.products || []).forEach((item) => {
        const pid = String(item.id || item.name);

        if (!map[pid]) {
          map[pid] = {
            sold: 0,
            revenue: 0,
          };
        }

        map[pid].sold += item.qty || 1;

        map[pid].revenue +=
          cleanPrice(item.finalPrice || item.price) *
          (item.qty || 1);
      });
    });

    return map;
  }, [orders, cleanPrice]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return sellerProducts.filter((p) => {
      const status =
        p.status || (p.visibleToCustomer ? "Live" : "Hidden");

      const matchFilter =
        stockFilter === "All" ||
        status === stockFilter ||
        (stockFilter === "Low Stock" &&
          p.stock > 0 &&
          p.stock <= 5);

      const matchSearch =
        (p.name || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (p.category || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (p.sellerName || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchFilter && matchSearch;
    });
  }, [sellerProducts, stockFilter, search]);

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
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={C.white}
            />
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.headerTitle}>
              Manage Products
            </Text>

            <Text style={styles.headerSubtitle}>
              Products added by sellers
            </Text>
          </View>

          <View style={styles.countBox}>
            <Ionicons
              name="cube-outline"
              size={18}
              color={C.white}
            />
            <Text style={styles.countText}>
              {sellerProducts.length}
            </Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons
            name="search-outline"
            size={18}
            color={C.muted}
          />

          <TextInput
            placeholder="Search products, sellers..."
            placeholderTextColor={C.muted}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />

          {search?.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch("")}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={C.muted}
              />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* FILTERS */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {stockFilters.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.filterBtn,
                stockFilter === item &&
                  styles.activeFilterBtn,
              ]}
              onPress={() => setStockFilter(item)}
            >
              <Text
                style={[
                  styles.filterText,
                  stockFilter === item &&
                    styles.activeFilterText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* PRODUCTS */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons
              name="cube-outline"
              size={70}
              color={C.muted}
            />

            <Text style={styles.emptyTitle}>
              No Products Found
            </Text>

            <Text style={styles.emptySub}>
              Seller added products will appear here
            </Text>
          </View>
        ) : (
          filteredProducts.map((p) => {
            const pid = String(p.id || p.name);
            const imageUri = resolveImageUri(p);

            const sales = productSalesMap[pid] || {
              sold: 0,
              revenue: 0,
            };

            const revenue = sales.revenue || 0;

            const adminAmount = revenue * 0.1;

            const sellerAmount = revenue * 0.9;

            const status =
              p.stock === 0
                ? "Out of Stock"
                : p.stock <= 5
                ? "Low Stock"
                : p.status ||
                  (p.visibleToCustomer
                    ? "Live"
                    : "Hidden");

            return (
              <TouchableOpacity
                key={p.id}
                activeOpacity={0.9}
                style={styles.card}
                onPress={() =>
                  navigation.navigate(
                    "AdminProductDetailsScreen",
                    { product: p }
                  )
                }
              >
                {/* TOP */}
                <View style={styles.cardTop}>
                  {/* IMAGE */}
                  {imageUri ? (
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.productImage}
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Ionicons
                        name="cube-outline"
                        size={28}
                        color={C.primary}
                      />
                    </View>
                  )}

                  {/* INFO */}
                  <View style={{ flex: 1 }}>
                    <Text
                      numberOfLines={1}
                      style={styles.productName}
                    >
                      {p.name}
                    </Text>

                    <Text style={styles.sellerName}>
                      {p.sellerName || "Unknown Seller"}
                    </Text>

                    <Text style={styles.category}>
                      {p.category || "General"}
                    </Text>

                    <Text style={styles.price}>
                      {formatCurrency(cleanPrice(p.finalPrice || p.price))}
                    </Text>

                    <View style={styles.metaRow}>
                      <Text style={styles.metaText}>
                        Sold: {sales.sold}
                      </Text>

                      <Text style={styles.metaText}>
                        Stock: {p.stock || 0}
                      </Text>
                    </View>
                  </View>

                  {/* STATUS */}
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          statusBg(status),
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            statusColor(status),
                        },
                      ]}
                    >
                      {status}
                    </Text>
                  </View>
                </View>

                {/* DIVIDER */}
                <View style={styles.divider} />

                {/* STATS */}
                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Ionicons
                      name="cash-outline"
                      size={18}
                      color={C.primary}
                    />

                    <Text style={styles.statLabel}>
                      Revenue
                    </Text>

                    <Text style={styles.statValue}>
                      ₹
                      {revenue > 1000
                        ? (
                            revenue / 1000
                          ).toFixed(1) + "K"
                        : revenue}
                    </Text>
                  </View>

                  <View style={styles.statBox}>
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={18}
                      color={C.orange}
                    />

                    <Text style={styles.statLabel}>
                      Admin 10%
                    </Text>

                    <Text
                      style={[
                        styles.statValue,
                        { color: C.orange },
                      ]}
                    >
                      ₹
                      {adminAmount > 1000
                        ? (
                            adminAmount / 1000
                          ).toFixed(1) + "K"
                        : adminAmount.toFixed(0)}
                    </Text>
                  </View>

                  <View style={styles.statBox}>
                    <Ionicons
                      name="wallet-outline"
                      size={18}
                      color={C.green}
                    />

                    <Text style={styles.statLabel}>
                      Seller 90%
                    </Text>

                    <Text
                      style={[
                        styles.statValue,
                        { color: C.green },
                      ]}
                    >
                      ₹
                      {sellerAmount > 1000
                        ? (
                            sellerAmount / 1000
                          ).toFixed(1) + "K"
                        : sellerAmount.toFixed(0)}
                    </Text>
                  </View>
                </View>

                {/* BUTTONS */}
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.viewBtn}
                    onPress={() =>
                      navigation.navigate(
                        "AdminProductDetailsScreen",
                        { product: p }
                      )
                    }
                  >
                    <Text style={styles.viewBtnText}>
                      View Details
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.payBtn}
                    onPress={() =>
                      navigation.navigate(
                        "AdminPayouts",
                        { product: p }
                      )
                    }
                  >
                    <Ionicons
                      name="card-outline"
                      size={16}
                      color={C.white}
                    />

                    <Text style={styles.payBtnText}>
                      Pay Seller
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })
        )}

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
    paddingBottom: 22,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerTitle: {
    color: C.white,
    fontSize: 22,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    marginTop: 3,
  },

  countBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },

  countText: {
    color: C.white,
    fontWeight: "800",
    fontSize: 14,
  },

  searchWrap: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: C.text,
    fontSize: 14,
  },

  filterContainer: {
    marginTop: 14,
    paddingLeft: 16,
  },

  filterBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: C.white,
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 1,
    borderColor: C.border,
  },

  activeFilterBtn: {
    backgroundColor: C.primary,
  },

  filterText: {
    color: C.muted,
    fontSize: 13,
    fontWeight: "700",
  },

  activeFilterText: {
    color: C.white,
  },

  scroll: {
    flex: 1,
    marginTop: 6,
  },

  card: {
    backgroundColor: C.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },

  cardTop: {
    flexDirection: "row",
    gap: 14,
  },

  productImage: {
    width: 85,
    height: 85,
    borderRadius: 20,
    backgroundColor: "#E2E8F0",
  },

  imagePlaceholder: {
    width: 85,
    height: 85,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  productName: {
    fontSize: 16,
    fontWeight: "800",
    color: C.text,
  },

  sellerName: {
    fontSize: 12,
    color: C.muted,
    marginTop: 2,
  },

  category: {
    fontSize: 11,
    color: C.primary,
    marginTop: 5,
    fontWeight: "700",
  },

  price: {
    fontSize: 18,
    fontWeight: "800",
    color: C.primary,
    marginTop: 6,
  },

  metaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },

  metaText: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "700",
  },

  statusBadge: {
    position: "absolute",
    right: 0,
    top: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",
  },

  divider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 16,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  statBox: {
    flex: 1,
    alignItems: "center",
  },

  statLabel: {
    fontSize: 10,
    color: C.muted,
    marginTop: 6,
  },

  statValue: {
    fontSize: 13,
    fontWeight: "800",
    color: C.text,
    marginTop: 4,
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 18,
    gap: 12,
  },

  viewBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: C.primary,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 13,
  },

  viewBtnText: {
    color: C.primary,
    fontWeight: "800",
    fontSize: 13,
  },

  payBtn: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
    backgroundColor: C.primary,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 13,
  },

  payBtnText: {
    color: C.white,
    fontWeight: "800",
    fontSize: 13,
  },

  emptyWrap: {
    marginTop: 120,
    alignItems: "center",
  },

  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "800",
    color: C.text,
  },

  emptySub: {
    marginTop: 6,
    color: C.muted,
    fontSize: 13,
  },
});
