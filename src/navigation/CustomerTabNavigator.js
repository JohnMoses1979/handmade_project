
// // src/navigation/CustomerTabNavigator.js

// import React from "react";
// import { View, Text, StyleSheet, Platform } from "react-native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { Ionicons } from "@expo/vector-icons";
// import { useShop } from "../context/ShopContext";

// import CustomerHomeScreen from "../screens/customer/CustomerHomeScreen";
// import AllCategoriesScreen from "../screens/customer/AllCategoriesScreen"; // ✅ NEW
// import ProductListScreen from "../screens/customer/CustomerProductListScreen";
// import ProductDetailsScreen from "../screens/customer/CustomerProductDetailsScreen";
// import CartScreen from "../screens/customer/CartScreen";
// import CheckoutScreen from "../screens/customer/CheckoutScreen";
// import WishlistScreen from "../screens/customer/CustomerWishlistScreen";
// import CustomerProfileScreen from "../screens/customer/CustomerProfileScreen";
// import MyOrdersScreen from "../screens/customer/CustomerMyOrdersScreen";
// import OrderDetailScreen from "../screens/customer/CustomerOrderDetailScreen";
// import CustomerSavedAddressScreen from "../screens/customer/CustomerSavedAddressScreen";
// import CustomerChatSupportScreen from "../screens/customer/CustomerChatSupportScreen";

// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

// // ─── Shared stack screens reused across stacks ────────────────────────────────
// function CommonCustomerScreens() {
//   return (
//     <>
//       <Stack.Screen name="ProductList"          component={ProductListScreen} />
//       <Stack.Screen name="ProductDetails"       component={ProductDetailsScreen} />
//       <Stack.Screen name="Checkout"             component={CheckoutScreen} />
//       <Stack.Screen name="OrderDetail"          component={OrderDetailScreen} />
//       <Stack.Screen name="MyOrders"             component={MyOrdersScreen} />
//       <Stack.Screen name="CustomerSavedAddress" component={CustomerSavedAddressScreen} />
//       <Stack.Screen name="CustomerChatSupport"  component={CustomerChatSupportScreen} />
//     </>
//   );
// }

// // ─── Home Stack ───────────────────────────────────────────────────────────────
// function HomeStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="CustomerHomeMain"     component={CustomerHomeScreen} />
//       {/* ✅ FIX: AllCategoriesScreen registered here so "View All" works from HomeStack */}
//       <Stack.Screen name="AllCategoriesScreen"  component={AllCategoriesScreen} />
//       <Stack.Screen name="ProductDetails"       component={ProductDetailsScreen} />
//       <Stack.Screen name="Checkout"             component={CheckoutScreen} />
//       <Stack.Screen name="OrderDetail"          component={OrderDetailScreen} />
//       <Stack.Screen name="MyOrders"             component={MyOrdersScreen} />
//       <Stack.Screen name="CustomerSavedAddress" component={CustomerSavedAddressScreen} />
//       <Stack.Screen name="CustomerChatSupport"  component={CustomerChatSupportScreen} />
//     </Stack.Navigator>
//   );
// }

// // ─── Shop Stack ───────────────────────────────────────────────────────────────
// function ShopStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen
//         name="CustomerShopMain"
//         component={ProductListScreen}
//         initialParams={{ category: "All" }}
//       />
//       <Stack.Screen name="ProductDetails"       component={ProductDetailsScreen} />
//       <Stack.Screen name="Checkout"             component={CheckoutScreen} />
//       <Stack.Screen name="OrderDetail"          component={OrderDetailScreen} />
//       <Stack.Screen name="MyOrders"             component={MyOrdersScreen} />
//       <Stack.Screen name="CustomerSavedAddress" component={CustomerSavedAddressScreen} />
//       <Stack.Screen name="CustomerChatSupport"  component={CustomerChatSupportScreen} />
//     </Stack.Navigator>
//   );
// }

// // ─── Cart Stack ───────────────────────────────────────────────────────────────
// function CartStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="CustomerCartMain" component={CartScreen} />
//       {CommonCustomerScreens()}
//     </Stack.Navigator>
//   );
// }

