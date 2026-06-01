

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   Modal,
//   SafeAreaView,
//   Platform,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import * as ImagePicker from "expo-image-picker";

// import { COLORS } from "../../constants/colors";
// import { useShop } from "../../context/ShopContext";

// const defaultProfile = {
//   name: "Customer",
//   email: "customer@email.com",
//   phone: "+91 98765 43210",
//   avatar: null,
//   addresses: [],
// };

// const defaultOrders = [
//   {
//     id: "ORD-1001",
//     title: "Handmade Product Order",
//     status: "Delivered",
//     date: "Today",
//     price: "₹499",
//   },
//   {
//     id: "ORD-1002",
//     title: "Local Seller Product",
//     status: "Processing",
//     date: "Yesterday",
//     price: "₹899",
//   },
// ];

// const customerNotifications = [
//   {
//     id: "1",
//     title: "Order Delivered",
//     message: "Your handmade product order ORD-1001 has been delivered.",
//     time: "Today, 10:30 AM",
//     type: "order",
//     read: false,
//     screen: "OrderDetail",
//     params: { order: defaultOrders[0] },
//   },
//   {
//     id: "2",
//     title: "Special Offer",
//     message: "Tap here to open today's handmade product offer.",
//     time: "Yesterday",
//     type: "offer",
//     read: false,
//     url: "https://www.google.com",
//   },
// ];

// export default function CustomerProfileScreen({ navigation }) {
//   const { cartCount = 0, wishlistCount = 0 } = useShop();

//   const [profile, setProfile] = useState(defaultProfile);
//   const [orders] = useState(defaultOrders);
//   const [notifications] = useState(customerNotifications);
//   const [avatarLoading, setAvatarLoading] = useState(false);
//   const [photoModalVisible, setPhotoModalVisible] = useState(false);
//   const [logoutModalVisible, setLogoutModalVisible] = useState(false);
//   const [message, setMessage] = useState("");

//   const unreadCount = notifications.filter((item) => !item.read).length;

//   const updateProfile = (data) => setProfile((prev) => ({ ...prev, ...data }));

//   const showMessage = (text) => {
//     setMessage(text);
//     setTimeout(() => setMessage(""), 2500);
//   };

//   const goToScreen = (screenName, params = {}) => {
//     navigation.navigate(screenName, params);
//   };

//   const openNotifications = () => {
//     navigation.navigate("CustomerNotifications", { notifications });
//   };

//   const openCamera = async () => {
//     setPhotoModalVisible(false);
//     const { status } = await ImagePicker.requestCameraPermissionsAsync();

//     if (status !== "granted") {
//       showMessage("Camera permission is required.");
//       return;
//     }

//     setAvatarLoading(true);

//     const result = await ImagePicker.launchCameraAsync({
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.7,
//     });

//     setAvatarLoading(false);

//     if (!result.canceled && result.assets?.length > 0) {
//       updateProfile({ avatar: result.assets[0].uri });
//     }
//   };

//   const openGallery = async () => {
//     setPhotoModalVisible(false);
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

//     if (status !== "granted") {
//       showMessage("Gallery permission is required.");
//       return;
//     }

//     setAvatarLoading(true);

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.7,
//     });

//     setAvatarLoading(false);

//     if (!result.canceled && result.assets?.length > 0) {
//       updateProfile({ avatar: result.assets[0].uri });
//     }
//   };

//   const removePhoto = () => {
//     setPhotoModalVisible(false);
//     updateProfile({ avatar: null });
//     showMessage("Profile photo removed.");
//   };

//   const handleLogout = () => {
//     setLogoutModalVisible(false);
//     navigation.reset({
//       index: 0,
//       routes: [{ name: "RoleSelectionScreen" }],
//     });
//   };

//   const menuItems = [
//     {
//       title: "My Orders",
//       subtitle: `${orders.length} total orders`,
//       icon: "bag-handle-outline",
//       color: "#7C3AED",
//       badge: null,
//       onPress: () => goToScreen("MyOrders", { orders }),
//     },
//     {
//       title: "Wishlist",
//       subtitle: `${wishlistCount} saved products`,
//       icon: "heart-outline",
//       color: "#E83E7C",
//       badge: wishlistCount > 0 ? wishlistCount : null,
//       onPress: () => navigation.navigate("WishlistTab"),
//     },
//     {
//       title: "My Cart",
//       subtitle: `${cartCount} products in cart`,
//       icon: "cart-outline",
//       color: "#F97316",
//       badge: cartCount > 0 ? cartCount : null,
//       onPress: () => navigation.navigate("CartTab"),
//     },
//     {
//       title: "Saved Addresses",
//       subtitle: `${profile.addresses?.length || 0} addresses saved`,
//       icon: "location-outline",
//       color: "#10B981",
//       badge: null,
//       onPress: () => goToScreen("CustomerSavedAddress"),
//     },
//     {
//       title: "Notifications",
//       subtitle:
//         unreadCount > 0
//           ? `${unreadCount} unread notifications`
//           : "All caught up!",
//       icon: "notifications-outline",
//       color: "#2563EB",
//       badge: unreadCount > 0 ? unreadCount : null,
//       onPress: openNotifications,
//     },
//     {
//       title: "Help & Support",
//       subtitle: "Chat, call and raise support tickets",
//       icon: "headset-outline",
//       color: "#0EA5E9",
//       badge: null,
//       onPress: () => goToScreen("CustomerChatSupport"),
//     },
//     {
//       title: "Logout",
//       subtitle: "Sign out from your account",
//       icon: "log-out-outline",
//       color: "#EF4444",
//       badge: null,
//       onPress: () => setLogoutModalVisible(true),
//     },
//   ];

//   const recentOrders = orders.slice(0, 3);

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity
//             style={styles.headerIconBtn}
//             activeOpacity={0.85}
//             onPress={() => navigation.goBack()}
//           >
//             <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
//           </TouchableOpacity>

//           <Text style={styles.headerTitle}>My Profile</Text>

//           <TouchableOpacity
//             style={styles.headerIconBtn}
//             activeOpacity={0.85}
//             onPress={openNotifications}
//           >
//             <Ionicons name="notifications-outline" size={23} color="#FFFFFF" />

//             {unreadCount > 0 && (
//               <View style={styles.headerBadge}>
//                 <Text style={styles.headerBadgeText}>
//                   {unreadCount > 99 ? "99+" : unreadCount}
//                 </Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>

//         {message ? (
//           <View style={styles.messageBox}>
//             <Text style={styles.messageText}>{message}</Text>
//           </View>
//         ) : null}

//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scroll}
//         >
//           <View style={styles.profileCard}>
//             <TouchableOpacity
//               style={styles.avatarWrapper}
//               onPress={() => setPhotoModalVisible(true)}
//               activeOpacity={0.85}
//             >
//               <View style={styles.avatarBox}>
//                 {profile.avatar ? (
//                   <Image source={{ uri: profile.avatar }} style={styles.avatarImage} />
//                 ) : (
//                   <Ionicons name="person" size={48} color="#FFFFFF" />
//                 )}
//               </View>

//               <View style={styles.cameraBtn}>
//                 <Ionicons
//                   name={avatarLoading ? "hourglass-outline" : "camera"}
//                   size={13}
//                   color="#FFFFFF"
//                 />
//               </View>
//             </TouchableOpacity>

