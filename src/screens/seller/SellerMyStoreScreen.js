// src/screens/seller/SellerMyStoreScreen.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useShop } from "../../context/ShopContext";
import { showAlert } from "../../utils/showAlert";

const C = {
  primary: "#082843",
  white: "#FFFFFF",
  bg: "#F8FAFC",
  text: "#111827",
  muted: "#6B7280",
  border: "#E2E8F0",
  success: "#16A34A",
  successSoft: "#ECFDF5",
  card: "#FFFFFF",
};

const CATEGORIES = [
  "Decor", "Pottery", "Jewelry", "Clothing", "Electronics",
  "Food", "Art", "Books", "Furniture", "Sports",
];

export default function SellerMyStoreScreen({ navigation }) {
  const { currentSeller, sellerStats, saveSellerProfile, formatPrice } = useShop();
  const seller = currentSeller || {};

  const [shopName, setShopName] = useState(seller.shopName || "");
  const [description, setDescription] = useState(seller.description || "");
  const [selectedCategory, setSelectedCategory] = useState(seller.category || "Decor");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setShopName(seller.shopName || "");
    setDescription(seller.description || "");
    setSelectedCategory(seller.category || "Decor");
  }, [seller.shopName, seller.description, seller.category]);

  const handleSave = async () => {
    try {
      await saveSellerProfile({
        shopName,
        description,
        category: selectedCategory,
        phone: seller.phone || "",
        email: seller.email || "",
      });
      setEditing(false);
      showAlert("Success", "Store details updated successfully.");
    } catch (error) {
      showAlert("Error", error?.message || "Unable to update store details.");
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Store</Text>
        <TouchableOpacity
          style={styles.editHeaderBtn}
          onPress={() => setEditing(!editing)}
        >
          <Ionicons name={editing ? "checkmark" : "create-outline"} size={20} color={C.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Store Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.storeAvatar}>
            <Text style={styles.storeAvatarText}>
              {shopName ? shopName[0].toUpperCase() : "S"}
            </Text>
          </View>
          <View style={styles.storeBadgeRow}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveBadgeText}>Store Active</Text>
            </View>
          </View>
        </View>

        {/* Store Stats */}
        <View style={styles.statsGrid}>
          {[
            { label: "Products", value: sellerStats?.liveProducts ?? 0, icon: "cube-outline", color: C.primary },
            { label: "Orders", value: sellerStats?.totalOrders ?? 0, icon: "receipt-outline", color: "#0EA5E9" },
            { label: "Pending", value: sellerStats?.pendingApprovalCount ?? 0, icon: "time-outline", color: "#F59E0B" },
            { label: "Earnings", value: `₹${((sellerStats?.totalEarnings ?? 0) / 1000).toFixed(1)}K`, icon: "wallet-outline", color: C.success },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + "15" }]}>
                <Ionicons name={stat.icon} size={18} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Store Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Store Details</Text>

          <Text style={styles.fieldLabel}>Store Name</Text>
          <TextInput
            style={[styles.input, !editing && styles.inputDisabled]}
            value={shopName}
            onChangeText={setShopName}
            editable={editing}
            placeholder="Your store name"
            placeholderTextColor={C.muted}
          />

          <Text style={styles.fieldLabel}>Store Description</Text>
          <TextInput
            style={[styles.input, styles.inputMulti, !editing && styles.inputDisabled]}
            value={description}
            onChangeText={setDescription}
            editable={editing}
            multiline
            numberOfLines={3}
            placeholder="Tell customers about your store"
            placeholderTextColor={C.muted}
          />

          <Text style={styles.fieldLabel}>Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.catChip,
                  selectedCategory === cat && styles.catChipActive,
                  !editing && styles.catChipDisabled,
                ]}
                onPress={() => editing && setSelectedCategory(cat)}
                activeOpacity={editing ? 0.8 : 1}
              >
                <Text
                  style={[
                    styles.catChipText,
                    selectedCategory === cat && styles.catChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Info</Text>
          {[
            { label: "Email", value: seller.email, icon: "mail-outline" },
            { label: "Phone", value: seller.phone, icon: "call-outline" },
          ].map((item) => (
            <View key={item.label} style={styles.contactRow}>
              <View style={styles.contactIcon}>
                <Ionicons name={item.icon} size={18} color={C.primary} />
              </View>
              <View>
                <Text style={styles.contactLabel}>{item.label}</Text>
                <Text style={styles.contactValue}>{item.value || "—"}</Text>
              </View>
            </View>
          ))}
        </View>

        {editing && (
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            activeOpacity={0.88}
          >
            <Ionicons name="checkmark-circle" size={20} color={C.white} />
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: {
    paddingTop: Platform.OS === "android" ? 38 : 54,
    paddingHorizontal: 16, paddingBottom: 12,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: C.white,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  iconBtn: {
    width: 42, height: 42, borderRadius: 21,
    alignItems: "center", justifyContent: "center", backgroundColor: "#F1F5F9",
  },
  editHeaderBtn: {
    width: 42, height: 42, borderRadius: 21,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "#EFF6FF",
  },
  headerTitle: { fontSize: 18, fontWeight: "900", color: C.text },
  content: { padding: 16, paddingBottom: 40 },
  bannerCard: {
    backgroundColor: C.primary, borderRadius: 20, padding: 24,
    alignItems: "center", marginBottom: 16,
  },
  storeAvatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 3, borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center", justifyContent: "center", marginBottom: 12,
  },
  storeAvatarText: { fontSize: 32, fontWeight: "900", color: C.white },
  storeBadgeRow: { flexDirection: "row", gap: 8 },
  liveBadge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 99,
  },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#4ADE80" },
  liveBadgeText: { fontSize: 12, fontWeight: "800", color: C.white },
  statsGrid: {
    flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16,
  },
  statCard: {
    flex: 1, minWidth: "44%", backgroundColor: C.card,
    borderRadius: 16, padding: 14, alignItems: "center",
    borderWidth: 1, borderColor: C.border,
    elevation: 1, shadowColor: "#000", shadowOpacity: 0.04,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  statIcon: {
    width: 36, height: 36, borderRadius: 12,
    alignItems: "center", justifyContent: "center", marginBottom: 8,
  },
  statValue: { fontSize: 18, fontWeight: "900", color: C.text, marginBottom: 3 },
  statLabel: { fontSize: 11, fontWeight: "700", color: C.muted },
  section: {
    backgroundColor: C.card, borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: C.border, marginBottom: 14,
    elevation: 1, shadowColor: "#000", shadowOpacity: 0.04,
    shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: { fontSize: 16, fontWeight: "900", color: C.text, marginBottom: 16 },
  fieldLabel: { fontSize: 12, fontWeight: "800", color: C.muted, marginBottom: 6 },
  input: {
    borderWidth: 1.5, borderColor: C.border, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, fontWeight: "700", color: C.text, marginBottom: 14,
    backgroundColor: C.white,
  },
  inputMulti: { minHeight: 80, textAlignVertical: "top" },
  inputDisabled: { backgroundColor: "#F8FAFC", color: C.muted },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  catChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99,
    borderWidth: 1.5, borderColor: C.border, backgroundColor: C.white,
  },
  catChipActive: { borderColor: C.primary, backgroundColor: "#EFF6FF" },
  catChipDisabled: { opacity: 0.7 },
  catChipText: { fontSize: 12, fontWeight: "800", color: C.muted },
  catChipTextActive: { color: C.primary },
  contactRow: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 12 },
  contactIcon: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: "#EFF6FF", alignItems: "center", justifyContent: "center",
  },
  contactLabel: { fontSize: 11, color: C.muted, fontWeight: "700", marginBottom: 2 },
  contactValue: { fontSize: 14, fontWeight: "800", color: C.text },
  saveBtn: {
    backgroundColor: C.primary, borderRadius: 16, height: 54,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
  },
  saveBtnText: { color: C.white, fontSize: 16, fontWeight: "900" },
});
