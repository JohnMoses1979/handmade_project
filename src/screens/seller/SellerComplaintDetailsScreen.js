import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BASE_URL } from "../../api/config";
import { useShop } from "../../context/ShopContext";

const C = {
  primary: "#082843",
  white: "#FFFFFF",
  bg: "#F8FAFC",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  red: "#EF4444",
  softRed: "#FEE2E2",
  warning: "#F59E0B",
  success: "#10B981",
  blue: "#2563EB",
};

const normalizeStatus = (value) => String(value || "").trim().toLowerCase();

const statusStyle = (status) => {
  const normalized = normalizeStatus(status);
  if (normalized === "resolved") return { bg: "#ECFDF5", color: C.success };
  if (
    normalized === "under review" ||
    normalized === "reviewed" ||
    normalized === "forwarded to seller"
  ) {
    return { bg: "#EFF6FF", color: C.blue };
  }
  if (normalized === "pending") return { bg: "#FFF7ED", color: C.warning };
  return { bg: "#F1F5F9", color: C.muted };
};

const formatDate = (value) => {
  if (!value) return "Just now";
  if (typeof value === "string") return value;
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "Just now";
  }
};

const serverUrl = BASE_URL.replace("/api", "");

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

export default function SellerComplaintDetailsScreen({ route, navigation }) {
  const { complaints = [], markComplaintRead } = useShop();
  const [isMarkingReviewed, setIsMarkingReviewed] = useState(false);
  const [locallyReviewed, setLocallyReviewed] = useState(false);

  const complaintId = route?.params?.complaint?.id ?? route?.params?.complaintId;
  const complaintFromRoute = route?.params?.complaint ?? {};
  const seller = route?.params?.seller ?? {};

  const complaint = useMemo(() => {
    const liveComplaint = complaints.find(
      (item) => String(item?.id) === String(complaintId)
    );
    return liveComplaint ?? complaintFromRoute;
  }, [complaints, complaintFromRoute, complaintId]);

  const currentStatus = complaint?.read ? "Reviewed" : complaint?.status ?? "Pending";
  const isResolved = normalizeStatus(complaint?.status) === "resolved";
  const isReviewed =
    locallyReviewed || Boolean(complaint?.read) || normalizeStatus(currentStatus) === "reviewed";
  const badge = statusStyle(currentStatus);

  const handleMarkReviewed = async () => {
    if (!complaint?.id) return;
    if (isResolved || isReviewed || isMarkingReviewed) return;

    setIsMarkingReviewed(true);
    try {
      await markComplaintRead?.(complaint.id);
      setLocallyReviewed(true);
    } catch (error) {
      console.error("Unable to mark complaint as read:", error);
    } finally {
      setIsMarkingReviewed(false);
    }
  };

  const images = Array.isArray(complaint?.images) ? complaint.images : [];

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={C.white} />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Complaint Details</Text>
          <Text style={styles.headerSub}>{seller?.name || complaint?.sellerName || "Your Shop"}</Text>
        </View>

        <View style={[styles.statusPill, { backgroundColor: badge.bg }]}>
          <Text style={[styles.statusText, { color: badge.color }]}>{currentStatus}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.topRow}>
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons name="message-alert-outline" size={24} color={C.red} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{complaint?.title || complaint?.productName || "Customer Complaint"}</Text>
              <Text style={styles.meta}>
                {complaint?.orderId ? `Order ${complaint.orderId}` : "Complaint"}
                {complaint?.id ? ` • #${complaint.id}` : ""}
              </Text>
            </View>
          </View>

          <View style={styles.detailGrid}>
            <View style={styles.detailChip}>
              <Ionicons name="person-outline" size={16} color={C.primary} />
              <Text style={styles.detailText}>{complaint?.customerName || complaint?.customer || "Customer"}</Text>
            </View>
            <View style={styles.detailChip}>
              <Ionicons name="cube-outline" size={16} color={C.primary} />
              <Text style={styles.detailText}>{complaint?.productName || complaint?.product || "Product"}</Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>Issue</Text>
          <Text style={styles.bodyText}>
            {complaint?.description || "The customer has raised a complaint for this order."}
          </Text>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={14} color={C.muted} />
            <Text style={styles.infoText}>{formatDate(complaint?.time || complaint?.createdAt)}</Text>
          </View>
        </View>

        {images.length > 0 ? (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Attached Images</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageRow}>
              {images.map((image, index) => {
                const source = toImageSource(image);
                return (
                  <View key={`${image}-${index}`} style={styles.imageCard}>
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

        {complaint?.resolution ? (
          <View style={styles.resolutionCard}>
            <View style={styles.resolutionHeader}>
              <Ionicons name="checkmark-circle" size={20} color={C.success} />
              <Text style={styles.resolutionTitle}>Resolution</Text>
            </View>
            <Text style={styles.resolutionBody}>{complaint.resolution}</Text>
            {complaint?.resolvedAt ? (
              <Text style={styles.resolutionTime}>Closed at {formatDate(complaint.resolvedAt)}</Text>
            ) : null}
          </View>
        ) : (
          <View style={styles.noteCard}>
            <Ionicons name="information-circle-outline" size={18} color={C.blue} />
            <Text style={styles.noteText}>
              We have recorded this complaint. The admin team can review and resolve it from the dashboard.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.primaryBtn,
            (isResolved || isReviewed || isMarkingReviewed) && styles.primaryBtnMuted,
          ]}
          activeOpacity={0.9}
          onPress={handleMarkReviewed}
          disabled={isResolved || isReviewed || isMarkingReviewed}
        >
          <Ionicons
            name={isResolved || isReviewed ? "checkmark-done" : "eye-outline"}
            size={18}
            color={C.white}
          />
          <Text style={styles.primaryBtnText}>
            {isResolved
              ? "Already Resolved"
              : isMarkingReviewed
                ? "Marking as Reviewed..."
                : isReviewed
                  ? "Marked as Reviewed"
                  : "Mark as Reviewed"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    backgroundColor: C.primary,
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    color: C.white,
    fontSize: 18,
    fontWeight: "800",
  },
  headerSub: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    marginTop: 2,
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
  content: {
    padding: 16,
    paddingBottom: 28,
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
  topRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: C.softRed,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: C.text,
    fontSize: 16,
    fontWeight: "800",
  },
  meta: {
    color: C.muted,
    fontSize: 12,
    marginTop: 3,
    fontWeight: "600",
  },
  detailGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  detailChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8FBFD",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  detailText: {
    color: C.text,
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },
  sectionLabel: {
    color: C.text,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 14,
  },
  bodyText: {
    color: C.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  infoText: {
    color: C.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  imageRow: {
    gap: 12,
    paddingTop: 10,
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
  resolutionCard: {
    backgroundColor: "#ECFDF5",
    borderColor: "#D1FAE5",
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },
  resolutionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  resolutionTitle: {
    color: C.success,
    fontSize: 14,
    fontWeight: "800",
  },
  resolutionBody: {
    color: C.text,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  resolutionTime: {
    color: C.muted,
    fontSize: 11,
    marginTop: 6,
    fontWeight: "600",
  },
  noteCard: {
    backgroundColor: "#EFF6FF",
    borderColor: "#DBEAFE",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  noteText: {
    flex: 1,
    color: C.blue,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
  primaryBtn: {
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  primaryBtnMuted: {
    backgroundColor: C.success,
  },
  primaryBtnText: {
    color: C.white,
    fontSize: 14,
    fontWeight: "800",
  },
});