//             <View style={styles.profileInfo}>
//               <Text style={styles.name}>{profile.name}</Text>
//               <Text style={styles.email}>{profile.email}</Text>
//               <Text style={styles.phone}>{profile.phone}</Text>

//               <TouchableOpacity
//                 style={styles.editBtn}
//                 activeOpacity={0.85}
//                 onPress={() => goToScreen("EditProfile")}
//               >
//                 <Ionicons name="create-outline" size={16} color="#FFFFFF" />
//                 <Text style={styles.editText}>Edit Profile</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View style={styles.statsRow}>
//             <TouchableOpacity
//               style={styles.statCard}
//               activeOpacity={0.85}
//               onPress={() => goToScreen("MyOrders", { orders })}
//             >
//               <Text style={styles.statValue}>{orders.length}</Text>
//               <Text style={styles.statLabel}>Orders</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.statCard}
//               activeOpacity={0.85}
//               onPress={() => navigation.navigate("WishlistTab")}
//             >
//               <Text style={styles.statValue}>{wishlistCount}</Text>
//               <Text style={styles.statLabel}>Wishlist</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.statCard}
//               activeOpacity={0.85}
//               onPress={() => navigation.navigate("CartTab")}
//             >
//               <Text style={styles.statValue}>{cartCount}</Text>
//               <Text style={styles.statLabel}>Cart</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Recent Orders</Text>
//             <TouchableOpacity onPress={() => goToScreen("MyOrders", { orders })}>
//               <Text style={styles.viewAll}>View All</Text>
//             </TouchableOpacity>
//           </View>

//           {recentOrders.map((order) => (
//             <TouchableOpacity
//               key={order.id}
//               style={styles.orderCard}
//               activeOpacity={0.85}
//               onPress={() => goToScreen("OrderDetail", { order })}
//             >
//               <View style={styles.orderIcon}>
//                 <Ionicons
//                   name="cube-outline"
//                   size={24}
//                   color={COLORS.customer || "#E83E7C"}
//                 />
//               </View>

//               <View style={styles.orderInfo}>
//                 <View style={styles.orderTop}>
//                   <Text style={styles.orderId}>{order.id}</Text>
//                   <Text
//                     style={[
//                       styles.status,
//                       order.status === "Delivered" && styles.delivered,
//                       order.status === "Shipped" && styles.shipped,
//                       order.status === "Processing" && styles.processing,
//                     ]}
//                   >
//                     {order.status}
//                   </Text>
//                 </View>

//                 <Text style={styles.orderTitle} numberOfLines={1}>
//                   {order.title}
//                 </Text>

//                 <View style={styles.orderBottom}>
//                   <Text style={styles.orderDate}>{order.date}</Text>
//                   <Text style={styles.orderPrice}>{order.price}</Text>
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))}

//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Account</Text>
//           </View>

//           <View style={styles.menuCard}>
//             {menuItems.map((item, index) => (
//               <TouchableOpacity
//                 key={item.title}
//                 style={[
//                   styles.menuRow,
//                   index === menuItems.length - 1 && styles.lastMenuRow,
//                 ]}
//                 activeOpacity={0.85}
//                 onPress={item.onPress}
//               >
//                 <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
//                   <Ionicons name={item.icon} size={21} color="#FFFFFF" />
//                 </View>

//                 <View style={styles.menuTextBox}>
//                   <Text style={styles.menuTitle}>{item.title}</Text>
//                   <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
//                 </View>

//                 {item.badge ? (
//                   <View style={styles.badge}>
//                     <Text style={styles.badgeText}>{item.badge}</Text>
//                   </View>
//                 ) : (
//                   <Ionicons
//                     name="chevron-forward"
//                     size={22}
//                     color={COLORS.muted || "#6B7280"}
//                   />
//                 )}
//               </TouchableOpacity>
//             ))}
//           </View>

//           <View style={styles.infoCard}>
//             <Ionicons
//               name="shield-checkmark-outline"
//               size={26}
//               color={COLORS.customer || "#E83E7C"}
//             />

//             <View style={{ flex: 1 }}>
//               <Text style={styles.infoTitle}>Buyer Protection</Text>
//               <Text style={styles.infoText}>
//                 Secure checkout, easy replacement, and trusted handmade sellers.
//               </Text>
//             </View>
//           </View>

//           <View style={{ height: 110 }} />
//         </ScrollView>

//         <Modal visible={photoModalVisible} transparent animationType="fade">
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalCard}>
//               <Text style={styles.modalTitle}>Profile Photo</Text>
//               <Text style={styles.modalDesc}>
//                 Choose how you want to update your profile photo.
//               </Text>

//               <TouchableOpacity style={styles.modalOption} onPress={openCamera}>
//                 <Ionicons name="camera-outline" size={24} color="#111827" />
//                 <Text style={styles.modalOptionText}>Open Camera</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.modalOption} onPress={openGallery}>
//                 <Ionicons name="image-outline" size={24} color="#111827" />
//                 <Text style={styles.modalOptionText}>Choose from Gallery</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.modalOption} onPress={removePhoto}>
//                 <Ionicons name="trash-outline" size={24} color="#EF4444" />
//                 <Text style={[styles.modalOptionText, { color: "#EF4444" }]}>
//                   Remove Photo
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.modalCancel}
//                 onPress={() => setPhotoModalVisible(false)}
//               >
//                 <Text style={styles.modalCancelText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>

//         <Modal visible={logoutModalVisible} transparent animationType="fade">
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalCard}>
//               <Text style={styles.modalTitle}>Logout</Text>
//               <Text style={styles.modalDesc}>
//                 Are you sure you want to sign out from your account?
//               </Text>

//               <View style={styles.logoutActions}>
//                 <TouchableOpacity
//                   style={styles.cancelBtn}
//                   onPress={() => setLogoutModalVisible(false)}
//                 >
//                   <Text style={styles.cancelBtnText}>Cancel</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
//                   <Text style={styles.logoutBtnText}>Logout</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: COLORS.customer || "#E83E7C",
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//   },

//   header: {
//     height: Platform.OS === "web" ? 64 : 58,
//     backgroundColor: COLORS.customer || "#E83E7C",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     elevation: 4,
//   },
//   headerTitle: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: 19,
//     fontWeight: "900",
//     color: "#FFFFFF",
//   },
//   headerIconBtn: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: "rgba(255,255,255,0.18)",
//     alignItems: "center",
//     justifyContent: "center",
//     position: "relative",
//   },
//   headerBadge: {
//     position: "absolute",
//     top: 4,
//     right: 3,
//     minWidth: 18,
//     height: 18,
//     borderRadius: 9,
//     backgroundColor: "#EF4444",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 4,
//     borderWidth: 1.5,
//     borderColor: "#FFFFFF",
//   },
//   headerBadgeText: {
//     color: "#FFFFFF",
//     fontSize: 9,
//     fontWeight: "900",
//   },

//   scroll: { paddingBottom: 20 },
//   messageBox: {
//     marginHorizontal: 16,
//     marginTop: 10,
//     padding: 12,
//     borderRadius: 14,
//     backgroundColor: "#111827",
//   },
//   messageText: {
//     color: "#FFFFFF",
//     fontSize: 13,
//     fontWeight: "800",
//     textAlign: "center",
//   },

