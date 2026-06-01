// import React, { useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
//   TouchableOpacity,
//   StatusBar,
//   TextInput,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// const C = {
//   primary: "#0e3243",
//   white: "#FFFFFF",
//   bg: "#FFFFFF",
//   text: "#111827",
//   muted: "#6B7280",
//   border: "#F3D3E2",
//   soft: "#FFFFFF",
//   green: "#16A34A",
//   orange: "#F59E0B",
//   red: "#EF4444",
//   blue: "#2563EB",
// };

// const returnData = [
//   {
//     id: "#RET1001",
//     orderId: "#ORD12340",
//     customer: "Kavya Reddy",
//     product: "Ceramic Vase",
//     price: "₹1,100",
//     reason: "Damaged item received",
//     status: "Pending",
//     requestedOn: "Today, 11:20 AM",
//   },
//   {
//     id: "#RET1002",
//     orderId: "#ORD12338",
//     customer: "Arjun Nair",
//     product: "Wooden Lamp",
//     price: "₹1,850",
//     reason: "Wrong product delivered",
//     status: "Review",
//     requestedOn: "Yesterday",
//   },
//   {
//     id: "#RET1003",
//     orderId: "#ORD12332",
//     customer: "Sana Khan",
//     product: "Handmade Jute Bag",
//     price: "₹699",
//     reason: "Size issue",
//     status: "Approved",
//     requestedOn: "2 Apr",
//   },
//   {
//     id: "#RET1004",
//     orderId: "#ORD12330",
//     customer: "Rahul Varma",
//     product: "Terracotta Planter",
//     price: "₹499",
//     reason: "Customer changed mind",
//     status: "Rejected",
//     requestedOn: "1 Apr",
//   },
// ];

// export default function SellerReturnScreen({ navigation }) {
//   const [filter, setFilter] = useState("Pending");
//   const [search, setSearch] = useState("");
//   const [items, setItems] = useState(returnData);

//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();

//     return items.filter((item) => {
//       const matchFilter = filter === "All" || item.status === filter;
//       const matchSearch =
//         !q ||
//         item.id.toLowerCase().includes(q) ||
//         item.orderId.toLowerCase().includes(q) ||
//         item.customer.toLowerCase().includes(q) ||
//         item.product.toLowerCase().includes(q);

//       return matchFilter && matchSearch;
//     });
//   }, [filter, search, items]);

//   const updateStatus = (id, status) => {
//     setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
//   };

//   const counts = {
//     Pending: items.filter((i) => i.status === "Pending").length,
//     Review: items.filter((i) => i.status === "Review").length,
//     Approved: items.filter((i) => i.status === "Approved").length,
//     Rejected: items.filter((i) => i.status === "Rejected").length,
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="dark-content" backgroundColor={C.white} />

//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
//           <Ionicons name="chevron-back" size={26} color={C.text} />
//         </TouchableOpacity>

//         <Text style={styles.headerTitle}>Returns</Text>

//         <View style={{ width: 42 }} />
//       </View>

//       <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
//         <View style={styles.topCard}>
//           <View style={styles.topIcon}>
//             <Ionicons name="return-up-back" size={30} color={C.primary} />
//           </View>

//           <View style={{ flex: 1 }}>
//             <Text style={styles.topTitle}>Return Management</Text>
//             <Text style={styles.topSub}>
//               Review return requests and update approval status.
//             </Text>
//           </View>
//         </View>

//         <View style={styles.statsRow}>
//           <SmallStat label="Pending" value={counts.Pending} color={C.orange} />
//           <SmallStat label="Review" value={counts.Review} color={C.blue} />
//           <SmallStat label="Approved" value={counts.Approved} color={C.green} />
//           <SmallStat label="Rejected" value={counts.Rejected} color={C.red} />
//         </View>

//         <View style={styles.searchBox}>
//           <Ionicons name="search" size={19} color={C.muted} />
//           <TextInput
//             value={search}
//             onChangeText={setSearch}
//             placeholder="Search return, order, customer"
//             placeholderTextColor="#A1A1AA"
//             style={styles.searchInput}
//           />
//         </View>

