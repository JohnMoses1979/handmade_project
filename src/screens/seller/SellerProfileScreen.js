

// // // import React from "react";
// // // import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Platform } from "react-native";
// // // import { Ionicons } from "@expo/vector-icons";

// // // const C = { primary:"#082843", white:"#fff", bg:"#fff", text:"#111827", muted:"#6B7280", border:"#F3D6E2", soft:"#FFFFFF", success:"#22C55E", danger:"#EF4444" };

// // // const rows = [
// // //   { title:"Bank Details", icon:"card-outline", right:"" },
// // //   { title:"Documents", icon:"document-text-outline", right:"4/4 Uploaded" },
// // //   { title:"My Store", icon:"storefront-outline", right:"" },
// // //   { title:"Settings", icon:"settings-outline", right:"" },
// // //   { title:"Help & Support", icon:"help-circle-outline", right:"" },
// // // ];

// // // export default function SellerProfileScreen({ navigation }) {
// // //   return (
// // //     <View style={styles.root}>
// // //       <StatusBar barStyle="dark-content" backgroundColor={C.white} />
// // //       <View style={styles.header}>
// // //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}><Ionicons name="chevron-back" size={24} color={C.text} /></TouchableOpacity>
// // //         <Text style={styles.headerTitle}>Profile</Text>
// // //         <TouchableOpacity style={styles.iconBtn}><Ionicons name="create-outline" size={22} color={C.text} /></TouchableOpacity>
// // //       </View>

// // //       <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
// // //         <View style={styles.profileCard}>
// // //           <View style={styles.avatar}><Text style={styles.avatarText}>PS</Text></View>
// // //           <View style={{ flex:1 }}>
// // //             <Text style={styles.name}>Priya Sharma</Text>
// // //             <Text style={styles.email}>priya.seller@email.com</Text>
// // //             <Text style={styles.phone}>9876543210</Text>
// // //             <View style={styles.verifyRow}><Ionicons name="checkmark-circle" size={15} color={C.success} /><Text style={styles.verifyText}>Verified Seller</Text></View>
// // //           </View>
// // //           <Ionicons name="chevron-forward" size={22} color={C.muted} />
// // //         </View>

// // //         {rows.map((r) => (
// // //           <TouchableOpacity key={r.title} style={styles.row} activeOpacity={0.85}>
// // //             <View style={styles.rowIcon}><Ionicons name={r.icon} size={20} color={C.primary} /></View>
// // //             <Text style={styles.rowTitle}>{r.title}</Text>
// // //             {r.right ? <Text style={styles.rowRight}>{r.right}</Text> : null}
// // //             <Ionicons name="chevron-forward" size={19} color={C.muted} />
// // //           </TouchableOpacity>
// // //         ))}

// // //         <TouchableOpacity style={styles.logout} onPress={() => navigation.replace("RoleSelectionScreen")}>
// // //           <Ionicons name="log-out-outline" size={20} color={C.danger} />
// // //           <Text style={styles.logoutText}>Logout</Text>
// // //         </TouchableOpacity>
// // //       </ScrollView>
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   root:{ flex:1, backgroundColor:C.bg },
// // //   header:{ paddingTop:Platform.OS==="android"?38:54, paddingHorizontal:16, paddingBottom:12, flexDirection:"row", alignItems:"center", justifyContent:"space-between" },
// // //   iconBtn:{ width:42, height:42, borderRadius:21, alignItems:"center", justifyContent:"center", backgroundColor:C.soft },
// // //   headerTitle:{ fontSize:18, fontWeight:"900", color:C.text },
// // //   content:{ padding:18, paddingBottom:100 },
// // //   profileCard:{ flexDirection:"row", alignItems:"center", padding:16, borderRadius:22, backgroundColor:"#FFFFFF", borderWidth:1, borderColor:C.border, marginBottom:18 },
// // //   avatar:{ width:74, height:74, borderRadius:37, backgroundColor:C.primary, alignItems:"center", justifyContent:"center", marginRight:14 },
// // //   avatarText:{ color:C.white, fontSize:24, fontWeight:"900" },
// // //   name:{ fontSize:18, fontWeight:"900", color:C.text },
// // //   email:{ fontSize:13, color:C.muted, marginTop:4 },
// // //   phone:{ fontSize:13, color:C.muted, marginTop:3 },
// // //   verifyRow:{ flexDirection:"row", alignItems:"center", marginTop:6 },
// // //   verifyText:{ marginLeft:5, fontSize:12, color:C.success, fontWeight:"800" },
// // //   row:{ height:62, borderBottomWidth:1, borderBottomColor:"#F3E5EC", flexDirection:"row", alignItems:"center" },
// // //   rowIcon:{ width:38, height:38, borderRadius:14, backgroundColor:C.soft, alignItems:"center", justifyContent:"center", marginRight:12 },
// // //   rowTitle:{ flex:1, fontSize:14, fontWeight:"800", color:C.text },
// // //   rowRight:{ fontSize:12, color:C.muted, marginRight:8, fontWeight:"700" },
// // //   logout:{ flexDirection:"row", alignItems:"center", marginTop:26, paddingVertical:14 },
// // //   logoutText:{ marginLeft:8, color:C.danger, fontSize:15, fontWeight:"900" },
// // // });

















