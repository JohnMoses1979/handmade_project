// // // import React from "react";
// // // import { View, Text, StyleSheet, Platform } from "react-native";
// // // import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// // // import { Ionicons } from "@expo/vector-icons";

// // // import SellerDashboardScreen from "../screens/seller/SellerDashboardScreen";
// // // import AddProductScreen from "../screens/seller/AddProductScreen";
// // // import MyProductsScreen from "../screens/seller/MyProductsScreen";
// // // import SellerOrdersScreen from "../screens/seller/SellerOrdersScreen";
// // // import SellerProfileScreen from "../screens/seller/SellerProfileScreen";

// // // const Tab = createBottomTabNavigator();
// // // const SELLER = "#087A2C";

// // // export default function SellerTabNavigator() {
// // //   return (
// // //     <Tab.Navigator
// // //       initialRouteName="SellerDashboard"
// // //       screenOptions={{
// // //         headerShown: false,
// // //         tabBarShowLabel: false,
// // //         tabBarStyle: styles.tabBar,
// // //       }}
// // //     >
// // //       <Tab.Screen
// // //         name="SellerDashboard"
// // //         component={SellerDashboardScreen}
// // //         options={{
// // //           tabBarIcon: ({ focused }) => (
// // //             <TabIcon icon="storefront" label="Home" focused={focused} />
// // //           ),
// // //         }}
// // //       />

// // //       <Tab.Screen
// // //         name="MyProducts"
// // //         component={MyProductsScreen}
// // //         options={{
// // //           tabBarIcon: ({ focused }) => (
// // //             <TabIcon icon="cube-outline" label="Products" focused={focused} />
// // //           ),
// // //         }}
// // //       />

// // //       <Tab.Screen
// // //         name="AddProduct"
// // //         component={AddProductScreen}
// // //         options={{
// // //           tabBarIcon: () => (
// // //             <View style={styles.centerButton}>
// // //               <Ionicons name="add" size={34} color="#fff" />
// // //             </View>
// // //           ),
// // //         }}
// // //       />

// // //       <Tab.Screen
// // //         name="SellerOrders"
// // //         component={SellerOrdersScreen}
// // //         options={{
// // //           tabBarIcon: ({ focused }) => (
// // //             <TabIcon icon="receipt-outline" label="Orders" focused={focused} />
// // //           ),
// // //         }}
// // //       />

// // //       <Tab.Screen
// // //         name="SellerProfile"
// // //         component={SellerProfileScreen}
// // //         options={{
// // //           tabBarIcon: ({ focused }) => (
// // //             <TabIcon icon="person-outline" label="Profile" focused={focused} />
// // //           ),
// // //         }}
// // //       />
// // //     </Tab.Navigator>
// // //   );
// // // }

