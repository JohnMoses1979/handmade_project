

// // // src/screens/admin/ManageUsersScreen.js

// // import React, { useMemo, useState } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   FlatList,
// //   TouchableOpacity,
// //   SafeAreaView,
// //   TextInput,
// //   StatusBar,
// //   Platform,
// // } from "react-native";
// // import { Ionicons } from "@expo/vector-icons";

// // const C = {
// //   primary: "#061B44",
// //   primary2: "#0B2A6F",
// //   purple: "#6D28D9",
// //   white: "#FFFFFF",
// //   bg: "#F6F8FC",
// //   card: "#FFFFFF",
// //   text: "#0F172A",
// //   muted: "#64748B",
// //   border: "#E2E8F0",
// //   blue: "#2563EB",
// //   green: "#16A34A",
// //   orange: "#F97316",
// //   red: "#EF4444",
// //   gray: "#64748B",
// // };

// // const initialUsers = [
// //   {
// //     id: "U1",
// //     type: "Customer",
// //     name: "John Doe",
// //     email: "john.doe@email.com",
// //     phone: "+91 98765 43210",
// //     date: "May 29, 2024",
// //     status: "Active",
// //     orders: 5,
// //     spent: "₹35,200",
// //   },
// //   {
// //     id: "U2",
// //     type: "Customer",
// //     name: "Alice Smith",
// //     email: "alice.smith@email.com",
// //     phone: "+91 98765 11111",
// //     date: "May 29, 2024",
// //     status: "Active",
// //     orders: 3,
// //     spent: "₹18,400",
// //   },
// //   {
// //     id: "U3",
// //     type: "Customer",
// //     name: "Michael Lee",
// //     email: "michael.lee@email.com",
// //     phone: "+91 98765 22222",
// //     date: "May 27, 2024",
// //     status: "Blocked",
// //     orders: 0,
// //     spent: "₹0",
// //   },
// // ];

// // const initialSellers = [
// //   {
// //     id: "S1",
// //     type: "Seller",
// //     name: "Tech Store",
// //     email: "techstore@email.com",
// //     phone: "+91 90000 11111",
// //     shopName: "Tech Store",
// //     category: "Electronics",
// //     date: "May 29, 2024",
// //     status: "Pending",
// //     products: 0,
// //     earnings: "₹0",
// //   },
// //   {
// //     id: "S2",
// //     type: "Seller",
// //     name: "Fashion Hub",
// //     email: "fashionhub@email.com",
// //     phone: "+91 90000 22222",
// //     shopName: "Fashion Hub",
// //     category: "Fashion",
// //     date: "May 28, 2024",
// //     status: "Approved",
// //     products: 18,
// //     earnings: "₹78,500",
// //   },
// //   {
// //     id: "S3",
// //     type: "Seller",
// //     name: "Daily Essentials",
// //     email: "daily@email.com",
// //     phone: "+91 90000 33333",
// //     shopName: "Daily Essentials",
// //     category: "Grocery",
// //     date: "May 27, 2024",
// //     status: "Rejected",
// //     products: 0,
// //     earnings: "₹0",
// //   },
// // ];

// // const mainTabs = ["All", "Customers", "Sellers"];
// // const statusTabs = ["All", "Active", "Pending", "Approved", "Rejected", "Blocked"];

// // const getStatusStyle = (status) => {
// //   switch (status) {
// //     case "Active":
// //     case "Approved":
// //       return { bg: "#DCFCE7", text: C.green };
// //     case "Pending":
// //       return { bg: "#FFEDD5", text: C.orange };
// //     case "Rejected":
// //     case "Blocked":
// //       return { bg: "#FEE2E2", text: C.red };
// //     default:
// //       return { bg: "#F1F5F9", text: C.gray };
// //   }
// // };

// // export default function ManageUsersScreen({ navigation }) {
// //   const [users, setUsers] = useState(initialUsers);
// //   const [sellers, setSellers] = useState(initialSellers);
// //   const [mainTab, setMainTab] = useState("All");
// //   const [statusTab, setStatusTab] = useState("All");
// //   const [search, setSearch] = useState("");
// //   const [toast, setToast] = useState("");

// //   const showToast = (msg) => {
// //     setToast(msg);
// //     setTimeout(() => setToast(""), 1700);
// //   };

// //   const allPeople = useMemo(() => [...users, ...sellers], [users, sellers]);

// //   const filteredPeople = useMemo(() => {
// //     return allPeople.filter((item) => {
// //       const matchMain =
// //         mainTab === "All" ||
// //         (mainTab === "Customers" && item.type === "Customer") ||
// //         (mainTab === "Sellers" && item.type === "Seller");

// //       const matchStatus = statusTab === "All" || item.status === statusTab;

// //       const query = search.toLowerCase();
// //       const matchSearch =
// //         item.name.toLowerCase().includes(query) ||
// //         item.email.toLowerCase().includes(query) ||
// //         item.phone.toLowerCase().includes(query) ||
// //         item.type.toLowerCase().includes(query) ||
// //         item.status.toLowerCase().includes(query) ||
// //         item.shopName?.toLowerCase().includes(query) ||
// //         item.category?.toLowerCase().includes(query);

// //       return matchMain && matchStatus && matchSearch;
// //     });
// //   }, [allPeople, mainTab, statusTab, search]);

// //   const totalCustomers = users.length;
// //   const totalSellers = sellers.length;
// //   const pendingSellers = sellers.filter((s) => s.status === "Pending").length;
// //   const approvedSellers = sellers.filter((s) => s.status === "Approved").length;

// //   const approveSeller = (sellerId) => {
// //     setSellers((prev) =>
// //       prev.map((s) =>
// //         s.id === sellerId ? { ...s, status: "Approved" } : s
// //       )
// //     );
// //     showToast("Seller approved. Now seller can login.");
// //   };

// //   const rejectSeller = (sellerId) => {
// //     setSellers((prev) =>
// //       prev.map((s) =>
// //         s.id === sellerId ? { ...s, status: "Rejected" } : s
// //       )
// //     );
// //     showToast("Seller rejected successfully.");
// //   };

// //   const blockCustomer = (userId) => {
// //     setUsers((prev) =>
// //       prev.map((u) =>
// //         u.id === userId ? { ...u, status: "Blocked" } : u
// //       )
// //     );
// //     showToast("User blocked successfully.");
// //   };

