// // // // src/screens/admin/AdminNotificationsScreen.js
// // // import React, { useState } from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   ScrollView,
// // //   StyleSheet,
// // //   TouchableOpacity,
// // //   SafeAreaView,
// // //   StatusBar,
// // // } from "react-native";
// // // import { Ionicons } from "@expo/vector-icons";

// // // const C = {
// // //   primary: "#0e3243",
// // //   accent: "#1a9e6e",
// // //   accentOrange: "#f5a623",
// // //   white: "#FFFFFF",
// // //   bg: "#f4f6f9",
// // //   card: "#FFFFFF",
// // //   text: "#0e3243",
// // //   muted: "#7a93a0",
// // //   border: "#e2eaf0",
// // //   red: "#e74c3c",
// // //   green: "#1a9e6e",
// // // };

// // // const notifications = [
// // //   {
// // //     id: "1",
// // //     type: "approval",
// // //     icon: "storefront-outline",
// // //     iconBg: "#e8f5e9",
// // //     iconColor: C.green,
// // //     title: "New Seller Registration",
// // //     message: "Rajesh Kumar from Tech Store has applied for seller approval.",
// // //     time: "2 min ago",
// // //     unread: true,
// // //   },
// // //   {
// // //     id: "2",
// // //     type: "order",
// // //     icon: "receipt-outline",
// // //     iconBg: "#e3f2fd",
// // //     iconColor: "#1976d2",
// // //     title: "New Order Placed",
// // //     message: "Order #ORD12345 worth ₹2,499 has been placed by Rahul Sharma.",
// // //     time: "15 min ago",
// // //     unread: true,
// // //   },
// // //   {
// // //     id: "3",
// // //     type: "payout",
// // //     icon: "wallet-outline",
// // //     iconBg: "#fff8e1",
// // //     iconColor: C.accentOrange,
// // //     title: "Payout Processed",
// // //     message: "Payout of ₹45,620 has been processed to Tech Store successfully.",
// // //     time: "1 hr ago",
// // //     unread: true,
// // //   },
// // //   {
// // //     id: "4",
// // //     type: "product",
// // //     icon: "cube-outline",
// // //     iconBg: "#f3e5f5",
// // //     iconColor: "#7b1fa2",
// // //     title: "Product Out of Stock",
// // //     message: "Wireless Headphones by Tech Store is now out of stock.",
// // //     time: "3 hrs ago",
// // //     unread: false,
// // //   },
// // //   {
// // //     id: "5",
// // //     type: "alert",
// // //     icon: "warning-outline",
// // //     iconBg: "#fdecea",
// // //     iconColor: C.red,
// // //     title: "High Return Rate Alert",
// // //     message: "Fashion Hub has a return rate of 18% this week. Review required.",
// // //     time: "5 hrs ago",
// // //     unread: false,
// // //   },
// // //   {
// // //     id: "6",
// // //     type: "approval",
// // //     icon: "checkmark-circle-outline",
// // //     iconBg: "#e8f5e9",
// // //     iconColor: C.green,
// // //     title: "Seller Approved",
// // //     message: "Priya Sharma from Fashion Hub has been approved as a seller.",
// // //     time: "Yesterday",
// // //     unread: false,
// // //   },
// // //   {
// // //     id: "7",
// // //     type: "report",
// // //     icon: "bar-chart-outline",
// // //     iconBg: "#e3f2fd",
// // //     iconColor: "#1976d2",
// // //     title: "Monthly Report Ready",
// // //     message: "May 2024 monthly sales report is ready. Total sales: ₹12,45,800.",
// // //     time: "Yesterday",
// // //     unread: false,
// // //   },
// // //   {
// // //     id: "8",
// // //     type: "user",
// // //     icon: "person-outline",
// // //     iconBg: "#f3e5f5",
// // //     iconColor: "#7b1fa2",
// // //     title: "New User Registered",
// // //     message: "25 new customers registered on the platform today.",
// // //     time: "2 days ago",
// // //     unread: false,
// // //   },
// // // ];

// // // export default function AdminNotificationsScreen({ navigation }) {
// // //   const [items, setItems] = useState(notifications);
// // //   const [filter, setFilter] = useState("All");

// // //   const filters = ["All", "Unread", "Approvals", "Orders", "Payouts"];

// // //   const filteredItems = items.filter((n) => {
// // //     if (filter === "All") return true;
// // //     if (filter === "Unread") return n.unread;
// // //     if (filter === "Approvals") return n.type === "approval";
// // //     if (filter === "Orders") return n.type === "order";
// // //     if (filter === "Payouts") return n.type === "payout";
// // //     return true;
// // //   });

// // //   const markAllRead = () => {
// // //     setItems(items.map((n) => ({ ...n, unread: false })));
// // //   };

// // //   const unreadCount = items.filter((n) => n.unread).length;

// // //   return (
// // //     <SafeAreaView style={styles.safe}>
// // //       <StatusBar barStyle="light-content" backgroundColor={C.primary} />
// // //       {/* Header */}
// // //       <View style={styles.header}>
// // //         <TouchableOpacity onPress={() => navigation.goBack()}>
// // //           <Ionicons name="arrow-back" size={24} color={C.white} />
// // //         </TouchableOpacity>
// // //         <View style={styles.headerCenter}>
// // //           <Text style={styles.headerTitle}>Notifications</Text>
// // //           {unreadCount > 0 && (
// // //             <View style={styles.headerBadge}>
// // //               <Text style={styles.headerBadgeText}>{unreadCount}</Text>
// // //             </View>
// // //           )}
// // //         </View>
// // //         <TouchableOpacity onPress={markAllRead}>
// // //           <Text style={styles.markAllText}>Mark all read</Text>
// // //         </TouchableOpacity>
// // //       </View>

