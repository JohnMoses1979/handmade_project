// screens/customer/NotificationsScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Header from "../../components/Header";
import { COLORS } from "../../constants/colors";
import { useShop } from "../../context/ShopContext";

export default function CustomerNotifications({ navigation }) {
  const {
    customerNotifications = [],
    markCustomerNotificationRead,
    markAllCustomerNotificationsRead,
  } = useShop();

  const markAllAsRead = () => {
    markAllCustomerNotificationsRead?.();
  };

  const unreadCount = customerNotifications.filter((item) => item.unread).length;

  return (
    <View style={styles.container}>
      <Header
        title="Notifications"
        navigation={navigation}
        color={COLORS.customer}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.topCard}>
          <View>
            <Text style={styles.topTitle}>Your Updates</Text>
            <Text style={styles.topText}>
              {unreadCount > 0
                ? `${unreadCount} unread notifications`
                : "All caught up!"}
            </Text>
          </View>

          <TouchableOpacity style={styles.readBtn} onPress={markAllAsRead}>
            <Text style={styles.readBtnText}>Mark Read</Text>
          </TouchableOpacity>
        </View>

        {customerNotifications.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons
              name="notifications-off-outline"
              size={54}
              color={COLORS.muted || "#6B7280"}
            />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyText}>
              Your order updates and offers will appear here.
            </Text>
          </View>
        ) : (
          customerNotifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              style={[
                styles.notificationCard,
                item.unread && styles.unreadCard,
              ]}
              onPress={() => markCustomerNotificationRead?.(item.id)}
            >
              <View style={[styles.iconBox, { backgroundColor: item.iconBg || item.color || COLORS.customer || "#E83E7C" }]}>
                <Ionicons name={item.icon || "notifications-outline"} size={24} color="#FFFFFF" />
              </View>

              <View style={styles.infoBox}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>{item.title}</Text>
                  {item.unread ? <View style={styles.dot} /> : null}
                </View>

                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor:"#FFFFFF" },
  scroll: { padding: 16, paddingBottom: 20 },

  topCard: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: COLORS.customer || "#E83E7C",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  topTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  topText: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(255,255,255,0.86)",
  },
  readBtn: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
  },
  readBtnText: {
    color: COLORS.customer || "#E83E7C",
    fontSize: 12,
    fontWeight: "900",
  },

  notificationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  unreadCard: {
    borderWidth: 1.5,
    borderColor: COLORS.customer || "#E83E7C",
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoBox: { flex: 1 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 15,
    fontWeight: "900",
    color: COLORS.text || "#111827",
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.customer || "#E83E7C",
  },
  message: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.muted || "#6B7280",
    lineHeight: 19,
  },
  time: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.customer || "#E83E7C",
  },

  emptyBox: {
    marginTop: 60,
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyTitle: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.text || "#111827",
  },
  emptyText: {
    marginTop: 6,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.muted || "#6B7280",
    lineHeight: 20,
  },
});