// //   const activateCustomer = (userId) => {
// //     setUsers((prev) =>
// //       prev.map((u) =>
// //         u.id === userId ? { ...u, status: "Active" } : u
// //       )
// //     );
// //     showToast("User activated successfully.");
// //   };

// //   const renderPerson = ({ item }) => {
// //     const statusStyle = getStatusStyle(item.status);
// //     const isSeller = item.type === "Seller";

// //     return (
// //       <View style={styles.card}>
// //         <View
// //           style={[
// //             styles.avatar,
// //             { backgroundColor: isSeller ? "#EAFBF0" : "#EAF2FF" },
// //           ]}
// //         >
// //           <Ionicons
// //             name={isSeller ? "storefront" : "person"}
// //             size={24}
// //             color={isSeller ? C.green : C.blue}
// //           />
// //         </View>

// //         <View style={styles.info}>
// //           <View style={styles.nameRow}>
// //             <Text style={styles.name}>{item.name}</Text>
// //             <View style={[styles.typeBadge, { backgroundColor: isSeller ? "#DCFCE7" : "#DBEAFE" }]}>
// //               <Text style={[styles.typeText, { color: isSeller ? C.green : C.blue }]}>
// //                 {item.type}
// //               </Text>
// //             </View>
// //           </View>

// //           <Text style={styles.email}>{item.email}</Text>
// //           <Text style={styles.phone}>{item.phone}</Text>

// //           {isSeller ? (
// //             <>
// //               <Text style={styles.meta}>Shop: {item.shopName}</Text>
// //               <Text style={styles.meta}>Category: {item.category}</Text>
// //               <View style={styles.statsRow}>
// //                 <Text style={styles.stat}>📦 {item.products} products</Text>
// //                 <Text style={styles.stat}>💰 {item.earnings}</Text>
// //               </View>
// //             </>
// //           ) : (
// //             <View style={styles.statsRow}>
// //               <Text style={styles.stat}>🛒 {item.orders} orders</Text>
// //               <Text style={styles.stat}>💰 {item.spent}</Text>
// //             </View>
// //           )}

// //           <Text style={styles.date}>Registered: {item.date}</Text>

// //           <View style={styles.actionRow}>
// //             {isSeller && item.status === "Pending" ? (
// //               <>
// //                 <TouchableOpacity
// //                   style={styles.approveBtn}
// //                   onPress={() => approveSeller(item.id)}
// //                   activeOpacity={0.85}
// //                 >
// //                   <Ionicons name="checkmark" size={16} color={C.white} />
// //                   <Text style={styles.btnText}>Approve</Text>
// //                 </TouchableOpacity>

// //                 <TouchableOpacity
// //                   style={styles.rejectBtn}
// //                   onPress={() => rejectSeller(item.id)}
// //                   activeOpacity={0.85}
// //                 >
// //                   <Ionicons name="close" size={16} color={C.white} />
// //                   <Text style={styles.btnText}>Reject</Text>
// //                 </TouchableOpacity>
// //               </>
// //             ) : item.type === "Customer" && item.status !== "Blocked" ? (
// //               <TouchableOpacity
// //                 style={styles.lightDangerBtn}
// //                 onPress={() => blockCustomer(item.id)}
// //                 activeOpacity={0.85}
// //               >
// //                 <Ionicons name="ban-outline" size={16} color={C.red} />
// //                 <Text style={styles.blockText}>Block User</Text>
// //               </TouchableOpacity>
// //             ) : item.type === "Customer" && item.status === "Blocked" ? (
// //               <TouchableOpacity
// //                 style={styles.lightSuccessBtn}
// //                 onPress={() => activateCustomer(item.id)}
// //                 activeOpacity={0.85}
// //               >
// //                 <Ionicons name="checkmark-circle-outline" size={16} color={C.green} />
// //                 <Text style={styles.activateText}>Activate User</Text>
// //               </TouchableOpacity>
// //             ) : null}
// //           </View>
// //         </View>

// //         <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
// //           <Text style={[styles.statusText, { color: statusStyle.text }]}>
// //             {item.status}
// //           </Text>
// //         </View>
// //       </View>
// //     );
// //   };

// //   return (
// //     <SafeAreaView style={styles.safe}>
// //       <StatusBar barStyle="light-content" backgroundColor={C.primary} />

// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
// //           <Ionicons name="arrow-back" size={24} color={C.white} />
// //         </TouchableOpacity>

// //         <Text style={styles.headerTitle}>User Management</Text>

// //         <TouchableOpacity activeOpacity={0.8}>
// //           <Ionicons name="filter-outline" size={23} color={C.white} />
// //         </TouchableOpacity>
// //       </View>

// //       {toast ? (
// //         <View style={styles.toast}>
// //           <Ionicons name="checkmark-circle" size={18} color={C.white} />
// //           <Text style={styles.toastText}>{toast}</Text>
// //         </View>
// //       ) : null}

// //       <View style={styles.statsBox}>
// //         <StatCard label="Customers" value={totalCustomers} icon="people" color={C.blue} />
// //         <StatCard label="Sellers" value={totalSellers} icon="storefront" color={C.green} />
// //         <StatCard label="Pending" value={pendingSellers} icon="time" color={C.orange} />
// //         <StatCard label="Approved" value={approvedSellers} icon="shield-checkmark" color={C.purple} />
// //       </View>

// //       <View style={styles.searchBox}>
// //         <Ionicons name="search-outline" size={20} color={C.muted} />
// //         <TextInput
// //           style={styles.searchInput}
// //           placeholder="Search name, email, phone, shop..."
// //           placeholderTextColor="#94A3B8"
// //           value={search}
// //           onChangeText={setSearch}
// //         />
// //         {search.length > 0 && (
// //           <TouchableOpacity onPress={() => setSearch("")}>
// //             <Ionicons name="close-circle" size={20} color={C.muted} />
// //           </TouchableOpacity>
// //         )}
// //       </View>

// //       <View style={styles.tabWrap}>
// //         {mainTabs.map((t) => (
// //           <TouchableOpacity
// //             key={t}
// //             style={[styles.mainTab, mainTab === t && styles.mainTabActive]}
// //             onPress={() => setMainTab(t)}
// //             activeOpacity={0.85}
// //           >
// //             <Text style={[styles.mainTabText, mainTab === t && styles.mainTabTextActive]}>
// //               {t}
// //             </Text>
// //           </TouchableOpacity>
// //         ))}
// //       </View>