//   profileCard: {
//     margin: 16,
//     padding: 18,
//     borderRadius: 26,
//     backgroundColor: COLORS.customer || "#E83E7C",
//     flexDirection: "row",
//     alignItems: "center",
//     elevation: 5,
//   },
//   avatarWrapper: { position: "relative" },
//   avatarBox: {
//     width: 92,
//     height: 92,
//     borderRadius: 46,
//     backgroundColor: "rgba(255,255,255,0.22)",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 3,
//     borderColor: "rgba(255,255,255,0.55)",
//     overflow: "hidden",
//   },
//   avatarImage: { width: 92, height: 92, borderRadius: 46 },
//   cameraBtn: {
//     position: "absolute",
//     bottom: 2,
//     right: 2,
//     width: 26,
//     height: 26,
//     borderRadius: 13,
//     backgroundColor: "#111827",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 2,
//     borderColor: "#FFFFFF",
//   },
//   profileInfo: { flex: 1, marginLeft: 16 },
//   name: { fontSize: 23, fontWeight: "900", color: "#FFFFFF" },
//   email: {
//     marginTop: 4,
//     fontSize: 13,
//     fontWeight: "700",
//     color: "rgba(255,255,255,0.85)",
//   },
//   phone: {
//     marginTop: 3,
//     fontSize: 13,
//     fontWeight: "700",
//     color: "rgba(255,255,255,0.85)",
//   },
//   editBtn: {
//     marginTop: 12,
//     height: 34,
//     alignSelf: "flex-start",
//     paddingHorizontal: 14,
//     borderRadius: 17,
//     backgroundColor: "rgba(17,24,39,0.28)",
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   editText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },

//   statsRow: { flexDirection: "row", marginHorizontal: 16, gap: 10 },
//   statCard: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 18,
//     paddingVertical: 16,
//     alignItems: "center",
//     elevation: 3,
//   },
//   statValue: {
//     fontSize: 22,
//     fontWeight: "900",
//     color: COLORS.customer || "#E83E7C",
//   },
//   statLabel: {
//     marginTop: 4,
//     fontSize: 12,
//     fontWeight: "800",
//     color: COLORS.muted || "#6B7280",
//   },

//   sectionHeader: {
//     marginHorizontal: 16,
//     marginTop: 22,
//     marginBottom: 10,
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "900",
//     color: COLORS.text || "#111827",
//   },
//   viewAll: {
//     fontSize: 13,
//     fontWeight: "900",
//     color: COLORS.customer || "#E83E7C",
//   },

//   orderCard: {
//     marginHorizontal: 16,
//     marginBottom: 12,
//     padding: 14,
//     borderRadius: 20,
//     backgroundColor: "#FFFFFF",
//     flexDirection: "row",
//     elevation: 3,
//   },
//   orderIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 16,
//     backgroundColor: "#FFF4F8",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   orderInfo: { flex: 1 },
//   orderTop: { flexDirection: "row", justifyContent: "space-between" },
//   orderId: {
//     fontSize: 13,
//     fontWeight: "900",
//     color: COLORS.text || "#111827",
//   },
//   status: {
//     fontSize: 11,
//     fontWeight: "900",
//     paddingHorizontal: 9,
//     paddingVertical: 4,
//     borderRadius: 12,
//     overflow: "hidden",
//   },
//   delivered: { backgroundColor: "#DCFCE7", color: "#15803D" },
//   shipped: { backgroundColor: "#DBEAFE", color: "#1D4ED8" },
//   processing: { backgroundColor: "#FEF3C7", color: "#B45309" },
//   orderTitle: {
//     marginTop: 7,
//     fontSize: 14,
//     fontWeight: "800",
//     color: COLORS.text || "#111827",
//   },
//   orderBottom: {
//     marginTop: 8,
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   orderDate: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: COLORS.muted || "#6B7280",
//   },
//   orderPrice: {
//     fontSize: 14,
//     fontWeight: "900",
//     color: COLORS.customer || "#E83E7C",
//   },

//   menuCard: {
//     marginHorizontal: 16,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 22,
//     overflow: "hidden",
//     elevation: 3,
//   },
//   menuRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   lastMenuRow: { borderBottomWidth: 0 },
//   menuIcon: {
//     width: 42,
//     height: 42,
//     borderRadius: 15,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   menuTextBox: { flex: 1 },
//   menuTitle: {
//     fontSize: 15,
//     fontWeight: "900",
//     color: COLORS.text || "#111827",
//   },
//   menuSubtitle: {
//     marginTop: 3,
//     fontSize: 12,
//     fontWeight: "700",
//     color: COLORS.muted || "#6B7280",
//   },
//   badge: {
//     minWidth: 22,
//     height: 22,
//     borderRadius: 11,
//     backgroundColor: COLORS.customer || "#E83E7C",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 6,
//   },
//   badgeText: { color: "#FFFFFF", fontSize: 11, fontWeight: "900" },

//   infoCard: {
//     marginHorizontal: 16,
//     marginTop: 18,
//     padding: 16,
//     borderRadius: 20,
//     backgroundColor: "#FFFFFF",
//     flexDirection: "row",
//     gap: 12,
//     elevation: 3,
//   },
//   infoTitle: {
//     fontSize: 15,
//     fontWeight: "900",
//     color: COLORS.text || "#111827",
//   },
//   infoText: {
//     marginTop: 4,
//     fontSize: 12,
//     fontWeight: "700",
//     color: COLORS.muted || "#6B7280",
//     lineHeight: 18,
//   },

//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.45)",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//   },
//   modalCard: {
//     width: "100%",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 24,
//     padding: 18,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "900",
//     color: COLORS.text || "#111827",
//     marginBottom: 12,
//   },
//   modalDesc: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: COLORS.muted || "#6B7280",
//     marginBottom: 18,
//     lineHeight: 20,
//   },
//   modalOption: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//     gap: 12,
//   },
//   modalOptionText: {
//     fontSize: 15,
//     fontWeight: "800",
//     color: COLORS.text || "#111827",
//   },
//   modalCancel: {
//     marginTop: 14,
//     height: 46,
//     borderRadius: 16,
//     backgroundColor: "#F3F4F6",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   modalCancelText: {
//     fontSize: 14,
//     fontWeight: "900",
//     color: COLORS.text || "#111827",
//   },
//   logoutActions: { flexDirection: "row", gap: 12 },
//   cancelBtn: {
//     flex: 1,
//     height: 46,
//     borderRadius: 16,
//     backgroundColor: "#F3F4F6",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   cancelBtnText: {
//     fontSize: 14,
//     fontWeight: "900",
//     color: COLORS.text || "#111827",
//   },
//   logoutBtn: {
//     flex: 1,
//     height: 46,
//     borderRadius: 16,
//     backgroundColor: "#EF4444",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   logoutBtnText: {
//     fontSize: 14,
//     fontWeight: "900",
//     color: "#FFFFFF",
//   },
// });





















// // src/screens/customer/CustomerProfileScreen.js

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   Modal,
//   SafeAreaView,
//   Platform,
// } from "react-native";

// import { Ionicons } from "@expo/vector-icons";
// import * as ImagePicker from "expo-image-picker";

// import { COLORS } from "../../constants/colors";
// import { useShop } from "../../context/ShopContext";

// const defaultProfile = {
//   name: "Customer",
//   email: "customer@email.com",
//   phone: "+91 98765 43210",
//   location: "Hyderabad",
//   bio: "Love handmade products ❤️",
//   avatar: null,
//   addresses: [],
// };

// const defaultOrders = [
//   {
//     id: "ORD-1001",
//     title: "Handmade Product Order",
//     status: "Delivered",
//     date: "Today",
//     price: "₹499",
//   },
//   {
//     id: "ORD-1002",
//     title: "Local Seller Product",
//     status: "Processing",
//     date: "Yesterday",
//     price: "₹899",
//   },
// ];

