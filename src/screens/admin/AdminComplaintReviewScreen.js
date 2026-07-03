import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { showAlert } from "../../utils/showAlert";
import { useShop } from "../../context/ShopContext";
import { SERVER_URL } from "../../api/config";

const C = {
  primary: "#0e3243",
  accent: "#1a9e6e",
  danger: "#ef4444",
  warning: "#f59e0b",
  info: "#2563eb",
  success: "#10b981",
  white: "#FFFFFF",
  text: "#0e3243",
  muted: "#7a93a0",
  bg: "#f4f6f9",
  border: "#e5edf3",
};

const normalizeStatus = (value) => String(value || "").trim().toLowerCase();

const getStatusStyle = (status) => {
  const normalized = normalizeStatus(status);
  if (normalized === "resolved") {
    return { backgroundColor: "#ecfdf5", color: C.success };
  }
  if (normalized === "under review" || normalized === "forwarded to seller") {
    return { backgroundColor: "#eff6ff", color: C.info };
  }
  if (normalized === "pending") {
    return { backgroundColor: "#fff7ed", color: C.warning };
  }
  return { backgroundColor: "#f1f5f9", color: C.muted };
};

const getPriorityStyle = (priority) => {
  const normalized = String(priority || "").trim().toLowerCase();
  if (normalized === "high") return { color: C.danger };
  if (normalized === "medium") return { color: C.warning };
  return { color: C.success };
};

const formatTime = (value) => {
  if (!value) return "Just now";
  if (typeof value === "string") return value;
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "Just now";
  }
};

const serverUrl = SERVER_URL;

const shortText = (value, fallback) => {
  const text = String(value || fallback || "").trim();
  return text || fallback || "";
};

const toImageSource = (value) => {
  if (!value || typeof value !== "string") return null;

  const trimmed = value.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("file://") ||
    trimmed.startsWith("data:")
  ) {
    return { uri: trimmed };
  }

  if (trimmed.startsWith("/uploads/") || trimmed.startsWith("uploads/")) {
    return { uri: `${serverUrl}/${trimmed.replace(/^\/+/, "")}` };
  }

  const normalizedPath = trimmed.replace(/\\/g, "/");
  const fileName = normalizedPath.split("?")[0].split("#")[0].split("/").pop();
  if (!fileName) return null;

  return { uri: `${serverUrl}/uploads/complaints/${encodeURIComponent(fileName)}` };
};