// //       <FlatList
// //         horizontal
// //         data={statusTabs}
// //         keyExtractor={(item) => item}
// //         showsHorizontalScrollIndicator={false}
// //         contentContainerStyle={styles.statusTabs}
// //         renderItem={({ item }) => (
// //           <TouchableOpacity
// //             style={[styles.statusTab, statusTab === item && styles.statusTabActive]}
// //             onPress={() => setStatusTab(item)}
// //             activeOpacity={0.85}
// //           >
// //             <Text style={[styles.statusTabText, statusTab === item && styles.statusTabTextActive]}>
// //               {item}
// //             </Text>
// //           </TouchableOpacity>
// //         )}
// //       />

// //       <FlatList
// //         data={filteredPeople}
// //         keyExtractor={(item) => item.id}
// //         renderItem={renderPerson}
// //         showsVerticalScrollIndicator={false}
// //         contentContainerStyle={styles.list}
// //         ListEmptyComponent={
// //           <View style={styles.emptyBox}>
// //             <Ionicons name="search-outline" size={42} color="#CBD5E1" />
// //             <Text style={styles.emptyTitle}>No records found</Text>
// //             <Text style={styles.emptyText}>Try another search or filter.</Text>
// //           </View>
// //         }
// //       />

// //       <View style={styles.bottomNav}>
// //         <BottomItem
// //           icon="home-outline"
// //           label="Dashboard"
// //           onPress={() => navigation.navigate("AdminDashboardScreen")}
// //         />
// //         <BottomItem
// //           icon="receipt-outline"
// //           label="Orders"
// //           onPress={() => navigation.navigate("ManageOrdersScreen")}
// //         />
// //         <BottomItem
// //           icon="cube-outline"
// //           label="Products"
// //           onPress={() => navigation.navigate("ManageProductsScreen")}
// //         />
// //         <BottomItem icon="people" label="Users" active />
// //         <BottomItem
// //           icon="ellipsis-horizontal"
// //           label="More"
// //           onPress={() => navigation.navigate("AdminReportsScreen")}
// //         />
// //       </View>
// //     </SafeAreaView>
// //   );
// // }

// // function StatCard({ label, value, icon, color }) {
// //   return (
// //     <View style={styles.statCard}>
// //       <View style={[styles.statIcon, { backgroundColor: `${color}18` }]}>
// //         <Ionicons name={icon} size={20} color={color} />
// //       </View>
// //       <Text style={styles.statValue}>{value}</Text>
// //       <Text style={styles.statLabel}>{label}</Text>
// //     </View>
// //   );
// // }