// // //       {/* Filter Tabs */}
// // //       <View style={styles.filterWrap}>
// // //         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
// // //           {filters.map((f) => (
// // //             <TouchableOpacity
// // //               key={f}
// // //               style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
// // //               onPress={() => setFilter(f)}
// // //             >
// // //               <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
// // //             </TouchableOpacity>
// // //           ))}
// // //         </ScrollView>
// // //       </View>

// // //       <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
// // //         {filteredItems.length === 0 ? (
// // //           <View style={styles.emptyWrap}>
// // //             <Ionicons name="notifications-off-outline" size={60} color={C.muted} />
// // //             <Text style={styles.emptyText}>No notifications</Text>
// // //           </View>
// // //         ) : (
// // //           filteredItems.map((n) => (
// // //             <TouchableOpacity
// // //               key={n.id}
// // //               style={[styles.notifCard, n.unread && styles.notifCardUnread]}
// // //               activeOpacity={0.8}
// // //             >
// // //               <View style={[styles.iconWrap, { backgroundColor: n.iconBg }]}>
// // //                 <Ionicons name={n.icon} size={22} color={n.iconColor} />
// // //               </View>
// // //               <View style={styles.notifContent}>
// // //                 <View style={styles.notifHeader}>
// // //                   <Text style={styles.notifTitle}>{n.title}</Text>
// // //                   {n.unread && <View style={styles.unreadDot} />}
// // //                 </View>
// // //                 <Text style={styles.notifMessage}>{n.message}</Text>
// // //                 <Text style={styles.notifTime}>{n.time}</Text>
// // //               </View>
// // //             </TouchableOpacity>
// // //           ))
// // //         )}
// // //         <View style={{ height: 30 }} />
// // //       </ScrollView>
// // //     </SafeAreaView>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   safe: { flex: 1, backgroundColor: C.primary },
// // //   header: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "space-between",
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 14,
// // //     backgroundColor: C.primary,
// // //   },
// // //   headerCenter: { flexDirection: "row", alignItems: "center", gap: 8 },
// // //   headerTitle: { color: C.white, fontSize: 18, fontWeight: "700" },
// // //   headerBadge: {
// // //     backgroundColor: C.red,
// // //     borderRadius: 10,
// // //     minWidth: 20,
// // //     height: 20,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     paddingHorizontal: 5,
// // //   },
// // //   headerBadgeText: { color: C.white, fontSize: 11, fontWeight: "700" },
// // //   markAllText: { color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: "600" },
// // //   filterWrap: { backgroundColor: C.primary, paddingBottom: 12 },
// // //   filters: { paddingHorizontal: 16, gap: 8 },
// // //   filterBtn: {
// // //     paddingHorizontal: 14,
// // //     paddingVertical: 6,
// // //     borderRadius: 20,
// // //     backgroundColor: "rgba(255,255,255,0.1)",
// // //   },
// // //   filterBtnActive: { backgroundColor: C.white },
// // //   filterText: { fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: "600" },
// // //   filterTextActive: { color: C.primary, fontWeight: "800" },
// // //   scroll: { flex: 1, backgroundColor: C.bg },
// // //   notifCard: {
// // //     flexDirection: "row",
// // //     backgroundColor: C.card,
// // //     marginHorizontal: 16,
// // //     marginTop: 10,
// // //     borderRadius: 16,
// // //     padding: 14,
// // //     shadowColor: "#000",
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 8,
// // //     elevation: 2,
// // //     gap: 12,
// // //   },
// // //   notifCardUnread: {
// // //     borderLeftWidth: 3,
// // //     borderLeftColor: C.primary,
// // //   },
// // //   iconWrap: {
// // //     width: 48,
// // //     height: 48,
// // //     borderRadius: 14,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     flexShrink: 0,
// // //   },
// // //   notifContent: { flex: 1 },
// // //   notifHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
// // //   notifTitle: { fontSize: 13, fontWeight: "800", color: C.text, flex: 1 },
// // //   unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary, marginLeft: 8 },
// // //   notifMessage: { fontSize: 12, color: C.muted, lineHeight: 17, marginBottom: 6 },
// // //   notifTime: { fontSize: 11, color: C.muted, fontWeight: "600" },
// // //   emptyWrap: { alignItems: "center", justifyContent: "center", paddingTop: 100, gap: 12 },
// // //   emptyText: { fontSize: 16, color: C.muted, fontWeight: "600" },
// // // });






















// // // src/screens/admin/AdminNotificationsScreen.js
// // import React, { useState } from "react";
// // import {
// //   View,
// //   Text,
// //   ScrollView,
// //   StyleSheet,
// //   TouchableOpacity,
// //   SafeAreaView,
// //   StatusBar,
// // } from "react-native";
// // import { Ionicons } from "@expo/vector-icons";

