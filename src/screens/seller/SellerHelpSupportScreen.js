// src/screens/seller/SellerHelpSupportScreen.js

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Linking,
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
  success: "#16A34A",
  card: "#FFFFFF",
};

export default function SellerHelpSupportScreen({ navigation }) {
  const { sellerSupportContent } = useShop();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => setOpenFaq(openFaq === idx ? null : idx);

  const faqs = Array.isArray(sellerSupportContent?.faqs)
    ? sellerSupportContent.faqs
    : [];

  const quickActions = Array.isArray(sellerSupportContent?.quickActions)
    ? sellerSupportContent.quickActions.map((item) => {
        const actionConfig = {
          chat: {
            icon: "chatbubbles-outline",
            color: C.primary,
            bg: "#EFF6FF",
            onPress: () => showAlert("Chat", "Opening live chat..."),
          },
          email: {
            icon: "mail-outline",
            color: "#7C3AED",
            bg: "#F5F3FF",
            onPress: () => Linking.openURL(`mailto:${item.value}`),
          },
          phone: {
            icon: "call-outline",
            color: "#16A34A",
            bg: "#ECFDF5",
            onPress: () => Linking.openURL(`tel:${item.value}`),
          },
          bug: {
            icon: "bug-outline",
            color: "#EF4444",
            bg: "#FFF5F5",
            onPress: () => showAlert("Report", "Bug report sent to support."),
          },
        }[item.type] || {
          icon: "help-outline",
          color: C.primary,
          bg: "#EFF6FF",
          onPress: () => showAlert("Support", item.label),
        };

        return {
          label: item.label,
          ...actionConfig,
        };
      })
    : [];

  const supportHours = Array.isArray(sellerSupportContent?.supportHours)
    ? sellerSupportContent.supportHours
    : [];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroBanner}>
          <View style={styles.heroIcon}>
            <Ionicons name="help-buoy-outline" size={36} color={C.white} />
          </View>
          <Text style={styles.heroTitle}>How can we help you?</Text>
          <Text style={styles.heroSub}>
            We're here 24/7. Find answers below or reach out to us.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Quick Contact</Text>
        <View style={styles.quickGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.quickCard}
              onPress={action.onPress}
              activeOpacity={0.85}
            >
              <View style={[styles.quickIcon, { backgroundColor: action.bg }]}>
                <Ionicons name={action.icon} size={22} color={action.color} />
              </View>
              <Text style={styles.quickLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Frequently Asked Questions</Text>
        <View style={styles.faqCard}>
          {faqs.map((faq, idx) => (
            <View key={idx}>
              <TouchableOpacity
                style={styles.faqRow}
                onPress={() => toggleFaq(idx)}
                activeOpacity={0.85}
              >
                <Text style={styles.faqQ} numberOfLines={openFaq === idx ? undefined : 2}>
                  {faq.q}
                </Text>
                <Ionicons
                  name={openFaq === idx ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={C.muted}
                />
              </TouchableOpacity>
              {openFaq === idx && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqA}>{faq.a}</Text>
                </View>
              )}
              {idx < faqs.length - 1 && <View style={styles.faqDivider} />}
            </View>
          ))}
        </View>

        <View style={styles.hoursCard}>
          <View style={styles.hoursHeader}>
            <Ionicons name="time-outline" size={20} color={C.primary} />
            <Text style={styles.hoursTitle}>Support Hours</Text>
          </View>
          {supportHours.map((h) => (
            <View key={h.day} style={styles.hoursRow}>
              <Text style={styles.hoursDay}>{h.day}</Text>
              <Text
                style={[
                  styles.hoursTime,
                  h.time === "Closed" && { color: "#EF4444" },
                ]}
              >
                {h.time}
              </Text>
            </View>
          ))}
        </View>
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

  heroBanner: {
    backgroundColor: C.primary, borderRadius: 22, padding: 24,
    alignItems: "center", marginBottom: 22,
  },
  heroIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center", marginBottom: 14,
  },
  heroTitle: { fontSize: 22, fontWeight: "900", color: C.white, marginBottom: 8 },
  heroSub: {
    fontSize: 13, fontWeight: "600",
    color: "rgba(255,255,255,0.7)", textAlign: "center", lineHeight: 20,
  },

  sectionLabel: {
    fontSize: 12, fontWeight: "900", color: C.muted,
    textTransform: "uppercase", letterSpacing: 0.8,
    marginBottom: 10, marginLeft: 4,
  },

  quickGrid: {
    flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 22,
  },
  quickCard: {
    flex: 1, minWidth: "44%", backgroundColor: C.card,
    borderRadius: 16, padding: 16, alignItems: "center", gap: 10,
    borderWidth: 1, borderColor: C.border,
    elevation: 1, shadowColor: "#000", shadowOpacity: 0.04,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  quickIcon: {
    width: 50, height: 50, borderRadius: 16,
    alignItems: "center", justifyContent: "center",
  },
  quickLabel: { fontSize: 12, fontWeight: "800", color: C.text, textAlign: "center" },

  faqCard: {
    backgroundColor: C.card, borderRadius: 20,
    borderWidth: 1, borderColor: C.border,
    padding: 16, marginBottom: 16,
    elevation: 1, shadowColor: "#000", shadowOpacity: 0.04,
    shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  faqRow: {
    flexDirection: "row", alignItems: "flex-start",
    justifyContent: "space-between", gap: 12, paddingVertical: 14,
  },
  faqQ: { flex: 1, fontSize: 14, fontWeight: "800", color: C.text, lineHeight: 20 },
  faqAnswer: {
    paddingBottom: 14, paddingRight: 28,
  },
  faqA: { fontSize: 13, fontWeight: "600", color: C.muted, lineHeight: 20 },
  faqDivider: { height: 1, backgroundColor: C.border },

  hoursCard: {
    backgroundColor: C.card, borderRadius: 20,
    borderWidth: 1, borderColor: C.border, padding: 16,
    elevation: 1, shadowColor: "#000", shadowOpacity: 0.04,
    shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  hoursHeader: {
    flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14,
  },
  hoursTitle: { fontSize: 16, fontWeight: "900", color: C.text },
  hoursRow: {
    flexDirection: "row", justifyContent: "space-between",
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  hoursDay: { fontSize: 13, fontWeight: "700", color: C.text },
  hoursTime: { fontSize: 13, fontWeight: "800", color: C.success },
});
