// src/screens/seller/SellerSettingsScreen.js

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { showAlert } from "../../utils/showAlert";
import { useShop } from "../../context/ShopContext";

const C = {
  primary: "#082843",
  white: "#FFFFFF",
  bg: "#F8FAFC",
  text: "#111827",
  muted: "#6B7280",
  border: "#E2E8F0",
  danger: "#EF4444",
  success: "#16A34A",
  card: "#FFFFFF",
};

export default function SellerSettingsScreen({ navigation }) {
  const { sellerSettings, saveSellerSettings } = useShop();
  const [orderNotif, setOrderNotif] = useState(Boolean(sellerSettings?.orderNotifications));
  const [promoNotif, setPromoNotif] = useState(Boolean(sellerSettings?.promotionalUpdates));
  const [smsNotif, setSmsNotif] = useState(Boolean(sellerSettings?.smsAlerts));
  const [emailNotif, setEmailNotif] = useState(Boolean(sellerSettings?.emailUpdates));
  const [darkMode, setDarkMode] = useState(Boolean(sellerSettings?.darkMode));
  const [autoAccept, setAutoAccept] = useState(Boolean(sellerSettings?.autoAcceptOrders));

  React.useEffect(() => {
    setOrderNotif(Boolean(sellerSettings?.orderNotifications));
    setPromoNotif(Boolean(sellerSettings?.promotionalUpdates));
    setSmsNotif(Boolean(sellerSettings?.smsAlerts));
    setEmailNotif(Boolean(sellerSettings?.emailUpdates));
    setDarkMode(Boolean(sellerSettings?.darkMode));
    setAutoAccept(Boolean(sellerSettings?.autoAcceptOrders));
  }, [sellerSettings]);

  const persistSettings = async (patch) => {
    try {
      await saveSellerSettings(patch);
    } catch (error) {
      showAlert("Error", error?.message || "Unable to update settings.");
    }
  };

  const SECTIONS = [
    {
      title: "Notifications",
      items: [
        {
          label: "Order Notifications",
          sub: "Get notified for new orders",
          icon: "notifications-outline",
          iconColor: C.primary,
          iconBg: "#EFF6FF",
          type: "toggle",
          value: orderNotif,
          onChange: (value) => {
            setOrderNotif(value);
            persistSettings({ orderNotifications: value });
          },
        },
        {
          label: "Promotional Updates",
          sub: "Tips, offers & platform news",
          icon: "megaphone-outline",
          iconColor: "#7C3AED",
          iconBg: "#F5F3FF",
          type: "toggle",
          value: promoNotif,
          onChange: (value) => {
            setPromoNotif(value);
            persistSettings({ promotionalUpdates: value });
          },
        },
        {
          label: "SMS Alerts",
          sub: "Order SMS on your phone",
          icon: "chatbubble-outline",
          iconColor: "#0EA5E9",
          iconBg: "#F0F9FF",
          type: "toggle",
          value: smsNotif,
          onChange: (value) => {
            setSmsNotif(value);
            persistSettings({ smsAlerts: value });
          },
        },
        {
          label: "Email Updates",
          sub: "Reports & summaries via email",
          icon: "mail-outline",
          iconColor: "#F59E0B",
          iconBg: "#FEF3C7",
          type: "toggle",
          value: emailNotif,
          onChange: (value) => {
            setEmailNotif(value);
            persistSettings({ emailUpdates: value });
          },
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          label: "Dark Mode",
          sub: "Switch app appearance",
          icon: "moon-outline",
          iconColor: "#6B7280",
          iconBg: "#F1F5F9",
          type: "toggle",
          value: darkMode,
          onChange: (value) => {
            setDarkMode(value);
            persistSettings({ darkMode: value });
          },
        },
        {
          label: "Auto-accept Orders",
          sub: "Skip manual order confirmation",
          icon: "flash-outline",
          iconColor: "#F59E0B",
          iconBg: "#FEF3C7",
          type: "toggle",
          value: autoAccept,
          onChange: (value) => {
            setAutoAccept(value);
            persistSettings({ autoAcceptOrders: value });
          },
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          label: "Change Password",
          sub: "Update your login password",
          icon: "lock-closed-outline",
          iconColor: "#16A34A",
          iconBg: "#ECFDF5",
          type: "nav",
          onPress: () => showAlert("Change Password", "Password change flow coming soon."),
        },
        {
          label: "Language",
          sub: "English (India)",
          icon: "globe-outline",
          iconColor: "#0EA5E9",
          iconBg: "#F0F9FF",
          type: "nav",
          onPress: () => showAlert("Language", "More languages coming soon."),
        },
        {
          label: "Delete Account",
          sub: "Permanently remove your account",
          icon: "trash-outline",
          iconColor: C.danger,
          iconBg: "#FFF5F5",
          type: "nav",
          danger: true,
          onPress: () =>
            showAlert(
              "Delete Account",
              "Are you sure? This action cannot be undone.",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => {} },
              ]
            ),
        },
      ],
    },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.sectionWrap}>
            <Text style={styles.sectionLabel}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, idx) => (
                <View key={item.label}>
                  <View style={styles.settingRow}>
                    <View style={[styles.settingIcon, { backgroundColor: item.iconBg }]}>
                      <Ionicons name={item.icon} size={20} color={item.iconColor} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.settingLabel, item.danger && { color: C.danger }]}>
                        {item.label}
                      </Text>
                      <Text style={styles.settingSub}>{item.sub}</Text>
                    </View>
                    {item.type === "toggle" ? (
                      <Switch
                        value={item.value}
                        onValueChange={item.onChange}
                        trackColor={{ false: "#E2E8F0", true: C.primary + "80" }}
                        thumbColor={item.value ? C.primary : "#CBD5E1"}
                      />
                    ) : (
                      <TouchableOpacity onPress={item.onPress}>
                        <Ionicons name="chevron-forward" size={18} color={C.muted} />
                      </TouchableOpacity>
                    )}
                  </View>
                  {idx < section.items.length - 1 && <View style={styles.rowDivider} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.version}>Version 1.0.0 · Crafty Marketplace</Text>
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
  headerTitle: { fontSize: 18, fontWeight: "900", color: C.text },
  content: { padding: 16, paddingBottom: 40 },
  sectionWrap: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 12, fontWeight: "900", color: C.muted,
    textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8, marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: C.card, borderRadius: 20,
    borderWidth: 1, borderColor: C.border,
    overflow: "hidden",
    elevation: 1, shadowColor: "#000", shadowOpacity: 0.04,
    shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  settingRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 14, gap: 14,
  },
  settingIcon: {
    width: 40, height: 40, borderRadius: 13,
    alignItems: "center", justifyContent: "center",
  },
  settingLabel: { fontSize: 14, fontWeight: "800", color: C.text, marginBottom: 2 },
  settingSub: { fontSize: 12, fontWeight: "600", color: C.muted },
  rowDivider: { height: 1, backgroundColor: C.border, marginLeft: 70 },
  version: {
    textAlign: "center", fontSize: 12, color: C.muted,
    fontWeight: "700", marginTop: 8,
  },
});