// // const C = {
// //   primary: "#0e3243",
// //   accent: "#1a9e6e",
// //   accentOrange: "#f5a623",
// //   white: "#FFFFFF",
// //   bg: "#f4f6f9",
// //   card: "#FFFFFF",
// //   text: "#0e3243",
// //   muted: "#7a93a0",
// //   border: "#e2eaf0",
// //   red: "#e74c3c",
// //   green: "#1a9e6e",
// // };

// // const notifications = [
// //   {
// //     id: "1",
// //     type: "approval",
// //     icon: "storefront-outline",
// //     iconBg: "#e8f5e9",
// //     iconColor: C.green,
// //     title: "New Seller Registration",
// //     message: "Rajesh Kumar from Tech Store has applied for seller approval.",
// //     time: "2 min ago",
// //     unread: true,
// //   },
// //   {
// //     id: "2",
// //     type: "order",
// //     icon: "receipt-outline",
// //     iconBg: "#e3f2fd",
// //     iconColor: "#1976d2",
// //     title: "New Order Placed",
// //     message: "Order #ORD12345 worth ₹2,499 has been placed by Rahul Sharma.",
// //     time: "15 min ago",
// //     unread: true,
// //   },
// //   {
// //     id: "3",
// //     type: "payout",
// //     icon: "wallet-outline",
// //     iconBg: "#fff8e1",
// //     iconColor: C.accentOrange,
// //     title: "Payout Processed",
// //     message: "Payout of ₹45,620 has been processed to Tech Store successfully.",
// //     time: "1 hr ago",
// //     unread: true,
// //   },
// //   {
// //     id: "4",
// //     type: "product",
// //     icon: "cube-outline",
// //     iconBg: "#f3e5f5",
// //     iconColor: "#7b1fa2",
// //     title: "Product Out of Stock",
// //     message: "Wireless Headphones by Tech Store is now out of stock.",
// //     time: "3 hrs ago",
// //     unread: false,
// //   },
// //   {
// //     id: "5",
// //     type: "alert",
// //     icon: "warning-outline",
// //     iconBg: "#fdecea",
// //     iconColor: C.red,
// //     title: "High Return Rate Alert",
// //     message: "Fashion Hub has a return rate of 18% this week. Review required.",
// //     time: "5 hrs ago",
// //     unread: false,
// //   },
// //   {
// //     id: "6",
// //     type: "approval",
// //     icon: "checkmark-circle-outline",
// //     iconBg: "#e8f5e9",
// //     iconColor: C.green,
// //     title: "Seller Approved",
// //     message: "Priya Sharma from Fashion Hub has been approved as a seller.",
// //     time: "Yesterday",
// //     unread: false,
// //   },
// //   {
// //     id: "7",
// //     type: "report",
// //     icon: "bar-chart-outline",
// //     iconBg: "#e3f2fd",
// //     iconColor: "#1976d2",
// //     title: "Monthly Report Ready",
// //     message: "May 2024 monthly sales report is ready. Total sales: ₹12,45,800.",
// //     time: "Yesterday",
// //     unread: false,
// //   },
// //   {
// //     id: "8",
// //     type: "user",
// //     icon: "person-outline",
// //     iconBg: "#f3e5f5",
// //     iconColor: "#7b1fa2",
// //     title: "New User Registered",
// //     message: "25 new customers registered on the platform today.",
// //     time: "2 days ago",
// //     unread: false,
// //   },
// // ];

// // export default function AdminNotificationsScreen({ navigation }) {
// //   const [items, setItems] = useState(notifications);
// //   const [filter, setFilter] = useState("All");

// //   const filters = ["All", "Unread", "Approvals", "Orders", "Payouts"];

// //   const filteredItems = items.filter((n) => {
// //     if (filter === "All") return true;
// //     if (filter === "Unread") return n.unread;
// //     if (filter === "Approvals") return n.type === "approval";
// //     if (filter === "Orders") return n.type === "order";
// //     if (filter === "Payouts") return n.type === "payout";
// //     return true;
// //   });

// //   const markAllRead = () => {
// //     setItems(items.map((n) => ({ ...n, unread: false })));
// //   };

// //   const unreadCount = items.filter((n) => n.unread).length;

// //   return (
// //     <SafeAreaView style={styles.safe}>
// //       <StatusBar barStyle="light-content" backgroundColor={C.primary} />
// //       {/* Header */}
// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={() => navigation.goBack()}>
// //           <Ionicons name="arrow-back" size={24} color={C.white} />
// //         </TouchableOpacity>
// //         <View style={styles.headerCenter}>
// //           <Text style={styles.headerTitle}>Notifications</Text>
// //           {unreadCount > 0 && (
// //             <View style={styles.headerBadge}>
// //               <Text style={styles.headerBadgeText}>{unreadCount}</Text>
// //             </View>
// //           )}
// //         </View>
// //         <TouchableOpacity onPress={markAllRead}>
// //           <Text style={styles.markAllText}>Mark all read</Text>
// //         </TouchableOpacity>
// //       </View>

// //       {/* Filter Tabs */}
// //       <View style={styles.filterWrap}>
// //         <ScrollView
// //           horizontal
// //           showsHorizontalScrollIndicator={false}
// //           contentContainerStyle={styles.filters}
// //         >
// //           {filters.map((f) => (
// //             <TouchableOpacity
// //               key={f}
// //               style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
// //               onPress={() => setFilter(f)}
// //             >
// //               <Text
// //                 style={[
// //                   styles.filterText,
// //                   filter === f && styles.filterTextActive,
// //                 ]}
// //               >
// //                 {f}
// //               </Text>
// //             </TouchableOpacity>
// //           ))}
// //         </ScrollView>
// //       </View>