// const customerNotifications = [
//   {
//     id: "1",
//     title: "Order Delivered",
//     message:
//       "Your handmade product order ORD-1001 has been delivered.",
//     time: "Today, 10:30 AM",
//     type: "order",
//     read: false,
//     screen: "OrderDetail",
//     params: { order: defaultOrders[0] },
//   },
// ];

// export default function CustomerProfileScreen({
//   navigation,
//   route,
// }) {
//   const {
//     cartCount = 0,
//     wishlistCount = 0,
//   } = useShop();

//   const [profile, setProfile] =
//     useState(defaultProfile);

//   const [orders] = useState(defaultOrders);

//   const [notifications] = useState(
//     customerNotifications
//   );

//   const [avatarLoading, setAvatarLoading] =
//     useState(false);

//   const [photoModalVisible, setPhotoModalVisible] =
//     useState(false);

//   const [logoutModalVisible, setLogoutModalVisible] =
//     useState(false);

//   const [message, setMessage] = useState("");

//   /* PROFILE UPDATE */
//   useEffect(() => {
//     if (route?.params?.updatedProfile) {
//       setProfile((prev) => ({
//         ...prev,
//         ...route.params.updatedProfile,
//       }));
//     }
//   }, [route?.params?.updatedProfile]);

//   const unreadCount = notifications.filter(
//     (item) => !item.read
//   ).length;

//   const updateProfile = (data) =>
//     setProfile((prev) => ({
//       ...prev,
//       ...data,
//     }));

//   const showMessage = (text) => {
//     setMessage(text);

//     setTimeout(() => {
//       setMessage("");
//     }, 2500);
//   };

//   const goToScreen = (
//     screenName,
//     params = {}
//   ) => {
//     navigation.navigate(screenName, params);
//   };

//   const openNotifications = () => {
//     navigation.navigate(
//       "CustomerNotifications",
//       {
//         notifications,
//       }
//     );
//   };

//   /* CAMERA */
//   const openCamera = async () => {
//     setPhotoModalVisible(false);

//     const { status } =
//       await ImagePicker.requestCameraPermissionsAsync();

//     if (status !== "granted") {
//       showMessage(
//         "Camera permission is required."
//       );

//       return;
//     }

//     setAvatarLoading(true);

//     const result =
//       await ImagePicker.launchCameraAsync({
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.7,
//       });

//     setAvatarLoading(false);

//     if (
//       !result.canceled &&
//       result.assets?.length > 0
//     ) {
//       updateProfile({
//         avatar: result.assets[0].uri,
//       });
//     }
//   };

//   /* GALLERY */
//   const openGallery = async () => {
//     setPhotoModalVisible(false);

//     const { status } =
//       await ImagePicker.requestMediaLibraryPermissionsAsync();

//     if (status !== "granted") {
//       showMessage(
//         "Gallery permission is required."
//       );

//       return;
//     }

//     setAvatarLoading(true);

//     const result =
//       await ImagePicker.launchImageLibraryAsync({
//         mediaTypes:
//           ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.7,
//       });

//     setAvatarLoading(false);

//     if (
//       !result.canceled &&
//       result.assets?.length > 0
//     ) {
//       updateProfile({
//         avatar: result.assets[0].uri,
//       });
//     }
//   };

//   const removePhoto = () => {
//     setPhotoModalVisible(false);

//     updateProfile({
//       avatar: null,
//     });

//     showMessage("Profile photo removed.");
//   };

//   const handleLogout = () => {
//     setLogoutModalVisible(false);

//     navigation.reset({
//       index: 0,
//       routes: [
//         {
//           name: "RoleSelectionScreen",
//         },
//       ],
//     });
//   };

//   const menuItems = [
//     {
//       title: "My Orders",
//       subtitle: `${orders.length} total orders`,
//       icon: "bag-handle-outline",
//       color: "#7C3AED",
//       onPress: () =>
//         goToScreen("MyOrders", { orders }),
//     },

//     {
//       title: "Wishlist",
//       subtitle: `${wishlistCount} saved products`,
//       icon: "heart-outline",
//       color: "#E83E7C",
//       onPress: () =>
//         navigation.navigate("WishlistTab"),
//     },

//     {
//       title: "My Cart",
//       subtitle: `${cartCount} products in cart`,
//       icon: "cart-outline",
//       color: "#F97316",
//       onPress: () =>
//         navigation.navigate("CartTab"),
//     },

//     {
//       title: "Saved Addresses",
//       subtitle: `${
//         profile.addresses?.length || 0
//       } addresses saved`,
//       icon: "location-outline",
//       color: "#10B981",
//       onPress: () =>
//         goToScreen("CustomerSavedAddress"),
//     },

//     {
//       title: "Notifications",
//       subtitle:
//         unreadCount > 0
//           ? `${unreadCount} unread notifications`
//           : "All caught up!",
//       icon: "notifications-outline",
//       color: "#2563EB",
//       onPress: openNotifications,
//     },

//     {
//       title: "Help & Support",
//       subtitle:
//         "Chat, call and raise support tickets",
//       icon: "headset-outline",
//       color: "#0EA5E9",
//       onPress: () =>
//         goToScreen("CustomerChatSupport"),
//     },

//     {
//       title: "Logout",
//       subtitle:
//         "Sign out from your account",
//       icon: "log-out-outline",
//       color: "#EF4444",
//       onPress: () =>
//         setLogoutModalVisible(true),
//     },
//   ];

//   const recentOrders = orders.slice(0, 3);

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
//         {/* HEADER */}
//         <View style={styles.header}>
//           <TouchableOpacity
//             style={styles.headerIconBtn}
//             activeOpacity={0.85}
//             onPress={() => navigation.goBack()}
//           >
//             <Ionicons
//               name="arrow-back"
//               size={22}
//               color="#FFFFFF"
//             />
//           </TouchableOpacity>

//           <Text style={styles.headerTitle}>
//             My Profile
//           </Text>

//           <TouchableOpacity
//             style={styles.headerIconBtn}
//             activeOpacity={0.85}
//             onPress={openNotifications}
//           >
//             <Ionicons
//               name="notifications-outline"
//               size={23}
//               color="#FFFFFF"
//             />

//             {unreadCount > 0 && (
//               <View style={styles.headerBadge}>
//                 <Text
//                   style={styles.headerBadgeText}
//                 >
//                   {unreadCount}
//                 </Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* MESSAGE */}
//         {message ? (
//           <View style={styles.messageBox}>
//             <Text style={styles.messageText}>
//               {message}
//             </Text>
//           </View>
//         ) : null}

//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scroll}
//         >
//           {/* PROFILE CARD */}
//           <View style={styles.profileCard}>
//             <TouchableOpacity
//               style={styles.avatarWrapper}
//               activeOpacity={0.85}
//               onPress={() =>
//                 setPhotoModalVisible(true)
//               }
//             >
//               <View style={styles.avatarBox}>
//                 {profile.avatar ? (
//                   <Image
//                     source={{
//                       uri: profile.avatar,
//                     }}
//                     style={styles.avatarImage}
//                   />
//                 ) : (
//                   <Ionicons
//                     name="person"
//                     size={48}
//                     color="#FFFFFF"
//                   />
//                 )}
//               </View>

