


// src/screens/admin/AdminPayoutsScreen.js

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useShop } from "../../context/ShopContext";
import { withdrawSellerPayoutAPI } from "../../api/paymentApi";
import { showAlert } from "../../utils/showAlert";

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
};

export default function AdminPayoutsScreen({
  navigation,
  route,
}) {
  const { orders = [], commissionRecords = [], cleanPrice } = useShop();

  const product = route?.params?.product;

  const [filter, setFilter] = useState("All");
  const [paidIds, setPaidIds] = useState([]);

  const filters = [
    "All",
    "Paid",
    "Processing",
    "Pending",
  ];

  // CREATE PAYOUT DATA
  const payouts = useMemo(() => {
    let data = [];

    orders.forEach((order, index) => {
      (order.products || []).forEach((item) => {
        const sameProduct =
          !product ||
          String(item.id || item.name) ===
            String(product.id || product.name);

        if (sameProduct) {
          const amount =
            cleanPrice(
              item.finalPrice || item.price
            ) * (item.qty || 1);

          const sellerAmount = amount * 0.9;

          data.push({
            id:
              "PAY-" +
              (1000 + index + 1),
            sellerId: item.sellerId || product?.sellerId || "",

            seller:
              item.sellerName ||
              product?.sellerName ||
              "Unknown Seller",

            product:
              item.name ||
              product?.name,

            amount: sellerAmount,

            revenue: amount,

            admin: amount * 0.1,

            qty: item.qty || 1,

            status:
              paidIds.includes("PAY-" + (1000 + index + 1))
                ? "Paid"
                : "Pending",

            date:
              order.date ||
              "30 May 2026",
          });
        }
      });
    });

    commissionRecords.forEach((record, index) => {
      const sameProduct =
        !product ||
        String(record.productId || record.productName) ===
          String(product.id || product.name);

      if (sameProduct) {
        const paidFee = record.totalAmount ?? record.adminCommission ?? 0;
        const isUploadFee = record.type === "product_upload_fee";
        data.push({
          id: record.id || "FEE-" + (1000 + index + 1),
          sellerId: record.sellerId || product?.sellerId || "",
          seller: record.sellerName || product?.sellerName || "Unknown Seller",
          product: record.productName || product?.name || "Product upload fee",
          amount: isUploadFee ? paidFee : record.sellerEarning ?? 0,
          revenue: paidFee,
          admin: record.adminCommission ?? 0,
          qty: 1,
          status: paidIds.includes(record.id || "FEE-" + (1000 + index + 1)) ? "Paid" : record.status || "Paid",
          date: record.createdAt
            ? new Date(record.createdAt).toLocaleDateString("en-IN")
            : "Today",
        });
      }
    });

    return data;
  }, [orders, commissionRecords, product, paidIds]);

  const paySeller = async (item) => {
    if (!item?.sellerId) {
      showAlert("Seller missing", "Seller id is not available for this payout.");
      return;
    }

    const result = await withdrawSellerPayoutAPI({
      sellerId: item.sellerId,
      amount: item.amount,
    });

    if (!result?.success) {
      showAlert("Payout failed", result?.message || "Unable to pay seller.");
      return;
    }

    setPaidIds((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]));
    showAlert("Payout created", "Seller payout has been created successfully.");
  };

  const payAllPending = async () => {
    const pendingItems = filtered.filter((p) => p.status === "Pending" || p.status === "Processing");
    for (const item of pendingItems) {
      await paySeller(item);
    }
  };

  // FILTERED
  const filtered = payouts.filter(
    (p) =>
      filter === "All" ||
      p.status === filter
  );

  // STATS
  const totalPayout = payouts.reduce(
    (a, b) => a + b.amount,
    0
  );

  const paidPayout = payouts
    .filter((p) => p.status === "Paid")
    .reduce((a, b) => a + b.amount, 0);

  const pendingPayout = payouts
    .filter(
      (p) =>
        p.status === "Pending" ||
        p.status === "Processing"
    )
    .reduce((a, b) => a + b.amount, 0);

  const getStatusColor = (status) => {
    if (status === "Paid") return C.green;

    if (status === "Processing")
      return C.orange;

    return "#64748B";
  };

  const getStatusBg = (status) => {
    if (status === "Paid")
      return "#DCFCE7";

    if (status === "Processing")
      return "#FEF3C7";

    return "#E2E8F0";
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
            Seller Payouts
          </Text>

          <TouchableOpacity>
            <Ionicons
              name="download-outline"
              size={22}
              color={C.white}
            />
          </TouchableOpacity>
        </View>

        {/* PRODUCT */}
        {product && (
          <View style={styles.productBox}>
            <Text style={styles.productName}>
              {product.name}
            </Text>

            <Text style={styles.productSeller}>
              {product.sellerName ||
                "Unknown Seller"}
            </Text>
          </View>
        )}

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>
              Total
            </Text>

            <Text style={styles.statsValue}>
              ₹
              {totalPayout > 1000
                ? (
                    totalPayout / 1000
                  ).toFixed(1) + "K"
                : totalPayout.toFixed(0)}
            </Text>
          </View>

          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>
              Paid
            </Text>

            <Text
              style={[
                styles.statsValue,
                { color: C.green },
              ]}
            >
              ₹
              {paidPayout > 1000
                ? (
                    paidPayout / 1000
                  ).toFixed(1) + "K"
                : paidPayout.toFixed(0)}
            </Text>
          </View>

          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>
              Pending
            </Text>

            <Text
              style={[
                styles.statsValue,
                { color: C.orange },
              ]}
            >
              ₹
              {pendingPayout > 1000
                ? (
                    pendingPayout / 1000
                  ).toFixed(1) + "K"
                : pendingPayout.toFixed(0)}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* FILTERS */}
      <View style={styles.filterWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {filters.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.filterBtn,
                filter === item &&
                  styles.activeFilter,
              ]}
              onPress={() =>
                setFilter(item)
              }
            >
              <Text
                style={[
                  styles.filterText,
                  filter === item &&
                    styles.activeFilterText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* PAYOUT LIST */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons
              name="wallet-outline"
              size={70}
              color={C.muted}
            />

            <Text style={styles.emptyTitle}>
              No payouts found
            </Text>
          </View>
        ) : (
          filtered.map((item, index) => (
            <View
              key={index}
              style={styles.card}
            >
              {/* TOP */}
              <View style={styles.cardTop}>
                <View style={styles.iconWrap}>
                  <Ionicons
                    name="wallet-outline"
                    size={24}
                    color={C.primary}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.payoutId}>
                    {item.id}
                  </Text>

                  <Text
                    style={styles.sellerName}
                  >
                    {item.seller}
                  </Text>

                  <Text
                    style={styles.productText}
                  >
                    {item.product}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        getStatusBg(
                          item.status
                        ),
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          getStatusColor(
                            item.status
                          ),
                      },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              {/* DIVIDER */}
              <View style={styles.divider} />

              {/* DETAILS */}
              <View style={styles.detailRow}>
                <View style={styles.detailBox}>
                  <Text
                    style={styles.detailLabel}
                  >
                    Revenue
                  </Text>

                  <Text
                    style={styles.detailValue}
                  >
                    ₹
                    {item.revenue > 1000
                      ? (
                          item.revenue /
                          1000
                        ).toFixed(1) +
                        "K"
                      : item.revenue.toFixed(
                          0
                        )}
                  </Text>
                </View>

                <View style={styles.detailBox}>
                  <Text
                    style={styles.detailLabel}
                  >
                    Admin
                  </Text>

                  <Text
                    style={[
                      styles.detailValue,
                      { color: C.orange },
                    ]}
                  >
                    ₹
                    {item.admin > 1000
                      ? (
                          item.admin /
                          1000
                        ).toFixed(1) +
                        "K"
                      : item.admin.toFixed(
                          0
                        )}
                  </Text>
                </View>

                <View style={styles.detailBox}>
                  <Text
                    style={styles.detailLabel}
                  >
                    Seller
                  </Text>

                  <Text
                    style={[
                      styles.detailValue,
                      { color: C.green },
                    ]}
                  >
                    ₹
                    {item.amount > 1000
                      ? (
                          item.amount /
                          1000
                        ).toFixed(1) +
                        "K"
                      : item.amount.toFixed(
                          0
                        )}
                  </Text>
                </View>
              </View>

              {/* FOOTER */}
              <View style={styles.footerRow}>
                <Text style={styles.date}>
                  {item.date}
                </Text>

                {item.status !== "Paid" && (
                  <TouchableOpacity
                    style={styles.payBtn}
                    onPress={() => paySeller(item)}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={C.white}
                    />

                    <Text
                      style={styles.payBtnText}
                    >
                      Pay Now
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}

        {/* PROCESS ALL */}
        {filtered.some(
          (p) =>
            p.status === "Pending" ||
            p.status === "Processing"
        ) && (
          <TouchableOpacity
            style={styles.processBtn}
            onPress={payAllPending}
          >
            <Ionicons
              name="flash-outline"
              size={18}
              color={C.white}
            />

            <Text
              style={styles.processBtnText}
            >
              Process All Pending Payouts
            </Text>
          </TouchableOpacity>
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
    paddingBottom: 24,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    color: C.white,
    fontSize: 20,
    fontWeight: "800",
  },

  productBox: {
    marginTop: 20,
  },

  productName: {
    color: C.white,
    fontSize: 20,
    fontWeight: "800",
  },

  productSeller: {
    marginTop: 5,
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },

  statsCard: {
    flex: 1,
    backgroundColor:
      "rgba(255,255,255,0.12)",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
  },

  statsLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
  },

  statsValue: {
    marginTop: 8,
    color: C.white,
    fontSize: 15,
    fontWeight: "800",
  },

  filterWrap: {
    paddingLeft: 16,
    marginTop: 16,
  },

  filterBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: C.card,
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 1,
    borderColor: C.border,
  },

  activeFilter: {
    backgroundColor: C.primary,
  },

  filterText: {
    color: C.muted,
    fontSize: 12,
    fontWeight: "700",
  },

  activeFilterText: {
    color: C.white,
  },

  scroll: {
    flex: 1,
    marginTop: 6,
  },

  emptyWrap: {
    marginTop: 120,
    alignItems: "center",
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: "800",
    color: C.text,
  },

  card: {
    backgroundColor: C.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
  },

  payoutId: {
    fontSize: 14,
    fontWeight: "800",
    color: C.text,
  },

  sellerName: {
    marginTop: 4,
    fontSize: 12,
    color: C.muted,
  },

  productText: {
    marginTop: 3,
    fontSize: 12,
    color: C.primary,
    fontWeight: "700",
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "800",
  },

  divider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 16,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  detailBox: {
    alignItems: "center",
    flex: 1,
  },

  detailLabel: {
    fontSize: 11,
    color: C.muted,
  },

  detailValue: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "800",
    color: C.text,
  },

  footerRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  date: {
    color: C.muted,
    fontSize: 11,
  },

  payBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: C.green,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },

  payBtnText: {
    color: C.white,
    fontSize: 12,
    fontWeight: "800",
  },

  processBtn: {
    marginHorizontal: 16,
    marginTop: 18,
    height: 58,
    borderRadius: 20,
    backgroundColor: C.primary,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },

  processBtnText: {
    color: C.white,
    fontSize: 14,
    fontWeight: "800",
  },
});