// //       <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
// //         {filteredItems.length === 0 ? (
// //           <View style={styles.emptyWrap}>
// //             <Ionicons name="notifications-off-outline" size={60} color={C.muted} />
// //             <Text style={styles.emptyText}>No notifications</Text>
// //           </View>
// //         ) : (
// //           filteredItems.map((n) => (
// //             <TouchableOpacity
// //               key={n.id}
// //               style={[styles.notifCard, n.unread && styles.notifCardUnread]}
// //               activeOpacity={0.8}
// //             >
// //               <View style={[styles.iconWrap, { backgroundColor: n.iconBg }]}>
// //                 <Ionicons name={n.icon} size={22} color={n.iconColor} />
// //               </View>
// //               <View style={styles.notifContent}>
// //                 <View style={styles.notifHeader}>
// //                   <Text style={styles.notifTitle}>{n.title}</Text>
// //                   {n.unread && <View style={styles.unreadDot} />}
// //                 </View>
// //                 <Text style={styles.notifMessage}>{n.message}</Text>
// //                 <Text style={styles.notifTime}>{n.time}</Text>
// //               </View>
// //             </TouchableOpacity>
// //           ))
// //         )}
// //         <View style={{ height: 30 }} />
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   safe: { flex: 1, backgroundColor: C.primary },
// //   header: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     paddingHorizontal: 20,
// //     paddingVertical: 14,
// //     backgroundColor: C.primary,
// //   },
// //   headerCenter: { flexDirection: "row", alignItems: "center", gap: 8 },
// //   headerTitle: { color: C.white, fontSize: 18, fontWeight: "700" },
// //   headerBadge: {
// //     backgroundColor: C.red,
// //     borderRadius: 10,
// //     minWidth: 20,
// //     height: 20,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     paddingHorizontal: 5,
// //   },
// //   headerBadgeText: { color: C.white, fontSize: 11, fontWeight: "700" },
// //   markAllText: {
// //     color: "rgba(255,255,255,0.7)",
// //     fontSize: 12,
// //     fontWeight: "600",
// //   },
// //   filterWrap: { backgroundColor: C.primary, paddingBottom: 12 },
// //   filters: { paddingHorizontal: 16, gap: 8 },
// //   filterBtn: {
// //     paddingHorizontal: 14,
// //     paddingVertical: 6,
// //     borderRadius: 20,
// //     backgroundColor: "rgba(255,255,255,0.1)",
// //   },
// //   filterBtnActive: { backgroundColor: C.white },
// //   filterText: {
// //     fontSize: 12,
// //     color: "rgba(255,255,255,0.7)",
// //     fontWeight: "600",
// //   },
// //   filterTextActive: { color: C.primary, fontWeight: "800" },
// //   scroll: { flex: 1, backgroundColor: C.bg },
// //   notifCard: {
// //     flexDirection: "row",
// //     backgroundColor: C.card,
// //     marginHorizontal: 16,
// //     marginTop: 10,
// //     borderRadius: 16,
// //     padding: 14,
// //     shadowColor: "#000",
// //     shadowOpacity: 0.05,
// //     shadowRadius: 8,
// //     elevation: 2,
// //     gap: 12,
// //   },
// //   notifCardUnread: {
// //     borderLeftWidth: 3,
// //     borderLeftColor: C.primary,
// //   },
// //   iconWrap: {
// //     width: 48,
// //     height: 48,
// //     borderRadius: 14,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     flexShrink: 0,
// //   },
// //   notifContent: { flex: 1 },
// //   notifHeader: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     marginBottom: 4,
// //   },
// //   notifTitle: { fontSize: 13, fontWeight: "800", color: C.text, flex: 1 },
// //   unreadDot: {
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //     backgroundColor: C.primary,
// //     marginLeft: 8,
// //   },
// //   notifMessage: { fontSize: 12, color: C.muted, lineHeight: 17, marginBottom: 6 },
// //   notifTime: { fontSize: 11, color: C.muted, fontWeight: "600" },
// //   emptyWrap: {
// //     alignItems: "center",
// //     justifyContent: "center",
// //     paddingTop: 100,
// //     gap: 12,
// //   },
// //   emptyText: { fontSize: 16, color: C.muted, fontWeight: "600" },
// // });

























// // src/screens/admin/AdminNotificationsScreen.js
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   Platform,
//   Alert,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useShop } from "../../context/ShopContext";

// const C = {
//   primary: "#0e3243",
//   accent: "#1a9e6e",
//   accentOrange: "#F97316",
//   white: "#FFFFFF",
//   bg: "#f4f6f9",
//   card: "#FFFFFF",
//   text: "#0e3243",
//   muted: "#7a93a0",
//   border: "#e2eaf0",
//   red: "#EF4444",
//   green: "#16A34A",
// };

// const FILTERS = ["All", "Unread", "Approvals", "Orders", "Complaints", "Payouts"];

// const typeToFilter = {
//   approval: "Approvals",
//   order: "Orders",
//   complaint: "Complaints",
//   payout: "Payouts",
//   alert: "Approvals",
//   product: "Orders",
//   report: "Orders",
//   user: "Orders",
// };

