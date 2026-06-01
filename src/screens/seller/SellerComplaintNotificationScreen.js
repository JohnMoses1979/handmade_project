

// // src/screens/seller/SellerComplaintNotificationScreen.js

// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   StatusBar,
//   Platform,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// const C = {
//   primary: "#082843",
//   white: "#FFFFFF",
//   bg: "#FFFFFF",
//   text: "#0F172A",
//   muted: "#64748B",
//   border: "#F1E0EA",
//   red: "#EF4444",
//   card: "#FFFFFF",
//   soft: "#F8FAFC",
//   warning: "#F59E0B",
//   success: "#10B981",
// };

// export default function SellerComplaintNotificationScreen({ route, navigation }) {
//   const seller = route?.params?.seller ?? { name: "Your Shop" };
//   const complaint = route?.params?.complaint ?? null;

//   const complaints = complaint
//     ? [complaint]
//     : [
//         {
//           id: "CMP001",
//           title: "Product Quality Issue",
//           description:
//             "Customer reported the product arrived damaged and does not match the description listed on the platform.",
//           time: "2 hours ago",
//           status: "Pending",
//           orderId: "ORD-1234",
//           customer: "Rahul M.",
//         },
//         {
//           id: "CMP002",
//           title: "Late Delivery",
//           description:
//             "Order was delivered 5 days past the expected delivery date. Customer is requesting a partial refund.",
//           time: "1 day ago",
//           status: "Under Review",
//           orderId: "ORD-1189",
//           customer: "Priya S.",
//         },
//       ];

//   const getStatusColor = (status) => {
//     if (!status) return C.muted;
//     if (status === "Pending") return C.warning;
//     if (status === "Resolved") return C.success;
//     return C.primary;
//   };

//   const getStatusBg = (status) => {
//     if (!status) return "#F1F5F9";
//     if (status === "Pending") return "#FFF7ED";
//     if (status === "Resolved") return "#ECFDF5";
//     return "#EFF6FF";
//   };

//   return (
//     <View style={styles.root}>
//       <StatusBar barStyle="light-content" backgroundColor={C.primary} />

//       {/* HEADER */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backBtn}
//           onPress={() => navigation.goBack()}
//           activeOpacity={0.8}
//         >
//           <Ionicons name="arrow-back" size={22} color={C.white} />
//         </TouchableOpacity>

//         <View style={{ flex: 1 }}>
//           <Text style={styles.headerTitle}>Complaint Notifications</Text>
//           <Text style={styles.headerSub}>{seller.name || "Your Shop"}</Text>
//         </View>

//         <View style={styles.countBadge}>
//           <Text style={styles.countText}>{complaints.length}</Text>
//         </View>
//       </View>

//       <ScrollView
//         contentContainerStyle={styles.content}
//         showsVerticalScrollIndicator={false}
//       >
//         {complaints.length === 0 ? (
//           /* EMPTY STATE */
//           <View style={styles.emptyWrap}>
//             <View style={styles.emptyIcon}>
//               <Ionicons name="shield-checkmark" size={48} color={C.success} />
//             </View>
//             <Text style={styles.emptyTitle}>No Complaints</Text>
//             <Text style={styles.emptySub}>
//               Great job! There are no active complaints for your shop right now.
//             </Text>
//           </View>
//         ) : (
//           complaints.map((item, index) => (
//             <View key={item.id || index} style={styles.complaintCard}>
//               {/* Top row */}
//               <View style={styles.cardHeader}>
//                 <View style={styles.complaintIconWrap}>
//                   <Ionicons name="alert-circle" size={22} color={C.red} />
//                 </View>

//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.complaintTitle}>
//                     {item.title || "Customer Complaint"}
//                   </Text>
//                   {item.orderId ? (
//                     <Text style={styles.complaintMeta}>
//                       Order: {item.orderId}
//                       {item.customer ? `  •  ${item.customer}` : ""}
//                     </Text>
//                   ) : null}
//                 </View>

//                 <View
//                   style={[
//                     styles.statusPill,
//                     { backgroundColor: getStatusBg(item.status) },
//                   ]}
//                 >
//                   <Text
//                     style={[
//                       styles.statusText,
//                       { color: getStatusColor(item.status) },
//                     ]}
//                   >
//                     {item.status || "Pending"}
//                   </Text>
//                 </View>
//               </View>

//               {/* Description */}
//               <Text style={styles.complaintDesc}>
//                 {item.description ||
//                   "A complaint has been raised regarding this order. Please review and resolve it as soon as possible."}
//               </Text>

//               {/* Time */}
//               <View style={styles.timeRow}>
//                 <Ionicons name="time-outline" size={13} color={C.muted} />
//                 <Text style={styles.timeText}>{item.time || "Just now"}</Text>
//               </View>

//               {/* Action button */}
//               <TouchableOpacity
//                 style={styles.viewBtn}
//                 activeOpacity={0.88}
//                 onPress={() =>
//                   navigation.navigate("AdminComplaintReviewScreen", {
//                     complaint: item,
//                   })
//                 }
//               >
//                 <Ionicons name="eye-outline" size={16} color={C.white} />
//                 <Text style={styles.viewBtnText}>View Full Complaint</Text>
//               </TouchableOpacity>
//             </View>
//           ))
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: "#F8FAFC" },