//               <View style={styles.cameraBtn}>
//                 <Ionicons
//                   name={
//                     avatarLoading
//                       ? "hourglass-outline"
//                       : "camera"
//                   }
//                   size={13}
//                   color="#FFFFFF"
//                 />
//               </View>
//             </TouchableOpacity>

//             <View style={styles.profileInfo}>
//               <Text style={styles.name}>
//                 {profile.name}
//               </Text>

//               <Text style={styles.email}>
//                 {profile.email}
//               </Text>

//               <Text style={styles.phone}>
//                 {profile.phone}
//               </Text>

//               <TouchableOpacity
//                 style={styles.editBtn}
//                 activeOpacity={0.85}
//                 onPress={() =>
//                   goToScreen(
//                     "CustomerEditProfile",
//                     {
//                       profileData: profile,
//                     }
//                   )
//                 }
//               >
//                 <Ionicons
//                   name="create-outline"
//                   size={16}
//                   color="#FFFFFF"
//                 />

//                 <Text style={styles.editText}>
//                   Edit Profile
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* STATS */}
//           <View style={styles.statsRow}>
//             <TouchableOpacity
//               style={styles.statCard}
//             >
//               <Text style={styles.statValue}>
//                 {orders.length}
//               </Text>

//               <Text style={styles.statLabel}>
//                 Orders
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.statCard}
//             >
//               <Text style={styles.statValue}>
//                 {wishlistCount}
//               </Text>

//               <Text style={styles.statLabel}>
//                 Wishlist
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.statCard}
//             >
//               <Text style={styles.statValue}>
//                 {cartCount}
//               </Text>

//               <Text style={styles.statLabel}>
//                 Cart
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* RECENT ORDERS */}
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>
//               Recent Orders
//             </Text>

//             <TouchableOpacity>
//               <Text style={styles.viewAll}>
//                 View All
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {recentOrders.map((order) => (
//             <TouchableOpacity
//               key={order.id}
//               style={styles.orderCard}
//             >
//               <View style={styles.orderIcon}>
//                 <Ionicons
//                   name="cube-outline"
//                   size={24}
//                   color="#E83E7C"
//                 />
//               </View>

//               <View style={styles.orderInfo}>
//                 <View style={styles.orderTop}>
//                   <Text style={styles.orderId}>
//                     {order.id}
//                   </Text>

//                   <Text
//                     style={[
//                       styles.status,

//                       order.status ===
//                         "Delivered" &&
//                         styles.delivered,

//                       order.status ===
//                         "Processing" &&
//                         styles.processing,
//                     ]}
//                   >
//                     {order.status}
//                   </Text>
//                 </View>

//                 <Text
//                   style={styles.orderTitle}
//                 >
//                   {order.title}
//                 </Text>

//                 <View
//                   style={styles.orderBottom}
//                 >
//                   <Text
//                     style={styles.orderDate}
//                   >
//                     {order.date}
//                   </Text>

//                   <Text
//                     style={styles.orderPrice}
//                   >
//                     {order.price}
//                   </Text>
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))}

//           {/* ACCOUNT */}
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>
//               Account
//             </Text>
//           </View>

//           <View style={styles.menuCard}>
//             {menuItems.map((item, index) => (
//               <TouchableOpacity
//                 key={item.title}
//                 style={[
//                   styles.menuRow,

//                   index ===
//                     menuItems.length - 1 &&
//                     styles.lastMenuRow,
//                 ]}
//                 activeOpacity={0.85}
//                 onPress={item.onPress}
//               >
//                 <View
//                   style={[
//                     styles.menuIcon,
//                     {
//                       backgroundColor:
//                         item.color,
//                     },
//                   ]}
//                 >
//                   <Ionicons
//                     name={item.icon}
//                     size={21}
//                     color="#FFFFFF"
//                   />
//                 </View>

//                 <View
//                   style={styles.menuTextBox}
//                 >
//                   <Text
//                     style={styles.menuTitle}
//                   >
//                     {item.title}
//                   </Text>

//                   <Text
//                     style={
//                       styles.menuSubtitle
//                     }
//                   >
//                     {item.subtitle}
//                   </Text>
//                 </View>

//                 <Ionicons
//                   name="chevron-forward"
//                   size={22}
//                   color="#6B7280"
//                 />
//               </TouchableOpacity>
//             ))}
//           </View>

//           <View style={{ height: 120 }} />
//         </ScrollView>

//         {/* PHOTO MODAL */}
//         <Modal
//           visible={photoModalVisible}
//           transparent
//           animationType="fade"
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalCard}>
//               <Text style={styles.modalTitle}>
//                 Profile Photo
//               </Text>

//               <TouchableOpacity
//                 style={styles.modalOption}
//                 onPress={openCamera}
//               >
//                 <Ionicons
//                   name="camera-outline"
//                   size={24}
//                   color="#111827"
//                 />

//                 <Text
//                   style={
//                     styles.modalOptionText
//                   }
//                 >
//                   Open Camera
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.modalOption}
//                 onPress={openGallery}
//               >
//                 <Ionicons
//                   name="image-outline"
//                   size={24}
//                   color="#111827"
//                 />

//                 <Text
//                   style={
//                     styles.modalOptionText
//                   }
//                 >
//                   Choose from Gallery
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.modalOption}
//                 onPress={removePhoto}
//               >
//                 <Ionicons
//                   name="trash-outline"
//                   size={24}
//                   color="#EF4444"
//                 />

//                 <Text
//                   style={[
//                     styles.modalOptionText,
//                     {
//                       color: "#EF4444",
//                     },
//                   ]}
//                 >
//                   Remove Photo
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.modalCancel}
//                 onPress={() =>
//                   setPhotoModalVisible(false)
//                 }
//               >
//                 <Text
//                   style={
//                     styles.modalCancelText
//                   }
//                 >
//                   Cancel
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>

//         {/* LOGOUT MODAL */}
//         <Modal
//           visible={logoutModalVisible}
//           transparent
//           animationType="fade"
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalCard}>
//               <Text style={styles.modalTitle}>
//                 Logout
//               </Text>

//               <Text style={styles.modalDesc}>
//                 Are you sure you want to
//                 logout?
//               </Text>

//               <View
//                 style={styles.logoutActions}
//               >
//                 <TouchableOpacity
//                   style={styles.cancelBtn}
//                   onPress={() =>
//                     setLogoutModalVisible(
//                       false
//                     )
//                   }
//                 >
//                   <Text
//                     style={
//                       styles.cancelBtnText
//                     }
//                   >
//                     Cancel
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={styles.logoutBtn}
//                   onPress={handleLogout}
//                 >
//                   <Text
//                     style={
//                       styles.logoutBtnText
//                     }
//                   >
//                     Logout
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor:
//       COLORS.customer || "#E83E7C",
//   },

//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//   },

//   header: {
//     height: Platform.OS === "web"
//       ? 64
//       : 58,

//     backgroundColor:
//       COLORS.customer || "#E83E7C",

//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",

//     paddingHorizontal: 16,
//   },

//   headerTitle: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: 19,
//     fontWeight: "900",
//     color: "#FFFFFF",
//   },

//   headerIconBtn: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,

//     backgroundColor:
//       "rgba(255,255,255,0.18)",

//     alignItems: "center",
//     justifyContent: "center",
//   },

//   headerBadge: {
//     position: "absolute",
//     top: 4,
//     right: 3,

//     minWidth: 18,
//     height: 18,
//     borderRadius: 9,