// export default function AdminNotificationsScreen({ navigation }) {
//   const {
//     adminNotifications,
//     markAdminNotificationRead,
//     markAllAdminNotificationsRead,
//     approveSeller,
//     rejectSeller,
//     pendingSellers,
//   } = useShop();

//   const [filter, setFilter] = useState("All");

//   const unreadCount = adminNotifications.filter((n) => n.unread).length;

//   const filteredItems = adminNotifications.filter((n) => {
//     if (filter === "All") return true;
//     if (filter === "Unread") return n.unread;
//     return typeToFilter[n.type] === filter;
//   });

//   const handleMarkAllRead = () => {
//     markAllAdminNotificationsRead();
//   };

//   const handleNotificationPress = (notification) => {
//     // Mark as read
//     if (notification.unread) {
//       markAdminNotificationRead(notification.id);
//     }

//     // If it's a seller approval notification and the seller is still pending
//     if (notification.type === "approval" && notification.sellerId) {
//       const isPending = pendingSellers.some(
//         (s) => String(s.id) === String(notification.sellerId)
//       );

//       if (isPending) {
//         const seller = pendingSellers.find(
//           (s) => String(s.id) === String(notification.sellerId)
//         );

//         Alert.alert(
//           "Seller Approval",
//           `${seller?.name || "This seller"} from ${
//             seller?.shopName || "their shop"
//           } is waiting for approval.\n\nCategory: ${
//             seller?.category || "General"
//           }\nRegistered: ${
//             seller?.registeredAt
//               ? new Date(seller.registeredAt).toLocaleDateString("en-IN")
//               : "Recently"
//           }`,
//           [
//             { text: "Cancel", style: "cancel" },
//             {
//               text: "Reject",
//               style: "destructive",
//               onPress: () => {
//                 Alert.prompt
//                   ? Alert.prompt(
//                       "Rejection Reason",
//                       "Enter reason for rejection (optional)",
//                       (reason) =>
//                         rejectSeller(
//                           notification.sellerId,
//                           reason || "Does not meet requirements"
//                         )
//                     )
//                   : rejectSeller(
//                       notification.sellerId,
//                       "Does not meet requirements"
//                     );
//               },
//             },
//             {
//               text: "Approve",
//               onPress: () => {
//                 approveSeller(notification.sellerId);
//                 Alert.alert(
//                   "Approved!",
//                   `${seller?.name || "Seller"} has been approved and notified.`
//                 );
//               },
//             },
//           ]
//         );
//       } else {
//         // Navigate to seller approvals
//         navigation.navigate("SellerApprovals");
//       }
//     }

//     // Complaint → navigate to complaint review
//     if (notification.type === "complaint") {
//       navigation.navigate("AdminComplaintReviewScreen");
//     }

//     // Order → navigate to manage orders
//     if (notification.type === "order") {
//       navigation.navigate("ManageOrders");
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="light-content" backgroundColor={C.primary} />

//       {/* ── HEADER ── */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backBtn}
//           onPress={() => navigation.goBack()}
//           activeOpacity={0.8}
//         >
//           <Ionicons name="arrow-back" size={22} color={C.white} />
//         </TouchableOpacity>

//         <View style={styles.headerCenter}>
//           <Text style={styles.headerTitle}>Notifications</Text>
//           {unreadCount > 0 && (
//             <View style={styles.headerBadge}>
//               <Text style={styles.headerBadgeText}>{unreadCount}</Text>
//             </View>
//           )}
//         </View>

//         <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.8}>
//           <Text style={styles.markAllText}>Mark all read</Text>
//         </TouchableOpacity>
//       </View>

//       {/* ── FILTER TABS ── */}
//       <View style={styles.filterWrap}>
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.filters}
//         >
//           {FILTERS.map((f) => {
//             const count =
//               f === "All"
//                 ? adminNotifications.length
//                 : f === "Unread"
//                 ? unreadCount
//                 : adminNotifications.filter(
//                     (n) => typeToFilter[n.type] === f
//                   ).length;

//             return (
//               <TouchableOpacity
//                 key={f}
//                 style={[
//                   styles.filterBtn,
//                   filter === f && styles.filterBtnActive,
//                 ]}
//                 onPress={() => setFilter(f)}
//                 activeOpacity={0.8}
//               >
//                 <Text
//                   style={[
//                     styles.filterText,
//                     filter === f && styles.filterTextActive,
//                   ]}
//                 >
//                   {f}
//                 </Text>
//                 {count > 0 && (
//                   <View
//                     style={[
//                       styles.filterCountBadge,
//                       filter === f && styles.filterCountBadgeActive,
//                     ]}
//                   >
//                     <Text
//                       style={[
//                         styles.filterCountText,
//                         filter === f && styles.filterCountTextActive,
//                       ]}
//                     >
//                       {count}
//                     </Text>
//                   </View>
//                 )}
//               </TouchableOpacity>
//             );
//           })}
//         </ScrollView>
//       </View>