//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.filterRow}
//         >
//           {["All", "Pending", "Review", "Approved", "Rejected"].map((item) => (
//             <TouchableOpacity
//               key={item}
//               activeOpacity={0.85}
//               onPress={() => setFilter(item)}
//               style={[styles.filterBtn, filter === item && styles.filterActive]}
//             >
//               <Text
//                 style={[
//                   styles.filterText,
//                   filter === item && styles.filterTextActive,
//                 ]}
//               >
//                 {item}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         {filtered.map((item) => (
//           <View key={item.id} style={styles.returnCard}>
//             <View style={styles.returnHead}>
//               <View>
//                 <Text style={styles.returnId}>{item.id}</Text>
//                 <Text style={styles.orderId}>{item.orderId}</Text>
//               </View>

//               <StatusPill status={item.status} />
//             </View>

//             <View style={styles.productRow}>
//               <View style={styles.productIcon}>
//                 <Ionicons name="cube-outline" size={22} color={C.primary} />
//               </View>

//               <View style={{ flex: 1 }}>
//                 <Text style={styles.productName}>{item.product}</Text>
//                 <Text style={styles.customer}>
//                   {item.customer} • {item.price}
//                 </Text>
//               </View>
//             </View>

//             <View style={styles.reasonBox}>
//               <Text style={styles.reasonLabel}>Return Reason</Text>
//               <Text style={styles.reasonText}>{item.reason}</Text>
//               <Text style={styles.requestedText}>Requested: {item.requestedOn}</Text>
//             </View>

//             {(item.status === "Pending" || item.status === "Review") && (
//               <View style={styles.actionRow}>
//                 <TouchableOpacity
//                   activeOpacity={0.85}
//                   style={[styles.actionBtn, styles.reviewBtn]}
//                   onPress={() => updateStatus(item.id, "Review")}
//                 >
//                   <Ionicons name="eye-outline" size={17} color={C.blue} />
//                   <Text style={[styles.actionText, { color: C.blue }]}>Review</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   activeOpacity={0.85}
//                   style={[styles.actionBtn, styles.approveBtn]}
//                   onPress={() => updateStatus(item.id, "Approved")}
//                 >
//                   <Ionicons name="checkmark-circle-outline" size={17} color={C.green} />
//                   <Text style={[styles.actionText, { color: C.green }]}>Approve</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   activeOpacity={0.85}
//                   style={[styles.actionBtn, styles.rejectBtn]}
//                   onPress={() => updateStatus(item.id, "Rejected")}
//                 >
//                   <Ionicons name="close-circle-outline" size={17} color={C.red} />
//                   <Text style={[styles.actionText, { color: C.red }]}>Reject</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>
//         ))}

//         {filtered.length === 0 && (
//           <View style={styles.emptyCard}>
//             <Ionicons name="document-text-outline" size={38} color={C.muted} />
//             <Text style={styles.emptyTitle}>No return requests</Text>
//             <Text style={styles.emptySub}>Try changing the filter or search text.</Text>
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// function SmallStat({ label, value, color }) {
//   return (
//     <View style={styles.smallStat}>
//       <Text style={[styles.smallStatValue, { color }]}>{value}</Text>
//       <Text style={styles.smallStatLabel}>{label}</Text>
//     </View>
//   );
// }

// function StatusPill({ status }) {
//   const color =
//     status === "Approved"
//       ? C.green
//       : status === "Rejected"
//       ? C.red
//       : status === "Review"
//       ? C.blue
//       : C.orange;