// import React from "react";
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Platform } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// const C = { 
//   primary: "#082843", 
//   white: "#fff", 
//   bg: "#fff", 
//   text: "#111827", 
//   muted: "#6B7280", 
//   border: "#F3D6E2", 
//   soft: "#FFFFFF", 
//   success: "#22C55E", 
//   danger: "#EF4444" 
// };

// const rows = [
//   { title: "Bank Details", icon: "card-outline", right: "", screen: "BankDetailsScreen" },
//   { title: "Documents", icon: "document-text-outline", right: "4/4 Uploaded", screen: "DocumentsScreen" },
//   { title: "My Store", icon: "storefront-outline", right: "", screen: "StoreScreen" },
//   { title: "Settings", icon: "settings-outline", right: "", screen: "SettingsScreen" },
//   { title: "Help & Support", icon: "help-circle-outline", right: "", screen: "HelpSupportScreen" },
// ];

// export default function SellerProfileScreen({ navigation }) {
//   return (
//     <View style={styles.root}>
//       <StatusBar barStyle="dark-content" backgroundColor={C.white} />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
//           <Ionicons name="chevron-back" size={24} color={C.text} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Profile</Text>
//         <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate("EditProfileScreen")}>
//           <Ionicons name="create-outline" size={22} color={C.text} />
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
//         {/* Profile Card */}
//         <View style={styles.profileCard}>
//           <View style={styles.avatar}><Text style={styles.avatarText}>PS</Text></View>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.name}>Priya Sharma</Text>
//             <Text style={styles.email}>priya.seller@email.com</Text>
//             <Text style={styles.phone}>9876543210</Text>
//             <View style={styles.verifyRow}>
//               <Ionicons name="checkmark-circle" size={15} color={C.success} />
//               <Text style={styles.verifyText}>Verified Seller</Text>
//             </View>
//           </View>
//           <Ionicons name="chevron-forward" size={22} color={C.muted} />
//         </View>

//         {/* Menu Rows */}
//         {rows.map((r) => (
//           <TouchableOpacity 
//             key={r.title} 
//             style={styles.row} 
//             activeOpacity={0.85} 
//             onPress={() => navigation.navigate(r.screen)} // Navigate to respective screen
//           >
//             <View style={styles.rowIcon}>
//               <Ionicons name={r.icon} size={20} color={C.primary} />
//             </View>
//             <Text style={styles.rowTitle}>{r.title}</Text>
//             {r.right ? <Text style={styles.rowRight}>{r.right}</Text> : null}
//             <Ionicons name="chevron-forward" size={19} color={C.muted} />
//           </TouchableOpacity>
//         ))}