//       <ScrollView
//         style={styles.scroll}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {filteredItems.length === 0 ? (
//           <View style={styles.emptyWrap}>
//             <View style={styles.emptyIcon}>
//               <Ionicons
//                 name="notifications-off-outline"
//                 size={44}
//                 color={C.muted}
//               />
//             </View>
//             <Text style={styles.emptyTitle}>No notifications</Text>
//             <Text style={styles.emptyText}>
//               {filter === "All"
//                 ? "You have no notifications yet."
//                 : `No ${filter.toLowerCase()} notifications.`}
//             </Text>
//           </View>
//         ) : (
//           filteredItems.map((n) => (
//             <TouchableOpacity
//               key={n.id}
//               style={[
//                 styles.notifCard,
//                 n.unread && styles.notifCardUnread,
//               ]}
//               activeOpacity={0.82}
//               onPress={() => handleNotificationPress(n)}
//             >
//               {/* Icon */}
//               <View
//                 style={[
//                   styles.iconWrap,
//                   { backgroundColor: n.iconBg || "#EFF6FF" },
//                 ]}
//               >
//                 <Ionicons
//                   name={n.icon || "notifications-outline"}
//                   size={22}
//                   color={n.iconColor || C.primary}
//                 />
//               </View>

//               {/* Content */}
//               <View style={styles.notifContent}>
//                 <View style={styles.notifHeader}>
//                   <Text style={styles.notifTitle} numberOfLines={1}>
//                     {n.title}
//                   </Text>
//                   {n.unread && <View style={styles.unreadDot} />}
//                 </View>
//                 <Text style={styles.notifMessage} numberOfLines={2}>
//                   {n.message}
//                 </Text>
//                 <View style={styles.notifFooter}>
//                   <Text style={styles.notifTime}>{n.time}</Text>

//                   {/* Quick approve/reject for pending seller notifications */}
//                   {n.type === "approval" &&
//                     n.sellerId &&
//                     pendingSellers.some(
//                       (s) => String(s.id) === String(n.sellerId)
//                     ) && (
//                       <View style={styles.quickActions}>
//                         <TouchableOpacity
//                           style={styles.rejectMiniBtn}
//                           activeOpacity={0.85}
//                           onPress={() =>
//                             rejectSeller(
//                               n.sellerId,
//                               "Does not meet requirements"
//                             )
//                           }
//                         >
//                           <Text style={styles.rejectMiniText}>Reject</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                           style={styles.approveMiniBtn}
//                           activeOpacity={0.85}
//                           onPress={() => {
//                             approveSeller(n.sellerId);
//                             markAdminNotificationRead(n.id);
//                           }}
//                         >
//                           <Text style={styles.approveMiniText}>Approve</Text>
//                         </TouchableOpacity>
//                       </View>
//                     )}
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))
//         )}
//         <View style={{ height: 30 }} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: C.primary },

//   // ── Header ──
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 18,
//     paddingTop: Platform.OS === "android" ? 10 : 0,
//     paddingBottom: 14,
//     backgroundColor: C.primary,
//     gap: 10,
//   },
//   backBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: 14,
//     backgroundColor: "rgba(255,255,255,0.15)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   headerCenter: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginLeft: 4,
//   },
//   headerTitle: {
//     color: C.white,
//     fontSize: 18,
//     fontWeight: "900",
//   },
//   headerBadge: {
//     backgroundColor: C.red,
//     borderRadius: 10,
//     minWidth: 22,
//     height: 22,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 5,
//   },
//   headerBadgeText: { color: C.white, fontSize: 11, fontWeight: "900" },
//   markAllText: {
//     color: "rgba(255,255,255,0.75)",
//     fontSize: 12,
//     fontWeight: "700",
//   },

//   // ── Filter tabs ──
//   filterWrap: { backgroundColor: C.primary, paddingBottom: 12 },
//   filters: { paddingHorizontal: 16, gap: 8 },
//   filterBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     paddingVertical: 7,
//     borderRadius: 20,
//     backgroundColor: "rgba(255,255,255,0.1)",
//     gap: 5,
//   },
//   filterBtnActive: { backgroundColor: C.white },
//   filterText: {
//     fontSize: 12,
//     color: "rgba(255,255,255,0.75)",
//     fontWeight: "700",
//   },
//   filterTextActive: { color: C.primary, fontWeight: "900" },
//   filterCountBadge: {
//     minWidth: 18,
//     height: 18,
//     borderRadius: 9,
//     backgroundColor: "rgba(255,255,255,0.2)",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 4,
//   },
//   filterCountBadgeActive: { backgroundColor: C.primary },
//   filterCountText: { fontSize: 10, color: C.white, fontWeight: "900" },
//   filterCountTextActive: { color: C.white },

//   // ── Scroll ──
//   scroll: { flex: 1, backgroundColor: C.bg },
//   scrollContent: { padding: 14 },

//   // ── Notification card ──
//   notifCard: {
//     flexDirection: "row",
//     backgroundColor: C.card,
//     borderRadius: 18,
//     padding: 14,
//     marginBottom: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//     gap: 12,
//     borderWidth: 1,
//     borderColor: "transparent",
//   },
//   notifCardUnread: {
//     borderLeftWidth: 3,
//     borderLeftColor: C.primary,
//     borderColor: "transparent",
//   },
//   iconWrap: {
//     width: 48,
//     height: 48,
//     borderRadius: 14,
//     alignItems: "center",
//     justifyContent: "center",
//     flexShrink: 0,
//   },
//   notifContent: { flex: 1 },
//   notifHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 4,
//   },
//   notifTitle: {
//     fontSize: 13,
//     fontWeight: "900",
//     color: C.text,
//     flex: 1,
//   },
//   unreadDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: C.primary,
//     marginLeft: 8,
//     flexShrink: 0,
//   },
//   notifMessage: {
//     fontSize: 12,
//     color: C.muted,
//     lineHeight: 17,
//     marginBottom: 6,
//   },
//   notifFooter: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   notifTime: { fontSize: 11, color: C.muted, fontWeight: "700" },