// // ─── Wishlist Stack ───────────────────────────────────────────────────────────
// function WishlistStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="CustomerWishlistMain" component={WishlistScreen} />
//       {CommonCustomerScreens()}
//     </Stack.Navigator>
//   );
// }

// // ─── Profile Stack ────────────────────────────────────────────────────────────
// function ProfileStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="CustomerProfileMain" component={CustomerProfileScreen} />
//       {CommonCustomerScreens()}
//     </Stack.Navigator>
//   );
// }

// // ─── Tab Navigator ────────────────────────────────────────────────────────────
// export default function CustomerTabNavigator() {
//   const { cartCount = 0, wishlistCount = 0 } = useShop();

//   return (
//     <Tab.Navigator
//       initialRouteName="HomeTab"
//       screenOptions={{
//         headerShown: false,
//         tabBarShowLabel: false,
//         tabBarHideOnKeyboard: true,
//         tabBarStyle: styles.tabBar,
//       }}
//     >
//       <Tab.Screen
//         name="HomeTab"
//         component={HomeStack}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon icon={focused ? "home" : "home-outline"} label="Home" focused={focused} />
//           ),
//         }}
//       />

//       <Tab.Screen
//         name="ShopTab"
//         component={ShopStack}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon icon={focused ? "grid" : "grid-outline"} label="Shop" focused={focused} />
//           ),
//         }}
//       />

//       <Tab.Screen
//         name="CartTab"
//         component={CartStack}
//         options={{
//           tabBarIcon: () => (
//             <View style={styles.centerButton}>
//               <Ionicons name="cart" size={29} color="#FFFFFF" />
//               {cartCount > 0 && (
//                 <View style={styles.badge}>
//                   <Text style={styles.badgeText}>
//                     {cartCount > 99 ? "99+" : cartCount}
//                   </Text>
//                 </View>
//               )}
//             </View>
//           ),
//         }}
//       />

//       <Tab.Screen
//         name="WishlistTab"
//         component={WishlistStack}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               icon={focused ? "heart" : "heart-outline"}
//               label="Wishlist"
//               focused={focused}
//               badgeCount={wishlistCount}
//             />
//           ),
//         }}
//       />

//       <Tab.Screen
//         name="ProfileTab"
//         component={ProfileStack}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon icon={focused ? "person" : "person-outline"} label="Profile" focused={focused} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// // ─── TabIcon ──────────────────────────────────────────────────────────────────
// function TabIcon({ icon, label, focused, badgeCount = 0 }) {
//   return (
//     <View style={styles.tabItem}>
//       <View style={focused ? styles.activeCircle : styles.inactiveCircle}>
//         <Ionicons name={icon} size={24} color={focused ? "#FFFFFF" : "#6B7280"} />
//         {badgeCount > 0 && (
//           <View style={styles.smallBadge}>
//             <Text style={styles.smallBadgeText}>
//               {badgeCount > 99 ? "99+" : badgeCount}
//             </Text>
//           </View>
//         )}
//       </View>
//       <Text style={[styles.tabText, focused && styles.activeText]}>{label}</Text>
//     </View>
//   );
// }

