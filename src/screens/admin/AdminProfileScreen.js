


// src/screens/admin/AdminProfileScreen.js

import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useShop } from "../../context/ShopContext";

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

export default function AdminProfileScreen({
  navigation,
}) {
  const {
    approvedSellers = [],
    pendingSellers = [],
    pendingSellerProducts = [],
    orders = [],
    totalAdminCommission = 0,
  } = useShop();

  // COUNTS
  const approvedSellerCount =
    approvedSellers.length;

  const totalOrders =
    orders.length;

  const pendingProducts =
    pendingSellerProducts.length;

  // LOGOUT
  const handleLogout = () => {
    navigation.replace(
      "RoleSelectionScreen"
    );
  };

  // QUICK ACTIONS
  const quickActions = [
    {
      title: "Manage Sellers",
      icon: "storefront-outline",
      color: "#EEF2FF",
      iconColor: C.primary,
      action: () =>
        navigation.navigate(
          "ManageSellers"
        ),
    },

    {
      title: "Seller Approvals",
      icon: "checkmark-circle-outline",
      color: "#ECFDF5",
      iconColor: C.green,
      badge: pendingSellers.length,
      action: () =>
        navigation.navigate(
          "SellerApprovals"
        ),
    },

    {
      title: "Commissions",
      icon: "cash-outline",
      color: "#FFF7ED",
      iconColor: C.orange,
      action: () =>
        navigation.navigate(
          "AdminCommission"
        ),
    },

    {
      title: "Payouts",
      icon: "wallet-outline",
      color: "#FEF2F2",
      iconColor: C.red,
      action: () =>
        navigation.navigate(
          "AdminPayouts"
        ),
    },
  ];

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
            Admin Profile
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                "AdminNotifications"
              )
            }
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={C.white}
            />
          </TouchableOpacity>
        </View>

        {/* PROFILE */}
        <View style={styles.profileWrap}>
          <View style={styles.avatar}>
            <Ionicons
              name="shield-checkmark"
              size={42}
              color={C.white}
            />
          </View>

          <Text style={styles.adminName}>
            Super Admin
          </Text>

          <Text style={styles.adminEmail}>
            admin@shopapp.com
          </Text>

          <View style={styles.adminBadge}>
            <Ionicons
              name="checkmark-circle"
              size={14}
              color={C.green}
            />

            <Text
              style={
                styles.adminBadgeText
              }
            >
              Main Administrator
            </Text>
          </View>
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {approvedSellerCount}
            </Text>

            <Text style={styles.statLabel}>
              Sellers
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {totalOrders}
            </Text>

            <Text style={styles.statLabel}>
              Orders
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              ₹
              {totalAdminCommission >
              1000
                ? (
                    totalAdminCommission /
                    1000
                  ).toFixed(1) + "K"
                : totalAdminCommission}
            </Text>

            <Text style={styles.statLabel}>
              Earnings
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* QUICK MANAGEMENT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Quick Management
          </Text>

          <View style={styles.grid}>
            {quickActions.map(
              (item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.actionCard}
                  activeOpacity={0.8}
                  onPress={
                    item.action
                  }
                >
                  <View
                    style={[
                      styles.iconWrap,
                      {
                        backgroundColor:
                          item.color,
                      },
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={24}
                      color={
                        item.iconColor
                      }
                    />

                    {item.badge >
                      0 && (
                      <View
                        style={
                          styles.badge
                        }
                      >
                        <Text
                          style={
                            styles.badgeText
                          }
                        >
                          {
                            item.badge
                          }
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text
                    style={
                      styles.actionText
                    }
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>

        {/* ADMIN CONTROLS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Admin Controls
          </Text>

          {/* PRODUCTS */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate(
                "ManageProducts"
              )
            }
          >
            <View
              style={
                styles.menuLeft
              }
            >
              <View
                style={
                  styles.menuIcon
                }
              >
                <Ionicons
                  name="cube-outline"
                  size={20}
                  color={
                    C.primary
                  }
                />
              </View>

              <Text
                style={
                  styles.menuText
                }
              >
                Manage Products
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={C.muted}
            />
          </TouchableOpacity>

          {/* ORDERS */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate(
                "ManageOrders"
              )
            }
          >
            <View
              style={
                styles.menuLeft
              }
            >
              <View
                style={
                  styles.menuIcon
                }
              >
                <Ionicons
                  name="bag-handle-outline"
                  size={20}
                  color={
                    C.green
                  }
                />
              </View>

              <Text
                style={
                  styles.menuText
                }
              >
                Manage Orders
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={C.muted}
            />
          </TouchableOpacity>

          {/* REPORTS */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate(
                "AdminReports"
              )
            }
          >
            <View
              style={
                styles.menuLeft
              }
            >
              <View
                style={
                  styles.menuIcon
                }
              >
                <Ionicons
                  name="bar-chart-outline"
                  size={20}
                  color={
                    C.orange
                  }
                />
              </View>

              <Text
                style={
                  styles.menuText
                }
              >
                Reports & Analytics
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={C.muted}
            />
          </TouchableOpacity>

          {/* COMMISSION */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate(
                "AdminCommission"
              )
            }
          >
            <View
              style={
                styles.menuLeft
              }
            >
              <View
                style={
                  styles.menuIcon
                }
              >
                <Ionicons
                  name="analytics-outline"
                  size={20}
                  color={
                    C.orange
                  }
                />
              </View>

              <Text
                style={
                  styles.menuText
                }
              >
                Revenue Analytics
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={C.muted}
            />
          </TouchableOpacity>

          {/* COMPLAINTS */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate(
                "AdminComplaintReviewScreen"
              )
            }
          >
            <View
              style={
                styles.menuLeft
              }
            >
              <View
                style={
                  styles.menuIcon
                }
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color={C.red}
                />
              </View>

              <Text
                style={
                  styles.menuText
                }
              >
                Complaints
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={C.muted}
            />
          </TouchableOpacity>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={C.red}
          />

          <Text
            style={styles.logoutText}
          >
            Logout
          </Text>
        </TouchableOpacity>

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
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  headerTitle: {
    color: C.white,
    fontSize: 20,
    fontWeight: "800",
  },

  profileWrap: {
    alignItems: "center",
    marginTop: 28,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 30,
    backgroundColor:
      "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  adminName: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: "800",
    color: C.white,
  },

  adminEmail: {
    marginTop: 4,
    fontSize: 13,
    color:
      "rgba(255,255,255,0.7)",
  },

  adminBadge: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor:
      "rgba(255,255,255,0.12)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 30,
  },

  adminBadgeText: {
    color: "#86EFAC",
    fontSize: 12,
    fontWeight: "700",
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 28,
  },

  statCard: {
    flex: 1,
    backgroundColor:
      "rgba(255,255,255,0.12)",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
  },

  statValue: {
    color: C.white,
    fontSize: 16,
    fontWeight: "900",
  },

  statLabel: {
    marginTop: 5,
    color:
      "rgba(255,255,255,0.7)",
    fontSize: 11,
  },

  scroll: {
    flex: 1,
  },

  section: {
    marginTop: 18,
    marginHorizontal: 16,
    backgroundColor: C.card,
    borderRadius: 24,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.text,
    marginBottom: 16,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent:
      "space-between",
  },

  actionCard: {
    width: "47%",
    backgroundColor: "#F8FAFC",
    borderRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 14,
    marginBottom: 14,
    alignItems: "center",
  },

  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: C.red,
    minWidth: 22,
    height: 22,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },

  badgeText: {
    color: C.white,
    fontSize: 10,
    fontWeight: "800",
  },

  actionText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "700",
    color: C.text,
    textAlign: "center",
  },

  menuItem: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor:
      "#F1F5F9",
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  menuText: {
    fontSize: 14,
    fontWeight: "700",
    color: C.text,
  },

  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: "#FEF2F2",
    borderWidth: 1.5,
    borderColor: "#FECACA",
    height: 58,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },

  logoutText: {
    color: C.red,
    fontSize: 15,
    fontWeight: "800",
  },
});