//         {/* Logout Button */}
//         <TouchableOpacity 
//           style={styles.logout} 
//           onPress={() => navigation.replace("RoleSelectionScreen")}
//         >
//           <Ionicons name="log-out-outline" size={20} color={C.danger} />
//           <Text style={styles.logoutText}>Logout</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: C.bg },
//   header: { 
//     paddingTop: Platform.OS === "android" ? 38 : 54, 
//     paddingHorizontal: 16, 
//     paddingBottom: 12, 
//     flexDirection: "row", 
//     alignItems: "center", 
//     justifyContent: "space-between" 
//   },
//   iconBtn: { 
//     width: 42, 
//     height: 42, 
//     borderRadius: 21, 
//     alignItems: "center", 
//     justifyContent: "center", 
//     backgroundColor: C.soft 
//   },
//   headerTitle: { 
//     fontSize: 18, 
//     fontWeight: "900", 
//     color: C.text 
//   },
//   content: { padding: 18, paddingBottom: 100 },
//   profileCard: { 
//     flexDirection: "row", 
//     alignItems: "center", 
//     padding: 16, 
//     borderRadius: 22, 
//     backgroundColor: "#FFFFFF", 
//     borderWidth: 1, 
//     borderColor: C.border, 
//     marginBottom: 18 
//   },
//   avatar: { 
//     width: 74, 
//     height: 74, 
//     borderRadius: 37, 
//     backgroundColor: C.primary, 
//     alignItems: "center", 
//     justifyContent: "center", 
//     marginRight: 14 
//   },
//   avatarText: { 
//     color: C.white, 
//     fontSize: 24, 
//     fontWeight: "900" 
//   },
//   name: { 
//     fontSize: 18, 
//     fontWeight: "900", 
//     color: C.text 
//   },
//   email: { 
//     fontSize: 13, 
//     color: C.muted, 
//     marginTop: 4 
//   },
//   phone: { 
//     fontSize: 13, 
//     color: C.muted, 
//     marginTop: 3 
//   },
//   verifyRow: { 
//     flexDirection: "row", 
//     alignItems: "center", 
//     marginTop: 6 
//   },
//   verifyText: { 
//     marginLeft: 5, 
//     fontSize: 12, 
//     color: C.success, 
//     fontWeight: "800" 
//   },
//   row: { 
//     height: 62, 
//     borderBottomWidth: 1, 
//     borderBottomColor: "#F3E5EC", 
//     flexDirection: "row", 
//     alignItems: "center" 
//   },
//   rowIcon: { 
//     width: 38, 
//     height: 38, 
//     borderRadius: 14, 
//     backgroundColor: C.soft, 
//     alignItems: "center", 
//     justifyContent: "center", 
//     marginRight: 12 
//   },
//   rowTitle: { 
//     flex: 1, 
//     fontSize: 14, 
//     fontWeight: "800", 
//     color: C.text 
//   },
//   rowRight: { 
//     fontSize: 12, 
//     color: C.muted, 
//     marginRight: 8, 
//     fontWeight: "700" 
//   },
//   logout: { 
//     flexDirection: "row", 
//     alignItems: "center", 
//     marginTop: 26, 
//     paddingVertical: 14 
//   },
//   logoutText: { 
//     marginLeft: 8, 
//     color: C.danger, 
//     fontSize: 15, 
//     fontWeight: "900" 
//   },
// });



































// src/screens/seller/SellerProfileScreen.js
// ✅ UPDATED — Removed Bank Details & Documents; kept My Store, Settings, Help & Support

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useShop } from "../../context/ShopContext";

const C = {
  primary: "#082843",
  white: "#fff",
  bg: "#F8FAFC",
  text: "#111827",
  muted: "#6B7280",
  border: "#E2E8F0",
  success: "#22C55E",
  danger: "#EF4444",
  card: "#FFFFFF",
};

const MENU_ROWS = [
  {
    title: "My Store",
    icon: "storefront-outline",
    iconColor: "#082843",
    iconBg: "#EFF6FF",
    sub: "Manage your store details",
    screen: "SellerMyStoreScreen",
  },
  {
    title: "Settings",
    icon: "settings-outline",
    iconColor: "#7C3AED",
    iconBg: "#F5F3FF",
    sub: "App preferences & account",
    screen: "SellerSettingsScreen",
  },
  {
    title: "Help & Support",
    icon: "help-circle-outline",
    iconColor: "#0EA5E9",
    iconBg: "#F0F9FF",
    sub: "FAQs, chat & contact us",
    screen: "SellerHelpSupportScreen",
  },
];

