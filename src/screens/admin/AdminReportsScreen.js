



// src/screens/admin/AdminReportsScreen.js

import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useShop } from "../../context/ShopContext";
import { showAlert } from "../../utils/showAlert";

const C = {
  primary: "#0e3243",
  secondary: "#0e3243",
  white: "#FFFFFF",
  bg: "#F4F7FC",
  card: "#FFFFFF",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  green: "#10B981",
  orange: "#F59E0B",
  red: "#EF4444",
};

export default function AdminReportsScreen({
  navigation,
}) {
  const {
    orders = [],
    sellers = [],
    pendingSellerProducts = [],
    totalAdminCommission = 0,
    totalSellerPayout = 0,
  } = useShop();

  const totalRevenue =
    totalAdminCommission +
    totalSellerPayout;

  const recentOrders =
    orders.slice(-5).reverse();

  const reportRows = orders.map((order) => ({
    id: order.id,
    date: order.date || order.createdAt || "",
    customer: order.customer || order.customerName || "Customer",
    amount: order.totalAmount || order.total || 0,
    adminCommission: order.adminCommission || 0,
    sellerPayout: order.sellerEarning || 0,
    status: order.status || "",
  }));

  const downloadFile = (fileName, mimeType, content) => {
    if (Platform.OS !== "web" || typeof document === "undefined") {
      showAlert("Export ready", "Report export is available on web in this build.");
      return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    const headers = ["Order ID", "Date", "Customer", "Amount", "Admin Commission", "Seller Payout", "Status"];
    const csv = [
      headers.join(","),
      ...reportRows.map((row) =>
        headers
          .map((header) => {
            const key = {
              "Order ID": "id",
              Date: "date",
              Customer: "customer",
              Amount: "amount",
              "Admin Commission": "adminCommission",
              "Seller Payout": "sellerPayout",
              Status: "status",
            }[header];
            return `"${String(row[key] ?? "").replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    downloadFile("admin-report.csv", "text/csv;charset=utf-8", csv);
  };

  const handleDownloadPdf = () => {
    if (Platform.OS !== "web" || typeof window === "undefined") {
      showAlert("PDF ready", "PDF download is available on web in this build.");
      return;
    }

    const rows = reportRows
      .map(
        (row) =>
          `<tr><td>${row.id}</td><td>${row.date}</td><td>${row.customer}</td><td>Rs ${row.amount}</td><td>Rs ${row.adminCommission}</td><td>Rs ${row.sellerPayout}</td><td>${row.status}</td></tr>`
      )
      .join("");
    const html = `<!doctype html><html><head><title>Admin Report</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#0F172A}h1{color:#0e3243}table{width:100%;border-collapse:collapse;margin-top:18px}th,td{border:1px solid #E2E8F0;padding:8px;text-align:left;font-size:12px}th{background:#0e3243;color:#fff}.stats{display:flex;gap:12px}.card{border:1px solid #E2E8F0;padding:12px;border-radius:8px}</style></head><body><h1>Admin Report</h1><div class="stats"><div class="card">Revenue: Rs ${totalRevenue}</div><div class="card">Admin: Rs ${totalAdminCommission}</div><div class="card">Seller: Rs ${totalSellerPayout}</div></div><table><thead><tr><th>Order ID</th><th>Date</th><th>Customer</th><th>Amount</th><th>Admin</th><th>Seller</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table><script>window.print();</script></body></html>`;
    const reportWindow = window.open("", "_blank");
    reportWindow?.document.write(html);
    reportWindow?.document.close();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={C.primary}
      />

      {/* HEADER */}
      <LinearGradient
        colors={[
          C.primary,
          C.secondary,
        ]}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={C.white}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Reports
          </Text>

          <TouchableOpacity>
            <Ionicons
              name="document-text-outline"
              size={22}
              color={C.white}
            />
          </TouchableOpacity>
        </View>

        {/* MAIN STATS */}
        <View style={styles.statsWrap}>
          <View style={styles.bigCard}>
            <Text style={styles.bigLabel}>
              Total Revenue
            </Text>

            <Text style={styles.bigValue}>
              ₹
              {totalRevenue > 1000
                ? (
                    totalRevenue /
                    1000
                  ).toFixed(1) + "K"
                : totalRevenue}
            </Text>
          </View>

          <View style={styles.smallRow}>
            <View style={styles.smallCard}>
              <Text
                style={
                  styles.smallLabel
                }
              >
                Admin
              </Text>

              <Text
                style={[
                  styles.smallValue,
                  {
                    color:
                      C.orange,
                  },
                ]}
              >
                ₹
                {totalAdminCommission >
                1000
                  ? (
                      totalAdminCommission /
                      1000
                    ).toFixed(1) +
                    "K"
                  : totalAdminCommission}
              </Text>
            </View>

            <View style={styles.smallCard}>
              <Text
                style={
                  styles.smallLabel
                }
              >
                Seller
              </Text>

              <Text
                style={[
                  styles.smallValue,
                  {
                    color:
                      C.green,
                  },
                ]}
              >
                ₹
                {totalSellerPayout >
                1000
                  ? (
                      totalSellerPayout /
                      1000
                    ).toFixed(1) +
                    "K"
                  : totalSellerPayout}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* QUICK ANALYTICS */}
        <View style={styles.analyticsRow}>
          <View style={styles.analyticsCard}>
            <Ionicons
              name="bag-outline"
              size={24}
              color={C.primary}
            />

            <Text
              style={
                styles.analyticsValue
              }
            >
              {orders.length}
            </Text>

            <Text
              style={
                styles.analyticsLabel
              }
            >
              Orders
            </Text>
          </View>

          <View style={styles.analyticsCard}>
            <Ionicons
              name="storefront-outline"
              size={24}
              color={C.green}
            />

            <Text
              style={
                styles.analyticsValue
              }
            >
              {sellers.length}
            </Text>

            <Text
              style={
                styles.analyticsLabel
              }
            >
              Sellers
            </Text>
          </View>

          <View style={styles.analyticsCard}>
            <Ionicons
              name="time-outline"
              size={24}
              color={C.orange}
            />

            <Text
              style={
                styles.analyticsValue
              }
            >
              {
                pendingSellerProducts.length
              }
            </Text>

            <Text
              style={
                styles.analyticsLabel
              }
            >
              Pending
            </Text>
          </View>
        </View>

        {/* RECENT TRANSACTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Recent Transactions
          </Text>

          {recentOrders.length ===
          0 ? (
            <View
              style={
                styles.emptyWrap
              }
            >
              <Ionicons
                name="receipt-outline"
                size={60}
                color={C.muted}
              />

              <Text
                style={
                  styles.emptyText
                }
              >
                No transactions available
              </Text>
            </View>
          ) : (
            recentOrders.map(
              (
                item,
                index
              ) => (
                <View
                  key={index}
                  style={
                    styles.orderCard
                  }
                >
                  <View
                    style={
                      styles.orderLeft
                    }
                  >
                    <View
                      style={
                        styles.iconWrap
                      }
                    >
                      <Ionicons
                        name="wallet-outline"
                        size={
                          20
                        }
                        color={
                          C.primary
                        }
                      />
                    </View>

                    <View>
                      <Text
                        style={
                          styles.orderId
                        }
                      >
                        #
                        {item.id ||
                          index +
                            1}
                      </Text>

                      <Text
                        style={
                          styles.orderDate
                        }
                      >
                        {item.date ||
                          "Today"}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={
                      styles.orderAmount
                    }
                  >
                    ₹
                    {item.totalAmount ||
                      item.total ||
                      0}
                  </Text>
                </View>
              )
            )
          )}
        </View>

        {/* ACTIONS */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.downloadBtn}
            onPress={handleDownloadPdf}
          >
            <Ionicons
              name="download-outline"
              size={18}
              color={C.white}
            />

            <Text
              style={
                styles.actionText
              }
            >
              Download PDF
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exportBtn}
            onPress={handleExportExcel}
          >
            <Ionicons
              name="document-outline"
              size={18}
              color={C.white}
            />

            <Text
              style={
                styles.actionText
              }
            >
              Export Excel
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{ height: 120 }}
        />
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
    paddingBottom: 28,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  headerTitle: {
    color: C.white,
    fontSize: 20,
    fontWeight: "800",
  },

  statsWrap: {
    marginTop: 24,
  },

  bigCard: {
    backgroundColor:
      "rgba(255,255,255,0.12)",
    borderRadius: 24,
    padding: 22,
  },

  bigLabel: {
    color:
      "rgba(255,255,255,0.7)",
    fontSize: 13,
  },

  bigValue: {
    marginTop: 10,
    color: C.white,
    fontSize: 32,
    fontWeight: "900",
  },

  smallRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },

  smallCard: {
    flex: 1,
    backgroundColor:
      "rgba(255,255,255,0.12)",
    borderRadius: 18,
    padding: 18,
  },

  smallLabel: {
    color:
      "rgba(255,255,255,0.7)",
    fontSize: 12,
  },

  smallValue: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "800",
  },

  scroll: {
    flex: 1,
  },

  analyticsRow: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 16,
    marginTop: 18,
  },

  analyticsCard: {
    flex: 1,
    backgroundColor: C.card,
    borderRadius: 22,
    paddingVertical: 20,
    alignItems: "center",
  },

  analyticsValue: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "900",
    color: C.text,
  },

  analyticsLabel: {
    marginTop: 4,
    fontSize: 11,
    color: C.muted,
  },

  section: {
    marginTop: 18,
    marginHorizontal: 16,
    backgroundColor: C.card,
    borderRadius: 24,
    padding: 18,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: C.text,
    marginBottom: 16,
  },

  emptyWrap: {
    alignItems: "center",
    paddingVertical: 40,
  },

  emptyText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "700",
    color: C.muted,
  },

  orderCard: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor:
      "#F1F5F9",
  },

  orderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  orderId: {
    fontSize: 14,
    fontWeight: "800",
    color: C.text,
  },

  orderDate: {
    marginTop: 4,
    fontSize: 11,
    color: C.muted,
  },

  orderAmount: {
    fontSize: 16,
    fontWeight: "900",
    color: C.green,
  },

  actionRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 18,
    gap: 12,
  },

  downloadBtn: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    backgroundColor: C.primary,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },

  exportBtn: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    backgroundColor: C.green,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },

  actionText: {
    color: C.white,
    fontSize: 13,
    fontWeight: "800",
  },
});