// // function BottomItem({ icon, label, active, onPress }) {
// //   return (
// //     <TouchableOpacity style={styles.bottomItem} onPress={onPress} activeOpacity={0.85}>
// //       <Ionicons name={icon} size={23} color={active ? C.blue : "#94A3B8"} />
// //       <Text style={[styles.bottomLabel, active && { color: C.blue }]}>{label}</Text>
// //     </TouchableOpacity>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   safe: {
// //     flex: 1,
// //     backgroundColor: C.bg,
// //   },
// //   header: {
// //     backgroundColor: C.primary,
// //     paddingTop: Platform.OS === "ios" ? 16 : 18,
// //     paddingBottom: 18,
// //     paddingHorizontal: 18,
// //     borderBottomLeftRadius: 26,
// //     borderBottomRightRadius: 26,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //   },
// //   headerTitle: {
// //     color: C.white,
// //     fontSize: 20,
// //     fontWeight: "900",
// //   },
// //   toast: {
// //     position: "absolute",
// //     top: Platform.OS === "ios" ? 85 : 70,
// //     left: 18,
// //     right: 18,
// //     zIndex: 10,
// //     backgroundColor: C.green,
// //     borderRadius: 16,
// //     padding: 13,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     gap: 8,
// //   },
// //   toastText: {
// //     color: C.white,
// //     fontSize: 13,
// //     fontWeight: "900",
// //   },
// //   statsBox: {
// //     flexDirection: "row",
// //     margin: 14,
// //     gap: 8,
// //   },
// //   statCard: {
// //     flex: 1,
// //     backgroundColor: C.white,
// //     borderRadius: 18,
// //     paddingVertical: 14,
// //     alignItems: "center",
// //     borderWidth: 1,
// //     borderColor: C.border,
// //     elevation: 2,
// //   },
// //   statIcon: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 13,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   statValue: {
// //     marginTop: 6,
// //     fontSize: 20,
// //     fontWeight: "900",
// //     color: C.text,
// //   },
// //   statLabel: {
// //     marginTop: 2,
// //     fontSize: 10,
// //     fontWeight: "800",
// //     color: C.muted,
// //   },
// //   searchBox: {
// //     marginHorizontal: 14,
// //     height: 52,
// //     borderRadius: 18,
// //     backgroundColor: C.white,
// //     borderWidth: 1,
// //     borderColor: C.border,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     paddingHorizontal: 14,
// //     gap: 10,
// //   },
// //   searchInput: {
// //     flex: 1,
// //     fontSize: 14,
// //     fontWeight: "700",
// //     color: C.text,
// //   },
// //   tabWrap: {
// //     flexDirection: "row",
// //     marginHorizontal: 14,
// //     marginTop: 12,
// //     backgroundColor: "#EAF0F8",
// //     borderRadius: 18,
// //     padding: 5,
// //   },
// //   mainTab: {
// //     flex: 1,
// //     height: 40,
// //     borderRadius: 14,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   mainTabActive: {
// //     backgroundColor: C.white,
// //     elevation: 2,
// //   },
// //   mainTabText: {
// //     fontSize: 13,
// //     fontWeight: "900",
// //     color: C.muted,
// //   },
// //   mainTabTextActive: {
// //     color: C.primary,
// //   },
// //   statusTabs: {
// //     paddingHorizontal: 14,
// //     paddingTop: 12,
// //     paddingBottom: 8,
// //     gap: 8,
// //   },
// //   statusTab: {
// //     paddingHorizontal: 15,
// //     height: 36,
// //     borderRadius: 18,
// //     backgroundColor: C.white,
// //     borderWidth: 1,
// //     borderColor: C.border,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   statusTabActive: {
// //     backgroundColor: C.primary,
// //     borderColor: C.primary,
// //   },
// //   statusTabText: {
// //     fontSize: 12,
// //     fontWeight: "900",
// //     color: C.muted,
// //   },
// //   statusTabTextActive: {
// //     color: C.white,
// //   },
// //   list: {
// //     paddingHorizontal: 14,
// //     paddingBottom: 105,
// //   },
// //   card: {
// //     backgroundColor: C.white,
// //     borderRadius: 22,
// //     padding: 14,
// //     marginBottom: 12,
// //     borderWidth: 1,
// //     borderColor: C.border,
// //     flexDirection: "row",
// //     elevation: 3,
// //   },
// //   avatar: {
// //     width: 52,
// //     height: 52,
// //     borderRadius: 18,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginRight: 12,
// //   },
// //   info: {
// //     flex: 1,
// //   },
// //   nameRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 8,
// //     flexWrap: "wrap",
// //   },
// //   name: {
// //     fontSize: 16,
// //     fontWeight: "900",
// //     color: C.text,
// //   },
// //   typeBadge: {
// //     paddingHorizontal: 8,
// //     paddingVertical: 3,
// //     borderRadius: 999,
// //   },
// //   typeText: {
// //     fontSize: 10,
// //     fontWeight: "900",
// //   },
// //   email: {
// //     marginTop: 4,
// //     fontSize: 12,
// //     fontWeight: "700",
// //     color: C.muted,
// //   },
// //   phone: {
// //     marginTop: 3,
// //     fontSize: 12,
// //     fontWeight: "700",
// //     color: C.muted,
// //   },
// //   meta: {
// //     marginTop: 4,
// //     fontSize: 12,
// //     fontWeight: "800",
// //     color: C.text,
// //   },
// //   statsRow: {
// //     flexDirection: "row",
// //     gap: 12,
// //     marginTop: 7,
// //     flexWrap: "wrap",
// //   },
// //   stat: {
// //     fontSize: 12,
// //     fontWeight: "800",
// //     color: C.gray,
// //   },
// //   date: {
// //     marginTop: 6,
// //     fontSize: 11,
// //     fontWeight: "700",
// //     color: "#94A3B8",
// //   },
// //   statusBadge: {
// //     position: "absolute",
// //     top: 14,
// //     right: 14,
// //     paddingHorizontal: 10,
// //     paddingVertical: 5,
// //     borderRadius: 999,
// //   },
// //   statusText: {
// //     fontSize: 11,
// //     fontWeight: "900",
// //   },
// //   actionRow: {
// //     flexDirection: "row",
// //     gap: 8,
// //     marginTop: 12,
// //     flexWrap: "wrap",
// //   },
// //   approveBtn: {
// //     height: 34,
// //     paddingHorizontal: 12,
// //     borderRadius: 11,
// //     backgroundColor: C.green,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 5,
// //   },
// //   rejectBtn: {
// //     height: 34,
// //     paddingHorizontal: 12,
// //     borderRadius: 11,
// //     backgroundColor: C.red,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 5,
// //   },
// //   btnText: {
// //     color: C.white,
// //     fontSize: 12,
// //     fontWeight: "900",
// //   },
// //   lightDangerBtn: {
// //     height: 34,
// //     paddingHorizontal: 12,
// //     borderRadius: 11,
// //     backgroundColor: "#FEE2E2",
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 5,
// //   },
// //   blockText: {
// //     color: C.red,
// //     fontSize: 12,
// //     fontWeight: "900",
// //   },
// //   lightSuccessBtn: {
// //     height: 34,
// //     paddingHorizontal: 12,
// //     borderRadius: 11,
// //     backgroundColor: "#DCFCE7",
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 5,
// //   },
// //   activateText: {
// //     color: C.green,
// //     fontSize: 12,
// //     fontWeight: "900",
// //   },
// //   emptyBox: {
// //     marginTop: 60,
// //     alignItems: "center",
// //   },
// //   emptyTitle: {
// //     marginTop: 12,
// //     fontSize: 17,
// //     fontWeight: "900",
// //     color: C.text,
// //   },
// //   emptyText: {
// //     marginTop: 4,
// //     fontSize: 13,
// //     fontWeight: "700",
// //     color: C.muted,
// //   },
// //   bottomNav: {
// //     position: "absolute",
// //     left: 12,
// //     right: 12,
// //     bottom: 12,
// //     height: 72,
// //     backgroundColor: C.white,
// //     borderRadius: 24,
// //     borderWidth: 1,
// //     borderColor: C.border,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-around",
// //     elevation: 10,
// //   },
// //   bottomItem: {
// //     alignItems: "center",
// //     justifyContent: "center",
// //     flex: 1,
// //   },
// //   bottomLabel: {
// //     marginTop: 4,
// //     fontSize: 10,
// //     fontWeight: "900",
// //     color: "#94A3B8",
// //   },
// // });




































// // src/screens/admin/ManageSellersScreen.js

// import React, { useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   SafeAreaView,
//   TextInput,
//   StatusBar,
//   Platform,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// const C = {
//   primary: "#061B44",
//   white: "#FFFFFF",
//   bg: "#F6F8FC",
//   card: "#FFFFFF",
//   text: "#0F172A",
//   muted: "#64748B",
//   border: "#E2E8F0",
//   blue: "#2563EB",
//   green: "#16A34A",
//   orange: "#F97316",
//   red: "#EF4444",
//   purple: "#7C3AED",
//   gray: "#64748B",
// };