//     backgroundColor: "#EF4444",

//     alignItems: "center",
//     justifyContent: "center",
//   },

//   headerBadgeText: {
//     color: "#FFFFFF",
//     fontSize: 9,
//     fontWeight: "900",
//   },

//   scroll: {
//     paddingBottom: 20,
//   },

//   messageBox: {
//     marginHorizontal: 16,
//     marginTop: 10,

//     padding: 12,
//     borderRadius: 14,

//     backgroundColor: "#111827",
//   },

//   messageText: {
//     color: "#FFFFFF",
//     textAlign: "center",
//     fontWeight: "800",
//   },

//   profileCard: {
//     margin: 16,
//     padding: 18,
//     borderRadius: 26,

//     backgroundColor:
//       COLORS.customer || "#E83E7C",

//     flexDirection: "row",
//     alignItems: "center",
//   },

//   avatarWrapper: {
//     position: "relative",
//   },

//   avatarBox: {
//     width: 92,
//     height: 92,
//     borderRadius: 46,

//     backgroundColor:
//       "rgba(255,255,255,0.22)",

//     alignItems: "center",
//     justifyContent: "center",

//     overflow: "hidden",
//   },

//   avatarImage: {
//     width: 92,
//     height: 92,
//     borderRadius: 46,
//   },

//   cameraBtn: {
//     position: "absolute",
//     bottom: 2,
//     right: 2,

//     width: 26,
//     height: 26,
//     borderRadius: 13,

//     backgroundColor: "#111827",

//     alignItems: "center",
//     justifyContent: "center",
//   },

//   profileInfo: {
//     flex: 1,
//     marginLeft: 16,
//   },

//   name: {
//     fontSize: 23,
//     fontWeight: "900",
//     color: "#FFFFFF",
//   },

//   email: {
//     marginTop: 4,
//     fontSize: 13,
//     fontWeight: "700",
//     color:
//       "rgba(255,255,255,0.85)",
//   },

//   phone: {
//     marginTop: 3,
//     fontSize: 13,
//     fontWeight: "700",
//     color:
//       "rgba(255,255,255,0.85)",
//   },

//   editBtn: {
//     marginTop: 12,

//     height: 34,
//     alignSelf: "flex-start",

//     paddingHorizontal: 14,
//     borderRadius: 17,

//     backgroundColor:
//       "rgba(17,24,39,0.28)",

//     flexDirection: "row",
//     alignItems: "center",
//   },

//   editText: {
//     color: "#FFFFFF",
//     fontSize: 12,
//     fontWeight: "900",
//     marginLeft: 6,
//   },

//   statsRow: {
//     flexDirection: "row",
//     marginHorizontal: 16,
//     gap: 10,
//   },

//   statCard: {
//     flex: 1,

//     backgroundColor: "#FFFFFF",

//     borderRadius: 18,
//     paddingVertical: 16,

//     alignItems: "center",

//     elevation: 3,
//   },

//   statValue: {
//     fontSize: 22,
//     fontWeight: "900",
//     color:
//       COLORS.customer || "#E83E7C",
//   },

//   statLabel: {
//     marginTop: 4,
//     fontSize: 12,
//     fontWeight: "800",
//     color: "#6B7280",
//   },

//   sectionHeader: {
//     marginHorizontal: 16,
//     marginTop: 22,
//     marginBottom: 10,

//     flexDirection: "row",
//     justifyContent: "space-between",
//   },

//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "900",
//     color: "#111827",
//   },

//   viewAll: {
//     fontSize: 13,
//     fontWeight: "900",
//     color:
//       COLORS.customer || "#E83E7C",
//   },

//   orderCard: {
//     marginHorizontal: 16,
//     marginBottom: 12,

//     padding: 14,
//     borderRadius: 20,

//     backgroundColor: "#FFFFFF",

//     flexDirection: "row",

//     elevation: 3,
//   },

//   orderIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 16,

//     backgroundColor: "#FFF4F8",

//     alignItems: "center",
//     justifyContent: "center",

//     marginRight: 12,
//   },

//   orderInfo: {
//     flex: 1,
//   },

//   orderTop: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },

//   orderId: {
//     fontSize: 13,
//     fontWeight: "900",
//     color: "#111827",
//   },

//   status: {
//     fontSize: 11,
//     fontWeight: "900",

//     paddingHorizontal: 9,
//     paddingVertical: 4,

//     borderRadius: 12,
//     overflow: "hidden",
//   },

//   delivered: {
//     backgroundColor: "#DCFCE7",
//     color: "#15803D",
//   },

//   processing: {
//     backgroundColor: "#FEF3C7",
//     color: "#B45309",
//   },

//   orderTitle: {
//     marginTop: 7,
//     fontSize: 14,
//     fontWeight: "800",
//     color: "#111827",
//   },

//   orderBottom: {
//     marginTop: 8,
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },

//   orderDate: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#6B7280",
//   },

//   orderPrice: {
//     fontSize: 14,
//     fontWeight: "900",
//     color:
//       COLORS.customer || "#E83E7C",
//   },

//   menuCard: {
//     marginHorizontal: 16,

//     backgroundColor: "#FFFFFF",

//     borderRadius: 22,
//     overflow: "hidden",

//     elevation: 3,
//   },

//   menuRow: {
//     flexDirection: "row",
//     alignItems: "center",

//     padding: 14,

//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },

//   lastMenuRow: {
//     borderBottomWidth: 0,
//   },

//   menuIcon: {
//     width: 42,
//     height: 42,
//     borderRadius: 15,

//     alignItems: "center",
//     justifyContent: "center",

//     marginRight: 12,
//   },

//   menuTextBox: {
//     flex: 1,
//   },

//   menuTitle: {
//     fontSize: 15,
//     fontWeight: "900",
//     color: "#111827",
//   },

//   menuSubtitle: {
//     marginTop: 3,
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#6B7280",
//   },

//   modalOverlay: {
//     flex: 1,
//     backgroundColor:
//       "rgba(0,0,0,0.45)",

//     alignItems: "center",
//     justifyContent: "center",

//     padding: 20,
//   },

//   modalCard: {
//     width: "100%",
//     backgroundColor: "#FFFFFF",

//     borderRadius: 24,
//     padding: 18,
//   },

//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "900",
//     color: "#111827",
//     marginBottom: 12,
//   },

//   modalDesc: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: "#6B7280",
//     marginBottom: 18,
//   },

//   modalOption: {
//     flexDirection: "row",
//     alignItems: "center",

//     paddingVertical: 14,
//   },

//   modalOptionText: {
//     fontSize: 15,
//     fontWeight: "800",
//     marginLeft: 12,
//     color: "#111827",
//   },

//   modalCancel: {
//     marginTop: 14,

//     height: 46,
//     borderRadius: 16,

//     backgroundColor: "#F3F4F6",

//     alignItems: "center",
//     justifyContent: "center",
//   },

//   modalCancelText: {
//     fontSize: 14,
//     fontWeight: "900",
//     color: "#111827",
//   },

//   logoutActions: {
//     flexDirection: "row",
//     gap: 12,
//   },

//   cancelBtn: {
//     flex: 1,

//     height: 46,
//     borderRadius: 16,

//     backgroundColor: "#F3F4F6",

//     alignItems: "center",
//     justifyContent: "center",
//   },

//   cancelBtnText: {
//     fontSize: 14,
//     fontWeight: "900",
//     color: "#111827",
//   },