// // ─── Styles ───────────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   tabBar: {
//     position: "absolute",
//     left: 14, right: 14, bottom: 14,
//     height: 76, borderRadius: 28,
//     backgroundColor: "#FFFFFF",
//     borderTopWidth: 0,
//     elevation: 14,
//     shadowColor: "#082843", shadowOpacity: 0.18,
//     shadowRadius: 16, shadowOffset: { width: 0, height: 8 },
//     paddingTop: 8,
//     paddingBottom: Platform.OS === "ios" ? 16 : 8,
//   },
//   tabItem: { alignItems: "center", justifyContent: "center", minWidth: 58 },
//   activeCircle: {
//     width: 36, height: 36, borderRadius: 18,
//     backgroundColor: "#082843",
//     alignItems: "center", justifyContent: "center", marginBottom: 2,
//   },
//   inactiveCircle: {
//     width: 36, height: 36, borderRadius: 18,
//     alignItems: "center", justifyContent: "center", marginBottom: 2,
//   },
//   tabText: { fontSize: 10.5, color: "#6B7280", fontWeight: "700", marginTop: 3 },
//   activeText: { color: "#082843", fontWeight: "900" },
//   centerButton: {
//     width: 64, height: 64, borderRadius: 32,
//     backgroundColor: "#082843",
//     alignItems: "center", justifyContent: "center",
//     marginTop: -34,
//     elevation: 16,
//     shadowColor: "#082843", shadowOpacity: 0.35,
//     shadowRadius: 16, shadowOffset: { width: 0, height: 8 },
//     borderWidth: 5, borderColor: "#FFF8F2",
//   },
//   badge: {
//     position: "absolute", top: -3, right: -3,
//     backgroundColor: "#111827",
//     minWidth: 21, height: 21, borderRadius: 11,
//     paddingHorizontal: 4,
//     alignItems: "center", justifyContent: "center",
//     borderWidth: 2, borderColor: "#FFFFFF",
//   },
//   badgeText: { color: "#FFFFFF", fontSize: 10, fontWeight: "900" },
//   smallBadge: {
//     position: "absolute", top: -7, right: -7,
//     backgroundColor: "#111827",
//     minWidth: 18, height: 18, borderRadius: 9,
//     paddingHorizontal: 4,
//     alignItems: "center", justifyContent: "center",
//     borderWidth: 1.5, borderColor: "#FFFFFF",
//   },
//   smallBadgeText: { color: "#FFFFFF", fontSize: 9, fontWeight: "900" },
// });



























// // src/navigation/CustomerTabNavigator.js

// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Platform,
// } from "react-native";

// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import { Ionicons } from "@expo/vector-icons";

// import { useShop } from "../context/ShopContext";

// import CustomerHomeScreen from "../screens/customer/CustomerHomeScreen";
// import AllCategoriesScreen from "../screens/customer/AllCategoriesScreen";
// import ProductListScreen from "../screens/customer/CustomerProductListScreen";
// import ProductDetailsScreen from "../screens/customer/CustomerProductDetailsScreen";
// import CartScreen from "../screens/customer/CartScreen";
// import CheckoutScreen from "../screens/customer/CheckoutScreen";
// import WishlistScreen from "../screens/customer/CustomerWishlistScreen";
// import CustomerProfileScreen from "../screens/customer/CustomerProfileScreen";
// import CustomerEditProfile from "../screens/customer/CustomerEditProfile";
// import MyOrdersScreen from "../screens/customer/CustomerMyOrdersScreen";
// import OrderDetailScreen from "../screens/customer/CustomerOrderDetailScreen";
// import CustomerSavedAddressScreen from "../screens/customer/CustomerSavedAddressScreen";
// import CustomerChatSupportScreen from "../screens/customer/CustomerChatSupportScreen";

// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

// /* ───────────────── COMMON STACK SCREENS ───────────────── */
// function CommonCustomerScreens() {
//   return (
//     <>
//       <Stack.Screen
//         name="ProductList"
//         component={ProductListScreen}
//       />

//       <Stack.Screen
//         name="ProductDetails"
//         component={ProductDetailsScreen}
//       />

//       <Stack.Screen
//         name="Checkout"
//         component={CheckoutScreen}
//       />

//       <Stack.Screen
//         name="OrderDetail"
//         component={OrderDetailScreen}
//       />

//       <Stack.Screen
//         name="MyOrders"
//         component={MyOrdersScreen}
//       />

//       <Stack.Screen
//         name="CustomerSavedAddress"
//         component={CustomerSavedAddressScreen}
//       />

//       <Stack.Screen
//         name="CustomerChatSupport"
//         component={CustomerChatSupportScreen}
//       />

//       {/* ✅ FIX */}
//       <Stack.Screen
//         name="CustomerEditProfile"
//         component={CustomerEditProfile}
//       />
//     </>
//   );
// }

// /* ───────────────── HOME STACK ───────────────── */
// function HomeStack() {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       <Stack.Screen
//         name="CustomerHomeMain"
//         component={CustomerHomeScreen}
//       />

//       <Stack.Screen
//         name="AllCategoriesScreen"
//         component={AllCategoriesScreen}
//       />

//       <Stack.Screen
//         name="ProductDetails"
//         component={ProductDetailsScreen}
//       />

//       <Stack.Screen
//         name="Checkout"
//         component={CheckoutScreen}
//       />

//       <Stack.Screen
//         name="OrderDetail"
//         component={OrderDetailScreen}
//       />