//   // ── Quick approve/reject inline buttons ──
//   quickActions: {
//     flexDirection: "row",
//     gap: 6,
//   },
//   rejectMiniBtn: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 8,
//     borderWidth: 1.5,
//     borderColor: C.red,
//   },
//   rejectMiniText: {
//     fontSize: 11,
//     fontWeight: "900",
//     color: C.red,
//   },
//   approveMiniBtn: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 8,
//     backgroundColor: C.primary,
//   },
//   approveMiniText: {
//     fontSize: 11,
//     fontWeight: "900",
//     color: C.white,
//   },

//   // ── Empty state ──
//   emptyWrap: {
//     alignItems: "center",
//     justifyContent: "center",
//     paddingTop: 80,
//   },
//   emptyIcon: {
//     width: 80,
//     height: 80,
//     borderRadius: 24,
//     backgroundColor: "#F1F5F9",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 16,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: "900",
//     color: C.text,
//     marginBottom: 6,
//   },
//   emptyText: {
//     fontSize: 13,
//     color: C.muted,
//     fontWeight: "600",
//     textAlign: "center",
//   },
// });





























// src/screens/admin/AdminNotificationsScreen.js
// FULLY UPDATED — Real notifications from ShopContext
//   - New seller registration triggers an approval notification
//   - Inline Approve / Reject buttons on seller approval cards
//   - Tapping card shows full seller detail alert if still pending
//   - Approve from here moves seller to approvedSellers → can login
//   - Filter tabs: All, Unread, Approvals, Orders, Complaints, Payouts

import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useShop } from "../../context/ShopContext";
import { showAlert } from "../../utils/showAlert";

const C = {
  primary: "#0e3243",
  accent: "#1a9e6e",
  accentOrange: "#F97316",
  white: "#FFFFFF",
  bg: "#f4f6f9",
  card: "#FFFFFF",
  text: "#0e3243",
  muted: "#7a93a0",
  border: "#e2eaf0",
  red: "#EF4444",
  green: "#16A34A",
};

const FILTERS = ["All", "Unread", "Approvals", "Orders", "Complaints", "Payouts"];

const typeToFilter = {
  approval: "Approvals",
  order: "Orders",
  complaint: "Complaints",
  payout: "Payouts",
  rejection: "Approvals",
  alert: "Approvals",
  product: "Orders",
  report: "Orders",
  user: "Orders",
};

