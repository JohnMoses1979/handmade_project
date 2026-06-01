

// src/screens/admin/SellerDetailsScreen.js

import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useShop } from "../../context/ShopContext";
import { showAlert } from "../../utils/showAlert";

const C = {
  primary: "#0e3243",
  accent: "#1a9e6e",
  white: "#FFFFFF",
  bg: "#f4f6f9",
  card: "#FFFFFF",
  text: "#0e3243",
  muted: "#7a93a0",
  border: "#e2eaf0",
  red: "#e74c3c",
  green: "#1a9e6e",
  blue: "#4F46E5",
};

const STATUS_CONFIG = {
  Approved: { bg: "#ECFDF5", text: "#10B981" },
  Pending:  { bg: "#FFF7ED", text: "#F59E0B" },
  Rejected: { bg: "#FEF2F2", text: "#EF4444" },
};

export default function SellerDetailsScreen({ navigation, route }) {
  // Always read the latest seller from context so the screen stays in sync
  // after approve/reject actions performed elsewhere.
  const { approvedSellers, pendingSellers, rejectedSellers } = useShop();

  const routeSeller = route?.params?.seller ?? {};
  const sellerId = routeSeller?.id ?? routeSeller?.sellerId ?? null;

  // Find the freshest copy from context; fall back to route param if not found
  const seller = (() => {
    if (!sellerId) return routeSeller;
    return (
      [...approvedSellers, ...pendingSellers, ...rejectedSellers].find(
        (s) => String(s.id) === String(sellerId)
      ) ?? routeSeller
    );
  })();

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleContact = useCallback(() => {
    const email = seller?.email;
    if (!email) {
      showAlert("No Email", "This seller has no email address on record.");
      return;
    }
    showAlert(
      "Contact Seller",
      `Send an email to ${email}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Open Mail",
          onPress: () => {
            Linking.openURL(`mailto:${email}`).catch(() =>
              showAlert("Error", "Could not open mail app.")
            );
          },
        },
      ]
    );
  }, [seller?.email]);

  const handleSuspend = useCallback(() => {
    showAlert(
      "Suspend Seller",
      `Suspend ${seller?.name ?? "this seller"}'s account? They will not be able to log in until reinstated.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Suspend",
          style: "destructive",
          onPress: () =>
            showAlert(
              "Suspended",
              `${seller?.name ?? "Seller"}'s account has been suspended.`
            ),
        },
      ]
    );
  }, [seller?.name]);

  const handleViewDocuments = useCallback(() => {
    navigation.navigate("SellerDocumentsScreen", {
      seller,
      documents: seller?.documents ?? [],
    });
  }, [navigation, seller]);

  // ── Build address string ──────────────────────────────────────────────────
  const addressStr = seller?.address
    ? [
        seller.address.address1,
        seller.address.address2,
        seller.address.city,
        seller.address.state,
        seller.address.pin,
      ]
        .filter(Boolean)
        .join(", ")
    : "—";

  // ── Info rows ─────────────────────────────────────────────────────────────
  const stats = [
    { label: "Phone",                value: seller?.phone         ?? "—",            icon: "call-outline"             },
    { label: "Category",             value: seller?.category      ?? "—",            icon: "grid-outline"             },
    { label: "GST",                  value: seller?.gst           || "Not provided", icon: "receipt-outline"          },
    { label: "Business Description", value: seller?.description   || "—",            icon: "information-circle-outline"},
    { label: "Address",              value: addressStr,                               icon: "location-outline"         },
    { label: "Registered On",        value: seller?.registeredAtLabel ?? seller?.joined ?? "—", icon: "calendar-outline"},
    { label: "Documents",            value: `${seller?.documents?.length ?? 0} uploaded`,       icon: "document-text-outline"},
    { label: "Rating",               value: `⭐ ${seller?.rating ?? "0.0"} / 5`,                icon: "star-outline"         },
    { label: "Total Products",       value: String(seller?.totalProducts ?? 0),                  icon: "cube-outline"         },
    { label: "Total Orders",         value: String(seller?.totalOrders   ?? 0),                  icon: "bag-handle-outline"   },
    { label: "Total Sales",          value: seller?.totalSales   ?? "₹0",                        icon: "cash-outline"         },
    { label: "Commission",           value: seller?.commission   ?? "₹0",                        icon: "wallet-outline"       },
  ];

  const statusConfig = STATUS_CONFIG[seller?.status] ?? { bg: "#F3F4F6", text: "#6B7280" };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seller Details</Text>
        <TouchableOpacity onPress={handleContact}>
          <Ionicons name="mail-outline" size={22} color={C.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(seller?.name ?? "S").charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.sellerName}>{seller?.name ?? "Seller"}</Text>
          <Text style={styles.shopName}>{seller?.shopName ?? "—"}</Text>
          <Text style={styles.sellerEmail}>{seller?.email ?? "—"}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
            <Text style={[styles.statusText, { color: statusConfig.text }]}>
              {seller?.status ?? "Pending"}
            </Text>
          </View>
        </View>

        {/* Info card */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Seller Information</Text>
          {stats.map((item, index) => (
            <View key={index} style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <View style={styles.iconBox}>
                  <Ionicons name={item.icon} size={18} color={C.primary} />
                </View>
                <Text style={styles.infoLabel}>{item.label}</Text>
              </View>
              <Text style={styles.infoValue} numberOfLines={3}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Rejection reason (only shown if rejected) */}
        {seller?.status === "Rejected" && !!seller?.rejectionReason && (
          <View style={styles.rejectionCard}>
            <Ionicons name="close-circle" size={18} color={C.red} />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.rejectionLabel}>Rejection Reason</Text>
              <Text style={styles.rejectionText}>{seller.rejectionReason}</Text>
            </View>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.contactBtn}
            activeOpacity={0.8}
            onPress={handleContact}
          >
            <Ionicons name="mail-outline" size={18} color={C.white} />
            <Text style={styles.contactBtnText}>Contact Seller</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.documentsBtn}
            activeOpacity={0.8}
            onPress={handleViewDocuments}
          >
            <Ionicons name="document-text-outline" size={18} color={C.white} />
            <Text style={styles.documentsBtnText}>
              View Documents ({seller?.documents?.length ?? 0})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.suspendBtn}
            activeOpacity={0.8}
            onPress={handleSuspend}
          >
            <Ionicons name="ban-outline" size={18} color={C.red} />
            <Text style={styles.suspendBtnText}>Suspend Seller</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: C.white,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "900",
    color: C.text,
  },

  scroll: { flex: 1, padding: 16 },

  profileCard: {
    backgroundColor: C.card,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    elevation: 3,
    shadowColor: C.primary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 30,
    backgroundColor: C.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  avatarText: { color: C.white, fontSize: 34, fontWeight: "900" },
  sellerName: { fontSize: 22, fontWeight: "900", color: C.text },
  shopName: { marginTop: 4, fontSize: 14, fontWeight: "700", color: C.primary },
  sellerEmail: { marginTop: 6, fontSize: 13, color: C.muted },
  statusBadge: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 30,
  },
  statusText: { fontSize: 12, fontWeight: "800" },

  infoCard: {
    backgroundColor: C.card,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: C.text,
    marginBottom: 18,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoLabel: { fontSize: 13, color: C.muted, fontWeight: "600" },
  infoValue: {
    fontSize: 13,
    fontWeight: "800",
    color: C.text,
    maxWidth: "45%",
    textAlign: "right",
    flexShrink: 1,
  },

  rejectionCard: {
    backgroundColor: "#FEE2E2",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  rejectionLabel: { fontSize: 12, fontWeight: "800", color: C.red },
  rejectionText: { fontSize: 13, color: "#7f1d1d", marginTop: 4, lineHeight: 18 },

  actionSection: { gap: 12, marginBottom: 16 },

  contactBtn: {
    height: 54,
    borderRadius: 18,
    backgroundColor: C.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  contactBtnText: { color: C.white, fontSize: 15, fontWeight: "800" },

  documentsBtn: {
    height: 54,
    borderRadius: 18,
    backgroundColor: C.blue,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  documentsBtnText: { color: C.white, fontSize: 15, fontWeight: "800" },

  suspendBtn: {
    height: 54,
    borderRadius: 18,
    backgroundColor: "#FEF2F2",
    borderWidth: 1.5,
    borderColor: "#FECACA",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  suspendBtnText: { color: C.red, fontSize: 15, fontWeight: "800" },
});