//       <Stack.Screen
//         name="MyOrders"
//         component={MyOrdersScreen}
//       />

//       <Stack.Screen
//         name="CustomerSavedAddress"
//         component={CustomerSavedAddressScreen}
//       />

//       <Stack.Screen
//         name="CustomerChatSupport"
//         component={CustomerChatSupportScreen}
//       />

//       {/* ✅ FIX */}
//       <Stack.Screen
//         name="CustomerEditProfile"
//         component={CustomerEditProfile}
//       />
//     </Stack.Navigator>
//   );
// }

// /* ───────────────── SHOP STACK ───────────────── */
// function ShopStack() {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       <Stack.Screen
//         name="CustomerShopMain"
//         component={ProductListScreen}
//         initialParams={{
//           category: "All",
//         }}
//       />

//       <Stack.Screen
//         name="ProductDetails"
//         component={ProductDetailsScreen}
//       />

//       <Stack.Screen
//         name="Checkout"
//         component={CheckoutScreen}
//       />

//       <Stack.Screen
//         name="OrderDetail"
//         component={OrderDetailScreen}
//       />

//       <Stack.Screen
//         name="MyOrders"
//         component={MyOrdersScreen}
//       />

//       <Stack.Screen
//         name="CustomerSavedAddress"
//         component={CustomerSavedAddressScreen}
//       />

//       <Stack.Screen
//         name="CustomerChatSupport"
//         component={CustomerChatSupportScreen}
//       />

//       {/* ✅ FIX */}
//       <Stack.Screen
//         name="CustomerEditProfile"
//         component={CustomerEditProfile}
//       />
//     </Stack.Navigator>
//   );
// }

// /* ───────────────── CART STACK ───────────────── */
// function CartStack() {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       <Stack.Screen
//         name="CustomerCartMain"
//         component={CartScreen}
//       />

//       {CommonCustomerScreens()}
//     </Stack.Navigator>
//   );
// }

// /* ───────────────── WISHLIST STACK ───────────────── */
// function WishlistStack() {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       <Stack.Screen
//         name="CustomerWishlistMain"
//         component={WishlistScreen}
//       />

//       {CommonCustomerScreens()}
//     </Stack.Navigator>
//   );
// }

// /* ───────────────── PROFILE STACK ───────────────── */
// function ProfileStack() {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       <Stack.Screen
//         name="CustomerProfile"
//         component={CustomerProfileScreen}
//       />

//       {/* ✅ FIX */}
//       <Stack.Screen
//         name="CustomerEditProfile"
//         component={CustomerEditProfile}
//       />

//       {CommonCustomerScreens()}
//     </Stack.Navigator>
//   );
// }

// /* ───────────────── TAB NAVIGATOR ───────────────── */
// export default function CustomerTabNavigator() {
//   const {
//     cartCount = 0,
//     wishlistCount = 0,
//   } = useShop();

//   return (
//     <Tab.Navigator
//       initialRouteName="HomeTab"
//       screenOptions={{
//         headerShown: false,
//         tabBarShowLabel: false,
//         tabBarHideOnKeyboard: true,
//         tabBarStyle: styles.tabBar,
//       }}
//     >
//       {/* HOME */}
//       <Tab.Screen
//         name="HomeTab"
//         component={HomeStack}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               icon={
//                 focused
//                   ? "home"
//                   : "home-outline"
//               }
//               label="Home"
//               focused={focused}
//             />
//           ),
//         }}
//       />

//       {/* SHOP */}
//       <Tab.Screen
//         name="ShopTab"
//         component={ShopStack}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               icon={
//                 focused
//                   ? "grid"
//                   : "grid-outline"
//               }
//               label="Shop"
//               focused={focused}
//             />
//           ),
//         }}
//       />

//       {/* CART */}
//       <Tab.Screen
//         name="CartTab"
//         component={CartStack}
//         options={{
//           tabBarIcon: () => (
//             <View style={styles.centerButton}>
//               <Ionicons
//                 name="cart"
//                 size={29}
//                 color="#FFFFFF"
//               />