//   return (
//     <View style={[styles.statusPill, { backgroundColor: color + "18" }]}>
//       <Text style={[styles.statusText, { color }]}>{status}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: C.bg,
//   },
//   header: {
//     height: 64,
//     paddingHorizontal: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     borderBottomWidth: 1,
//     borderBottomColor: C.border,
//   },
//   backBtn: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: C.soft,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "900",
//     color: C.text,
//   },
//   content: {
//     padding: 16,
//     paddingBottom: 110,
//   },
//   topCard: {
//     borderRadius: 22,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: C.border,
//     backgroundColor: C.soft,
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   topIcon: {
//     width: 58,
//     height: 58,
//     borderRadius: 18,
//     backgroundColor: C.white,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   topTitle: {
//     fontSize: 18,
//     fontWeight: "900",
//     color: C.text,
//   },
//   topSub: {
//     fontSize: 13,
//     color: C.muted,
//     marginTop: 4,
//     fontWeight: "600",
//   },
//   statsRow: {
//     flexDirection: "row",
//     gap: 8,
//     marginBottom: 14,
//   },
//   smallStat: {
//     flex: 1,
//     backgroundColor: C.white,
//     borderWidth: 1,
//     borderColor: C.border,
//     borderRadius: 16,
//     paddingVertical: 13,
//     alignItems: "center",
//   },
//   smallStatValue: {
//     fontSize: 20,
//     fontWeight: "900",
//   },
//   smallStatLabel: {
//     fontSize: 10.5,
//     color: C.muted,
//     fontWeight: "800",
//     marginTop: 3,
//   },
//   searchBox: {
//     height: 50,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: C.border,
//     backgroundColor: C.white,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 13,
//     marginBottom: 14,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: 8,
//     color: C.text,
//     fontWeight: "700",
//   },
//   filterRow: {
//     gap: 8,
//     paddingBottom: 14,
//   },
//   filterBtn: {
//     paddingHorizontal: 16,
//     paddingVertical: 9,
//     borderRadius: 999,
//     backgroundColor: C.white,
//     borderWidth: 1,
//     borderColor: C.border,
//   },
//   filterActive: {
//     backgroundColor: C.primary,
//     borderColor: C.primary,
//   },
//   filterText: {
//     color: C.primary,
//     fontWeight: "900",
//     fontSize: 12,
//   },
//   filterTextActive: {
//     color: C.white,
//   },
//   returnCard: {
//     backgroundColor: C.white,
//     borderRadius: 22,
//     borderWidth: 1,
//     borderColor: C.border,
//     padding: 16,
//     marginBottom: 14,
//   },
//   returnHead: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   returnId: {
//     fontSize: 14,
//     color: C.text,
//     fontWeight: "900",
//   },
//   orderId: {
//     fontSize: 12,
//     color: C.muted,
//     fontWeight: "700",
//     marginTop: 2,
//   },
//   statusPill: {
//     borderRadius: 999,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//   },
//   statusText: {
//     fontSize: 11,
//     fontWeight: "900",
//   },
//   productRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 14,
//   },
//   productIcon: {
//     width: 46,
//     height: 46,
//     borderRadius: 15,
//     backgroundColor: C.soft,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   productName: {
//     fontSize: 15,
//     color: C.text,
//     fontWeight: "900",
//   },
//   customer: {
//     fontSize: 12,
//     color: C.muted,
//     fontWeight: "700",
//     marginTop: 3,
//   },
//   reasonBox: {
//     backgroundColor: "#FAFAFA",
//     borderRadius: 16,
//     padding: 13,
//     marginTop: 14,
//     borderWidth: 1,
//     borderColor: "#F1F5F9",
//   },
//   reasonLabel: {
//     color: C.muted,
//     fontSize: 11,
//     fontWeight: "900",
//     marginBottom: 4,
//   },
//   reasonText: {
//     color: C.text,
//     fontSize: 13,
//     fontWeight: "800",
//   },
//   requestedText: {
//     color: C.muted,
//     fontSize: 11.5,
//     fontWeight: "700",
//     marginTop: 7,
//   },
//   actionRow: {
//     flexDirection: "row",
//     gap: 8,
//     marginTop: 14,
//   },
//   actionBtn: {
//     flex: 1,
//     height: 42,
//     borderRadius: 14,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     gap: 5,
//     borderWidth: 1,
//   },
//   reviewBtn: {
//     backgroundColor: "#EFF6FF",
//     borderColor: "#BFDBFE",
//   },
//   approveBtn: {
//     backgroundColor: "#ECFDF5",
//     borderColor: "#BBF7D0",
//   },
//   rejectBtn: {
//     backgroundColor: "#FEF2F2",
//     borderColor: "#FECACA",
//   },
//   actionText: {
//     fontSize: 12,
//     fontWeight: "900",
//   },
//   emptyCard: {
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: C.white,
//     borderWidth: 1,
//     borderColor: C.border,
//     borderRadius: 22,
//     padding: 30,
//     marginTop: 10,
//   },
//   emptyTitle: {
//     fontSize: 16,
//     color: C.text,
//     fontWeight: "900",
//     marginTop: 10,
//   },
//   emptySub: {
//     fontSize: 12,
//     color: C.muted,
//     fontWeight: "700",
//     marginTop: 4,
//   },
// });










































// screens/seller/SellerReturnScreen.js

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Image,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useShop } from "../../context/ShopContext";