export default function AdminNotificationsScreen({ navigation }) {
  const {
    adminNotifications,
    markAdminNotificationRead,
    markAllAdminNotificationsRead,
    approveSeller,
    rejectSeller,
    pendingSellers,
  } = useShop();

  const [filter, setFilter] = useState("All");

  const unreadCount = adminNotifications.filter((n) => n.unread).length;

  const filteredItems = adminNotifications.filter((n) => {
    if (filter === "All") return true;
    if (filter === "Unread") return n.unread;
    return typeToFilter[n.type] === filter;
  });

  const handleMarkAllRead = () => {
    markAllAdminNotificationsRead();
  };

  useFocusEffect(
    useCallback(() => {
      markAllAdminNotificationsRead?.();
    }, [markAllAdminNotificationsRead])
  );

  const handleNotificationPress = (notification) => {
    if (notification.unread) {
      markAdminNotificationRead(notification.id);
    }

    if (notification.type === "approval" && notification.sellerId) {
      const seller = pendingSellers.find(
        (s) => String(s.id) === String(notification.sellerId)
      );

      if (seller) {
        showAlert(
          "Seller Application",
          `${seller.name} — ${seller.shopName}\nCategory: ${seller.category || "—"}\nPhone: ${seller.phone || "—"}\nDocuments: ${seller.documents?.length || 0} uploaded\nApplied: ${seller.registeredAtLabel || "—"}`,
          [
            { text: "Dismiss", style: "cancel" },
            {
              text: "View Details",
              onPress: () =>
                navigation.navigate("SellerApprovals"),
            },
            {
              text: "Approve",
              onPress: () => {
                approveSeller(notification.sellerId);
                markAdminNotificationRead(notification.id);
                showAlert("Approved ✅", `${seller.name} can now log in.`);
              },
            },
          ]
        );
      } else {
        // Already processed
        navigation.navigate("SellerApprovals");
      }
      return;
    }

    if (notification.type === "complaint") {
      navigation.navigate("AdminComplaintReviewScreen");
      return;
    }

    if (notification.type === "order") {
      navigation.navigate("ManageOrders");
      return;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={22} color={C.white} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.8}>
          <Text style={styles.markAllText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {FILTERS.map((f) => {
            const count =
              f === "All"
                ? adminNotifications.length
                : f === "Unread"
                ? unreadCount
                : adminNotifications.filter((n) => typeToFilter[n.type] === f)
                    .length;

            return (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterBtn,
                  filter === f && styles.filterBtnActive,
                ]}
                onPress={() => setFilter(f)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === f && styles.filterTextActive,
                  ]}
                >
                  {f}
                </Text>
                {count > 0 && (
                  <View
                    style={[
                      styles.filterCountBadge,
                      filter === f && styles.filterCountBadgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterCountText,
                        filter === f && styles.filterCountTextActive,
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Notifications list */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredItems.length === 0 ? (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="notifications-off-outline"
                size={44}
                color={C.muted}
              />
            </View>
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptyText}>
              {filter === "All"
                ? "You have no notifications yet."
                : `No ${filter.toLowerCase()} notifications.`}
            </Text>
          </View>
        ) : (
          filteredItems.map((n) => {
            // Check if this is a still-pending seller notification
            const isPendingSeller =
              n.type === "approval" &&
              n.sellerId &&
              pendingSellers.some(
                (s) => String(s.id) === String(n.sellerId)
              );

            const pendingSeller = isPendingSeller
              ? pendingSellers.find(
                  (s) => String(s.id) === String(n.sellerId)
                )
              : null;

            return (
              <TouchableOpacity
                key={n.id}
                style={[
                  styles.notifCard,
                  n.unread && styles.notifCardUnread,
                ]}
                activeOpacity={0.82}
                onPress={() => handleNotificationPress(n)}
              >
                {/* Icon */}
                <View
                  style={[
                    styles.iconWrap,
                    { backgroundColor: n.iconBg || "#EFF6FF" },
                  ]}
                >
                  <Ionicons
                    name={n.icon || "notifications-outline"}
                    size={22}
                    color={n.iconColor || C.primary}
                  />
                </View>

                {/* Content */}
                <View style={styles.notifContent}>
                  <View style={styles.notifHeader}>
                    <Text style={styles.notifTitle} numberOfLines={1}>
                      {n.title}
                    </Text>
                    {n.unread && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notifMessage} numberOfLines={2}>
                    {n.message}
                  </Text>
                  <View style={styles.notifFooter}>
                    <Text style={styles.notifTime}>{n.time}</Text>

                    {/* Inline approve/reject for pending seller approvals */}
                    {isPendingSeller && pendingSeller && (
                      <View style={styles.quickActions}>
                        <TouchableOpacity
                          style={styles.rejectMiniBtn}
                          activeOpacity={0.85}
                          onPress={() => {
                            showAlert(
                              "Reject Seller",
                              `Reject ${pendingSeller.name}'s application?`,
                              [
                                { text: "Cancel", style: "cancel" },
                                {
                                  text: "Reject",
                                  style: "destructive",
                                  onPress: () => {
                                    rejectSeller(
                                      n.sellerId,
                                      "Does not meet requirements"
                                    );
                                    markAdminNotificationRead(n.id);
                                  },
                                },
                              ]
                            );
                          }}
                        >
                          <Text style={styles.rejectMiniText}>Reject</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.approveMiniBtn}
                          activeOpacity={0.85}
                          onPress={() => {
                            approveSeller(n.sellerId);
                            markAdminNotificationRead(n.id);
                            showAlert(
                              "Approved ✅",
                              `${pendingSeller.name} can now log in.`
                            );
                          }}
                        >
                          <Text style={styles.approveMiniText}>Approve</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Show "Already Processed" if it was an approval but no longer pending */}
                    {n.type === "approval" &&
                      n.sellerId &&
                      !isPendingSeller && (
                        <Text style={styles.processedText}>✓ Processed</Text>
                      )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.primary },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: Platform.OS === "android" ? 10 : 0,
    paddingBottom: 14,
    backgroundColor: C.primary,
    gap: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 4,
  },
  headerTitle: { color: C.white, fontSize: 18, fontWeight: "900" },
  headerBadge: {
    backgroundColor: C.red,
    borderRadius: 10,
    minWidth: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  headerBadgeText: { color: C.white, fontSize: 11, fontWeight: "900" },
  markAllText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: "700",
  },
  filterWrap: { backgroundColor: C.primary, paddingBottom: 12 },
  filters: { paddingHorizontal: 16, gap: 8 },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    gap: 5,
  },
  filterBtnActive: { backgroundColor: C.white },
  filterText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "700",
  },
  filterTextActive: { color: C.primary, fontWeight: "900" },
  filterCountBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  filterCountBadgeActive: { backgroundColor: C.primary },
  filterCountText: { fontSize: 10, color: C.white, fontWeight: "900" },
  filterCountTextActive: { color: C.white },
  scroll: { flex: 1, backgroundColor: C.bg },
  scrollContent: { padding: 14 },
  notifCard: {
    flexDirection: "row",
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  notifCardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: C.primary,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  notifContent: { flex: 1 },
  notifHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: C.text,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.primary,
    marginLeft: 8,
    flexShrink: 0,
  },
  notifMessage: {
    fontSize: 12,
    color: C.muted,
    lineHeight: 17,
    marginBottom: 6,
  },
  notifFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 6,
  },
  notifTime: { fontSize: 11, color: C.muted, fontWeight: "700" },
  quickActions: { flexDirection: "row", gap: 6 },
  rejectMiniBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: C.red,
  },
  rejectMiniText: { fontSize: 11, fontWeight: "900", color: C.red },
  approveMiniBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: C.primary,
  },
  approveMiniText: { fontSize: 11, fontWeight: "900", color: C.white },
  processedText: { fontSize: 11, color: C.accent, fontWeight: "800" },
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: C.text,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: C.muted,
    fontWeight: "600",
    textAlign: "center",
  },
});