//               {cartCount > 0 && (
//                 <View style={styles.badge}>
//                   <Text style={styles.badgeText}>
//                     {cartCount > 99
//                       ? "99+"
//                       : cartCount}
//                   </Text>
//                 </View>
//               )}
//             </View>
//           ),
//         }}
//       />

//       {/* WISHLIST */}
//       <Tab.Screen
//         name="WishlistTab"
//         component={WishlistStack}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               icon={
//                 focused
//                   ? "heart"
//                   : "heart-outline"
//               }
//               label="Wishlist"
//               focused={focused}
//               badgeCount={wishlistCount}
//             />
//           ),
//         }}
//       />

//       {/* PROFILE */}
//       <Tab.Screen
//         name="ProfileTab"
//         component={ProfileStack}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               icon={
//                 focused
//                   ? "person"
//                   : "person-outline"
//               }
//               label="Profile"
//               focused={focused}
//             />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// /* ───────────────── TAB ICON ───────────────── */
// function TabIcon({
//   icon,
//   label,
//   focused,
//   badgeCount = 0,
// }) {
//   return (
//     <View style={styles.tabItem}>
//       <View
//         style={
//           focused
//             ? styles.activeCircle
//             : styles.inactiveCircle
//         }
//       >
//         <Ionicons
//           name={icon}
//           size={24}
//           color={
//             focused
//               ? "#FFFFFF"
//               : "#6B7280"
//           }
//         />

//         {badgeCount > 0 && (
//           <View style={styles.smallBadge}>
//             <Text
//               style={styles.smallBadgeText}
//             >
//               {badgeCount > 99
//                 ? "99+"
//                 : badgeCount}
//             </Text>
//           </View>
//         )}
//       </View>

//       <Text
//         style={[
//           styles.tabText,
//           focused && styles.activeText,
//         ]}
//       >
//         {label}
//       </Text>
//     </View>
//   );
// }

// /* ───────────────── STYLES ───────────────── */
// const styles = StyleSheet.create({
//   tabBar: {
//     position: "absolute",

//     left: 14,
//     right: 14,
//     bottom: 14,

//     height: 76,

//     borderRadius: 28,

//     backgroundColor: "#FFFFFF",

//     borderTopWidth: 0,

//     elevation: 14,

//     shadowColor: "#082843",
//     shadowOpacity: 0.18,
//     shadowRadius: 16,

//     shadowOffset: {
//       width: 0,
//       height: 8,
//     },

//     paddingTop: 8,

//     paddingBottom:
//       Platform.OS === "ios"
//         ? 16
//         : 8,
//   },

//   tabItem: {
//     alignItems: "center",
//     justifyContent: "center",
//     minWidth: 58,
//   },

//   activeCircle: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,

//     backgroundColor: "#082843",

//     alignItems: "center",
//     justifyContent: "center",

//     marginBottom: 2,
//   },

//   inactiveCircle: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,

//     alignItems: "center",
//     justifyContent: "center",

//     marginBottom: 2,
//   },

//   tabText: {
//     fontSize: 10.5,
//     color: "#6B7280",
//     fontWeight: "700",
//     marginTop: 3,
//   },

//   activeText: {
//     color: "#082843",
//     fontWeight: "900",
//   },

//   centerButton: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,

//     backgroundColor: "#082843",

//     alignItems: "center",
//     justifyContent: "center",

//     marginTop: -34,

//     elevation: 16,

//     shadowColor: "#082843",
//     shadowOpacity: 0.35,
//     shadowRadius: 16,

//     shadowOffset: {
//       width: 0,
//       height: 8,
//     },

//     borderWidth: 5,
//     borderColor: "#FFF8F2",
//   },

//   badge: {
//     position: "absolute",
//     top: -3,
//     right: -3,

//     backgroundColor: "#111827",

//     minWidth: 21,
//     height: 21,
//     borderRadius: 11,

//     paddingHorizontal: 4,

//     alignItems: "center",
//     justifyContent: "center",

//     borderWidth: 2,
//     borderColor: "#FFFFFF",
//   },

//   badgeText: {
//     color: "#FFFFFF",
//     fontSize: 10,
//     fontWeight: "900",
//   },

//   smallBadge: {
//     position: "absolute",
//     top: -7,
//     right: -7,

//     backgroundColor: "#111827",

//     minWidth: 18,
//     height: 18,
//     borderRadius: 9,

