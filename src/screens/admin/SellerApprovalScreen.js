

// src/screens/admin/SellerApprovalScreen.js

import React, { useMemo, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Modal,
  TextInput,
  Platform,
  Linking,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useShop } from "../../context/ShopContext";
import { showAlert } from "../../utils/showAlert";

// ─── Colour tokens ────────────────────────────────────────────────────────────
const C = {
  primary:  "#0e3243",
  accent:   "#1a9e6e",
  white:    "#FFFFFF",
  bg:       "#f4f6f9",
  card:     "#FFFFFF",
  text:     "#0e3243",
  muted:    "#7a93a0",
  border:   "#e2eaf0",
  red:      "#e74c3c",
  green:    "#1a9e6e",
  yellow:   "#f59e0b",
  blue:     "#3b82f6",
  purple:   "#8b5cf6",
};

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = ["Pending", "Approved", "Rejected"];

export default function SellerApprovalScreen({ navigation }) {
  const {
    pendingSellers  = [],
    approvedSellers = [],
    rejectedSellers = [],
    approveSeller,
    rejectSeller,
    reloadSellers,
  } = useShop();
  const rootNavigation = navigation.getParent?.() ?? navigation;

  const [tab,             setTab]             = useState("Pending");
  const [loading,         setLoading]         = useState(false);
  const [searchText,      setSearchText]      = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedSeller,  setSelectedSeller]  = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  // Quick-preview bottom sheet
  const [previewSeller,   setPreviewSeller]   = useState(null);
  const [showPreview,     setShowPreview]     = useState(false);

  useFocusEffect(
    useCallback(() => {
      reloadSellers?.().catch((error) => {
        console.error("Failed to refresh sellers on focus:", error);
      });
    }, [reloadSellers])
  );

  // ── Derived list ──────────────────────────────────────────────────────────
  const baseList = useMemo(() => {
    if (tab === "Approved") return approvedSellers;
    if (tab === "Rejected") return rejectedSellers;
    return pendingSellers;
  }, [tab, pendingSellers, approvedSellers, rejectedSellers]);

  const sellers = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return baseList;
    return baseList.filter(
      (s) =>
        String(s?.name      ?? "").toLowerCase().includes(q) ||
        String(s?.shopName  ?? "").toLowerCase().includes(q) ||
        String(s?.email     ?? "").toLowerCase().includes(q) ||
        String(s?.phone     ?? "").toLowerCase().includes(q) ||
        String(s?.category  ?? "").toLowerCase().includes(q) ||
        String(s?.address?.city ?? "").toLowerCase().includes(q)
    );
  }, [baseList, searchText]);

  // ── Utility ───────────────────────────────────────────────────────────────
  const getSellerId = (seller) =>
    seller?.id ?? seller?.sellerId ?? seller?.email ?? null;

  // ─────────────────────────────────────────────────────────────────────────
  //  NAVIGATIONS
  // ─────────────────────────────────────────────────────────────────────────

  /** Full detail page for any seller */
  const goToDetails = useCallback(
    (seller) => rootNavigation.navigate("SellerDetailsScreen", { seller }),
    [rootNavigation]
  );

  /** Document viewer page */
  const goToDocuments = useCallback(
    (seller) =>
      rootNavigation.navigate("SellerDocumentsScreen", {
        seller,
        documents: seller?.documents ?? [],
      }),
    [rootNavigation]
  );

  /** Admin: seller's product list */
  const goToSellerProducts = useCallback(
    (seller) =>
      rootNavigation.navigate("ManageProducts", {
        sellerId: getSellerId(seller),
        sellerName: seller?.shopName ?? seller?.name ?? "Seller",
        seller,
      }),
    [rootNavigation]
  );

  /** Admin: orders placed with this seller */
  const goToSellerOrders = useCallback(
    (seller) =>
      rootNavigation.navigate("ManageOrders", {
        sellerId: getSellerId(seller),
        sellerName: seller?.shopName ?? seller?.name ?? "Seller",
        seller,
      }),
    [rootNavigation]
  );

  /** Admin: complaints against this seller */
  const goToSellerComplaints = useCallback(
    (seller) =>
      rootNavigation.navigate("AdminComplaintReviewScreen", {
        sellerId: getSellerId(seller),
        sellerName: seller?.shopName ?? seller?.name ?? "Seller",
        seller,
      }),
    [rootNavigation]
  );

  /** Admin: payout / commission detail for this seller */
  const goToSellerPayouts = useCallback(
    (seller) =>
      rootNavigation.navigate("AdminPayouts", {
        sellerId: getSellerId(seller),
        sellerName: seller?.shopName ?? seller?.name ?? "Seller",
        seller,
      }),
    [rootNavigation]
  );

  /** Direct phone call */
  const callSeller = useCallback((seller) => {
    const phone = seller?.phone;
    if (!phone) {
      showAlert("No Phone", "This seller has no phone number on record.");
      return;
    }
    Linking.openURL(`tel:${phone}`).catch(() =>
      showAlert("Error", "Could not open phone app.")
    );
  }, []);

  /** Direct email */
  const emailSeller = useCallback((seller) => {
    const email = seller?.email;
    if (!email) {
      showAlert("No Email", "This seller has no email address on record.");
      return;
    }
    Linking.openURL(`mailto:${email}`).catch(() =>
      showAlert("Error", "Could not open mail app.")
    );
  }, []);

  // ── Quick-preview sheet ───────────────────────────────────────────────────
  const openPreview = useCallback((seller) => {
    setPreviewSeller(seller);
    setShowPreview(true);
  }, []);

  const closePreview = useCallback(() => {
    setShowPreview(false);
    setPreviewSeller(null);
  }, []);

  // ── Approve ───────────────────────────────────────────────────────────────
  const handleApproveNow = useCallback(
    async (seller) => {
      const sellerId = getSellerId(seller);
      if (!sellerId) {
        showAlert("Error", "Seller ID is missing.");
        return;
      }
      setLoading(true);
      try {
        const result = approveSeller?.(sellerId);
        if (result && typeof result.then === "function") await result;
        setTab("Approved");
        showAlert(
          "Approved ✅",
          `${seller?.name ?? "Seller"} is approved and can now login.`
        );
      } catch (err) {
        showAlert("Approval Failed", err?.message ?? "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
    [approveSeller]
  );

  const handleApprove = useCallback(
    (seller) => {
      if (Platform.OS === "web") {
        const ok =
          typeof globalThis.confirm === "function"
            ? globalThis.confirm(
                `Approve ${seller?.name ?? "this seller"} and allow them to login?`
              )
            : true;
        if (ok) handleApproveNow(seller);
        return;
      }

      showAlert(
        "Approve Seller",
        `Approve ${seller?.name ?? "this seller"} and allow them to login?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Approve", onPress: () => handleApproveNow(seller) },
        ]
      );
    },
    [handleApproveNow]
  );

  // Re-approve a previously rejected seller
  const handleReApprove = useCallback(
    (seller) => {
      if (Platform.OS === "web") {
        const ok =
          typeof globalThis.confirm === "function"
            ? globalThis.confirm(
                `Re-approve ${seller?.name ?? "this seller"}? They will be moved to Approved and can login.`
              )
            : true;
        if (ok) handleApproveNow(seller);
        return;
      }

      showAlert(
        "Re-Approve Seller",
        `Re-approve ${seller?.name ?? "this seller"}? They will be moved to Approved and can login.`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Re-Approve", onPress: () => handleApproveNow(seller) },
        ]
      );
    },
    [handleApproveNow]
  );

  // ── Reject ────────────────────────────────────────────────────────────────
  const handleRejectPress = useCallback((seller) => {
    setSelectedSeller(seller);
    setRejectionReason("");
    setShowRejectModal(true);
  }, []);

  const submitRejection = useCallback(async () => {
    if (!selectedSeller) return;
    if (!rejectionReason.trim()) {
      showAlert("Required", "Please enter a rejection reason.");
      return;
    }
    const sellerId = getSellerId(selectedSeller);
    if (!sellerId) {
      showAlert("Error", "Seller ID is missing.");
      return;
    }
    setLoading(true);
    try {
      const result = rejectSeller?.(sellerId, rejectionReason.trim());
      if (result && typeof result.then === "function") await result;
      setShowRejectModal(false);
      setTab("Rejected");
      showAlert(
        "Rejected",
        `${selectedSeller?.name ?? "Seller"} has been rejected.`
      );
    } catch (err) {
      showAlert("Reject Failed", err?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [selectedSeller, rejectionReason, rejectSeller]);

  // ─────────────────────────────────────────────────────────────────────────
  //  RENDER HELPERS
  // ─────────────────────────────────────────────────────────────────────────

  const renderTab = (label) => {
    const count =
      label === "Approved"
        ? approvedSellers.length
        : label === "Rejected"
        ? rejectedSellers.length
        : pendingSellers.length;
    const active = tab === label;
    return (
      <TouchableOpacity
        key={label}
        style={[styles.tab, active && styles.activeTab]}
        onPress={() => { setTab(label); setSearchText(""); }}
        activeOpacity={0.85}
      >
        <Text style={[styles.tabText, active && styles.activeTabText]}>
          {label}
        </Text>
        <View style={[styles.badge, active && styles.activeBadge]}>
          <Text style={[styles.badgeText, active && styles.activeBadgeText]}>
            {count}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // ── Action quick-links rendered inside each card ──────────────────────────
  const renderNavLinks = (seller) => (
    <View style={styles.navLinksRow}>
      <TouchableOpacity
        style={styles.navLink}
        onPress={() => goToSellerProducts(seller)}
        activeOpacity={0.8}
      >
        <Ionicons name="cube-outline" size={14} color={C.primary} />
        <Text style={styles.navLinkText}>Products</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navLink}
        onPress={() => goToSellerOrders(seller)}
        activeOpacity={0.8}
      >
        <Ionicons name="bag-handle-outline" size={14} color={C.primary} />
        <Text style={styles.navLinkText}>Orders</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navLink}
        onPress={() => goToSellerComplaints(seller)}
        activeOpacity={0.8}
      >
        <Ionicons name="alert-circle-outline" size={14} color={C.primary} />
        <Text style={styles.navLinkText}>Complaints</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navLink}
        onPress={() => goToSellerPayouts(seller)}
        activeOpacity={0.8}
      >
        <Ionicons name="wallet-outline" size={14} color={C.primary} />
        <Text style={styles.navLinkText}>Payouts</Text>
      </TouchableOpacity>
    </View>
  );

  // ── Individual seller card ────────────────────────────────────────────────
  const renderSellerCard = (seller) => {
    const docsCount = seller?.documents?.length ?? 0;
    const cardKey   = getSellerId(seller) ?? Math.random().toString();

    return (
      <View key={cardKey} style={styles.card}>

        {/* ── Top: avatar + info + chevron ── */}
        <TouchableOpacity
          style={styles.cardTop}
          activeOpacity={0.9}
          onPress={() => goToDetails(seller)}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(seller?.name ?? "S").charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{seller?.name ?? "Seller Name"}</Text>
            <Text style={styles.shop}>{seller?.shopName ?? "Shop Name"}</Text>
            <Text style={styles.email}>{seller?.email ?? "No email"}</Text>
            <Text style={styles.phone}>{seller?.phone ?? "No phone"}</Text>

            {!!seller?.category && (
              <Text style={styles.category}>{seller.category}</Text>
            )}

            {!!seller?.address?.city && (
              <Text style={styles.city}>
                📍 {seller.address.city}
                {seller.address.state ? `, ${seller.address.state}` : ""}
              </Text>
            )}

            <Text style={styles.regTime}>
              Applied: {seller?.registeredAtLabel ?? seller?.joined ?? "—"}
            </Text>

            <Text style={styles.docsCount}>
              📄 {docsCount} document{docsCount !== 1 ? "s" : ""} uploaded
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color={C.muted} />
        </TouchableOpacity>

        {/* ── Contact strip: call + email ── */}
        <View style={styles.contactStrip}>
          <TouchableOpacity
            style={styles.contactChip}
            onPress={() => callSeller(seller)}
            activeOpacity={0.8}
          >
            <Ionicons name="call-outline" size={14} color={C.accent} />
            <Text style={styles.contactChipText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactChip}
            onPress={() => emailSeller(seller)}
            activeOpacity={0.8}
          >
            <Ionicons name="mail-outline" size={14} color={C.accent} />
            <Text style={styles.contactChipText}>Email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactChip}
            onPress={() => openPreview(seller)}
            activeOpacity={0.8}
          >
            <Ionicons name="eye-outline" size={14} color={C.accent} />
            <Text style={styles.contactChipText}>Quick View</Text>
          </TouchableOpacity>
        </View>

        {/* ── Primary action row: documents + full details ── */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.docsBtn}
            onPress={() => goToDocuments(seller)}
            activeOpacity={0.85}
          >
            <Ionicons name="document-text-outline" size={15} color={C.primary} />
            <Text style={styles.docsText}>Documents ({docsCount})</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.detailsBtn}
            onPress={() => goToDetails(seller)}
            activeOpacity={0.85}
          >
            <Ionicons name="person-circle-outline" size={15} color={C.white} />
            <Text style={styles.detailsText}>Full Details</Text>
          </TouchableOpacity> */}


        <TouchableOpacity
  style={styles.detailsBtn}
  onPress={() =>
    navigation.navigate("SellerDetails", {
      seller: seller,
    })
  }
  activeOpacity={0.85}
>
  <Ionicons
    name="person-circle-outline"
    size={15}
    color={C.white}
  />
  <Text style={styles.detailsText}>Full Details</Text>
</TouchableOpacity>

        </View>

        {/* ── Navigation links (Products / Orders / Complaints / Payouts) ── */}
        {renderNavLinks(seller)}

        {/* ── Approve / Reject actions (Pending tab) ── */}
        {tab === "Pending" && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.approveBtn}
              onPress={() => handleApprove(seller)}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-circle" size={17} color={C.white} />
              <Text style={styles.approveText}>Approve</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={() => handleRejectPress(seller)}
              activeOpacity={0.85}
            >
              <Ionicons name="close-circle" size={17} color={C.red} />
              <Text style={styles.rejectText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Approved status + manage actions ── */}
        {tab === "Approved" && (
          <>
            <View style={styles.statusBoxGreen}>
              <Ionicons name="checkmark-circle" size={17} color={C.green} />
              <Text style={styles.statusGreenText}>
                Approved — Seller can login
              </Text>
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                onPress={() => handleRejectPress(seller)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.revokeText}>Revoke</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* ── Rejected status + re-approve ── */}
        {tab === "Rejected" && (
          <>
            <View style={styles.statusBoxRed}>
              <Ionicons name="close-circle" size={17} color={C.red} />
              <Text style={styles.statusRedText} numberOfLines={3}>
                Rejected: {seller?.rejectionReason ?? "No reason provided"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.reApproveBtn}
              onPress={() => handleReApprove(seller)}
              activeOpacity={0.85}
            >
              <Ionicons name="refresh-circle-outline" size={17} color={C.white} />
              <Text style={styles.reApproveText}>Re-Approve Seller</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  //  QUICK-PREVIEW BOTTOM SHEET
  // ─────────────────────────────────────────────────────────────────────────
  const renderPreviewSheet = () => {
    if (!previewSeller) return null;
    const s = previewSeller;
    const rows = [
      { icon: "mail-outline",     label: "Email",    value: s.email    ?? "—" },
      { icon: "call-outline",     label: "Phone",    value: s.phone    ?? "—" },
      { icon: "grid-outline",     label: "Category", value: s.category ?? "—" },
      { icon: "receipt-outline",  label: "GST",      value: s.gst      || "Not provided" },
      { icon: "location-outline", label: "City",
        value: s.address?.city
          ? `${s.address.city}${s.address.state ? `, ${s.address.state}` : ""}`
          : "—"
      },
      { icon: "calendar-outline", label: "Applied",
        value: s.registeredAtLabel ?? s.joined ?? "—"
      },
      { icon: "document-text-outline", label: "Docs",
        value: `${s.documents?.length ?? 0} uploaded`
      },
    ];

    return (
      <Modal
        visible={showPreview}
        transparent
        animationType="slide"
        onRequestClose={closePreview}
      >
        <View style={styles.sheetOverlay}>
          <View style={styles.sheetContent}>
            {/* handle bar */}
            <View style={styles.sheetHandle} />

            {/* header */}
            <View style={styles.sheetHeader}>
              <View style={styles.sheetAvatar}>
                <Text style={styles.sheetAvatarText}>
                  {(s.name ?? "S").charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.sheetName}>{s.name ?? "Seller"}</Text>
                <Text style={styles.sheetShop}>{s.shopName ?? "—"}</Text>
              </View>
              <TouchableOpacity onPress={closePreview}>
                <Ionicons name="close" size={24} color={C.text} />
              </TouchableOpacity>
            </View>

            {/* info rows */}
            {rows.map((r, i) => (
              <View key={i} style={styles.sheetRow}>
                <View style={styles.sheetIconBox}>
                  <Ionicons name={r.icon} size={16} color={C.primary} />
                </View>
                <Text style={styles.sheetLabel}>{r.label}</Text>
                <Text style={styles.sheetValue} numberOfLines={2}>{r.value}</Text>
              </View>
            ))}

            {/* navigation buttons */}
            <View style={styles.sheetNavGrid}>
              {[
                { label: "Documents",  icon: "document-text-outline", fn: () => { closePreview(); goToDocuments(s);         } },
                { label: "Details",    icon: "person-circle-outline",  fn: () => { closePreview(); goToDetails(s);           } },
                { label: "Products",   icon: "cube-outline",           fn: () => { closePreview(); goToSellerProducts(s);    } },
                { label: "Orders",     icon: "bag-handle-outline",     fn: () => { closePreview(); goToSellerOrders(s);      } },
                { label: "Complaints", icon: "alert-circle-outline",   fn: () => { closePreview(); goToSellerComplaints(s);  } },
                { label: "Payouts",    icon: "wallet-outline",         fn: () => { closePreview(); goToSellerPayouts(s);     } },
              ].map((btn) => (
                <TouchableOpacity
                  key={btn.label}
                  style={styles.sheetNavBtn}
                  onPress={btn.fn}
                  activeOpacity={0.8}
                >
                  <View style={styles.sheetNavIcon}>
                    <Ionicons name={btn.icon} size={20} color={C.primary} />
                  </View>
                  <Text style={styles.sheetNavLabel}>{btn.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  //  MAIN RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color={C.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seller Approvals</Text>
        {/* Notification bell — navigate to admin notifications */}
        <TouchableOpacity
          onPress={() => navigation.navigate("AdminNotificationsScreen")}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="notifications-outline" size={22} color={C.white} />
        </TouchableOpacity>
      </View>

      {/* ── Tabs ── */}
      <View style={styles.tabsWrap}>
        {TABS.map(renderTab)}
      </View>

      {/* ── Search bar ── */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={C.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${tab} sellers…`}
          placeholderTextColor={C.muted}
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {!!searchText && Platform.OS !== "ios" && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Ionicons name="close-circle" size={18} color={C.muted} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── List ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {sellers.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="storefront-outline" size={60} color={C.muted} />
            <Text style={styles.emptyTitle}>No {tab} Sellers</Text>
            <Text style={styles.emptyText}>
              {tab === "Pending"
                ? "No seller registration requests yet."
                : tab === "Approved"
                ? "No approved sellers yet."
                : "No rejected sellers yet."}
            </Text>
          </View>
        ) : (
          sellers.map(renderSellerCard)
        )}
      </ScrollView>

      {/* ── Loading overlay (sits above everything via Modal) ── */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={C.white} />
          <Text style={styles.loadingText}>Please wait…</Text>
        </View>
      </Modal>

      {/* ── Reject / Revoke reason modal ── */}
      <Modal
        visible={showRejectModal}
        transparent
        animationType="slide"
        onRequestClose={() => { if (!loading) setShowRejectModal(false); }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Reject — {selectedSeller?.name ?? "Seller"}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowRejectModal(false)}
                  disabled={loading}
                >
                  <Ionicons name="close" size={24} color={C.text} />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalSub}>
                {selectedSeller?.shopName ?? "Shop"} ·{" "}
                {selectedSeller?.category ?? "Category"}
              </Text>

              <TextInput
                style={styles.rejectInput}
                placeholder="Enter rejection reason (required)"
                placeholderTextColor={C.muted}
                multiline
                value={rejectionReason}
                onChangeText={setRejectionReason}
                editable={!loading}
                maxLength={500}
              />
              <Text style={styles.charCount}>
                {rejectionReason.length}/500
              </Text>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.cancelBtn, loading && styles.disabledBtn]}
                  onPress={() => setShowRejectModal(false)}
                  disabled={loading}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.submitBtn, loading && styles.disabledBtn]}
                  onPress={submitRejection}
                  disabled={loading}
                >
                  <Ionicons name="close-circle" size={17} color={C.white} />
                  <Text style={styles.submitText}>Confirm Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Quick-preview bottom sheet ── */}
      {renderPreviewSheet()}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.primary },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: C.primary,
  },
  headerTitle: { color: C.white, fontSize: 18, fontWeight: "900" },

  // Tabs
  tabsWrap: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: C.primary,
  },
  tab: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.13)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  activeTab: { backgroundColor: C.white },
  tabText:       { color: "rgba(255,255,255,0.78)", fontSize: 12, fontWeight: "800" },
  activeTabText: { color: C.primary },
  badge: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  activeBadge:      { backgroundColor: C.primary },
  badgeText:        { color: C.white, fontSize: 10, fontWeight: "900" },
  activeBadgeText:  { color: C.white },

  // Search
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 11,
    paddingHorizontal: 10,
    color: C.text,
    fontSize: 14,
  },

  // Scroll
  scroll:        { flex: 1, backgroundColor: C.bg },
  scrollContent: { paddingBottom: 110 },

  // Card
  card: {
    backgroundColor: C.card,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTop: { flexDirection: "row", gap: 12, alignItems: "flex-start" },

  // Avatar
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: C.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: C.white, fontSize: 22, fontWeight: "900" },

  // Card text
  name:     { fontSize: 15, fontWeight: "900", color: C.text },
  shop:     { marginTop: 3, fontSize: 13, fontWeight: "800", color: C.primary },
  email:    { marginTop: 5, fontSize: 12, color: C.muted },
  phone:    { marginTop: 2, fontSize: 12, color: C.muted },
  category: {
    marginTop: 5,
    fontSize: 11,
    color: C.white,
    fontWeight: "800",
    backgroundColor: C.primary,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
    overflow: "hidden",
  },
  city:      { marginTop: 5, fontSize: 11, color: C.muted },
  regTime:   { marginTop: 4, fontSize: 11, color: C.muted },
  docsCount: { marginTop: 3, fontSize: 11, color: C.accent, fontWeight: "800" },

  // Contact strip
  contactStrip: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  contactChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#E8FAF3",
    borderWidth: 1,
    borderColor: "#b6ebd6",
  },
  contactChipText: { fontSize: 11, fontWeight: "800", color: C.accent },

  // Action rows
  actionRow: { flexDirection: "row", gap: 8, marginTop: 10 },

  docsBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    backgroundColor: "#F8FAFC",
  },
  docsText: { fontSize: 11, fontWeight: "800", color: C.primary },

  detailsBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: C.primary,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  detailsText: { color: C.white, fontSize: 11, fontWeight: "800" },

  // Nav links row (Products / Orders / Complaints / Payouts)
  navLinksRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  navLink: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    gap: 3,
  },
  navLinkText: { fontSize: 10, fontWeight: "800", color: C.primary },

  // Approve / Reject
  approveBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.green,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  approveText: { color: C.white, fontSize: 13, fontWeight: "900" },

  rejectBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: C.red,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  rejectText: { color: C.red, fontSize: 13, fontWeight: "900" },

  // Status boxes
  statusBoxGreen: {
    marginTop: 10,
    backgroundColor: "#DCFCE7",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  statusGreenText: { color: C.green, fontSize: 12, fontWeight: "900" },
  revokeText: {
    fontSize: 11,
    fontWeight: "800",
    color: C.red,
    textDecorationLine: "underline",
  },

  statusBoxRed: {
    marginTop: 10,
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
  },
  statusRedText: { color: C.red, fontSize: 12, fontWeight: "800", flex: 1 },

  // Re-approve button
  reApproveBtn: {
    marginTop: 8,
    height: 42,
    borderRadius: 12,
    backgroundColor: C.blue,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  reApproveText: { color: C.white, fontSize: 13, fontWeight: "900" },

  // Empty state
  emptyWrap:  { alignItems: "center", paddingTop: 100, paddingHorizontal: 30 },
  emptyTitle: { marginTop: 14, fontSize: 17, color: C.text, fontWeight: "900" },
  emptyText:  { marginTop: 6,  fontSize: 13, color: C.muted, textAlign: "center" },

  // Loading overlay
  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 10, color: C.white, fontWeight: "800" },

  // Reject modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: C.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "900", color: C.text },
  modalSub:   { fontSize: 13, color: C.muted, marginTop: 4, marginBottom: 14 },
  rejectInput: {
    height: 120,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: "#F8FAFC",
    padding: 14,
    color: C.text,
    fontSize: 13,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 11,
    color: C.muted,
    textAlign: "right",
    marginTop: 4,
  },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 14 },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: { color: C.text, fontWeight: "800" },
  submitBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: C.red,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  submitText:   { color: C.white, fontWeight: "900" },
  disabledBtn:  { opacity: 0.5 },

  // Quick-preview sheet
  sheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheetContent: {
    backgroundColor: C.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 38 : 24,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 4,
    backgroundColor: C.border,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  sheetAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: C.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sheetAvatarText: { color: C.white, fontSize: 20, fontWeight: "900" },
  sheetName: { fontSize: 16, fontWeight: "900", color: C.text },
  sheetShop: { fontSize: 13, color: C.muted, marginTop: 2 },

  sheetRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  sheetIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  sheetLabel: { flex: 1, fontSize: 13, color: C.muted, fontWeight: "600" },
  sheetValue: {
    fontSize: 13,
    fontWeight: "800",
    color: C.text,
    maxWidth: "50%",
    textAlign: "right",
  },

  sheetNavGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },
  sheetNavBtn: {
    width: "30%",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: C.border,
    gap: 5,
  },
  sheetNavIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  sheetNavLabel: { fontSize: 11, fontWeight: "800", color: C.primary },
});