//   // Header
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: C.primary,
//     paddingTop: Platform.OS === "android" ? 44 : 58,
//     paddingBottom: 18,
//     paddingHorizontal: 18,
//     gap: 12,
//   },
//   backBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: 14,
//     backgroundColor: "rgba(255,255,255,0.15)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   headerTitle: {
//     color: C.white,
//     fontSize: 18,
//     fontWeight: "900",
//   },
//   headerSub: {
//     color: "rgba(255,255,255,0.7)",
//     fontSize: 12,
//     fontWeight: "600",
//     marginTop: 2,
//   },
//   countBadge: {
//     minWidth: 32,
//     height: 32,
//     borderRadius: 12,
//     backgroundColor: C.red,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 8,
//   },
//   countText: { color: C.white, fontSize: 14, fontWeight: "900" },

//   // Content
//   content: {
//     padding: 18,
//     paddingBottom: 100,
//   },

//   // Complaint card
//   complaintCard: {
//     backgroundColor: C.white,
//     borderRadius: 22,
//     borderWidth: 1,
//     borderColor: "#FEE2E2",
//     padding: 16,
//     marginBottom: 16,
//     elevation: 2,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: 10,
//     marginBottom: 10,
//   },
//   complaintIconWrap: {
//     width: 44,
//     height: 44,
//     borderRadius: 14,
//     backgroundColor: "#FEE2E2",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   complaintTitle: {
//     fontSize: 14,
//     fontWeight: "900",
//     color: C.text,
//   },
//   complaintMeta: {
//     fontSize: 11.5,
//     color: C.muted,
//     fontWeight: "700",
//     marginTop: 3,
//   },
//   statusPill: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 999,
//   },
//   statusText: {
//     fontSize: 11,
//     fontWeight: "900",
//   },
//   complaintDesc: {
//     fontSize: 13,
//     color: C.muted,
//     fontWeight: "600",
//     lineHeight: 20,
//     marginBottom: 10,
//   },
//   timeRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//     marginBottom: 14,
//   },
//   timeText: {
//     fontSize: 11.5,
//     color: C.muted,
//     fontWeight: "700",
//   },
//   viewBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: C.primary,
//     paddingVertical: 12,
//     borderRadius: 14,
//     gap: 6,
//   },
//   viewBtnText: {
//     color: C.white,
//     fontSize: 13,
//     fontWeight: "900",
//   },

//   // Empty state
//   emptyWrap: {
//     alignItems: "center",
//     justifyContent: "center",
//     paddingTop: 80,
//   },
//   emptyIcon: {
//     width: 90,
//     height: 90,
//     borderRadius: 28,
//     backgroundColor: "#ECFDF5",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 20,
//   },
//   emptyTitle: {
//     fontSize: 22,
//     fontWeight: "900",
//     color: C.text,
//     marginBottom: 8,
//   },
//   emptySub: {
//     fontSize: 14,
//     color: C.muted,
//     fontWeight: "600",
//     textAlign: "center",
//     lineHeight: 22,
//     paddingHorizontal: 20,
//   },
// });






























// src/screens/seller/SellerComplaintNotificationScreen.js

import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
  card: "#FFFFFF",
};