// const initialSellers = [
//   {
//     id: "S1",
//     name: "Tech Store",
//     owner: "Ravi Kumar",
//     email: "techstore@email.com",
//     phone: "+91 90000 11111",
//     shopName: "Tech Store",
//     category: "Electronics",
//     date: "May 29, 2024",
//     status: "Pending",
//     products: 0,
//     totalSales: "₹0",
//     sellerPayout: "₹0",
//     adminCommission: "₹0",
//   },
//   {
//     id: "S2",
//     name: "Fashion Hub",
//     owner: "Anjali Sharma",
//     email: "fashionhub@email.com",
//     phone: "+91 90000 22222",
//     shopName: "Fashion Hub",
//     category: "Fashion",
//     date: "May 28, 2024",
//     status: "Approved",
//     products: 18,
//     totalSales: "₹78,500",
//     sellerPayout: "₹70,650",
//     adminCommission: "₹7,850",
//   },
//   {
//     id: "S3",
//     name: "Daily Essentials",
//     owner: "Kiran Reddy",
//     email: "daily@email.com",
//     phone: "+91 90000 33333",
//     shopName: "Daily Essentials",
//     category: "Grocery",
//     date: "May 27, 2024",
//     status: "Rejected",
//     products: 0,
//     totalSales: "₹0",
//     sellerPayout: "₹0",
//     adminCommission: "₹0",
//   },
//   {
//     id: "S4",
//     name: "Home Decor World",
//     owner: "Priya Nair",
//     email: "decor@email.com",
//     phone: "+91 90000 44444",
//     shopName: "Home Decor World",
//     category: "Handmade",
//     date: "May 26, 2024",
//     status: "Blocked",
//     products: 7,
//     totalSales: "₹24,000",
//     sellerPayout: "₹21,600",
//     adminCommission: "₹2,400",
//   },
// ];

// const tabs = ["All", "Pending", "Approved", "Rejected", "Blocked"];

// const getStatusStyle = (status) => {
//   switch (status) {
//     case "Approved":
//       return { bg: "#DCFCE7", text: C.green };
//     case "Pending":
//       return { bg: "#FFEDD5", text: C.orange };
//     case "Rejected":
//     case "Blocked":
//       return { bg: "#FEE2E2", text: C.red };
//     default:
//       return { bg: "#F1F5F9", text: C.gray };
//   }
// };

// export default function ManageSellersScreen({ navigation }) {
//   const [sellers, setSellers] = useState(initialSellers);
//   const [activeTab, setActiveTab] = useState("All");
//   const [search, setSearch] = useState("");
//   const [toast, setToast] = useState("");

//   const showToast = (msg) => {
//     setToast(msg);
//     setTimeout(() => setToast(""), 1700);
//   };

//   const filteredSellers = useMemo(() => {
//     return sellers.filter((seller) => {
//       const matchTab = activeTab === "All" || seller.status === activeTab;
//       const q = search.toLowerCase();

//       const matchSearch =
//         seller.name.toLowerCase().includes(q) ||
//         seller.owner.toLowerCase().includes(q) ||
//         seller.email.toLowerCase().includes(q) ||
//         seller.phone.toLowerCase().includes(q) ||
//         seller.shopName.toLowerCase().includes(q) ||
//         seller.category.toLowerCase().includes(q) ||
//         seller.status.toLowerCase().includes(q);

//       return matchTab && matchSearch;
//     });
//   }, [sellers, activeTab, search]);

//   const approveSeller = (id) => {
//     setSellers((prev) =>
//       prev.map((s) => (s.id === id ? { ...s, status: "Approved" } : s))
//     );
//     showToast("Seller approved. Now seller can login.");
//   };

//   const rejectSeller = (id) => {
//     setSellers((prev) =>
//       prev.map((s) => (s.id === id ? { ...s, status: "Rejected" } : s))
//     );
//     showToast("Seller rejected successfully.");
//   };

//   const blockSeller = (id) => {
//     setSellers((prev) =>
//       prev.map((s) => (s.id === id ? { ...s, status: "Blocked" } : s))
//     );
//     showToast("Seller blocked successfully.");
//   };

//   const activateSeller = (id) => {
//     setSellers((prev) =>
//       prev.map((s) => (s.id === id ? { ...s, status: "Approved" } : s))
//     );
//     showToast("Seller activated successfully.");
//   };

//   const total = sellers.length;
//   const pending = sellers.filter((s) => s.status === "Pending").length;
//   const approved = sellers.filter((s) => s.status === "Approved").length;
//   const blocked = sellers.filter((s) => s.status === "Blocked").length;

//   const renderSeller = ({ item }) => {
//     const status = getStatusStyle(item.status);

//     return (
//       <View style={styles.card}>
//         <View style={styles.cardTop}>
//           <View style={styles.avatar}>
//             <Ionicons name="storefront" size={27} color={C.green} />
//           </View>

//           <View style={{ flex: 1 }}>
//             <View style={styles.nameRow}>
//               <Text style={styles.shopName}>{item.shopName}</Text>
//               <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
//                 <Text style={[styles.statusText, { color: status.text }]}>
//                   {item.status}
//                 </Text>
//               </View>
//             </View>

//             <Text style={styles.owner}>Owner: {item.owner}</Text>
//             <Text style={styles.meta}>{item.email}</Text>
//             <Text style={styles.meta}>{item.phone}</Text>
//           </View>
//         </View>

//         <View style={styles.detailsBox}>
//           <InfoItem icon="pricetag-outline" label="Category" value={item.category} />
//           <InfoItem icon="cube-outline" label="Products" value={item.products} />
//           <InfoItem icon="calendar-outline" label="Registered" value={item.date} />
//         </View>

//         <View style={styles.moneyBox}>
//           <View>
//             <Text style={styles.moneyLabel}>Total Sales</Text>
//             <Text style={styles.moneyValue}>{item.totalSales}</Text>
//           </View>

//           <View>
//             <Text style={styles.moneyLabel}>Seller 90%</Text>
//             <Text style={[styles.moneyValue, { color: C.green }]}>
//               {item.sellerPayout}
//             </Text>
//           </View>

//           <View>
//             <Text style={styles.moneyLabel}>Admin 10%</Text>
//             <Text style={[styles.moneyValue, { color: C.orange }]}>
//               {item.adminCommission}
//             </Text>
//           </View>
//         </View>

//         <View style={styles.actionRow}>
//           {item.status === "Pending" && (
//             <>
//               <TouchableOpacity
//                 style={styles.approveBtn}
//                 onPress={() => approveSeller(item.id)}
//               >
//                 <Ionicons name="checkmark" size={17} color={C.white} />
//                 <Text style={styles.btnText}>Approve</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.rejectBtn}
//                 onPress={() => rejectSeller(item.id)}
//               >
//                 <Ionicons name="close" size={17} color={C.white} />
//                 <Text style={styles.btnText}>Reject</Text>
//               </TouchableOpacity>
//             </>
//           )}

