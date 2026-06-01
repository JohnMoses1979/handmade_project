
// src/screens/seller/SellerDashboardScreen.js

import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useShop } from "../../context/ShopContext";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#082843",
  primaryDark: "#0A3D66",
  bg: "#F4F6FB",
  white: "#FFFFFF",
  text: "#0F172A",
  muted: "#7B8794",
  blue: "#3B82F6",
  green: "#10B981",
  orange: "#F97316",
  purple: "#8B5CF6",
  border: "#EAEFF5",
  danger: "#EF4444",
};

function PressableScale({ children, onPress, style }) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={pressIn}
        onPressOut={pressOut}
        onPress={onPress}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function SellerDashboardScreen({ navigation }) {
  const {
    unreadNotifications = 0,
    unreadComplaints = 0,
    sellerStats = {},
    sellerDashboard = {},
    formatPrice = (amount) => `â‚¹${amount || 0}`,
    currentSeller,
    reloadSellerNotifications,
    reloadComplaints,
  } = useShop();
  const [selectedTab, setSelectedTab] = useState("Dashboard");
  const salesOverview = sellerDashboard.salesOverview ?? { bars: [] };
  const topProducts = sellerDashboard.topSellingProducts ?? [];

  useFocusEffect(
    useCallback(() => {
      if (currentSeller?.id) {
        reloadSellerNotifications?.(currentSeller.id);
        reloadComplaints?.(currentSeller.id);
      }
    }, [currentSeller?.id, reloadSellerNotifications, reloadComplaints])
  );

  const stats = [
    {
      title: "Orders",
      value: String(sellerStats.totalOrders ?? 0),
      icon: "bag-handle-outline",
      color: COLORS.blue,
      screen: "SellerOrdersScreen",
    },
    {
      title: "Live",
      value: String(sellerStats.liveProducts ?? 0),
      icon: "eye-outline",
      color: COLORS.green,
      screen: "MyProductsScreen",
    },
    {
      title: "Returns",
      value: String(sellerStats.returns ?? 0),
      icon: "return-up-back-outline",
      color: COLORS.orange,
      screen: "SellerReturnScreen",
    },
    {
      title: "Pending",
      value: String(sellerStats.processing ?? 0),
      icon: "time-outline",
      color: COLORS.purple,
      screen: "SellerOrdersScreen",
    },
  ];

  const actions = [
    {
      title: "Add Product",
      icon: "add-circle-outline",
      color: COLORS.blue,
      screen: "AddProductScreen",
    },
    {
      title: "My Products",
      icon: "pricetag-outline",
      color: COLORS.green,
      screen: "MyProductsScreen",
    },
    {
      title: "Orders",
      icon: "clipboard-outline",
      color: COLORS.orange,
      screen: "SellerOrdersScreen",
    },
    {
      title: "Returns",
      icon: "return-up-back-outline",
      color: COLORS.purple,
      screen: "SellerReturnScreen",
    },
    {
      title: "Hire Delivery",
      icon: "bicycle-outline",
      color: COLORS.orange,
      screen: "SellerDeliveryScreen",
    },
    {
      title: "Payouts",
      icon: "wallet-outline",
      color: COLORS.blue,
      screen: "SellerPayoutScreen",
    },
  ];

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <LinearGradient
              colors={[COLORS.primaryDark, COLORS.primary]}
              style={styles.storeBox}
            >
              <Ionicons name="storefront" size={28} color={COLORS.white} />
            </LinearGradient>

            <View>
              <Text style={styles.heading}>Seller Dashboard</Text>
              <Text style={styles.subHeading}>
                Manage products, orders &{"\n"}grow your business
              </Text>
            </View>
          </View>

          {/* HEADER ICONS â€” message icon removed */}
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigateTo("SellerNotificationScreen")}
            >
              <Ionicons
                name="notifications-outline"
                size={21}
                color={COLORS.primary}
              />
              {unreadNotifications > 0 ? (
                <View style={[styles.badge, { backgroundColor: COLORS.danger }]}>
                  <Text style={styles.badgeText}>
                    {unreadNotifications > 99 ? "99+" : unreadNotifications}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigateTo("SellerComplaintNotificationScreen")}
            >
              <Ionicons
                name="alert-circle-outline"
                size={21}
                color={COLORS.danger}
              />
              <View style={[styles.badge, { backgroundColor: "#FF4D4F" }]}>
                <Text style={styles.badgeText}>
                  {unreadComplaints > 99 ? "99+" : unreadComplaints}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigateTo("SellerProfileScreen")}
            >
              <Ionicons name="person" size={21} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* EARNING CARD */}
        <LinearGradient
          colors={[COLORS.primaryDark, COLORS.primary]}
          style={styles.earningCard}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.earningTitle}>Total Earnings</Text>
            <Text style={styles.earningAmount}>
              {formatPrice(sellerStats.totalEarnings ?? 0)}
            </Text>
            <View style={styles.growthRow}>
              <Ionicons
                name={
                  sellerStats.monthlyGrowthPositive === false
                    ? "trending-down"
                    : "trending-up"
                }
                size={15}
                color={
                  sellerStats.monthlyGrowthPositive === false
                    ? "#FCA5A5"
                    : "#34D399"
                }
              />
              <Text style={styles.growthText}>
                {`${sellerStats.monthlyGrowthPositive === false ? "↓" : "↑"} ${Math.abs(
                  sellerStats.monthlyGrowthPercent ?? 0
                ).toFixed(1)}% from last month`}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.walletBox}
            onPress={() => navigateTo("SellerPayoutScreen")}
          >
            <Ionicons name="wallet" size={30} color={COLORS.primary} />
            <Text style={styles.walletText}>Payouts</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* STATS */}
        <View style={styles.statsContainer}>
          {stats.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.statCard}
              activeOpacity={0.9}
              onPress={() => navigateTo(item.screen)}
            >
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: item.color + "15" },
                ]}
              >
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statTitle}>{item.title}</Text>
              <View
                style={[styles.bottomLine, { backgroundColor: item.color }]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionGrid}>
            {actions.map((item, index) => (
              <PressableScale
                key={index}
                style={styles.actionCard}
                onPress={() => navigateTo(item.screen)}
              >
                <View
                  style={[
                    styles.actionIcon,
                    { backgroundColor: item.color + "15" },
                  ]}
                >
                  <Ionicons name={item.icon} size={28} color={item.color} />
                </View>
                <Text style={styles.actionTitle}>{item.title}</Text>
                <Text style={styles.actionSub}>Open screen</Text>
              </PressableScale>
            ))}
          </View>
        </View>

        {/* SALES */}
        <View style={styles.row}>
          <View style={styles.salesCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.salesTitle}>Sales Overview</Text>
              <Text style={styles.weekText}>This Week</Text>
            </View>
            <Text style={styles.salesAmount}>
              {formatPrice(salesOverview.amount ?? 0)}
            </Text>
            <Text
              style={[
                styles.salesGrowth,
                {
                  color:
                    salesOverview.isPositive === false
                      ? COLORS.danger
                      : COLORS.green,
                },
              ]}
            >
              {`${salesOverview.isPositive === false ? "↓" : "↑"} ${Math.abs(
                salesOverview.growthPercent ?? 0
              ).toFixed(1)}% from last week`}
            </Text>
            <View style={styles.chart}>
              {salesOverview.bars.map((bar, index) => (
                <View key={index} style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: bar.height,
                        backgroundColor:
                          index === salesOverview.highlightIndex
                            ? COLORS.blue
                            : "#DCE7FF",
                      },
                    ]}
                  />
                  <Text style={styles.barDay}>{bar.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* TOP PRODUCTS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Selling Product</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {topProducts.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.productRow}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.productImage}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.soldCount}>{item.sold}</Text>
                <Text style={styles.soldText}>Sold</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* NOTIFICATION ROW */}
        <View style={styles.notifyRow}>
          <TouchableOpacity
            style={styles.notifyCard}
            onPress={() => navigateTo("SellerComplaintNotificationScreen")}
          >
            <Ionicons name="shield-outline" size={26} color="#EF4444" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.notifyTitle}>Complaint Notifications</Text>
              <Text style={styles.notifySub}>
                {unreadComplaints > 0
                  ? `${unreadComplaints} new complaints received`
                  : "No new complaints"}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.notifyCard}
            onPress={() => navigateTo("SellerNotificationScreen")}
          >
            <Ionicons
              name="notifications-outline"
              size={26}
              color="#3B82F6"
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.notifyTitle}>All Notifications</Text>
              <Text style={styles.notifySub}>
                {unreadNotifications > 0
                  ? `${unreadNotifications} unread notifications`
                  : "All caught up"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* BOTTOM NAVIGATION */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => setSelectedTab("Dashboard")}
        >
          <Ionicons
            name="home"
            size={23}
            color={
              selectedTab === "Dashboard" ? COLORS.primary : "#A1A1AA"
            }
          />
          <Text
            style={[
              styles.bottomLabel,
              {
                color:
                  selectedTab === "Dashboard" ? COLORS.primary : "#A1A1AA",
              },
            ]}
          >
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => navigateTo("MyProductsScreen")}
        >
          <Ionicons name="cube-outline" size={23} color="#A1A1AA" />
          <Text style={styles.bottomInactive}>Products</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => navigateTo("AddProductScreen")}
        >
          <Ionicons name="add" size={34} color={COLORS.white} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => navigateTo("SellerOrdersScreen")}
        >
          <Ionicons name="clipboard-outline" size={23} color="#A1A1AA" />
          <Text style={styles.bottomInactive}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => navigateTo("SellerProfileScreen")}
        >
          <Ionicons name="person-outline" size={23} color="#A1A1AA" />
          <Text style={styles.bottomInactive}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: Platform.OS === "android" ? 50 : 60,
    paddingBottom: 140,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 22,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  storeBox: {
    width: 70,
    height: 70,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  heading: {
    fontSize: 21,
    fontWeight: "900",
    color: COLORS.text,
  },
  subHeading: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 4,
    lineHeight: 18,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    elevation: 2,
  },
  badge: {
    position: "absolute",
    right: 6,
    top: 6,
    backgroundColor: COLORS.primary,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "800",
  },
  earningCard: {
    borderRadius: 30,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  earningTitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
    fontWeight: "700",
  },
  earningAmount: {
    color: COLORS.white,
    fontSize: 44,
    fontWeight: "900",
    marginVertical: 10,
  },
  growthRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  growthText: {
    color: COLORS.white,
    marginLeft: 6,
    fontWeight: "700",
  },
  walletBox: {
    width: 110,
    height: 110,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  walletText: {
    marginTop: 8,
    fontWeight: "900",
    color: COLORS.primary,
  },
  statsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    flexDirection: "row",
    paddingVertical: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
  },
  statIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontSize: 30,
    fontWeight: "900",
    marginTop: 10,
    color: COLORS.text,
  },
  statTitle: {
    color: COLORS.muted,
    fontWeight: "700",
    marginTop: 4,
  },
  bottomLine: {
    width: 34,
    height: 4,
    borderRadius: 10,
    marginTop: 12,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 18,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.text,
  },
  viewAll: {
    color: COLORS.blue,
    fontWeight: "800",
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    paddingVertical: 22,
    alignItems: "center",
    marginBottom: 14,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  actionTitle: {
    fontWeight: "900",
    fontSize: 15,
    color: COLORS.text,
    marginTop: 12,
  },
  actionSub: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    marginBottom: 20,
  },
  salesCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 18,
  },
  salesTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.text,
  },
  weekText: {
    color: COLORS.muted,
    fontWeight: "700",
  },
  salesAmount: {
    fontSize: 36,
    fontWeight: "900",
    color: COLORS.primary,
  },
  salesGrowth: {
    color: COLORS.green,
    fontWeight: "700",
    marginTop: 4,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 22,
    height: 120,
  },
  barWrapper: {
    alignItems: "center",
  },
  bar: {
    width: 20,
    borderRadius: 10,
  },
  barDay: {
    marginTop: 8,
    fontSize: 11,
    color: COLORS.muted,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 18,
    marginRight: 14,
  },
  productName: {
    fontWeight: "900",
    color: COLORS.text,
    fontSize: 15,
  },
  productPrice: {
    marginTop: 4,
    color: COLORS.muted,
    fontWeight: "700",
  },
  soldCount: {
    fontSize: 20,
    color: COLORS.green,
    fontWeight: "900",
  },
  soldText: {
    color: COLORS.muted,
    fontSize: 12,
  },
  notifyRow: {
    marginBottom: 20,
  },
  notifyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  notifyTitle: {
    fontWeight: "900",
    color: COLORS.text,
  },
  notifySub: {
    marginTop: 4,
    color: COLORS.muted,
  },
  bottomBar: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 18,
    height: 82,
    backgroundColor: COLORS.white,
    borderRadius: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 12,
    elevation: 12,
  },
  bottomItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  bottomLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "800",
  },
  bottomInactive: {
    fontSize: 12,
    marginTop: 4,
    color: "#A1A1AA",
    fontWeight: "700",
  },
  plusButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -42,
    borderWidth: 5,
    borderColor: COLORS.bg,
  },
});
