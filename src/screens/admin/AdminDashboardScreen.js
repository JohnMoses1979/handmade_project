
// src/screens/admin/AdminDashboardScreen.js

import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { useShop } from "../../context/ShopContext";

const { width } = Dimensions.get("window");

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
  blue: "#2563EB",
  purple: "#7C3AED",
};

export default function AdminDashboardScreen({
  navigation,
}) {
  const {
    reloadAdminNotifications,
    reloadAdminOrders,
    reloadComplaints,
    reloadSellers,
    pendingSellers = [],
    approvedSellers = [],
    sellerProducts = [],
    commissionRecords = [],
    unreadComplaints = 0,
    unreadAdminNotifications = 0,
    totalAdminCommission = 0,
    orders = [],
  } = useShop();

  const [dashboardSnapshot, setDashboardSnapshot] = useState(() => ({
    orders,
    pendingSellers,
    approvedSellers,
    sellerProducts,
    commissionRecords,
    unreadComplaints,
    unreadAdminNotifications,
    totalAdminCommission,
  }));
  const dashboardSnapshotRef = useRef(dashboardSnapshot);

  dashboardSnapshotRef.current = {
    orders,
    pendingSellers,
    approvedSellers,
    sellerProducts,
    commissionRecords,
    unreadComplaints,
    unreadAdminNotifications,
    totalAdminCommission,
  };

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const refreshAdminSnapshot = async () => {
        await Promise.all([
          reloadAdminOrders?.(),
          reloadComplaints?.(),
          reloadSellers?.(),
          reloadAdminNotifications?.(),
        ]);

        if (!active) return;

        setDashboardSnapshot(dashboardSnapshotRef.current);
      };

      refreshAdminSnapshot();

      return () => {
        active = false;
      };
    }, [
      reloadAdminOrders,
      reloadComplaints,
      reloadSellers,
      reloadAdminNotifications,
    ])
  );

  const dashboardOrders = Array.isArray(dashboardSnapshot.orders) ? dashboardSnapshot.orders : [];
  const dashboardPendingSellers = Array.isArray(dashboardSnapshot.pendingSellers)
    ? dashboardSnapshot.pendingSellers
    : [];
  const dashboardApprovedSellers = Array.isArray(dashboardSnapshot.approvedSellers)
    ? dashboardSnapshot.approvedSellers
    : [];
  const dashboardSellerProducts = Array.isArray(dashboardSnapshot.sellerProducts)
    ? dashboardSnapshot.sellerProducts
    : [];
  const dashboardCommissionRecords = Array.isArray(dashboardSnapshot.commissionRecords)
    ? dashboardSnapshot.commissionRecords
    : [];
  const dashboardUnreadComplaints = Number(dashboardSnapshot.unreadComplaints ?? 0);
  const dashboardUnreadAdminNotifications = Number(dashboardSnapshot.unreadAdminNotifications ?? 0);
  const dashboardTotalAdminCommission = Number(dashboardSnapshot.totalAdminCommission ?? 0);

  const totalProducts =
    dashboardSellerProducts.length;

  const totalOrders =
    dashboardOrders.length;

  const totalComplaints =
    dashboardUnreadComplaints;

  const bellCount =
    dashboardUnreadAdminNotifications + dashboardUnreadComplaints;

  const pendingSellerCount =
    dashboardPendingSellers.length;

  const salesGraph = useMemo(() => {
    const totals = Array(7).fill(0);
    const now = new Date();
    const currentWeekday = (now.getDay() + 6) % 7;
    const weekStart = new Date(now);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(now.getDate() - currentWeekday);

    dashboardOrders.forEach((order) => {
      const createdAt = new Date(order.createdAt);
      if (Number.isNaN(createdAt.getTime()) || createdAt < weekStart) return;
      const index = (createdAt.getDay() + 6) % 7;
      totals[index] += Number(order.adminCommission ?? 0);
    });

    return totals;
  }, [dashboardOrders]);

  const maxGraph = useMemo(
    () => Math.max(...salesGraph, 1),
    [salesGraph]
  );

  const sellerTotal = dashboardApprovedSellers.length + dashboardPendingSellers.length || 1;
  const statusTotal = Math.max(sellerTotal, totalComplaints, 1);

  const goTo = (screen, params) => {
    navigation.navigate(
      screen,
      params || {}
    );
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
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>
              Admin Dashboard
            </Text>

            <Text style={styles.headerSub}>
              Manage sellers, products &
              platform earnings
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() =>
                goTo(
                  "AdminNotifications"
                )
              }
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color={C.white}
              />
              {bellCount > 0 ? (
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>
                    {bellCount > 99 ? "99+" : bellCount}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() =>
                goTo("AdminProfile")
              }
            >
              <Ionicons
                name="person-circle-outline"
                size={24}
                color={C.white}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* MAIN CARD */}
        <View style={styles.heroCard}>
          <View>
            <Text style={styles.heroLabel}>
              Total Platform Earnings
            </Text>

            <Text style={styles.heroAmount}>
              ₹
              {dashboardTotalAdminCommission >
              1000
                ? (
                    dashboardTotalAdminCommission /
                    1000
                  ).toFixed(1) + "K"
                : dashboardTotalAdminCommission}
            </Text>

            <Text style={styles.heroGrowth}>
              +18.5% this month
            </Text>
          </View>

          <View style={styles.heroIcon}>
            <Ionicons
              name="cash-outline"
              size={38}
              color={C.orange}
            />
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* SUMMARY */}
        <View style={styles.summaryGrid}>
          <SummaryCard
            label="Orders"
            value={totalOrders}
            icon="bag-outline"
            color={C.primary}
          />

          <SummaryCard
            label="Products"
            value={totalProducts}
            icon="cube-outline"
            color={C.purple}
          />

          <SummaryCard
            label="Sellers"
            value={
              dashboardApprovedSellers.length
            }
            icon="storefront-outline"
            color={C.green}
          />

          <SummaryCard
            label="Complaints"
            value={totalComplaints}
            icon="alert-circle-outline"
            color={C.red}
          />
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.section}>
          <View style={styles.sectionTop}>
            <Text
              style={
                styles.sectionTitle
              }
            >
              Quick Actions
            </Text>
          </View>

          <View style={styles.quickGrid}>
            <QuickCard
              title="Seller Approval"
              icon="shield-checkmark-outline"
              color={C.green}
              onPress={() =>
                goTo(
                  "SellerApprovals"
                )
              }
            />

            <QuickCard
              title="Manage Sellers"
              icon="storefront-outline"
              color={C.blue}
              onPress={() =>
                goTo(
                  "ManageSellers"
                )
              }
            />

            <QuickCard
              title="Products"
              icon="cube-outline"
              color={C.purple}
              onPress={() =>
                goTo(
                  "ManageProducts"
                )
              }
            />

            <QuickCard
              title="Orders"
              icon="bag-handle-outline"
              color={C.orange}
              onPress={() =>
                goTo(
                  "ManageOrders"
                )
              }
            />

            <QuickCard
              title="Reports"
              icon="bar-chart-outline"
              color={C.primary}
              onPress={() =>
                goTo(
                  "AdminReports"
                )
              }
            />

            <QuickCard
              title="Commission"
              icon="wallet-outline"
              color={C.green}
              onPress={() =>
                goTo(
                  "AdminCommission"
                )
              }
            />

            <QuickCard
              title="Payouts"
              icon="card-outline"
              color={C.orange}
              onPress={() =>
                goTo(
                  "AdminPayouts"
                )
              }
            />

            <QuickCard
              title="Complaints"
              icon="warning-outline"
              color={C.red}
              onPress={() =>
                goTo(
                  "AdminComplaintReviewScreen"
                )
              }
            />
          </View>
        </View>

        {/* ANALYTICS */}
        <View style={styles.section}>
          <View style={styles.sectionTop}>
            <Text
              style={
                styles.sectionTitle
              }
            >
              Weekly Earnings
            </Text>

            <TouchableOpacity
              onPress={() =>
                goTo(
                  "AdminReports"
                )
              }
            >
              <Text
                style={
                  styles.viewAll
                }
              >
                Reports
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chartBox}>
            {salesGraph.map(
              (
                item,
                index
              ) => (
                <View
                  key={index}
                  style={
                    styles.chartItem
                  }
                >
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height:
                          (item /
                            maxGraph) *
                          120,
                      },
                    ]}
                  />

                  <Text
                    style={
                      styles.chartLabel
                    }
                  >
                    {
                      [
                        "M",
                        "T",
                        "W",
                        "T",
                        "F",
                        "S",
                        "S",
                      ][index]
                    }
                  </Text>
                </View>
              )
            )}
          </View>
        </View>

        {/* RECENT PAYMENTS */}
        <View style={styles.section}>
          <View style={styles.sectionTop}>
            <Text
              style={
                styles.sectionTitle
              }
            >
              Recent Listing Payments
            </Text>

            <TouchableOpacity
              onPress={() =>
                goTo(
                  "AdminPayouts"
                )
              }
            >
              <Text
                style={
                  styles.viewAll
                }
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {dashboardCommissionRecords.length ===
          0 ? (
            <View
              style={
                styles.emptyWrap
              }
            >
              <Ionicons
                name="wallet-outline"
                size={55}
                color={C.muted}
              />

              <Text
                style={
                  styles.emptyText
                }
              >
                No payment records found
              </Text>
            </View>
          ) : (
            dashboardCommissionRecords
              .slice(0, 5)
              .map((item) => (
                <View
                  key={item.id}
                  style={
                    styles.paymentRow
                  }
                >
                  <View
                    style={
                      styles.paymentLeft
                    }
                  >
                    <View
                      style={
                        styles.paymentIcon
                      }
                    >
                      <Ionicons
                        name="cash-outline"
                        size={
                          20
                        }
                        color={
                          C.orange
                        }
                      />
                    </View>

                    <View>
                      <Text
                        style={
                          styles.paymentName
                        }
                      >
                        {
                          item.sellerName
                        }
                      </Text>

                      <Text
                        style={
                          styles.paymentSub
                        }
                      >
                        Product Published
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={
                      styles.paymentAmount
                    }
                  >
                    ₹
                    {item.adminCommission?.toLocaleString(
                      "en-IN"
                    )}
                  </Text>
                </View>
              ))
          )}
        </View>

        {/* SELLER STATUS */}
        <View style={styles.section}>
          <View style={styles.sectionTop}>
            <Text
              style={
                styles.sectionTitle
              }
            >
              Seller Status
            </Text>

            <TouchableOpacity
              onPress={() =>
                goTo(
                  "SellerApprovals"
                )
              }
            >
              <Text
                style={
                  styles.viewAll
                }
              >
                Review
              </Text>
            </TouchableOpacity>
          </View>

          <ProgressItem
            label="Approved Sellers"
            value={
              dashboardApprovedSellers.length
            }
            color={C.green}
            width={`${Math.min((dashboardApprovedSellers.length / statusTotal) * 100, 100)}%`}
          />

          <ProgressItem
            label="Pending Sellers"
            value={
              pendingSellerCount
            }
            color={C.orange}
            width={`${Math.min((pendingSellerCount / statusTotal) * 100, 100)}%`}
          />

          <ProgressItem
            label="Complaints"
            value={totalComplaints}
            color={C.red}
            width={`${Math.min((totalComplaints / statusTotal) * 100, 100)}%`}
          />
        </View>

        <View
          style={{ height: 120 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

/* SUMMARY CARD */

function SummaryCard({
  label,
  value,
  icon,
  color,
}) {
  return (
    <View style={styles.summaryCard}>
      <View
        style={[
          styles.summaryIcon,
          {
            backgroundColor:
              `${color}15`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={22}
          color={color}
        />
      </View>

      <Text style={styles.summaryValue}>
        {value}
      </Text>

      <Text style={styles.summaryLabel}>
        {label}
      </Text>
    </View>
  );
}

/* QUICK CARD */

function QuickCard({
  title,
  icon,
  color,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.quickCard}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View
        style={[
          styles.quickIcon,
          {
            backgroundColor:
              `${color}15`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={24}
          color={color}
        />
      </View>

      <Text style={styles.quickTitle}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

/* PROGRESS */

function ProgressItem({
  label,
  value,
  color,
  width,
}) {
  return (
    <View style={styles.progressItem}>
      <View style={styles.progressTop}>
        <Text
          style={styles.progressLabel}
        >
          {label}
        </Text>

        <Text
          style={styles.progressValue}
        >
          {value}
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: color,
              width,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },

  header: {
    paddingTop:
      Platform.OS === "ios"
        ? 14
        : 18,
    paddingBottom: 28,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  headerTitle: {
    color: C.white,
    fontSize: 24,
    fontWeight: "900",
  },

  headerSub: {
    color:
      "rgba(255,255,255,0.7)",
    marginTop: 4,
    fontSize: 12,
  },

  headerActions: {
    flexDirection: "row",
    gap: 10,
  },

  headerBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor:
      "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  headerBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: C.red,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },

  headerBadgeText: {
    color: C.white,
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 12,
  },

  heroCard: {
    marginTop: 24,
    backgroundColor:
      "rgba(255,255,255,0.12)",
    borderRadius: 28,
    padding: 22,
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  heroLabel: {
    color:
      "rgba(255,255,255,0.7)",
    fontSize: 13,
  },

  heroAmount: {
    marginTop: 10,
    color: C.white,
    fontSize: 32,
    fontWeight: "900",
  },

  heroGrowth: {
    marginTop: 8,
    color: "#86EFAC",
    fontSize: 13,
    fontWeight: "700",
  },

  heroIcon: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor:
      "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  scroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
  },

  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent:
      "space-between",
  },

  summaryCard: {
    width: (width - 42) / 2,
    backgroundColor: C.card,
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
  },

  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  summaryValue: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: "900",
    color: C.text,
  },

  summaryLabel: {
    marginTop: 6,
    fontSize: 12,
    color: C.muted,
    fontWeight: "700",
  },

  section: {
    backgroundColor: C.card,
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
  },

  sectionTop: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: C.text,
  },

  viewAll: {
    fontSize: 12,
    fontWeight: "800",
    color: C.primary,
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent:
      "space-between",
  },

  quickCard: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    borderRadius: 22,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 12,
  },

  quickIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  quickTitle: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "800",
    color: C.text,
    textAlign: "center",
  },

  chartBox: {
    height: 170,
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent:
      "space-between",
    paddingHorizontal: 12,
    paddingBottom: 16,
    paddingTop: 18,
  },

  chartItem: {
    alignItems: "center",
    flex: 1,
  },

  chartBar: {
    width: 16,
    borderRadius: 30,
    backgroundColor: C.primary,
  },

  chartLabel: {
    marginTop: 8,
    fontSize: 10,
    color: C.muted,
    fontWeight: "700",
  },

  paymentRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor:
      "#F1F5F9",
  },

  paymentLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFF7ED",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  paymentName: {
    fontSize: 14,
    fontWeight: "800",
    color: C.text,
  },

  paymentSub: {
    marginTop: 4,
    fontSize: 11,
    color: C.muted,
  },

  paymentAmount: {
    fontSize: 15,
    fontWeight: "900",
    color: C.green,
  },

  progressItem: {
    marginBottom: 16,
  },

  progressTop: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    marginBottom: 7,
  },

  progressLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: C.text,
  },

  progressValue: {
    fontSize: 13,
    fontWeight: "900",
    color: C.text,
  },

  progressTrack: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 30,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 30,
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
});