//   logoutBtn: {
//     flex: 1,

//     height: 46,
//     borderRadius: 16,

//     backgroundColor: "#EF4444",

//     alignItems: "center",
//     justifyContent: "center",
//   },

//   logoutBtnText: {
//     fontSize: 14,
//     fontWeight: "900",
//     color: "#FFFFFF",
//   },
// });/









































// src/screens/customer/CustomerProfileScreen.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  SafeAreaView,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { COLORS } from "../../constants/colors";
import { useShop } from "../../context/ShopContext";
import { clearAuthSession } from "../../utils/authSession";

const defaultProfile = {
  name: "Customer",
  email: "customer@email.com",
  phone: "+91 98765 43210",
  location: "Hyderabad",
  bio: "Love handmade products ❤️",
  avatar: null,
  addresses: [],
};

const defaultOrders = [
  {
    id: "ORD-1001",
    title: "Handmade Product Order",
    status: "Delivered",
    date: "Today",
    price: "₹499",
  },
  {
    id: "ORD-1002",
    title: "Local Seller Product",
    status: "Processing",
    date: "Yesterday",
    price: "₹899",
  },
];

export default function CustomerProfileScreen({
  navigation,
  route,
}) {
  const {
    cartCount = 0,
    wishlistCount = 0,
    unreadCustomerNotifications = 0,
    currentCustomer,
    customerAddresses,
    orders = [],
    updateCustomerProfile,
  } = useShop();

  const [profile, setProfile] =
    useState(defaultProfile);

  const [avatarLoading, setAvatarLoading] =
    useState(false);

  const [photoModalVisible, setPhotoModalVisible] =
    useState(false);

  const [logoutModalVisible, setLogoutModalVisible] =
    useState(false);

  const [message, setMessage] = useState("");

  /* PROFILE UPDATE */
  useEffect(() => {
    if (route?.params?.updatedProfile) {
      setProfile((prev) => ({
        ...prev,
        ...route.params.updatedProfile,
      }));
    }
  }, [route?.params?.updatedProfile]);

  useEffect(() => {
    setProfile((prev) => ({
      ...prev,
      ...defaultProfile,
      ...prev,
      ...currentCustomer,
      addresses: customerAddresses,
      avatar: currentCustomer?.avatar ?? prev.avatar ?? defaultProfile.avatar,
    }));
  }, [currentCustomer, customerAddresses]);

  const updateProfile = (data) =>
    setProfile((prev) => {
      const nextProfile = {
        ...prev,
        ...data,
      };
      updateCustomerProfile?.(nextProfile);
      return nextProfile;
    });

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const goToScreen = (
    screenName,
    params = {}
  ) => {
    navigation.navigate(screenName, params);
  };

  const openNotifications = () => {
    navigation.navigate("CustomerNotifications");
  };

  /* CAMERA */
  const openCamera = async () => {
    setPhotoModalVisible(false);

    const { status } =
      await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      showMessage(
        "Camera permission is required."
      );

      return;
    }

    setAvatarLoading(true);

    const result =
      await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

    setAvatarLoading(false);

    if (
      !result.canceled &&
      result.assets?.length > 0
    ) {
      updateProfile({
        avatar: result.assets[0].uri,
      });
    }
  };

  /* GALLERY */
  const openGallery = async () => {
    setPhotoModalVisible(false);

    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      showMessage(
        "Gallery permission is required."
      );

      return;
    }

    setAvatarLoading(true);

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

    setAvatarLoading(false);

    if (
      !result.canceled &&
      result.assets?.length > 0
    ) {
      updateProfile({
        avatar: result.assets[0].uri,
      });
    }
  };

  const removePhoto = () => {
    setPhotoModalVisible(false);

    updateProfile({
      avatar: null,
    });

    showMessage("Profile photo removed.");
  };

  const handleLogout = () => {
    setLogoutModalVisible(false);
    clearAuthSession();

    navigation.reset({
      index: 0,
      routes: [
        {
          name: "RoleSelectionScreen",
        },
      ],
    });
  };

  const menuItems = [
    {
      title: "My Orders",
      subtitle: `${orders.length} total orders`,
      icon: "bag-handle-outline",
      color: "#7C3AED",
      onPress: () =>
        goToScreen("MyOrders", { orders }),
    },

    {
      title: "Wishlist",
      subtitle: `${wishlistCount} saved products`,
      icon: "heart-outline",
      color: "#E83E7C",
      onPress: () =>
        navigation.navigate("WishlistTab"),
    },

    {
      title: "My Cart",
      subtitle: `${cartCount} products in cart`,
      icon: "cart-outline",
      color: "#F97316",
      onPress: () =>
        navigation.navigate("CartTab"),
    },

    {
      title: "Saved Addresses",
      subtitle: `${
        customerAddresses?.length || 0
      } addresses saved`,
      icon: "location-outline",
      color: "#10B981",
      onPress: () =>
        goToScreen("CustomerSavedAddress"),
    },

    {
      title: "Notifications",
      subtitle:
        unreadCustomerNotifications > 0
          ? `${unreadCustomerNotifications} unread notifications`
          : "All caught up!",
      icon: "notifications-outline",
      color: "#2563EB",
      onPress: openNotifications,
    },

    {
      title: "Help & Support",
      subtitle:
        "Chat, call and raise support tickets",
      icon: "headset-outline",
      color: "#0EA5E9",
      onPress: () =>
        goToScreen("CustomerChatSupport"),
    },

    {
      title: "Logout",
      subtitle:
        "Sign out from your account",
      icon: "log-out-outline",
      color: "#EF4444",
      onPress: () =>
        setLogoutModalVisible(true),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            activeOpacity={0.85}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            My Profile
          </Text>

          <TouchableOpacity
            style={styles.headerIconBtn}
            activeOpacity={0.85}
            onPress={openNotifications}
          >
            <Ionicons
              name="notifications-outline"
              size={23}
              color="#FFFFFF"
            />

            {unreadCustomerNotifications > 0 && (
              <View style={styles.headerBadge}>
                <Text
                  style={styles.headerBadgeText}
                >
                  {unreadCustomerNotifications}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* MESSAGE */}
        {message ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>
              {message}
            </Text>
          </View>
        ) : null}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* PROFILE CARD */}
          <View style={styles.profileCard}>
            <TouchableOpacity
              style={styles.avatarWrapper}
              activeOpacity={0.85}
              onPress={() =>
                setPhotoModalVisible(true)
              }
            >
              <View style={styles.avatarBox}>
                {profile.avatar ? (
                  <Image
                    source={{
                      uri: profile.avatar,
                    }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Ionicons
                    name="person"
                    size={48}
                    color="#FFFFFF"
                  />
                )}
              </View>

              <View style={styles.cameraBtn}>
                <Ionicons
                  name={
                    avatarLoading
                      ? "hourglass-outline"
                      : "camera"
                  }
                  size={13}
                  color="#FFFFFF"
                />
              </View>
            </TouchableOpacity>

            <View style={styles.profileInfo}>
              <Text style={styles.name}>
                {profile.name}
              </Text>

              <Text style={styles.email}>
                {profile.email}
              </Text>

              <Text style={styles.phone}>
                {profile.phone}
              </Text>

              <TouchableOpacity
                style={styles.editBtn}
                activeOpacity={0.85}
                onPress={() =>
                  goToScreen(
                    "CustomerEditProfile",
                    {
                      profileData: profile,
                    }
                  )
                }
              >
                <Ionicons
                  name="create-outline"
                  size={16}
                  color="#FFFFFF"
                />

                <Text style={styles.editText}>
                  Edit Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* STATS */}
          <View style={styles.statsRow}>
            <TouchableOpacity
              style={styles.statCard}
            >
              <Text style={styles.statValue}>
                {orders.length}
              </Text>

              <Text style={styles.statLabel}>
                Orders
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
            >
              <Text style={styles.statValue}>
                {wishlistCount}
              </Text>

              <Text style={styles.statLabel}>
                Wishlist
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
            >
              <Text style={styles.statValue}>
                {cartCount}
              </Text>

              <Text style={styles.statLabel}>
                Cart
              </Text>
            </TouchableOpacity>
          </View>

          {/* ACCOUNT */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Account
            </Text>
          </View>

          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.title}
                style={[
                  styles.menuRow,

                  index ===
                    menuItems.length - 1 &&
                    styles.lastMenuRow,
                ]}
                activeOpacity={0.85}
                onPress={item.onPress}
              >
                <View
                  style={[
                    styles.menuIcon,
                    {
                      backgroundColor:
                        item.color,
                    },
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={21}
                    color="#FFFFFF"
                  />
                </View>

                <View
                  style={styles.menuTextBox}
                >
                  <Text
                    style={styles.menuTitle}
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={
                      styles.menuSubtitle
                    }
                  >
                    {item.subtitle}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color="#6B7280"
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* PHOTO MODAL */}
        <Modal
          visible={photoModalVisible}
          transparent
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                Profile Photo
              </Text>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={openCamera}
              >
                <Ionicons
                  name="camera-outline"
                  size={24}
                  color="#111827"
                />

                <Text
                  style={
                    styles.modalOptionText
                  }
                >
                  Open Camera
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={openGallery}
              >
                <Ionicons
                  name="image-outline"
                  size={24}
                  color="#111827"
                />

                <Text
                  style={
                    styles.modalOptionText
                  }
                >
                  Choose from Gallery
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={removePhoto}
              >
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color="#EF4444"
                />

                <Text
                  style={[
                    styles.modalOptionText,
                    {
                      color: "#EF4444",
                    },
                  ]}
                >
                  Remove Photo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() =>
                  setPhotoModalVisible(false)
                }
              >
                <Text
                  style={
                    styles.modalCancelText
                  }
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* LOGOUT MODAL */}
        <Modal
          visible={logoutModalVisible}
          transparent
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                Logout
              </Text>

              <Text style={styles.modalDesc}>
                Are you sure you want to
                logout?
              </Text>

              <View
                style={styles.logoutActions}
              >
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() =>
                    setLogoutModalVisible(
                      false
                    )
                  }
                >
                  <Text
                    style={
                      styles.cancelBtnText
                    }
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.logoutBtn}
                  onPress={handleLogout}
                >
                  <Text
                    style={
                      styles.logoutBtnText
                    }
                  >
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor:
      COLORS.customer || "#062B67",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    height: Platform.OS === "web"
      ? 64
      : 58,

    backgroundColor:
      COLORS.customer || "#062B67",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 16,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 19,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  headerIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,

    backgroundColor:
      "rgba(255,255,255,0.18)",

    alignItems: "center",
    justifyContent: "center",
  },

  headerBadge: {
    position: "absolute",
    top: 4,
    right: 3,

    minWidth: 18,
    height: 18,
    borderRadius: 9,

    backgroundColor: "#EF4444",

    alignItems: "center",
    justifyContent: "center",
  },

  headerBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
  },

  scroll: {
    paddingBottom: 20,
  },

  messageBox: {
    marginHorizontal: 16,
    marginTop: 10,

    padding: 12,
    borderRadius: 14,

    backgroundColor: "#111827",
  },

  messageText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "800",
  },

  profileCard: {
    margin: 16,
    padding: 18,
    borderRadius: 26,

    backgroundColor:
      COLORS.customer || "#062B67",

    flexDirection: "row",
    alignItems: "center",
  },

  avatarWrapper: {
    position: "relative",
  },

  avatarBox: {
    width: 92,
    height: 92,
    borderRadius: 46,

    backgroundColor:
      "rgba(255,255,255,0.22)",

    alignItems: "center",
    justifyContent: "center",

    overflow: "hidden",
  },

  avatarImage: {
    width: 92,
    height: 92,
    borderRadius: 46,
  },

  cameraBtn: {
    position: "absolute",
    bottom: 2,
    right: 2,

    width: 26,
    height: 26,
    borderRadius: 13,

    backgroundColor: "#111827",

    alignItems: "center",
    justifyContent: "center",
  },

  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },

  name: {
    fontSize: 23,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  email: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
    color:
      "rgba(255,255,255,0.85)",
  },

  phone: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: "700",
    color:
      "rgba(255,255,255,0.85)",
  },

  editBtn: {
    marginTop: 12,

    height: 34,
    alignSelf: "flex-start",

    paddingHorizontal: 14,
    borderRadius: 17,

    backgroundColor:
      "rgba(17,24,39,0.28)",

    flexDirection: "row",
    alignItems: "center",
  },

  editText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    marginLeft: 6,
  },

  statsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    gap: 10,
  },

  statCard: {
    flex: 1,

    backgroundColor: "#FFFFFF",

    borderRadius: 18,
    paddingVertical: 16,

    alignItems: "center",

    elevation: 3,
  },

  statValue: {
    fontSize: 22,
    fontWeight: "900",
    color:
      COLORS.customer || "#062B67",
  },

  statLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "800",
    color: "#6B7280",
  },

  sectionHeader: {
    marginHorizontal: 16,
    marginTop: 22,
    marginBottom: 10,

    flexDirection: "row",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
  },

  menuCard: {
    marginHorizontal: 16,

    backgroundColor: "#FFFFFF",

    borderRadius: 22,
    overflow: "hidden",

    elevation: 3,
  },

  menuRow: {
    flexDirection: "row",
    alignItems: "center",

    padding: 14,

    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  lastMenuRow: {
    borderBottomWidth: 0,
  },

  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  menuTextBox: {
    flex: 1,
  },

  menuTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#111827",
  },

  menuSubtitle: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.45)",

    alignItems: "center",
    justifyContent: "center",

    padding: 20,
  },

  modalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",

    borderRadius: 24,
    padding: 18,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 12,
  },

  modalDesc: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 18,
  },

  modalOption: {
    flexDirection: "row",
    alignItems: "center",

    paddingVertical: 14,
  },

  modalOptionText: {
    fontSize: 15,
    fontWeight: "800",
    marginLeft: 12,
    color: "#111827",
  },

  modalCancel: {
    marginTop: 14,

    height: 46,
    borderRadius: 16,

    backgroundColor: "#F3F4F6",

    alignItems: "center",
    justifyContent: "center",
  },

  modalCancelText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#111827",
  },

  logoutActions: {
    flexDirection: "row",
    gap: 12,
  },

  cancelBtn: {
    flex: 1,

    height: 46,
    borderRadius: 16,

    backgroundColor: "#F3F4F6",

    alignItems: "center",
    justifyContent: "center",
  },

  cancelBtnText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#111827",
  },

  logoutBtn: {
    flex: 1,

    height: 46,
    borderRadius: 16,

    backgroundColor: "#EF4444",

    alignItems: "center",
    justifyContent: "center",
  },

  logoutBtnText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#FFFFFF",
  },
});