export default function SellerComplaintNotificationScreen({ route, navigation }) {
  const {
    complaints: liveComplaints = [],
    currentSeller,
    reloadComplaints,
    markAllComplaintsRead,
  } = useShop();
  const seller = route?.params?.seller ?? { name: "Your Shop" };
  const complaint = route?.params?.complaint ?? null;
  const sellerComplaints = liveComplaints.filter(
    (item) =>
      !currentSeller?.id ||
      !item?.sellerId ||
      String(item.sellerId) === String(currentSeller.id)
  );

  const complaints = complaint ? [complaint] : sellerComplaints;

  useFocusEffect(
    useCallback(() => {
      if (currentSeller?.id) {
        reloadComplaints?.(currentSeller.id);
      }
      markAllComplaintsRead?.();
    }, [currentSeller?.id, reloadComplaints, markAllComplaintsRead])
  );

  const getStatusColor = (status) => {
    if (status === "Pending") return C.warning;
    if (status === "Resolved") return C.success;
    if (status === "Under Review") return C.blue;
    return C.muted;
  };

  const getStatusBg = (status) => {
    if (status === "Pending") return "#FFF7ED";
    if (status === "Resolved") return "#ECFDF5";
    if (status === "Under Review") return "#EFF6FF";
    return "#F1F5F9";
  };

  const getPriorityColor = (priority) => {
    if (priority === "High") return C.red;
    if (priority === "Medium") return C.warning;
    return C.success;
  };

  const openComplaint = (item) => {
    navigation.navigate("SellerComplaintDetails", {
      complaint: item,
      seller,
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={22} color={C.white} />
        </TouchableOpacity>

        <View style={styles.headerTextBox}>
          <Text style={styles.headerTitle}>Customer Complaints</Text>
          <Text style={styles.headerSub}>{seller?.name || "Your Shop"}</Text>
        </View>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>{complaints.length}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <MaterialCommunityIcons
              name="message-alert-outline"
              size={26}
              color={C.red}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.summaryTitle}>Complaint came from customer</Text>
            <Text style={styles.summarySub}>
              Review the complaint and respond quickly to maintain good seller rating.
            </Text>
          </View>
        </View>

        {complaints.length === 0 ? (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIcon}>
              <Ionicons name="shield-checkmark" size={48} color={C.success} />
            </View>
            <Text style={styles.emptyTitle}>No Complaints</Text>
            <Text style={styles.emptySub}>
              Great job! There are no active customer complaints for your shop.
            </Text>
          </View>
        ) : (
          complaints.map((item, index) => (
            <TouchableOpacity
              key={item.id || index}
              style={styles.complaintCard}
              activeOpacity={0.9}
              onPress={() => openComplaint(item)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.complaintIconWrap}>
                  <Ionicons name="alert-circle" size={24} color={C.red} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.complaintTitle}>
                    {item.title || "Customer Complaint"}
                  </Text>
                  <Text style={styles.complaintMeta}>
                    {item.id || "CMP"} • {item.orderId || "Order ID"}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: getStatusBg(item.status) },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(item.status) },
                    ]}
                  >
                    {item.status || "Pending"}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoBox}>
                  <Ionicons name="person-outline" size={15} color={C.primary} />
                  <Text style={styles.infoText}>{item.customer || "Customer"}</Text>
                </View>

                <View style={styles.infoBox}>
                  <Ionicons name="cube-outline" size={15} color={C.primary} />
                  <Text style={styles.infoText}>{item.product || "Product"}</Text>
                </View>
              </View>

              <Text style={styles.complaintDesc}>
                {item.description ||
                  "A customer has raised a complaint for this order. Please check and respond."}
              </Text>

              <View style={styles.bottomRow}>
                <View style={styles.timeRow}>
                  <Ionicons name="time-outline" size={14} color={C.muted} />
                  <Text style={styles.timeText}>{item.time || "Just now"}</Text>
                </View>

                <View style={styles.priorityRow}>
                  <View
                    style={[
                      styles.priorityDot,
                      { backgroundColor: getPriorityColor(item.priority) },
                    ]}
                  />
                  <Text style={styles.priorityText}>
                    {item.priority || "Normal"} Priority
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.viewBtn}
                activeOpacity={0.88}
                onPress={() => openComplaint(item)}
              >
                <Ionicons name="eye-outline" size={17} color={C.white} />
                <Text style={styles.viewBtnText}>View Complaint Details</Text>
                <Ionicons name="chevron-forward" size={17} color={C.white} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.primary,
    paddingTop: Platform.OS === "android" ? 44 : 58,
    paddingBottom: 18,
    paddingHorizontal: 18,
    gap: 12,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTextBox: {
    flex: 1,
  },

  headerTitle: {
    color: C.white,
    fontSize: 19,
    fontWeight: "900",
  },

  headerSub: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
  },

  countBadge: {
    minWidth: 34,
    height: 34,
    borderRadius: 13,
    backgroundColor: C.red,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  countText: {
    color: C.white,
    fontSize: 14,
    fontWeight: "900",
  },

  content: {
    padding: 18,
    paddingBottom: 100,
  },

  summaryCard: {
    flexDirection: "row",
    backgroundColor: C.white,
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
    elevation: 2,
    gap: 12,
  },

  summaryIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: C.softRed,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: C.text,
    marginBottom: 4,
  },

  summarySub: {
    fontSize: 12.5,
    color: C.muted,
    fontWeight: "600",
    lineHeight: 19,
  },

  complaintCard: {
    backgroundColor: C.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },

  complaintIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: C.softRed,
    alignItems: "center",
    justifyContent: "center",
  },

  complaintTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: C.text,
  },

  complaintMeta: {
    fontSize: 11.5,
    color: C.muted,
    fontWeight: "700",
    marginTop: 4,
  },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "900",
  },

  infoRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },

  infoBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 9,
    gap: 6,
  },

  infoText: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: "800",
    color: C.text,
  },

  complaintDesc: {
    fontSize: 13,
    color: C.muted,
    fontWeight: "600",
    lineHeight: 20,
    marginBottom: 12,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  timeText: {
    fontSize: 11.5,
    color: C.muted,
    fontWeight: "700",
  },

  priorityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 99,
  },

  priorityText: {
    fontSize: 11.5,
    color: C.muted,
    fontWeight: "800",
  },

  viewBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.primary,
    paddingVertical: 13,
    borderRadius: 15,
    gap: 7,
  },

  viewBtnText: {
    color: C.white,
    fontSize: 13,
    fontWeight: "900",
  },

  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },

  emptyIcon: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: C.text,
    marginBottom: 8,
  },

  emptySub: {
    fontSize: 14,
    color: C.muted,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
});