// // // function TabIcon({ icon, label, focused }) {
// // //   return (
// // //     <View style={styles.tabItem}>
// // //       <View style={focused ? styles.activeCircle : null}>
// // //         <Ionicons name={icon} size={24} color={focused ? "#fff" : "#6B7280"} />
// // //       </View>
// // //       <Text style={[styles.tabText, focused && styles.activeText]}>{label}</Text>
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   tabBar: {
// // //     position: "absolute",
// // //     left: 14,
// // //     right: 14,
// // //     bottom: 14,
// // //     height: 76,
// // //     borderRadius: 28,
// // //     backgroundColor: "#FFFFFF",
// // //     borderTopWidth: 0,
// // //     elevation: 14,
// // //     shadowColor: SELLER,
// // //     shadowOpacity: 0.18,
// // //     shadowRadius: 16,
// // //     shadowOffset: { width: 0, height: 8 },
// // //     paddingTop: 8,
// // //     paddingBottom: Platform.OS === "ios" ? 16 : 8,
// // //   },
// // //   tabItem: {
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     minWidth: 58,
// // //   },
// // //   activeCircle: {
// // //     width: 36,
// // //     height: 36,
// // //     borderRadius: 18,
// // //     backgroundColor: SELLER,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     marginBottom: 2,
// // //   },
// // //   tabText: {
// // //     fontSize: 10.5,
// // //     color: "#6B7280",
// // //     fontWeight: "700",
// // //     marginTop: 3,
// // //   },
// // //   activeText: {
// // //     color: SELLER,
// // //     fontWeight: "900",
// // //   },
// // //   centerButton: {
// // //     width: 64,
// // //     height: 64,
// // //     borderRadius: 32,
// // //     backgroundColor: SELLER,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     marginTop: -34,
// // //     elevation: 16,
// // //     shadowColor: SELLER,
// // //     shadowOpacity: 0.35,
// // //     shadowRadius: 16,
// // //     shadowOffset: { width: 0, height: 8 },
// // //     borderWidth: 5,
// // //     borderColor: "#F0FFF4",
// // //   },
// // // });




















// // import React from "react";
// // import { View, Text, StyleSheet, Platform } from "react-native";
// // import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// // import { Ionicons } from "@expo/vector-icons";

// // import SellerDashboardScreen from "../screens/seller/SellerDashboardScreen";
// // import AddProductScreen from "../screens/seller/AddProductScreen";
// // import MyProductsScreen from "../screens/seller/MyProductsScreen";
// // import SellerOrdersScreen from "../screens/seller/SellerOrdersScreen";
// // import SellerProfileScreen from "../screens/seller/SellerProfileScreen";

// // const Tab = createBottomTabNavigator();
// // const SELLER_COLOR = "#E83E7C";  // Customized color for Seller sections

// // export default function SellerTabNavigator() {
// //   return (
// //     <Tab.Navigator
// //       initialRouteName="SellerDashboard"
// //       screenOptions={{
// //         headerShown: false,
// //         tabBarShowLabel: false,
// //         tabBarStyle: styles.tabBar,
// //       }}
// //     >
// //       <Tab.Screen
// //         name="SellerDashboard"
// //         component={SellerDashboardScreen}
// //         options={{
// //           tabBarIcon: ({ focused }) => (
// //             <TabIcon icon="storefront" label="Dashboard" focused={focused} />
// //           ),
// //         }}
// //       />

// //       <Tab.Screen
// //         name="MyProducts"
// //         component={MyProductsScreen}
// //         options={{
// //           tabBarIcon: ({ focused }) => (
// //             <TabIcon icon="cube-outline" label="Products" focused={focused} />
// //           ),
// //         }}
// //       />

// //       <Tab.Screen
// //         name="AddProduct"
// //         component={AddProductScreen}
// //         options={{
// //           tabBarIcon: () => (
// //             <View style={styles.centerButton}>
// //               <Ionicons name="add" size={34} color="#fff" />
// //             </View>
// //           ),
// //         }}
// //       />

// //       <Tab.Screen
// //         name="SellerOrders"
// //         component={SellerOrdersScreen}
// //         options={{
// //           tabBarIcon: ({ focused }) => (
// //             <TabIcon icon="receipt-outline" label="Orders" focused={focused} />
// //           ),
// //         }}
// //       />

// //       <Tab.Screen
// //         name="SellerProfile"
// //         component={SellerProfileScreen}
// //         options={{
// //           tabBarIcon: ({ focused }) => (
// //             <TabIcon icon="person-outline" label="Profile" focused={focused} />
// //           ),
// //         }}
// //       />
// //     </Tab.Navigator>
// //   );
// // }

// // function TabIcon({ icon, label, focused }) {
// //   return (
// //     <View style={styles.tabItem}>
// //       <View style={focused ? styles.activeCircle : styles.inactiveCircle}>
// //         <Ionicons name={icon} size={24} color={focused ? "#fff" : "#6B7280"} />
// //       </View>
// //       <Text style={[styles.tabText, focused && styles.activeText]}>{label}</Text>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   tabBar: {
// //     position: "absolute",
// //     left: 14,
// //     right: 14,
// //     bottom: 14,
// //     height: 76,
// //     borderRadius: 28,
// //     backgroundColor: "#FFFFFF",
// //     borderTopWidth: 0,
// //     elevation: 14,
// //     shadowColor: SELLER_COLOR,
// //     shadowOpacity: 0.18,
// //     shadowRadius: 16,
// //     shadowOffset: { width: 0, height: 8 },
// //     paddingTop: 8,
// //     paddingBottom: Platform.OS === "ios" ? 16 : 8,
// //   },
// //   tabItem: {
// //     alignItems: "center",
// //     justifyContent: "center",
// //     minWidth: 58,
// //   },
// //   activeCircle: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 18,
// //     backgroundColor: SELLER_COLOR,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginBottom: 2,
// //   },
// //   inactiveCircle: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 18,
// //     backgroundColor: "#F4F4F4",  // Light gray background for inactive tabs
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginBottom: 2,
// //   },
// //   tabText: {
// //     fontSize: 10.5,
// //     color: "#6B7280",
// //     fontWeight: "700",
// //     marginTop: 3,
// //   },
// //   activeText: {
// //     color: SELLER_COLOR,
// //     fontWeight: "900",
// //   },
// //   centerButton: {
// //     width: 64,
// //     height: 64,
// //     borderRadius: 32,
// //     backgroundColor: SELLER_COLOR,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginTop: -34,
// //     elevation: 16,
// //     shadowColor: SELLER_COLOR,
// //     shadowOpacity: 0.35,
// //     shadowRadius: 16,
// //     shadowOffset: { width: 0, height: 8 },
// //     borderWidth: 5,
// //     borderColor: "#F0FFF4",
// //   },
// // });














// // import React from "react";
// // import { View, Text, StyleSheet, Platform } from "react-native";
// // import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// // import { Ionicons } from "@expo/vector-icons";

// // import SellerDashboardScreen from "../screens/seller/SellerDashboardScreen";
// // import AddProductScreen from "../screens/seller/AddProductScreen";
// // import MyProductsScreen from "../screens/seller/MyProductsScreen";
// // import SellerOrdersScreen from "../screens/seller/SellerOrdersScreen";
// // import SellerProfileScreen from "../screens/seller/SellerProfileScreen";

// // const Tab = createBottomTabNavigator();
// // const SELLER_COLOR = "#E83E7C";  // Customized color for Seller sections

// // export default function SellerTabNavigator() {
// //   return (
// //     <Tab.Navigator
// //       initialRouteName="SellerDashboard"
// //       screenOptions={{
// //         headerShown: false,
// //         tabBarShowLabel: false,
// //         tabBarStyle: styles.tabBar,
// //       }}
// //     >
// //       <Tab.Screen
// //         name="SellerDashboard"
// //         component={SellerDashboardScreen}
// //         options={{
// //           tabBarIcon: ({ focused }) => (
// //             <TabIcon icon="storefront" label="Dashboard" focused={focused} />
// //           ),
// //         }}
// //       />

// //       <Tab.Screen
// //         name="MyProducts"
// //         component={MyProductsScreen}
// //         options={{
// //           tabBarIcon: ({ focused }) => (
// //             <TabIcon icon="cube-outline" label="Products" focused={focused} />
// //           ),
// //         }}
// //       />

// //       <Tab.Screen
// //         name="AddProduct"
// //         component={AddProductScreen}
// //         options={{
// //           tabBarIcon: () => (
// //             <View style={styles.centerButton}>
// //               <Ionicons name="add" size={34} color="#fff" />
// //             </View>
// //           ),
// //         }}
// //       />

// //       <Tab.Screen
// //         name="SellerOrders"
// //         component={SellerOrdersScreen}
// //         options={{
// //           tabBarIcon: ({ focused }) => (
// //             <TabIcon icon="receipt-outline" label="Orders" focused={focused} />
// //           ),
// //         }}
// //       />

// //       <Tab.Screen
// //         name="SellerProfile"
// //         component={SellerProfileScreen}
// //         options={{
// //           tabBarIcon: ({ focused }) => (
// //             <TabIcon icon="person-outline" label="Profile" focused={focused} />
// //           ),
// //         }}
// //       />
// //     </Tab.Navigator>
// //   );
// // }

// // function TabIcon({ icon, label, focused }) {
// //   return (
// //     <View style={styles.tabItem}>
// //       <View style={focused ? styles.activeCircle : styles.inactiveCircle}>
// //         <Ionicons name={icon} size={24} color={focused ? "#fff" : "#6B7280"} />
// //       </View>
// //       <Text style={[styles.tabText, focused && styles.activeText]}>{label}</Text>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   tabBar: {
// //     position: "absolute",
// //     left: 14,
// //     right: 14,
// //     bottom: 14,
// //     height: 76,
// //     borderRadius: 28,
// //     backgroundColor: "#FFFFFF",
// //     borderTopWidth: 0,
// //     elevation: 14,
// //     shadowColor: SELLER_COLOR,
// //     shadowOpacity: 0.18,
// //     shadowRadius: 16,
// //     shadowOffset: { width: 0, height: 8 },
// //     paddingTop: 8,
// //     paddingBottom: Platform.OS === "ios" ? 16 : 8,
// //   },
// //   tabItem: {
// //     alignItems: "center",
// //     justifyContent: "center",
// //     minWidth: 58,
// //   },
// //   activeCircle: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 18,
// //     backgroundColor: SELLER_COLOR,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginBottom: 2,
// //   },
// //   inactiveCircle: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 18,
// //     backgroundColor: "#F4F4F4",  // Light gray background for inactive tabs
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginBottom: 2,
// //   },
// //   tabText: {
// //     fontSize: 10.5,
// //     color: "#6B7280",
// //     fontWeight: "700",
// //     marginTop: 3,
// //   },
// //   activeText: {
// //     color: SELLER_COLOR,
// //     fontWeight: "900",
// //   },
// //   centerButton: {
// //     width: 64,
// //     height: 64,
// //     borderRadius: 32,
// //     backgroundColor: SELLER_COLOR,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginTop: -34,
// //     elevation: 16,
// //     shadowColor: SELLER_COLOR,
// //     shadowOpacity: 0.35,
// //     shadowRadius: 16,
// //     shadowOffset: { width: 0, height: 8 },
// //     borderWidth: 5,
// //     borderColor: "#F0FFF4",
// //   },
// // });
























// // import React from "react";
// // import { View, Text, StyleSheet, Platform } from "react-native";
// // import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// // import { Ionicons } from "@expo/vector-icons";

// // import SellerDashboardScreen from "../screens/seller/SellerDashboardScreen";
// // import AddProductScreen from "../screens/seller/AddProductScreen";
// // import MyProductsScreen from "../screens/seller/MyProductsScreen";
// // import SellerOrdersScreen from "../screens/seller/SellerOrdersScreen";
// // import SellerProfileScreen from "../screens/seller/SellerProfileScreen";

// // const Tab = createBottomTabNavigator();

// // const SELLER_PRIMARY = "#C2185B";
// // const SELLER_DARK = "#880E4F";

// // export default function SellerTabNavigator() {
// //   return (
// //     <Tab.Navigator
// //       initialRouteName="SellerDashboard"
// //       screenOptions={{
// //         headerShown: false,
// //         tabBarShowLabel: false,
// //         tabBarStyle: styles.tabBar,
// //       }}
// //     >
// //       <Tab.Screen
// //         name="SellerDashboard"
// //         component={SellerDashboardScreen}
// //         options={{
// //           tabBarIcon: ({ focused }) => (
// //             <TabIcon icon="storefront" label="Dashboard" focused={focused} />
// //           ),
// //         }}
// //       />

// //       <Tab.Screen
// //         name="MyProducts"
// //         component={MyProductsScreen}
// //         options={{
// //           tabBarIcon: ({ focused }) => (
// //             <TabIcon icon="cube-outline" label="Products" focused={focused} />
// //           ),
// //         }}
// //       />

// //       {/* Centre FAB — Add Product */}
// //       <Tab.Screen
// //         name="AddProduct"
// //         component={AddProductScreen}
// //         options={{
// //           tabBarIcon: () => (
// //             <View style={styles.fabButton}>
// //               <Ionicons name="add" size={30} color="#fff" />
// //             </View>
// //           ),
// //         }}
// //       />

// //       <Tab.Screen
// //         name="SellerOrders"
// //         component={SellerOrdersScreen}
// //         options={{
// //           tabBarIcon: ({ focused }) => (
// //             <TabIcon icon="receipt-outline" label="Orders" focused={focused} />
// //           ),
// //         }}
// //       />

// //       <Tab.Screen
// //         name="SellerProfile"
// //         component={SellerProfileScreen}
// //         options={{
// //           tabBarIcon: ({ focused }) => (
// //             <TabIcon icon="person-outline" label="Profile" focused={focused} />
// //           ),
// //         }}
// //       />
// //     </Tab.Navigator>
// //   );
// // }

// // // ─── Tab Icon ─────────────────────────────────────────────────────────────────
// // function TabIcon({ icon, label, focused }) {
// //   return (
// //     <View style={styles.tabItem}>
// //       <View style={focused ? styles.activeCircle : styles.inactiveCircle}>
// //         <Ionicons
// //           name={icon}
// //           size={22}
// //           color={focused ? "#fff" : "#9CA3AF"}
// //         />
// //       </View>
// //       <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
// //         {label}
// //       </Text>
// //     </View>
// //   );
// // }

// // // ─── Styles ───────────────────────────────────────────────────────────────────
// // const styles = StyleSheet.create({
// //   tabBar: {
// //     position: "absolute",
// //     left: 16,
// //     right: 16,
// //     bottom: 16,
// //     height: 72,
// //     borderRadius: 28,
// //     backgroundColor: "#FFFFFF",
// //     borderTopWidth: 0,
// //     elevation: 16,
// //     shadowColor: SELLER_PRIMARY,
// //     shadowOpacity: 0.2,
// //     shadowRadius: 20,
// //     shadowOffset: { width: 0, height: 8 },
// //     paddingTop: 6,
// //     paddingBottom: Platform.OS === "ios" ? 12 : 6,
// //   },

// //   tabItem: {
// //     alignItems: "center",
// //     justifyContent: "center",
// //     minWidth: 56,
// //   },

// //   activeCircle: {
// //     width: 38,
// //     height: 38,
// //     borderRadius: 19,
// //     backgroundColor: SELLER_PRIMARY,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginBottom: 2,
// //     shadowColor: SELLER_PRIMARY,
// //     shadowOpacity: 0.4,
// //     shadowOffset: { width: 0, height: 4 },
// //     elevation: 6,
// //   },

// //   inactiveCircle: {
// //     width: 38,
// //     height: 38,
// //     borderRadius: 19,
// //     backgroundColor: "#F5F5F5",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginBottom: 2,
// //   },

// //   tabLabel: {
// //     fontSize: 10,
// //     color: "#9CA3AF",
// //     fontWeight: "700",
// //     marginTop: 1,
// //   },
// //   tabLabelActive: {
// //     color: SELLER_PRIMARY,
// //     fontWeight: "900",
// //   },

// //   // FAB centre button
// //   fabButton: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     backgroundColor: SELLER_PRIMARY,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginTop: -30,
// //     elevation: 14,
// //     shadowColor: SELLER_PRIMARY,
// //     shadowOpacity: 0.45,
// //     shadowRadius: 16,
// //     shadowOffset: { width: 0, height: 8 },
// //     borderWidth: 4,
// //     borderColor: "#FFF0F5",
// //   },
// // });


































// // import React from "react";
// // import { View, Text, StyleSheet, Platform } from "react-native";
// // import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// // import { Ionicons } from "@expo/vector-icons";

// // import SellerDashboardScreen from "../screens/seller/SellerDashboardScreen";
// // import AddProductScreen from "../screens/seller/AddProductScreen";
// // import MyProductsScreen from "../screens/seller/MyProductsScreen";
// // import SellerOrdersScreen from "../screens/seller/SellerOrdersScreen";
// // import SellerProfileScreen from "../screens/seller/SellerProfileScreen";
// // import SellerComplaintNotificationScreen from "../screens/seller/SellerComplaintNotificationScreen";
// // import SellerNotificationScreen from "../screens/seller/SellerNotificationsScreen";

// // const Tab = createBottomTabNavigator();

// // const SELLER_PRIMARY = "#082843";

// // export default function SellerTabNavigator() {
// //   return (
// //     <Tab.Navigator
// //       initialRouteName="SellerDashboardScreen"
// //       screenOptions={{
// //         headerShown: false,
// //         tabBarShowLabel: false,
// //         tabBarStyle: styles.tabBar,
// //       }}
// //     >
// //       <Tab.Screen
// //         name="SellerDashboardScreen"
// //         component={SellerDashboardScreen}
// //         options={{
// //           tabBarIcon: ({ focused }) => (
// //             <TabIcon icon="storefront" label="Dashboard" focused={focused} />
// //           ),
// //         }}
// //       />

// //         {/* Notification Screen */}
// //       <Stack.Screen
// //         name="SellerNotificationScreen"
// //         component={SellerNotificationScreen}
// //       />

// //       {/* Complaint Notification */}
// //       <Stack.Screen
// //         name="SellerComplaintNotificationScreen"
// //         component={SellerComplaintNotificationScreen}
// //       />

// //       <Tab.Screen
// //         name="MyProductsScreen"
// //         component={MyProductsScreen}
// //         options={{
// //           tabBarIcon: ({ focused }) => (
// //             <TabIcon icon="cube-outline" label="Products" focused={focused} />
// //           ),
// //         }}
// //       />

// //       <Tab.Screen
// //         name="AddProductScreen"
// //         component={AddProductScreen}
// //         options={{
// //           tabBarIcon: () => (
// //             <View style={styles.fabButton}>
// //               <Ionicons name="add" size={32} color="#fff" />
// //             </View>
// //           ),
// //         }}
// //       />

// //       <Tab.Screen
// //         name="SellerOrdersScreen"
// //         component={SellerOrdersScreen}
// //         options={{
// //           tabBarIcon: ({ focused }) => (
// //             <TabIcon icon="receipt-outline" label="Orders" focused={focused} />
// //           ),
// //         }}
// //       />

// //       <Tab.Screen
// //         name="SellerProfileScreen"
// //         component={SellerProfileScreen}
// //         options={{
// //           tabBarIcon: ({ focused }) => (
// //             <TabIcon icon="person-outline" label="Profile" focused={focused} />
// //           ),
// //         }}
// //       />
// //     </Tab.Navigator>
// //   );
// // }

// // function TabIcon({ icon, label, focused }) {
// //   return (
// //     <View style={styles.tabItem}>
// //       <View style={focused ? styles.activeCircle : styles.inactiveCircle}>
// //         <Ionicons name={icon} size={22} color={focused ? "#fff" : "#9CA3AF"} />
// //       </View>
// //       <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
// //         {label}
// //       </Text>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   tabBar: {
// //     position: "absolute",
// //     left: 16,
// //     right: 16,
// //     bottom: 16,
// //     height: 72,
// //     borderRadius: 28,
// //     backgroundColor: "#FFFFFF",
// //     borderTopWidth: 0,
// //     elevation: 16,
// //     shadowColor: SELLER_PRIMARY,
// //     shadowOpacity: 0.2,
// //     shadowRadius: 20,
// //     shadowOffset: { width: 0, height: 8 },
// //     paddingTop: 6,
// //     paddingBottom: Platform.OS === "ios" ? 12 : 6,
// //   },
// //   tabItem: {
// //     alignItems: "center",
// //     justifyContent: "center",
// //     minWidth: 56,
// //   },
// //   activeCircle: {
// //     width: 38,
// //     height: 38,
// //     borderRadius: 19,
// //     backgroundColor: SELLER_PRIMARY,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginBottom: 2,
// //     elevation: 6,
// //   },
// //   inactiveCircle: {
// //     width: 38,
// //     height: 38,
// //     borderRadius: 19,
// //     backgroundColor: "#F5F5F5",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginBottom: 2,
// //   },
// //   tabLabel: {
// //     fontSize: 10,
// //     color: "#9CA3AF",
// //     fontWeight: "700",
// //     marginTop: 1,
// //   },
// //   tabLabelActive: {
// //     color: "#082843",
// //     fontWeight: "900",
// //   },
// //   fabButton: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     backgroundColor: SELLER_PRIMARY,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginTop: -30,
// //     elevation: 14,
// //     shadowColor: "#082843",
// //     shadowOpacity: 0.45,
// //     shadowRadius: 16,
// //     shadowOffset: { width: 0, height: 8 },
// //     borderWidth: 4,
// //     borderColor: "#FFF0F5",
// //   },
// // });





































// // src/navigation/SellerTabNavigator.js

// import React from "react";
// import { View, Text, StyleSheet, Platform } from "react-native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Ionicons } from "@expo/vector-icons";

// import SellerDashboardScreen from "../screens/seller/SellerDashboardScreen";
// import AddProductScreen from "../screens/seller/AddProductScreen";
// import MyProductsScreen from "../screens/seller/MyProductsScreen";
// import SellerOrdersScreen from "../screens/seller/SellerOrdersScreen";
// import SellerProfileScreen from "../screens/seller/SellerProfileScreen";

// const Tab = createBottomTabNavigator();

// const SELLER_PRIMARY = "#082843";

// export default function SellerTabNavigator() {
//   return (
//     <Tab.Navigator
//       initialRouteName="SellerDashboardScreen"
//       screenOptions={{
//         headerShown: false,
//         tabBarShowLabel: false,
//         tabBarStyle: styles.tabBar,
//       }}
//     >
//       {/* Dashboard */}
//       <Tab.Screen
//         name="SellerDashboardScreen"
//         component={SellerDashboardScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               icon="storefront"
//               label="Dashboard"
//               focused={focused}
//             />
//           ),
//         }}
//       />

//       {/* Products */}
//       <Tab.Screen
//         name="MyProductsScreen"
//         component={MyProductsScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               icon="cube-outline"
//               label="Products"
//               focused={focused}
//             />
//           ),
//         }}
//       />

//       {/* Add Product */}
//       <Tab.Screen
//         name="AddProductScreen"
//         component={AddProductScreen}
//         options={{
//           tabBarIcon: () => (
//             <View style={styles.fabButton}>
//               <Ionicons name="add" size={32} color="#fff" />
//             </View>
//           ),
//         }}
//       />

//       {/* Orders */}
//       <Tab.Screen
//         name="SellerOrdersScreen"
//         component={SellerOrdersScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               icon="receipt-outline"
//               label="Orders"
//               focused={focused}
//             />
//           ),
//         }}
//       />

//       {/* Profile */}
//       <Tab.Screen
//         name="SellerProfileScreen"
//         component={SellerProfileScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               icon="person-outline"
//               label="Profile"
//               focused={focused}
//             />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// function TabIcon({ icon, label, focused }) {
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
//           size={22}
//           color={focused ? "#fff" : "#9CA3AF"}
//         />
//       </View>

//       <Text
//         style={[
//           styles.tabLabel,
//           focused && styles.tabLabelActive,
//         ]}
//       >
//         {label}
//       </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   tabBar: {
//     position: "absolute",
//     left: 16,
//     right: 16,
//     bottom: 16,
//     height: 72,
//     borderRadius: 28,
//     backgroundColor: "#FFFFFF",
//     borderTopWidth: 0,
//     elevation: 16,
//     shadowColor: SELLER_PRIMARY,
//     shadowOpacity: 0.2,
//     shadowRadius: 20,
//     shadowOffset: {
//       width: 0,
//       height: 8,
//     },
//     paddingTop: 6,
//     paddingBottom: Platform.OS === "ios" ? 12 : 6,
//   },

//   tabItem: {
//     alignItems: "center",
//     justifyContent: "center",
//     minWidth: 56,
//   },

//   activeCircle: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     backgroundColor: SELLER_PRIMARY,
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 2,
//     elevation: 6,
//   },

//   inactiveCircle: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     backgroundColor: "#F5F5F5",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 2,
//   },

//   tabLabel: {
//     fontSize: 10,
//     color: "#9CA3AF",
//     fontWeight: "700",
//     marginTop: 1,
//   },

//   tabLabelActive: {
//     color: "#082843",
//     fontWeight: "900",
//   },

//   fabButton: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: SELLER_PRIMARY,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: -30,
//     elevation: 14,
//     shadowColor: "#082843",
//     shadowOpacity: 0.45,
//     shadowRadius: 16,
//     shadowOffset: {
//       width: 0,
//       height: 8,
//     },
//     borderWidth: 4,
//     borderColor: "#FFF0F5",
//   },
// });





































// src/navigation/SellerTabNavigator.js

import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import SellerDashboardScreen from "../screens/seller/SellerDashboardScreen";
import AddProductScreen from "../screens/seller/AddProductScreen";
import MyProductsScreen from "../screens/seller/MyProductsScreen";
import SellerOrdersScreen from "../screens/seller/SellerOrdersScreen";
import SellerProfileScreen from "../screens/seller/SellerProfileScreen";

const Tab = createBottomTabNavigator();

const SELLER_PRIMARY = "#082843";

export default function SellerTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="SellerDashboardScreen"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      {/* Dashboard */}
      <Tab.Screen
        name="SellerDashboardScreen"
        component={SellerDashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="storefront" label="Dashboard" focused={focused} />
          ),
        }}
      />

      {/* Products */}
      <Tab.Screen
        name="MyProductsScreen"
        component={MyProductsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="cube-outline" label="Products" focused={focused} />
          ),
        }}
      />

      {/* Add Product */}
      <Tab.Screen
        name="AddProductScreen"
        component={AddProductScreen}
        options={{
          tabBarIcon: () => (
            <View style={styles.fabButton}>
              <Ionicons name="add" size={32} color="#fff" />
            </View>
          ),
        }}
      />

      {/* Orders */}
      <Tab.Screen
        name="SellerOrdersScreen"
        component={SellerOrdersScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="receipt-outline" label="Orders" focused={focused} />
          ),
        }}
      />

      {/* Profile */}
      <Tab.Screen
        name="SellerProfileScreen"
        component={SellerProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="person-outline" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function TabIcon({ icon, label, focused }) {
  return (
    <View style={styles.tabItem}>
      <View style={focused ? styles.activeCircle : styles.inactiveCircle}>
        <Ionicons
          name={icon}
          size={22}
          color={focused ? "#fff" : "#9CA3AF"}
        />
      </View>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    height: 72,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0,
    elevation: 16,
    shadowColor: SELLER_PRIMARY,
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    paddingTop: 6,
    paddingBottom: Platform.OS === "ios" ? 12 : 6,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 56,
  },
  activeCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: SELLER_PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
    elevation: 6,
  },
  inactiveCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: "700",
    marginTop: 1,
  },
  tabLabelActive: {
    color: "#082843",
    fontWeight: "900",
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: SELLER_PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -30,
    elevation: 14,
    shadowColor: "#082843",
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    borderWidth: 4,
    borderColor: "#FFF0F5",
  },
});