export default function AdminComplaintReviewScreen({ navigation }) {
  const { complaints = [], resolveComplaint, markAllComplaintsRead, reloadComplaints } = useShop();

  const activeCount = complaints.filter(
    (item) => normalizeStatus(item?.status) !== "resolved"
  ).length;
  const resolvedCount = complaints.filter(
    (item) => normalizeStatus(item?.status) === "resolved"
  ).length;

  const handleResolveComplaint = (complaint) => {
    if (!complaint?.id) return;

    showAlert("Resolve Complaint", "Mark this complaint as resolved?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Resolve",
        onPress: async () => {
          try {
            await resolveComplaint(
              complaint.id,
              "Issue reviewed and resolved by admin"
            );
            showAlert(
              "Complaint Resolved",
              "The complaint was marked resolved and the seller was notified."
            );
          } catch (error) {
            showAlert("Error", error?.message || "Unable to resolve complaint.");
          }
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      reloadComplaints?.();
      markAllComplaintsRead?.();
    }, [reloadComplaints, markAllComplaintsRead])
  );

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={C.white} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Complaints</Text>
          <Text style={styles.headerSub}>Review customer issues and close the loop</Text>
        </View>

        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="help-circle-outline" size={22} color={C.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryBadge}>
              <MaterialCommunityIcons name="message-alert-outline" size={24} color={C.danger} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryTitle}>Live complaint review</Text>
              <Text style={styles.summaryText}>
                Track pending issues, resolve them quickly, and keep sellers informed.
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Text style={styles.statValue}>{activeCount}</Text>
              <Text style={styles.statLabel}>Open</Text>
            </View>
            <View style={styles.statChip}>
              <Text style={styles.statValue}>{resolvedCount}</Text>
              <Text style={styles.statLabel}>Resolved</Text>
            </View>
            <View style={styles.statChip}>
              <Text style={styles.statValue}>{complaints.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </View>

        {complaints.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons name="checkmark-done-circle-outline" size={46} color={C.success} />
            </View>
            <Text style={styles.emptyTitle}>No complaints right now</Text>
            <Text style={styles.emptyText}>
              New complaints from customers will appear here automatically.
            </Text>
          </View>
        ) : (
          complaints.map((complaint) => {
            const statusStyle = getStatusStyle(complaint?.status);
            const isResolved = normalizeStatus(complaint?.status) === "resolved";

            return (
              <View key={complaint?.id ?? complaint?.orderId ?? complaint?.productName} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.issueIcon}>
                    <Ionicons name="alert-circle" size={22} color={C.danger} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.productName}>
                      {shortText(complaint?.productName || complaint?.product, "Customer Complaint")}
                    </Text>
                    <Text style={styles.metaText}>
                      {shortText(complaint?.complaintType || complaint?.issue, "Complaint")}
                      {complaint?.orderId ? ` • ${complaint.orderId}` : ""}
                    </Text>
                  </View>

                  <View style={[styles.statusPill, { backgroundColor: statusStyle.backgroundColor }]}>
                    <Text style={[styles.statusText, { color: statusStyle.color }]}>
                      {shortText(complaint?.status, "Pending")}
                    </Text>
                  </View>
                </View>

                <View style={styles.metaGrid}>
                  <View style={styles.metaCard}>
                    <Ionicons name="person-outline" size={16} color={C.primary} />
                    <Text style={styles.metaCardText}>
                      {shortText(complaint?.customerName || complaint?.customer, "Customer")}
                    </Text>
                  </View>

                  <View style={styles.metaCard}>
                    <Ionicons name="storefront-outline" size={16} color={C.primary} />
                    <Text style={styles.metaCardText}>
                      {shortText(complaint?.sellerName, "Seller")}
                    </Text>
                  </View>
                </View>

                <Text style={styles.issueLabel}>Issue</Text>
                <Text style={styles.issueText}>
                  {shortText(
                    complaint?.description,
                    "A customer complaint is waiting for review."
                  )}
                </Text>

                {Array.isArray(complaint?.images) && complaint.images.length > 0 ? (
                  <View style={styles.imageSection}>
                    <Text style={styles.imageLabel}>Attached Images</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.imageRow}
                    >
                      {complaint.images.map((image, imageIndex) => {
                        const source = toImageSource(image);
                        return (
                          <View key={`${complaint?.id ?? "complaint"}-${imageIndex}`} style={styles.imageCard}>
                            {source ? (
                              <Image source={source} style={styles.image} />
                            ) : (
                              <View style={styles.imageFallback}>
                                <Ionicons name="image-outline" size={20} color={C.muted} />
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </ScrollView>
                  </View>
                ) : null}

                <View style={styles.footerRow}>
                  <View style={styles.timeRow}>
                    <Ionicons name="time-outline" size={14} color={C.muted} />
                    <Text style={styles.timeText}>{formatTime(complaint?.time || complaint?.createdAt)}</Text>
                  </View>

                  <View style={styles.priorityRow}>
                    <View style={[styles.priorityDot, getPriorityStyle(complaint?.priority)]} />
                    <Text style={[styles.priorityText, getPriorityStyle(complaint?.priority)]}>
                      {shortText(complaint?.priority, "Normal")} Priority
                    </Text>
                  </View>
                </View>

                {complaint?.resolution ? (
                  <View style={styles.resolutionBox}>
                    <View style={styles.resolutionHeader}>
                      <Ionicons name="checkmark-circle" size={18} color={C.success} />
                      <Text style={styles.resolutionTitle}>Resolution</Text>
                    </View>
                    <Text style={styles.resolutionText}>
                      {shortText(complaint.resolution, "Resolved")}
                    </Text>
                    {complaint?.resolvedAt ? (
                      <Text style={styles.resolutionStamp}>
                        Closed at {formatTime(complaint.resolvedAt)}
                      </Text>
                    ) : null}
                  </View>
                ) : null}

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.resolveBtn, isResolved && styles.resolveBtnDisabled]}
                    onPress={() => handleResolveComplaint(complaint)}
                    disabled={isResolved}
                    activeOpacity={0.9}
                  >
                    <Ionicons
                      name={isResolved ? "checkmark-done" : "checkmark-circle-outline"}
                      size={18}
                      color={C.white}
                    />
                    <Text style={styles.resolveText}>
                      {isResolved ? "Resolved" : "Resolve"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: C.primary,
  },
  headerCenter: {
    flex: 1,
    paddingHorizontal: 10,
  },
  headerTitle: {
    color: C.white,
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  headerSub: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    textAlign: "center",
    marginTop: 3,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 28,
  },
  summaryCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  summaryBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryTitle: {
    color: C.text,
    fontSize: 16,
    fontWeight: "800",
  },
  summaryText: {
    color: C.muted,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 19,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  statChip: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: "#F8FBFD",
    paddingVertical: 12,
    alignItems: "center",
  },
  statValue: {
    color: C.text,
    fontSize: 18,
    fontWeight: "800",
  },
  statLabel: {
    color: C.muted,
    fontSize: 12,
    marginTop: 2,
    fontWeight: "600",
  },
  emptyCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
  },
  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: {
    color: C.text,
    fontSize: 17,
    fontWeight: "800",
  },
  emptyText: {
    color: C.muted,
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 19,
  },
  card: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  issueIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  productName: {
    color: C.text,
    fontSize: 16,
    fontWeight: "800",
  },
  metaText: {
    color: C.muted,
    fontSize: 12,
    marginTop: 3,
    fontWeight: "600",
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
  },
  metaGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  metaCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8FBFD",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  metaCardText: {
    color: C.text,
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },
  issueLabel: {
    color: C.text,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 14,
  },
  issueText: {
    color: C.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },
  imageSection: {
    marginTop: 14,
  },
  imageLabel: {
    color: C.text,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 10,
  },
  imageRow: {
    gap: 12,
  },
  imageCard: {
    width: 92,
    height: 92,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#F8FBFD",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  timeText: {
    color: C.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  priorityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.success,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "700",
  },
  resolutionBox: {
    marginTop: 14,
    borderRadius: 16,
    padding: 14,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  resolutionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  resolutionTitle: {
    color: C.success,
    fontSize: 13,
    fontWeight: "800",
  },
  resolutionText: {
    color: C.text,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  resolutionStamp: {
    color: C.muted,
    fontSize: 11,
    marginTop: 6,
    fontWeight: "600",
  },
  actionRow: {
    marginTop: 14,
  },
  resolveBtn: {
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
  },
  resolveBtnDisabled: {
    backgroundColor: "#94A3B8",
  },
  resolveText: {
    color: C.white,
    fontSize: 14,
    fontWeight: "800",
  },
});