const C = {
  primary: "#0e3243",
  white: "#FFFFFF",
  bg: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  border: "#E5E7EB",
  soft: "#F8FAFC",
  green: "#16A34A",
  orange: "#F59E0B",
  red: "#EF4444",
  blue: "#2563EB",
};

const getImageSource = (image) => {
  if (!image) return null;
  if (typeof image === "string") return { uri: image };
  return image;
};

export default function SellerReturnScreen({ navigation }) {
  const {
    returnRequests = [],
    updateReturnStatus = () => {},
    currentSeller,
    formatPrice = (n) => `₹${n || 0}`,
  } = useShop();

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [processingReturnId, setProcessingReturnId] = useState(null);
  const [refundModalVisible, setRefundModalVisible] = useState(false);
  const [selectedRefundRequest, setSelectedRefundRequest] = useState(null);
  const [refundFlowState, setRefundFlowState] = useState("idle");
  const [refundGatewayResult, setRefundGatewayResult] = useState(null);
  const [refundErrorMessage, setRefundErrorMessage] = useState("");

  const goToDashboard = () => {
    setRefundModalVisible(false);
    setSelectedRefundRequest(null);
    setRefundFlowState("idle");
    setRefundGatewayResult(null);
    setRefundErrorMessage("");
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }
    navigation.navigate("SellerDashboardScreen");
  };

  const formatRefundError = (value) => {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (value && typeof value === "object") {
      if (typeof value.message === "string" && value.message.trim()) return value.message.trim();
      if (typeof value.description === "string" && value.description.trim()) return value.description.trim();
      try {
        return JSON.stringify(value);
      } catch {
        return "Unable to credit refund.";
      }
    }
    return "Unable to credit refund.";
  };

  const displayRefundError = formatRefundError(refundErrorMessage);

  const filters = [
    "All",
    "Return Requested",
    "Return Pickup Started",
    "Product Received",
  ];

  const sellerReturnRequests = useMemo(() => {
    const sellerId = String(currentSeller?.id ?? "").trim();
    if (!sellerId) return returnRequests;
    return returnRequests.filter(
      (item) => !item.sellerId || String(item.sellerId) === sellerId
    );
  }, [currentSeller, returnRequests]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return sellerReturnRequests.filter((item) => {
      const status = item.status || "Return Requested";
      const matchFilter = filter === "All" || status === filter;

      const matchSearch =
        !q ||
        String(item.id || "").toLowerCase().includes(q) ||
        String(item.orderId || "").toLowerCase().includes(q) ||
        String(item.customer || "").toLowerCase().includes(q) ||
        String(item.product || "").toLowerCase().includes(q) ||
        String(item.reason || "").toLowerCase().includes(q);

      return matchFilter && matchSearch;
    });
  }, [filter, search, sellerReturnRequests]);

  const counts = {
    All: sellerReturnRequests.length,
    "Return Requested": sellerReturnRequests.filter(
      (i) => (i.status || "Return Requested") === "Return Requested"
    ).length,
    "Return Pickup Started": sellerReturnRequests.filter(
      (i) => i.status === "Return Pickup Started"
    ).length,
    "Product Received": sellerReturnRequests.filter(
      (i) => i.status === "Product Received"
    ).length,
  };

  const startPickup = (id) => {
    updateReturnStatus(id, "Return Pickup Started");
  };

  const openRefundModal = (item) => {
    setSelectedRefundRequest(item);
    setRefundFlowState("idle");
    setRefundGatewayResult(null);
    setRefundErrorMessage("");
    setRefundModalVisible(true);
  };

  const closeRefundModal = () => {
    if (processingReturnId) return;
    setRefundModalVisible(false);
    setSelectedRefundRequest(null);
    setRefundFlowState("idle");
    setRefundGatewayResult(null);
    setRefundErrorMessage("");
  };

  const confirmRefund = async () => {
    if (!selectedRefundRequest?.id) return;
    try {
      setProcessingReturnId(selectedRefundRequest.id);
      setRefundFlowState("processing");
      setRefundGatewayResult(null);
      setRefundErrorMessage("");
      const result = await updateReturnStatus(selectedRefundRequest.id, "Product Received");
      if (!result?.success) {
        throw new Error(formatRefundError(result?.message));
      }
      setRefundGatewayResult(result?.razorpayRefund ?? null);
      setRefundFlowState("success");
    } catch (error) {
      const message = formatRefundError(error);
      setRefundErrorMessage(message);
      setRefundFlowState("failure");
      Alert.alert("Refund Failed", message);
    } finally {
      setProcessingReturnId(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={26} color={C.text} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Returns</Text>
          <Text style={styles.headerSub}>{sellerReturnRequests.length} requests</Text>
        </View>

        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("SellerNotificationScreen")}
        >
          <Ionicons name="notifications-outline" size={22} color={C.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topCard}>
          <View style={styles.topIcon}>
            <Ionicons name="return-up-back" size={30} color={C.primary} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.topTitle}>Return Pickup Flow</Text>
            <Text style={styles.topSub}>
              Start pickup first. When the product is received, Razorpay refund
              is credited back to the customer and seller balance drops.
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <SmallStat label="Requested" value={counts["Return Requested"]} color={C.orange} />
          <SmallStat label="Pickup" value={counts["Return Pickup Started"]} color={C.blue} />
          <SmallStat label="Received" value={counts["Product Received"]} color={C.green} />
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={19} color={C.muted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search return, order, customer, product"
            placeholderTextColor="#A1A1AA"
            style={styles.searchInput}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {filters.map((item) => (
            <TouchableOpacity
              key={item}
              activeOpacity={0.85}
              onPress={() => setFilter(item)}
              style={[styles.filterBtn, filter === item && styles.filterActive]}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === item && styles.filterTextActive,
                ]}
              >
                {item} ({counts[item] || 0})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filtered.map((item) => {
          const status = item.status || "Return Requested";
          const imageSource = getImageSource(item.image || item.productImage);
          const refundText =
            item.refundAmountText ||
            item.price ||
            formatPrice(item.refundAmount || 0);

          return (
            <View key={String(item.id)} style={styles.returnCard}>
              <View style={styles.returnHead}>
                <View>
                  <Text style={styles.returnId}>{item.id}</Text>
                  <Text style={styles.orderId}>{item.orderId}</Text>
                </View>

                <StatusPill status={status} />
              </View>

              <View style={styles.productRow}>
                <View style={styles.productIcon}>
                  {imageSource ? (
                    <Image
                      source={imageSource}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Ionicons name="cube-outline" size={22} color={C.primary} />
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {item.product || "Product"}
                  </Text>
                  <Text style={styles.customer}>
                    {item.customer || "Customer"} • {refundText}
                  </Text>
                </View>
              </View>

              <View style={styles.reasonBox}>
                <Text style={styles.reasonLabel}>Customer Return Reason</Text>
                <Text style={styles.reasonText}>
                  {item.reason || "No reason added"}
                </Text>
                <Text style={styles.requestedText}>
                  Requested: {item.requestedOn || "Today"}
                </Text>
              </View>

              <View style={styles.refundBox}>
                <Ionicons
                  name={item.refundCredited ? "wallet" : "time-outline"}
                  size={18}
                  color={item.refundCredited ? C.green : C.orange}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.refundTitle}>
                    Refund Amount: {refundText}
                  </Text>
                  <Text style={styles.refundMethod}>
                    Razorpay refund to customer
                    {item.razorpayRefundId ? ` - ${item.razorpayRefundId}` : ""}
                  </Text>
                  <Text
                    style={[
                      styles.refundSub,
                      { color: item.refundCredited ? C.green : C.orange },
                    ]}
                  >
                    {item.refundCredited
                      ? `Credited ${item.creditedOn || "Today"}`
                      : "Not credited. Credit only after product received."}
                  </Text>
                </View>
              </View>

              {status === "Return Requested" && (
                <TouchableOpacity
                  style={styles.pickupBtn}
                  activeOpacity={0.85}
                  onPress={() => startPickup(item.id)}
                >
                  <Ionicons name="bicycle-outline" size={18} color={C.white} />
                  <Text style={styles.pickupText}>Start Return Pickup</Text>
                </TouchableOpacity>
              )}

              {status === "Return Pickup Started" && (
                <TouchableOpacity
                  style={styles.receivedBtn}
                  activeOpacity={0.85}
                  onPress={() => openRefundModal(item)}
                  disabled={processingReturnId === item.id}
                >
                  {processingReturnId === item.id ? (
                    <ActivityIndicator size="small" color={C.white} />
                  ) : (
                    <Ionicons
                      name="checkmark-done-circle"
                      size={18}
                      color={C.white}
                    />
                  )}
                  <Text style={styles.receivedText}>Refund via Razorpay</Text>
                </TouchableOpacity>
              )}

              {status === "Product Received" && (
                <View style={styles.completedBox}>
                  <Ionicons
                    name="checkmark-done-circle"
                    size={18}
                    color={C.green}
                  />
                  <Text style={styles.completedText}>
                    Product received. Razorpay refund credited successfully.
                  </Text>
                </View>
              )}
            </View>
          );
        })}

        {filtered.length === 0 && (
          <View style={styles.emptyCard}>
            <Ionicons name="document-text-outline" size={38} color={C.muted} />
            <Text style={styles.emptyTitle}>No return requests</Text>
            <Text style={styles.emptySub}>
              Customer return requests will appear here automatically.
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={refundModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeRefundModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {refundFlowState === "processing" ? (
              <View style={styles.processingWrap}>
                <ActivityIndicator size="large" color={C.primary} />
                <Text style={styles.processingTitle}>Processing Razorpay refund</Text>
                <Text style={styles.processingSub}>
                  Please wait while Razorpay processes the refund using the original payment id.
                </Text>
                <Text style={styles.processingMeta}>
                  Payment: {selectedRefundRequest?.razorpayPaymentId || "-"}
                </Text>
                <Text style={styles.processingMeta}>
                  Amount: {selectedRefundRequest?.refundAmountText || selectedRefundRequest?.price || formatPrice(selectedRefundRequest?.refundAmount || 0)}
                </Text>
              </View>
            ) : refundFlowState === "success" ? (
              <View style={styles.processingWrap}>
                <View style={styles.successIcon}>
                  <Ionicons name="checkmark-circle" size={30} color={C.green} />
                </View>
                <Text style={styles.processingTitle}>Refund successful</Text>
                <Text style={styles.processingSub}>
                  Customer will see the refunded amount in the original payment method.
                </Text>
                <Text style={styles.processingMeta}>
                  Status: {refundGatewayResult?.status || "processing"}
                </Text>
                <Text style={styles.processingMeta}>
                  Refund ID: {refundGatewayResult?.refundId || "-"}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={goToDashboard}
                  style={[styles.doneBtn, styles.modalConfirmBtn]}
                >
                  <Text style={styles.modalConfirmText}>Back to Dashboard</Text>
                </TouchableOpacity>
              </View>
            ) : refundFlowState === "failure" ? (
              <View style={styles.processingWrap}>
                <View style={styles.failureIcon}>
                  <Ionicons name="close-circle" size={30} color={C.red} />
                </View>
                <Text style={styles.processingTitle}>Refund failed</Text>
                <Text style={styles.processingSub}>
                  {displayRefundError || "Razorpay could not complete the refund request."}
                </Text>
                <Text style={styles.processingMeta}>
                  Payment: {selectedRefundRequest?.razorpayPaymentId || "-"}
                </Text>
                <View style={styles.modalFailureActions}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setRefundFlowState("idle")}
                    style={[styles.doneBtn, styles.retryBtn]}
                  >
                    <Text style={[styles.modalConfirmText, { color: C.primary }]}>Retry</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={goToDashboard}
                    style={[styles.doneBtn, styles.modalConfirmBtn]}
                  >
                    <Text style={styles.modalConfirmText}>Back to Dashboard</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <View style={styles.modalTopRow}>
                  <View style={styles.modalIcon}>
                    <Ionicons name="shield-checkmark" size={22} color={C.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalTitle}>Confirm Razorpay Refund</Text>
                    <Text style={styles.modalSub}>
                      This will refund the original payment. No new payment will be collected.
                    </Text>
                  </View>
                </View>

                <View style={styles.modalInfoBox}>
                  <Text style={styles.modalInfoLabel}>Order</Text>
                  <Text style={styles.modalInfoValue}>{selectedRefundRequest?.orderId || "-"}</Text>
                </View>
                <View style={styles.modalInfoBox}>
                  <Text style={styles.modalInfoLabel}>Original Payment</Text>
                  <Text style={styles.modalInfoValue}>
                    {selectedRefundRequest?.razorpayPaymentId || "-"}
                  </Text>
                </View>
                <View style={styles.modalInfoBox}>
                  <Text style={styles.modalInfoLabel}>Refund Amount</Text>
                  <Text style={styles.modalInfoValue}>
                    {selectedRefundRequest?.refundAmountText ||
                      selectedRefundRequest?.price ||
                      formatPrice(selectedRefundRequest?.refundAmount || 0)}
                  </Text>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={closeRefundModal}
                    style={[styles.modalBtn, styles.modalCancelBtn]}
                    disabled={Boolean(processingReturnId)}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={confirmRefund}
                    style={[styles.modalBtn, styles.modalConfirmBtn]}
                    disabled={Boolean(processingReturnId)}
                  >
                    {processingReturnId ? (
                      <ActivityIndicator size="small" color={C.white} />
                    ) : (
                      <Ionicons name="card-outline" size={17} color={C.white} />
                    )}
                    <Text style={styles.modalConfirmText}>
                      {processingReturnId ? "Refunding..." : "Confirm Refund"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function SmallStat({ label, value, color }) {
  return (
    <View style={styles.smallStat}>
      <Text style={[styles.smallStatValue, { color }]}>{value}</Text>
      <Text style={styles.smallStatLabel}>{label}</Text>
    </View>
  );
}

function StatusPill({ status }) {
  const color =
    status === "Product Received"
      ? C.green
      : status === "Return Pickup Started"
      ? C.blue
      : C.orange;

  return (
    <View style={[styles.statusPill, { backgroundColor: color + "18" }]}>
      <Text style={[styles.statusText, { color }]}>
        {status || "Return Requested"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: {
    height: Platform.OS === "web" ? 66 : 64,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    backgroundColor: C.white,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.soft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.border,
  },
  headerCenter: { alignItems: "center", flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: "900", color: C.text },
  headerSub: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "700",
    color: C.muted,
  },
  content: { padding: 16, paddingBottom: 110 },
  topCard: {
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.soft,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  topIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  topTitle: { fontSize: 18, fontWeight: "900", color: C.text },
  topSub: {
    fontSize: 13,
    color: C.muted,
    marginTop: 4,
    fontWeight: "600",
    lineHeight: 18,
  },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  smallStat: {
    flex: 1,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
  },
  smallStatValue: { fontSize: 20, fontWeight: "900" },
  smallStatLabel: {
    fontSize: 10.5,
    color: C.muted,
    fontWeight: "800",
    marginTop: 3,
  },
  searchBox: {
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: C.text,
    fontWeight: "700",
  },
  filterRow: { gap: 8, paddingBottom: 14 },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
  },
  filterActive: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  filterText: { color: C.primary, fontWeight: "900", fontSize: 12 },
  filterTextActive: { color: C.white },
  returnCard: {
    backgroundColor: C.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },
  returnHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  returnId: { fontSize: 14, color: C.text, fontWeight: "900" },
  orderId: {
    fontSize: 12,
    color: C.muted,
    fontWeight: "700",
    marginTop: 2,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    maxWidth: 180,
  },
  statusText: { fontSize: 11, fontWeight: "900" },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },
  productIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: C.soft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.border,
  },
  productImage: { width: "100%", height: "100%" },
  productName: {
    fontSize: 15,
    color: C.text,
    fontWeight: "900",
    lineHeight: 20,
  },
  customer: {
    fontSize: 12,
    color: C.muted,
    fontWeight: "700",
    marginTop: 3,
  },
  reasonBox: {
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    padding: 13,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  reasonLabel: {
    color: C.muted,
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 4,
  },
  reasonText: {
    color: C.text,
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18,
  },
  requestedText: {
    color: C.muted,
    fontSize: 11.5,
    fontWeight: "700",
    marginTop: 7,
  },
  refundBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  refundTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: C.text,
  },
  refundMethod: {
    marginTop: 2,
    fontSize: 11.5,
    fontWeight: "800",
    color: C.blue,
  },
  refundSub: {
    marginTop: 2,
    fontSize: 11.5,
    fontWeight: "800",
  },
  pickupBtn: {
    marginTop: 14,
    height: 44,
    borderRadius: 15,
    backgroundColor: C.blue,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },
  pickupText: {
    color: C.white,
    fontSize: 13,
    fontWeight: "900",
  },
  receivedBtn: {
    marginTop: 14,
    height: 44,
    borderRadius: 15,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },
  receivedText: {
    color: C.white,
    fontSize: 13,
    fontWeight: "900",
  },
  completedBox: {
    marginTop: 14,
    padding: 11,
    borderRadius: 14,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  completedText: {
    flex: 1,
    color: C.green,
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 17,
  },
  emptyCard: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 22,
    padding: 30,
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 16,
    color: C.text,
    fontWeight: "900",
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: C.muted,
    fontWeight: "700",
    marginTop: 4,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: C.white,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: C.border,
  },
  modalTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 14,
  },
  modalIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    color: C.text,
    fontSize: 16,
    fontWeight: "900",
  },
  modalSub: {
    marginTop: 4,
    color: C.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
  modalInfoBox: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  modalInfoLabel: {
    color: C.muted,
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 4,
  },
  modalInfoValue: {
    color: C.text,
    fontSize: 13,
    fontWeight: "800",
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  modalBtn: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  modalCancelBtn: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: C.border,
  },
  modalConfirmBtn: {
    backgroundColor: C.primary,
  },
  doneBtn: {
    minWidth: 120,
    marginTop: 14,
    paddingHorizontal: 18,
  },
  retryBtn: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  modalCancelText: {
    color: C.text,
    fontSize: 13,
    fontWeight: "900",
  },
  modalConfirmText: {
    color: C.white,
    fontSize: 13,
    fontWeight: "900",
  },
  processingWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  processingTitle: {
    color: C.text,
    fontSize: 16,
    fontWeight: "900",
    marginTop: 14,
    textAlign: "center",
  },
  processingSub: {
    marginTop: 6,
    color: C.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    fontWeight: "600",
  },
  processingMeta: {
    marginTop: 10,
    color: C.primary,
    fontSize: 11.5,
    fontWeight: "800",
    textAlign: "center",
  },
  successIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },
  failureIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  modalFailureActions: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginTop: 14,
  },
});
