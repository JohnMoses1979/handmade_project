



// src/screens/admin/SellerDocumentsScreen.js
// FULLY UPDATED — Shows real documents uploaded by seller during registration
//   - Documents are structured: { title, type, uri, verified }
//   - Shows image preview thumbnail if uri exists
//   - View button opens the file URI
//   - No dummy/fallback placeholder documents shown

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
  blue: "#2563EB",
};

export default function SellerDocumentsScreen({ navigation, route }) {
  const seller = route?.params?.seller || {};
  // Documents come directly from seller registration — structured array
  const documents = route?.params?.documents || seller?.documents || [];

  const handleViewDocument = (doc) => {
    if (doc?.uri && typeof doc.uri === "string") {
      Linking.openURL(doc.uri).catch(() =>
        showAlert("Cannot Open", "Unable to open this file.")
      );
    } else {
      showAlert("Not Available", "No file was uploaded for this document.");
    }
  };

  const formatDocType = (type) => type || "Verification Document";

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={C.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seller Documents</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Seller info card */}
      <View style={styles.sellerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(seller?.name || "S").charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.sellerName}>{seller?.name || "Seller"}</Text>
          <Text style={styles.shopName}>{seller?.shopName || "—"}</Text>
          <Text style={styles.email}>{seller?.email || "—"}</Text>
          <Text style={styles.docsBadge}>
            {documents.length} document{documents.length !== 1 ? "s" : ""} uploaded
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {documents.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons
              name="document-text-outline"
              size={70}
              color={C.muted}
            />
            <Text style={styles.emptyTitle}>No Documents Uploaded</Text>
            <Text style={styles.emptySub}>
              This seller has not uploaded any documents yet.
            </Text>
          </View>
        ) : (
          documents.map((doc, index) => (
            <View key={index} style={styles.documentCard}>
              {/* Left: thumbnail + info */}
              <View style={styles.docLeft}>
                {/* Show image thumbnail if we have a local URI */}
                {doc?.uri ? (
                  <Image
                    source={{ uri: doc.uri }}
                    style={styles.docThumb}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.docIcon}>
                    <Ionicons
                      name="document-text-outline"
                      size={24}
                      color={C.primary}
                    />
                  </View>
                )}

                <View style={{ flex: 1 }}>
                  <Text style={styles.docName}>
                    {doc?.title || "Document"}
                  </Text>
                  <Text style={styles.docType}>
                    {formatDocType(doc?.type)}
                  </Text>
                  {doc?.fileName ? (
                    <Text style={styles.docFileName} numberOfLines={1}>
                      {doc.fileName}
                    </Text>
                  ) : null}

                  {/* Verified / Pending status */}
                  <View
                    style={[
                      styles.statusWrap,
                      {
                        backgroundColor: doc?.verified
                          ? "#DCFCE7"
                          : "#FEF9C3",
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        doc?.verified
                          ? "checkmark-circle"
                          : "time-outline"
                      }
                      size={13}
                      color={doc?.verified ? C.green : "#A16207"}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        { color: doc?.verified ? C.green : "#A16207" },
                      ]}
                    >
                      {doc?.verified ? "Verified" : "Awaiting Verification"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Right: View button */}
              <TouchableOpacity
                style={[styles.viewBtn, !doc?.uri && styles.viewBtnDisabled]}
                disabled={!doc?.uri}
                onPress={() => handleViewDocument(doc)}
              >
                <Ionicons name="eye-outline" size={16} color={C.white} />
                <Text style={styles.viewBtnText}>View</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: {
    backgroundColor: C.primary,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { color: C.white, fontSize: 18, fontWeight: "800" },
  sellerCard: {
    backgroundColor: C.card,
    margin: 16,
    borderRadius: 22,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: C.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: C.white, fontSize: 26, fontWeight: "900" },
  sellerName: { fontSize: 18, fontWeight: "800", color: C.text },
  shopName: { marginTop: 4, fontSize: 13, color: C.primary, fontWeight: "700" },
  email: { marginTop: 4, fontSize: 12, color: C.muted },
  docsBadge: {
    marginTop: 6,
    fontSize: 11,
    color: C.accent,
    fontWeight: "800",
    backgroundColor: "#ECFDF5",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  scroll: { flex: 1, paddingHorizontal: 16 },
  documentCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  docLeft: { flexDirection: "row", alignItems: "center", flex: 1, gap: 12 },
  docIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  docThumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
  },
  docName: { fontSize: 15, fontWeight: "800", color: C.text },
  docType: { marginTop: 3, fontSize: 12, color: C.muted },
  docFileName: { marginTop: 2, fontSize: 11, color: C.muted, fontStyle: "italic" },
  statusWrap: {
    marginTop: 8,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
  },
  statusText: { fontSize: 11, fontWeight: "800" },
  viewBtn: {
    height: 42,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: C.primary,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  viewBtnDisabled: { backgroundColor: C.muted, opacity: 0.5 },
  viewBtnText: { color: C.white, fontSize: 12, fontWeight: "800" },
  emptyWrap: { alignItems: "center", paddingTop: 120 },
  emptyTitle: { marginTop: 16, fontSize: 18, fontWeight: "800", color: C.text },
  emptySub: {
    marginTop: 6,
    color: C.muted,
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