//     paddingHorizontal: 4,

//     alignItems: "center",
//     justifyContent: "center",

//     borderWidth: 1.5,
//     borderColor: "#FFFFFF",
//   },

//   smallBadgeText: {
//     color: "#FFFFFF",
//     fontSize: 9,
//     fontWeight: "900",
//   },
// });
























// src/navigation/CustomerTabNavigator.js

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Ionicons } from "@expo/vector-icons";

import { useShop } from "../context/ShopContext";

import CustomerHomeScreen from "../screens/customer/CustomerHomeScreen";
import AllCategoriesScreen from "../screens/customer/AllCategoriesScreen";
import ProductListScreen from "../screens/customer/CustomerProductListScreen";
import ProductDetailsScreen from "../screens/customer/CustomerProductDetailsScreen";
import CartScreen from "../screens/customer/CartScreen";
import CheckoutScreen from "../screens/customer/CheckoutScreen";
import WishlistScreen from "../screens/customer/CustomerWishlistScreen";
import CustomerProfileScreen from "../screens/customer/CustomerProfileScreen";
import CustomerEditProfile from "../screens/customer/CustomerEditProfile";
import MyOrdersScreen from "../screens/customer/CustomerMyOrdersScreen";
import OrderDetailScreen from "../screens/customer/CustomerOrderDetailScreen";
import CustomerSavedAddressScreen from "../screens/customer/CustomerSavedAddressScreen";
import CustomerChatSupportScreen from "../screens/customer/CustomerChatSupportScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/* ───────────────── COMMON SCREENS ───────────────── */
function CommonCustomerScreens() {
  return (
    <>
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
      />

      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
      />

      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
      />

      <Stack.Screen
        name="MyOrders"
        component={MyOrdersScreen}
      />

      <Stack.Screen
        name="CustomerSavedAddress"
        component={CustomerSavedAddressScreen}
      />

      <Stack.Screen
        name="CustomerChatSupport"
        component={CustomerChatSupportScreen}
      />
    </>
  );
}

/* ───────────────── HOME STACK ───────────────── */
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="CustomerHomeMain"
        component={CustomerHomeScreen}
      />

      <Stack.Screen
        name="AllCategoriesScreen"
        component={AllCategoriesScreen}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
      />

      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
      />

      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
      />

      <Stack.Screen
        name="MyOrders"
        component={MyOrdersScreen}
      />

      <Stack.Screen
        name="CustomerSavedAddress"
        component={CustomerSavedAddressScreen}
      />

      <Stack.Screen
        name="CustomerChatSupport"
        component={CustomerChatSupportScreen}
      />

      <Stack.Screen
        name="CustomerEditProfile"
        component={CustomerEditProfile}
      />
    </Stack.Navigator>
  );
}

/* ───────────────── SHOP STACK ───────────────── */
function ShopStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="CustomerShopMain"
        component={ProductListScreen}
        initialParams={{
          category: "All",
        }}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
      />

      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
      />

      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
      />

      <Stack.Screen
        name="MyOrders"
        component={MyOrdersScreen}
      />

      <Stack.Screen
        name="CustomerSavedAddress"
        component={CustomerSavedAddressScreen}
      />

      <Stack.Screen
        name="CustomerChatSupport"
        component={CustomerChatSupportScreen}
      />

      <Stack.Screen
        name="CustomerEditProfile"
        component={CustomerEditProfile}
      />
    </Stack.Navigator>
  );
}

/* ───────────────── CART STACK ───────────────── */
function CartStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="CustomerCartMain"
        component={CartScreen}
      />

      {CommonCustomerScreens()}

      <Stack.Screen
        name="CustomerEditProfile"
        component={CustomerEditProfile}
      />
    </Stack.Navigator>
  );
}

/* ───────────────── WISHLIST STACK ───────────────── */
function WishlistStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="CustomerWishlistMain"
        component={WishlistScreen}
      />

      {CommonCustomerScreens()}

      <Stack.Screen
        name="CustomerEditProfile"
        component={CustomerEditProfile}
      />
    </Stack.Navigator>
  );
}