export default function SellerProfileScreen({ navigation }) {
  const { currentSeller, sellerStats } = useShop();

  const seller = currentSeller || {
    name: "Priya Sharma",
    shopName: "Priya's Boutique",
    email: "priya.seller@email.com",
    phone: "9876543210",
  };

  const initials = seller.name
    ? seller.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "PS";

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      {/* ── Header Gradient ── */}
      <LinearGradient colors={[C.primary, "#0D3A5C"]} style={styles.headerGrad}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={24} color={C.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 42 }} />
        </View>

        {/* Avatar + Info */}
        <View style={styles.profileHero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.sellerName}>{seller.name}</Text>
          <Text style={styles.sellerShop}>{seller.shopName || "My Shop"}</Text>
          <View style={styles.verifyBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#4ADE80" />
            <Text style={styles.verifyText}>Verified Seller</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{sellerStats?.liveProducts ?? 2}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{sellerStats?.totalOrders ?? 1}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              ₹{((sellerStats?.totalEarnings ?? 0) / 1000).toFixed(1)}K
            </Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ── Contact Info Card ── */}
        <View style={styles.contactCard}>
          <View style={styles.contactRow}>
            <View style={styles.contactIcon}>
              <Ionicons name="mail-outline" size={18} color={C.primary} />
            </View>
            <View>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{seller.email || "—"}</Text>
            </View>
          </View>
          <View style={styles.contactDivider} />
          <View style={styles.contactRow}>
            <View style={styles.contactIcon}>
              <Ionicons name="call-outline" size={18} color={C.primary} />
            </View>
            <View>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>{seller.phone || "—"}</Text>
            </View>
          </View>
        </View>

        {/* ── Menu Section ── */}
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.menuCard}>
          {MENU_ROWS.map((row, idx) => (
            <TouchableOpacity
              key={row.title}
              style={[
                styles.menuRow,
                idx < MENU_ROWS.length - 1 && styles.menuRowBorder,
              ]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate(row.screen)}
            >
              <View style={[styles.menuIcon, { backgroundColor: row.iconBg }]}>
                <Ionicons name={row.icon} size={20} color={row.iconColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuTitle}>{row.title}</Text>
                <Text style={styles.menuSub}>{row.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={C.muted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Logout ── */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => navigation.replace("RoleSelectionScreen")}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={20} color={C.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  headerGrad: {
    paddingTop: Platform.OS === "android" ? 38 : 54,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  iconBtn: {
    width: 42, height: 42, borderRadius: 21,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  headerTitle: { fontSize: 18, fontWeight: "900", color: C.white },

  profileHero: { alignItems: "center", marginBottom: 20 },

  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
    borderWidth: 3, borderColor: "rgba(255,255,255,0.4)",
    marginBottom: 12,
  },

  avatarText: { fontSize: 28, fontWeight: "900", color: C.white },

  sellerName: { fontSize: 22, fontWeight: "900", color: C.white, marginBottom: 4 },

  sellerShop: { fontSize: 14, fontWeight: "700", color: "rgba(255,255,255,0.7)", marginBottom: 10 },

  verifyBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 99,
  },

  verifyText: { fontSize: 12, fontWeight: "800", color: "#4ADE80" },

  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 16, padding: 16,
  },

  statItem: { flex: 1, alignItems: "center" },

  statValue: { fontSize: 20, fontWeight: "900", color: C.white, marginBottom: 3 },

  statLabel: { fontSize: 11, fontWeight: "700", color: "rgba(255,255,255,0.65)" },

  statDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.2)", marginHorizontal: 8 },

  content: { padding: 16, paddingBottom: 40 },

  contactCard: {
    backgroundColor: C.card, borderRadius: 20,
    borderWidth: 1, borderColor: C.border,
    padding: 16, marginBottom: 20,
    elevation: 1, shadowColor: "#000", shadowOpacity: 0.04,
    shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },

  contactRow: { flexDirection: "row", alignItems: "center", gap: 14 },

  contactIcon: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: "#EFF6FF", alignItems: "center", justifyContent: "center",
  },

  contactLabel: { fontSize: 11, color: C.muted, fontWeight: "700", marginBottom: 2 },

  contactValue: { fontSize: 14, fontWeight: "800", color: C.text },

  contactDivider: { height: 1, backgroundColor: C.border, marginVertical: 12 },

  sectionLabel: {
    fontSize: 13, fontWeight: "900", color: C.muted,
    marginBottom: 10, marginLeft: 4, textTransform: "uppercase", letterSpacing: 0.8,
  },

  menuCard: {
    backgroundColor: C.card, borderRadius: 20,
    borderWidth: 1, borderColor: C.border,
    overflow: "hidden", marginBottom: 20,
    elevation: 1, shadowColor: "#000", shadowOpacity: 0.04,
    shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },

  menuRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 16, gap: 14,
  },

  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },

  menuIcon: {
    width: 42, height: 42, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
  },

  menuTitle: { fontSize: 15, fontWeight: "800", color: C.text, marginBottom: 2 },

  menuSub: { fontSize: 12, fontWeight: "600", color: C.muted },

  logoutBtn: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 8,
    paddingVertical: 16, borderRadius: 16,
    borderWidth: 1.5, borderColor: "#FEE2E2",
    backgroundColor: "#FFF5F5", marginBottom: 16,
  },

  logoutText: { fontSize: 15, fontWeight: "900", color: C.danger },

  version: {
    textAlign: "center", fontSize: 12,
    color: C.muted, fontWeight: "700",
  },
});