//           {item.status === "Approved" && (
//             <TouchableOpacity
//               style={styles.blockBtn}
//               onPress={() => blockSeller(item.id)}
//             >
//               <Ionicons name="ban-outline" size={17} color={C.red} />
//               <Text style={styles.blockText}>Block Seller</Text>
//             </TouchableOpacity>
//           )}

//           {(item.status === "Blocked" || item.status === "Rejected") && (
//             <TouchableOpacity
//               style={styles.activateBtn}
//               onPress={() => activateSeller(item.id)}
//             >
//               <Ionicons name="checkmark-circle-outline" size={17} color={C.green} />
//               <Text style={styles.activateText}>Activate Seller</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="light-content" backgroundColor={C.primary} />

//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color={C.white} />
//         </TouchableOpacity>

//         <Text style={styles.headerTitle}>Manage Sellers</Text>

//         <TouchableOpacity>
//           <Ionicons name="options-outline" size={24} color={C.white} />
//         </TouchableOpacity>
//       </View>

//       {toast ? (
//         <View style={styles.toast}>
//           <Ionicons name="checkmark-circle" size={18} color={C.white} />
//           <Text style={styles.toastText}>{toast}</Text>
//         </View>
//       ) : null}

//       <View style={styles.statsRow}>
//         <StatCard label="Total" value={total} icon="storefront" color={C.blue} />
//         <StatCard label="Pending" value={pending} icon="time" color={C.orange} />
//         <StatCard label="Approved" value={approved} icon="shield-checkmark" color={C.green} />
//         <StatCard label="Blocked" value={blocked} icon="ban" color={C.red} />
//       </View>

//       <View style={styles.searchBox}>
//         <Ionicons name="search-outline" size={20} color={C.muted} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search seller, shop, email, category..."
//           placeholderTextColor="#94A3B8"
//           value={search}
//           onChangeText={setSearch}
//         />

//         {search.length > 0 && (
//           <TouchableOpacity onPress={() => setSearch("")}>
//             <Ionicons name="close-circle" size={20} color={C.muted} />
//           </TouchableOpacity>
//         )}
//       </View>

//       <FlatList
//         horizontal
//         data={tabs}
//         keyExtractor={(item) => item}
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.tabs}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={[styles.tab, activeTab === item && styles.tabActive]}
//             onPress={() => setActiveTab(item)}
//           >
//             <Text style={[styles.tabText, activeTab === item && styles.tabTextActive]}>
//               {item}
//             </Text>
//           </TouchableOpacity>
//         )}
//       />

//       <FlatList
//         data={filteredSellers}
//         keyExtractor={(item) => item.id}
//         renderItem={renderSeller}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.list}
//         ListEmptyComponent={
//           <View style={styles.emptyBox}>
//             <Ionicons name="storefront-outline" size={46} color="#CBD5E1" />
//             <Text style={styles.emptyTitle}>No sellers found</Text>
//             <Text style={styles.emptyText}>Try another search or filter.</Text>
//           </View>
//         }
//       />

//       <View style={styles.bottomNav}>
//         <BottomItem
//           icon="home-outline"
//           label="Dashboard"
//           onPress={() => navigation.navigate("AdminDashboardScreen")}
//         />
//         <BottomItem
//           icon="receipt-outline"
//           label="Orders"
//           onPress={() => navigation.navigate("ManageOrdersScreen")}
//         />
//         <BottomItem
//           icon="cube-outline"
//           label="Products"
//           onPress={() => navigation.navigate("ManageProductsScreen")}
//         />
//         <BottomItem icon="storefront" label="Sellers" active />
//         <BottomItem
//           icon="ellipsis-horizontal"
//           label="More"
//           onPress={() => navigation.navigate("AdminReportsScreen")}
//         />
//       </View>
//     </SafeAreaView>
//   );
// }

// function StatCard({ label, value, icon, color }) {
//   return (
//     <View style={styles.statCard}>
//       <View style={[styles.statIcon, { backgroundColor: `${color}18` }]}>
//         <Ionicons name={icon} size={20} color={color} />
//       </View>
//       <Text style={styles.statValue}>{value}</Text>
//       <Text style={styles.statLabel}>{label}</Text>
//     </View>
//   );
// }

// function InfoItem({ icon, label, value }) {
//   return (
//     <View style={styles.infoItem}>
//       <Ionicons name={icon} size={16} color={C.primary} />
//       <Text style={styles.infoLabel}>{label}</Text>
//       <Text style={styles.infoValue}>{value}</Text>
//     </View>
//   );
// }