/* ───────────────── PROFILE STACK ───────────────── */
function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* ✅ FIXED PROFILE SCREEN */}
      <Stack.Screen
        name="CustomerProfileMain"
        component={CustomerProfileScreen}
      />

      {/* ✅ FIXED EDIT PROFILE */}
      <Stack.Screen
        name="CustomerEditProfile"
        component={CustomerEditProfile}
      />

      {CommonCustomerScreens()}
    </Stack.Navigator>
  );
}

/* ───────────────── TAB NAVIGATOR ───────────────── */
export default function CustomerTabNavigator() {
  const {
    cartCount = 0,
    wishlistCount = 0,
  } = useShop();

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.tabBar,
      }}
    >
      {/* HOME */}
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={
                focused
                  ? "home"
                  : "home-outline"
              }
              label="Home"
              focused={focused}
            />
          ),
        }}
      />

      {/* SHOP */}
      <Tab.Screen
        name="ShopTab"
        component={ShopStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={
                focused
                  ? "grid"
                  : "grid-outline"
              }
              label="Shop"
              focused={focused}
            />
          ),
        }}
      />

      {/* CART */}
      <Tab.Screen
        name="CartTab"
        component={CartStack}
        options={{
          tabBarIcon: () => (
            <View style={styles.centerButton}>
              <Ionicons
                name="cart"
                size={29}
                color="#FFFFFF"
              />

              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {cartCount > 99
                      ? "99+"
                      : cartCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      {/* WISHLIST */}
      <Tab.Screen
        name="WishlistTab"
        component={WishlistStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={
                focused
                  ? "heart"
                  : "heart-outline"
              }
              label="Wishlist"
              focused={focused}
              badgeCount={wishlistCount}
            />
          ),
        }}
      />

      {/* PROFILE */}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={
                focused
                  ? "person"
                  : "person-outline"
              }
              label="Profile"
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

/* ───────────────── TAB ICON ───────────────── */
function TabIcon({
  icon,
  label,
  focused,
  badgeCount = 0,
}) {
  return (
    <View style={styles.tabItem}>
      <View
        style={
          focused
            ? styles.activeCircle
            : styles.inactiveCircle
        }
      >
        <Ionicons
          name={icon}
          size={24}
          color={
            focused
              ? "#FFFFFF"
              : "#6B7280"
          }
        />

        {badgeCount > 0 && (
          <View style={styles.smallBadge}>
            <Text
              style={styles.smallBadgeText}
            >
              {badgeCount > 99
                ? "99+"
                : badgeCount}
            </Text>
          </View>
        )}
      </View>

      <Text
        style={[
          styles.tabText,
          focused && styles.activeText,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

/* ───────────────── STYLES ───────────────── */
const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,

    height: 76,

    borderRadius: 28,

    backgroundColor: "#FFFFFF",

    borderTopWidth: 0,

    elevation: 14,

    shadowColor: "#082843",
    shadowOpacity: 0.18,
    shadowRadius: 16,

    shadowOffset: {
      width: 0,
      height: 8,
    },

    paddingTop: 8,

    paddingBottom:
      Platform.OS === "ios"
        ? 16
        : 8,
  },

  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 58,
  },

  activeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,

    backgroundColor: "#082843",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 2,
  },

  inactiveCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 2,
  },

  tabText: {
    fontSize: 10.5,
    color: "#6B7280",
    fontWeight: "700",
    marginTop: 3,
  },

  activeText: {
    color: "#082843",
    fontWeight: "900",
  },

  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,

    backgroundColor: "#082843",

    alignItems: "center",
    justifyContent: "center",

    marginTop: -34,

    elevation: 16,

    shadowColor: "#082843",
    shadowOpacity: 0.35,
    shadowRadius: 16,

    shadowOffset: {
      width: 0,
      height: 8,
    },

    borderWidth: 5,
    borderColor: "#FFF8F2",
  },

  badge: {
    position: "absolute",
    top: -3,
    right: -3,

    backgroundColor: "#111827",

    minWidth: 21,
    height: 21,
    borderRadius: 11,

    paddingHorizontal: 4,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },

  smallBadge: {
    position: "absolute",
    top: -7,
    right: -7,

    backgroundColor: "#111827",

    minWidth: 18,
    height: 18,
    borderRadius: 9,

    paddingHorizontal: 4,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },

  smallBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
  },
});