// function BottomItem({ icon, label, active, onPress }) {
//   return (
//     <TouchableOpacity style={styles.bottomItem} onPress={onPress}>
//       <Ionicons name={icon} size={23} color={active ? C.blue : "#94A3B8"} />
//       <Text style={[styles.bottomLabel, active && { color: C.blue }]}>
//         {label}
//       </Text>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: C.bg,
//   },
//   header: {
//     backgroundColor: C.primary,
//     paddingTop: Platform.OS === "ios" ? 16 : 18,
//     paddingBottom: 18,
//     paddingHorizontal: 18,
//     borderBottomLeftRadius: 28,
//     borderBottomRightRadius: 28,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   headerTitle: {
//     color: C.white,
//     fontSize: 21,
//     fontWeight: "900",
//   },
//   toast: {
//     position: "absolute",
//     top: Platform.OS === "ios" ? 86 : 72,
//     left: 18,
//     right: 18,
//     zIndex: 10,
//     backgroundColor: C.green,
//     borderRadius: 16,
//     padding: 13,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 8,
//   },
//   toastText: {
//     color: C.white,
//     fontSize: 13,
//     fontWeight: "900",
//   },
//   statsRow: {
//     flexDirection: "row",
//     margin: 14,
//     gap: 8,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: C.card,
//     borderRadius: 18,
//     paddingVertical: 14,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: C.border,
//     elevation: 2,
//   },
//   statIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 13,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   statValue: {
//     marginTop: 6,
//     fontSize: 20,
//     fontWeight: "900",
//     color: C.text,
//   },
//   statLabel: {
//     marginTop: 2,
//     fontSize: 10,
//     fontWeight: "800",
//     color: C.muted,
//   },
//   searchBox: {
//     marginHorizontal: 14,
//     height: 52,
//     borderRadius: 18,
//     backgroundColor: C.card,
//     borderWidth: 1,
//     borderColor: C.border,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 14,
//     gap: 10,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 14,
//     fontWeight: "700",
//     color: C.text,
//   },
//   tabs: {
//     paddingHorizontal: 14,
//     paddingTop: 12,
//     paddingBottom: 8,
//     gap: 8,
//   },
//   tab: {
//     paddingHorizontal: 18,
//     height: 38,
//     borderRadius: 20,
//     backgroundColor: C.white,
//     borderWidth: 1,
//     borderColor: C.border,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   tabActive: {
//     backgroundColor: C.primary,
//     borderColor: C.primary,
//   },
//   tabText: {
//     fontSize: 13,
//     fontWeight: "900",
//     color: C.muted,
//   },
//   tabTextActive: {
//     color: C.white,
//   },
//   list: {
//     paddingHorizontal: 14,
//     paddingBottom: 105,
//   },
//   card: {
//     backgroundColor: C.card,
//     borderRadius: 24,
//     padding: 15,
//     marginBottom: 14,
//     borderWidth: 1,
//     borderColor: C.border,
//     elevation: 3,
//   },
//   cardTop: {
//     flexDirection: "row",
//   },
//   avatar: {
//     width: 56,
//     height: 56,
//     borderRadius: 19,
//     backgroundColor: "#EAFBF0",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 13,
//   },
//   nameRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 8,
//   },
//   shopName: {
//     flex: 1,
//     fontSize: 17,
//     fontWeight: "900",
//     color: C.text,
//   },
//   owner: {
//     marginTop: 4,
//     fontSize: 13,
//     fontWeight: "800",
//     color: C.text,
//   },
//   meta: {
//     marginTop: 3,
//     fontSize: 12,
//     fontWeight: "700",
//     color: C.muted,
//   },
//   statusBadge: {
//     paddingHorizontal: 9,
//     paddingVertical: 5,
//     borderRadius: 999,
//     alignSelf: "flex-start",
//   },
//   statusText: {
//     fontSize: 10,
//     fontWeight: "900",
//   },
//   detailsBox: {
//     marginTop: 14,
//     backgroundColor: "#F8FAFC",
//     borderRadius: 17,
//     padding: 12,
//     gap: 8,
//   },
//   infoItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 7,
//   },
//   infoLabel: {
//     fontSize: 12,
//     fontWeight: "800",
//     color: C.muted,
//     width: 75,
//   },
//   infoValue: {
//     flex: 1,
//     fontSize: 12,
//     fontWeight: "900",
//     color: C.text,
//   },
//   moneyBox: {
//     marginTop: 13,
//     borderRadius: 17,
//     backgroundColor: "#EEF4FF",
//     padding: 13,
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   moneyLabel: {
//     fontSize: 10,
//     fontWeight: "900",
//     color: C.muted,
//   },
//   moneyValue: {
//     marginTop: 5,
//     fontSize: 13,
//     fontWeight: "900",
//     color: C.text,
//   },
//   actionRow: {
//     marginTop: 14,
//     flexDirection: "row",
//     gap: 9,
//     flexWrap: "wrap",
//   },
//   approveBtn: {
//     height: 38,
//     paddingHorizontal: 15,
//     borderRadius: 13,
//     backgroundColor: C.green,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   rejectBtn: {
//     height: 38,
//     paddingHorizontal: 15,
//     borderRadius: 13,
//     backgroundColor: C.red,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   btnText: {
//     color: C.white,
//     fontSize: 13,
//     fontWeight: "900",
//   },
//   blockBtn: {
//     height: 38,
//     paddingHorizontal: 15,
//     borderRadius: 13,
//     backgroundColor: "#FEE2E2",
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   blockText: {
//     color: C.red,
//     fontSize: 13,
//     fontWeight: "900",
//   },
//   activateBtn: {
//     height: 38,
//     paddingHorizontal: 15,
//     borderRadius: 13,
//     backgroundColor: "#DCFCE7",
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   activateText: {
//     color: C.green,
//     fontSize: 13,
//     fontWeight: "900",
//   },
//   emptyBox: {
//     marginTop: 70,
//     alignItems: "center",
//   },
//   emptyTitle: {
//     marginTop: 12,
//     fontSize: 18,
//     fontWeight: "900",
//     color: C.text,
//   },
//   emptyText: {
//     marginTop: 4,
//     fontSize: 13,
//     fontWeight: "700",
//     color: C.muted,
//   },
//   bottomNav: {
//     position: "absolute",
//     left: 12,
//     right: 12,
//     bottom: 12,
//     height: 72,
//     backgroundColor: C.white,
//     borderRadius: 24,
//     borderWidth: 1,
//     borderColor: C.border,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-around",
//     elevation: 10,
//   },
//   bottomItem: {
//     alignItems: "center",
//     justifyContent: "center",
//     flex: 1,
//   },
//   bottomLabel: {
//     marginTop: 4,
//     fontSize: 10,
//     fontWeight: "900",
//     color: "#94A3B8",
//   },
// });





























// src/screens/admin/ManageUsersScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { showAlert } from "../../utils/showAlert";

const C = {
  primary: "#0e3243",
  accent: "#1a9e6e",
  accentOrange: "#f5a623",
  white: "#FFFFFF",
  bg: "#f4f6f9",
  card: "#FFFFFF",
  text: "#0e3243",
  muted: "#7a93a0",
  border: "#e2eaf0",
  red: "#e74c3c",
  green: "#1a9e6e",
};

const users = [
  { id: "1", name: "Rahul Sharma", email: "rahul@gmail.com", phone: "+91 98765 43210", orders: 12, spent: 28450, status: "Active", joined: "15 Jan 2024", city: "Mumbai" },
  { id: "2", name: "Priya Singh", email: "priya@gmail.com", phone: "+91 87654 32109", orders: 8, spent: 15200, status: "Active", joined: "22 Feb 2024", city: "Delhi" },
  { id: "3", name: "Amit Verma", email: "amit@gmail.com", phone: "+91 76543 21098", orders: 5, spent: 9800, status: "Active", joined: "10 Mar 2024", city: "Bangalore" },
  { id: "4", name: "Neha Patel", email: "neha@gmail.com", phone: "+91 65432 10987", orders: 20, spent: 45600, status: "Active", joined: "5 Dec 2023", city: "Ahmedabad" },
  { id: "5", name: "Rohit Gupta", email: "rohit@gmail.com", phone: "+91 54321 09876", orders: 3, spent: 4200, status: "Blocked", joined: "18 Apr 2024", city: "Hyderabad" },
  { id: "6", name: "Sneha Joshi", email: "sneha@gmail.com", phone: "+91 43210 98765", orders: 15, spent: 32000, status: "Active", joined: "2 Feb 2024", city: "Pune" },
  { id: "7", name: "Kiran Rao", email: "kiran@gmail.com", phone: "+91 32109 87654", orders: 1, spent: 899, status: "Active", joined: "28 Apr 2024", city: "Chennai" },
  { id: "8", name: "Arjun Mehta", email: "arjun@gmail.com", phone: "+91 21098 76543", orders: 25, spent: 68000, status: "Active", joined: "1 Nov 2023", city: "Kolkata" },
];

const statusColor = (s) => (s === "Active" ? C.green : C.red);
const statusBg = (s) => (s === "Active" ? "#e8f5e9" : "#fdecea");

export default function ManageUsersScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Active", "Blocked"];

  const filtered = users.filter((u) => {
    const matchFilter = filter === "All" || u.status === filter;
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.city.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const blockedUsers = users.filter((u) => u.status === "Blocked").length;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={C.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Users</Text>
        <TouchableOpacity>
          <Ionicons name="download-outline" size={22} color={C.white} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalUsers}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "rgba(26,158,110,0.2)" }]}>
          <Text style={[styles.statValue, { color: "#4ecb8d" }]}>{activeUsers}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "rgba(231,76,60,0.2)" }]}>
          <Text style={[styles.statValue, { color: "#ff6b6b" }]}>{blockedUsers}</Text>
          <Text style={styles.statLabel}>Blocked</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={16} color={C.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users, emails, cities..."
          placeholderTextColor={C.muted}
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={16} color={C.muted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter */}
      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.countText}>{filtered.length} users</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {filtered.map((u) => (
          <View key={u.id} style={styles.userCard}>
            <View style={styles.userTop}>
              <View style={styles.avatarWrap}>
                <Text style={styles.avatarText}>{u.name.charAt(0)}</Text>
              </View>
              <View style={styles.userInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.userName}>{u.name}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusBg(u.status) }]}>
                    <Text style={[styles.statusText, { color: statusColor(u.status) }]}>{u.status}</Text>
                  </View>
                </View>
                <Text style={styles.userEmail}>{u.email}</Text>
                <Text style={styles.userPhone}>{u.phone}</Text>
                <View style={styles.userMeta}>
                  <Ionicons name="location-outline" size={11} color={C.muted} />
                  <Text style={styles.userMetaText}>{u.city}</Text>
                  <Text style={styles.userMetaText}>•</Text>
                  <Text style={styles.userMetaText}>Joined {u.joined}</Text>
                </View>
              </View>
            </View>

            <View style={styles.ordersRow}>
              <View style={styles.orderStat}>
                <Text style={styles.orderStatValue}>{u.orders}</Text>
                <Text style={styles.orderStatLabel}>Orders</Text>
              </View>
              <View style={styles.orderStatDivider} />
              <View style={styles.orderStat}>
                <Text style={styles.orderStatValue}>₹{(u.spent / 1000).toFixed(1)}K</Text>
                <Text style={styles.orderStatLabel}>Total Spent</Text>
              </View>
              <View style={styles.actionBtns}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() =>
                    showAlert(
                      u.status === "Active" ? "Block User" : "Unblock User",
                      `${u.status === "Active" ? "Block" : "Unblock"} ${u.name}?`,
                      [
                        { text: "Cancel", style: "cancel" },
                        { text: "Confirm", style: u.status === "Active" ? "destructive" : "default" },
                      ]
                    )
                  }
                >
                  <Ionicons
                    name={u.status === "Active" ? "ban-outline" : "checkmark-circle-outline"}
                    size={18}
                    color={u.status === "Active" ? C.red : C.green}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="mail-outline" size={18} color={C.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="trash-outline" size={18} color={C.red} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyWrap}>
            <Ionicons name="people-outline" size={60} color={C.muted} />
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
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
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: C.primary,
  },
  headerTitle: { color: C.white, fontSize: 18, fontWeight: "700" },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 8,
    backgroundColor: C.primary,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    gap: 2,
  },
  statValue: { fontSize: 18, fontWeight: "800", color: C.white },
  statLabel: { fontSize: 10, color: "rgba(255,255,255,0.7)" },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.card,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 13, color: C.text },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    alignItems: "center",
    backgroundColor: C.bg,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  filterBtnActive: { backgroundColor: C.primary, borderColor: C.primary },
  filterText: { fontSize: 12, color: C.muted, fontWeight: "600" },
  filterTextActive: { color: C.white, fontWeight: "800" },
  countText: { fontSize: 11, color: C.muted, marginLeft: "auto" },
  scroll: { flex: 1, backgroundColor: C.bg },
  userCard: {
    backgroundColor: C.card,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  userTop: { flexDirection: "row", gap: 12, marginBottom: 12 },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: { color: C.white, fontSize: 20, fontWeight: "800" },
  userInfo: { flex: 1, gap: 2 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 },
  userName: { fontSize: 14, fontWeight: "800", color: C.text, flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: "700" },
  userEmail: { fontSize: 12, color: C.muted },
  userPhone: { fontSize: 12, color: C.muted },
  userMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  userMetaText: { fontSize: 10, color: C.muted },
  ordersRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bg,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  orderStat: { alignItems: "center", paddingHorizontal: 12 },
  orderStatValue: { fontSize: 14, fontWeight: "800", color: C.text },
  orderStatLabel: { fontSize: 9, color: C.muted, marginTop: 1 },
  orderStatDivider: { width: 1, height: 30, backgroundColor: C.border },
  actionBtns: { flexDirection: "row", gap: 4, marginLeft: "auto" },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.card,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  emptyWrap: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, color: C.muted, fontWeight: "600" },
});
