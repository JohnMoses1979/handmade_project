

// // // src/navigation/AdminTabNavigator.js

// // import React from "react";
// // import { View, Text, StyleSheet, Platform } from "react-native";
// // import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// // import { Ionicons } from "@expo/vector-icons";

// // import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
// // import ManageSellersScreen from "../screens/admin/ManageSellersScreen";
// // import ManageOrdersScreen from "../screens/admin/ManageOrdersScreen";
// // import ManageProductsScreen from "../screens/admin/ManageProductsScreen";
// // import AdminReportsScreen from "../screens/admin/AdminReportsScreen";

// // const Tab = createBottomTabNavigator();

// // const C = {
// //   primary: "#0e3243",
// //   white: "#FFFFFF",
// //   muted: "#B8CDD6",
// //   activeBg: "rgba(255,255,255,0.16)",
// // };

// // export default function AdminTabNavigator() {
// //   return (
// //     <Tab.Navigator
// //       initialRouteName="AdminDashboard"
// //       screenOptions={{
// //         headerShown: false,
// //         tabBarShowLabel: false,
// //         tabBarHideOnKeyboard: true,
// //         tabBarStyle: styles.tabBar,
// //         tabBarItemStyle: styles.tabBarItem,
// //       }}
// //     >
// //       <Tab.Screen
// //         name="AdminDashboard"
// //         component={AdminDashboardScreen}
// //         options={{
// //           tabBarIcon: ({ focused }) => (
// //             <TabIcon
// //               icon={focused ? "home" : "home-outline"}
// //               label="Home"
// //               focused={focused}
// //             />
// //           ),
// //         }}
// //       />

// //       <Tab.Screen
// //         name="ManageSellers"
// //         component={ManageSellersScreen}
// //         options={{
// //           tabBarIcon: ({ focused }) => (
// //             <TabIcon
// //               icon={focused ? "storefront" : "storefront-outline"}
// //               label="Sellers"
// //               focused={focused}
// //             />
// //           ),
// //         }}
// //       />

// //       <Tab.Screen
// //         name="ManageOrders"
// //         component={ManageOrdersScreen}
// //         options={{
// //           tabBarIcon: ({ focused }) => (
// //             <TabIcon
// //               icon={focused ? "receipt" : "receipt-outline"}
// //               label="Orders"
// //               focused={focused}
// //             />
// //           ),
// //         }}
// //       />

// //       <Tab.Screen
// //         name="ManageProducts"
// //         component={ManageProductsScreen}
// //         options={{
// //           tabBarIcon: ({ focused }) => (
// //             <TabIcon
// //               icon={focused ? "cube" : "cube-outline"}
// //               label="Products"
// //               focused={focused}
// //             />
// //           ),
// //         }}
// //       />

// //       <Tab.Screen
// //         name="AdminReports"
// //         component={AdminReportsScreen}
// //         options={{
// //           tabBarIcon: ({ focused }) => (
// //             <TabIcon
// //               icon={focused ? "bar-chart" : "bar-chart-outline"}
// //               label="Reports"
// //               focused={focused}
// //             />
// //           ),
// //         }}
// //       />
// //     </Tab.Navigator>
// //   );
// // }

// // function TabIcon({ icon, label, focused }) {
// //   return (
// //     <View style={styles.tabItem}>
// //       <View style={[styles.iconCircle, focused && styles.iconCircleActive]}>
// //         <Ionicons name={icon} size={22} color={focused ? C.white : C.muted} />
// //       </View>

// //       <Text style={[styles.tabText, focused && styles.activeText]}>
// //         {label}
// //       </Text>

// //       {focused ? <View style={styles.activeDot} /> : null}
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   tabBar: {
// //     position: "absolute",
// //     left: 12,
// //     right: 12,
// //     bottom: 12,
// //     height: 74,
// //     borderRadius: 26,
// //     backgroundColor: C.primary,
// //     borderTopWidth: 0,
// //     elevation: 14,
// //     shadowColor: C.primary,
// //     shadowOpacity: 0.25,
// //     shadowRadius: 16,
// //     shadowOffset: { width: 0, height: 8 },
// //     paddingTop: 8,
// //     paddingBottom: Platform.OS === "ios" ? 18 : 8,
// //   },

// //   tabBarItem: {
// //     height: 64,
// //   },

// //   tabItem: {
// //     alignItems: "center",
// //     justifyContent: "center",
// //     minWidth: 58,
// //   },

// //   iconCircle: {
// //     width: 34,
// //     height: 34,
// //     borderRadius: 14,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   iconCircleActive: {
// //     backgroundColor: C.activeBg,
// //   },

// //   tabText: {
// //     marginTop: 2,
// //     fontSize: 10,
// //     color: C.muted,
// //     fontWeight: "800",
// //   },

// //   activeText: {
// //     color: C.white,
// //     fontWeight: "900",
// //   },

// //   activeDot: {
// //     marginTop: 3,
// //     width: 5,
// //     height: 5,
// //     borderRadius: 5,
// //     backgroundColor: C.white,
// //   },
// // });
























// import React from "react";
// import { View, Text, StyleSheet, Platform } from "react-native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Ionicons } from "@expo/vector-icons";

// // Import Screens
// import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
// import ManageSellersScreen from "../screens/admin/ManageSellersScreen";
// import ManageOrdersScreen from "../screens/admin/ManageOrdersScreen";
// import ManageProductsScreen from "../screens/admin/ManageProductsScreen";
// import AdminReportsScreen from "../screens/admin/AdminReportsScreen";
// import AdminProfileScreen from "../screens/admin/AdminProfileScreen"; // Import AdminProfileScreen
// import AdminNotificationsScreen from "../screens/admin/AdminNotificationsScreen"; // Import AdminNotificationsScreen

// const Tab = createBottomTabNavigator();

// const C = {
//   primary: "#0e3243",
//   white: "#FFFFFF",
//   muted: "#B8CDD6",
//   activeBg: "rgba(255,255,255,0.16)",
// };

// export default function AdminTabNavigator() {
//   return (
//     <Tab.Navigator
//       initialRouteName="AdminDashboard"
//       screenOptions={{
//         headerShown: false,
//         tabBarShowLabel: false,
//         tabBarHideOnKeyboard: true,
//         tabBarStyle: styles.tabBar,
//         tabBarItemStyle: styles.tabBarItem,
//       }}
//     >
//       <Tab.Screen
//         name="AdminDashboard"
//         component={AdminDashboardScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               icon={focused ? "home" : "home-outline"}
//               label="Home"
//               focused={focused}
//             />
//           ),
//         }}
//       />

//       <Tab.Screen
//         name="ManageSellers"
//         component={ManageSellersScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               icon={focused ? "storefront" : "storefront-outline"}
//               label="Sellers"
//               focused={focused}
//             />
//           ),
//         }}
//       />

//       <Tab.Screen
//         name="ManageOrders"
//         component={ManageOrdersScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               icon={focused ? "receipt" : "receipt-outline"}
//               label="Orders"
//               focused={focused}
//             />
//           ),
//         }}
//       />

//       <Tab.Screen
//         name="ManageProducts"
//         component={ManageProductsScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               icon={focused ? "cube" : "cube-outline"}
//               label="Products"
//               focused={focused}
//             />
//           ),
//         }}
//       />

//       <Tab.Screen
//         name="AdminReports"
//         component={AdminReportsScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               icon={focused ? "bar-chart" : "bar-chart-outline"}
//               label="Reports"
//               focused={focused}
//             />
//           ),
//         }}
//       />

//       {/* Admin Profile Screen */}
//       <Tab.Screen
//         name="AdminProfile"
//         component={AdminProfileScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               icon={focused ? "person" : "person-outline"}
//               label="Profile"
//               focused={focused}
//             />
//           ),
//         }}
//       />

//       {/* Admin Notifications Screen */}
//       <Tab.Screen
//         name="AdminNotifications"
//         component={AdminNotificationsScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               icon={focused ? "notifications" : "notifications-outline"}
//               label="Notifications"
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
//       <View style={[styles.iconCircle, focused && styles.iconCircleActive]}>
//         <Ionicons name={icon} size={22} color={focused ? C.white : C.muted} />
//       </View>

//       <Text style={[styles.tabText, focused && styles.activeText]}>{label}</Text>

//       {focused ? <View style={styles.activeDot} /> : null}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   tabBar: {
//     position: "absolute",
//     left: 12,
//     right: 12,
//     bottom: 12,
//     height: 74,
//     borderRadius: 26,
//     backgroundColor: C.primary,
//     borderTopWidth: 0,
//     elevation: 14,
//     shadowColor: C.primary,
//     shadowOpacity: 0.25,
//     shadowRadius: 16,
//     shadowOffset: { width: 0, height: 8 },
//     paddingTop: 8,
//     paddingBottom: Platform.OS === "ios" ? 18 : 8,
//   },

//   tabBarItem: {
//     height: 64,
//   },

//   tabItem: {
//     alignItems: "center",
//     justifyContent: "center",
//     minWidth: 58,
//   },

//   iconCircle: {
//     width: 34,
//     height: 34,
//     borderRadius: 14,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   iconCircleActive: {
//     backgroundColor: C.activeBg,
//   },

//   tabText: {
//     marginTop: 2,
//     fontSize: 10,
//     color: C.muted,
//     fontWeight: "800",
//   },

//   activeText: {
//     color: C.white,
//     fontWeight: "900",
//   },

//   activeDot: {
//     marginTop: 3,
//     width: 5,
//     height: 5,
//     borderRadius: 5,
//     backgroundColor: C.white,
//   },
// });



























// import React from "react";
// import { View, Text, StyleSheet, Platform } from "react-native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Ionicons } from "@expo/vector-icons";

// // Import Screens
// import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
// import ManageSellersScreen from "../screens/admin/ManageSellersScreen";
// import ManageOrdersScreen from "../screens/admin/ManageOrdersScreen";
// import ManageProductsScreen from "../screens/admin/ManageProductsScreen";
// import AdminReportsScreen from "../screens/admin/AdminReportsScreen";
// import AdminProfileScreen from "../screens/admin/AdminProfileScreen";
// import AdminNotificationsScreen from "../screens/admin/AdminNotificationsScreen";

// const Tab = createBottomTabNavigator();

// const C = {
//   primary: "#0e3243",
//   white: "#FFFFFF",
//   muted: "#B8CDD6",
//   activeBg: "rgba(255,255,255,0.16)",
// };

// export default function AdminTabNavigator() {
//   return (
//     <Tab.Navigator
//       initialRouteName="AdminDashboard"
//       screenOptions={{
//         headerShown: false,
//         tabBarShowLabel: false,
//         tabBarHideOnKeyboard: true,
//         tabBarStyle: styles.tabBar,
//         tabBarItemStyle: styles.tabBarItem,
//       }}
//     >
//       <Tab.Screen
//         name="AdminDashboard"
//         component={AdminDashboardScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               icon={focused ? "home" : "home-outline"}
//               label="Home"
//               focused={focused}
//             />
//           ),
//         }}
//       />

//       <Tab.Screen
//         name="ManageSellers"
//         component={ManageSellersScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               icon={focused ? "storefront" : "storefront-outline"}
//               label="Sellers"
//               focused={focused}
//             />
//           ),
//         }}
//       />

//       <Tab.Screen
//         name="ManageOrders"
//         component={ManageOrdersScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               icon={focused ? "receipt" : "receipt-outline"}
//               label="Orders"
//               focused={focused}
//             />
//           ),
//         }}
//       />

  

//       <Tab.Screen
//         name="AdminReports"
//         component={AdminReportsScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               icon={focused ? "bar-chart" : "bar-chart-outline"}
//               label="Reports"
//               focused={focused}
//             />
//           ),
//         }}
//       />

//       <Tab.Screen
//         name="AdminProfile"
//         component={AdminProfileScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               icon={focused ? "person" : "person-outline"}
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
//       <View style={[styles.iconCircle, focused && styles.iconCircleActive]}>
//         <Ionicons name={icon} size={22} color={focused ? C.white : C.muted} />
//       </View>

//       <Text style={[styles.tabText, focused && styles.activeText]}>{label}</Text>

//       {focused ? <View style={styles.activeDot} /> : null}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   tabBar: {
//     position: "absolute",
//     left: 12,
//     right: 12,
//     bottom: 12,
//     height: 74,
//     borderRadius: 26,
//     backgroundColor: C.primary,
//     borderTopWidth: 0,
//     elevation: 14,
//     shadowColor: C.primary,
//     shadowOpacity: 0.25,
//     shadowRadius: 16,
//     shadowOffset: { width: 0, height: 8 },
//     paddingTop: 8,
//     paddingBottom: Platform.OS === "ios" ? 18 : 8,
//   },

//   tabBarItem: {
//     height: 64,
//   },

//   tabItem: {
//     alignItems: "center",
//     justifyContent: "center",
//     minWidth: 58,
//   },

//   iconCircle: {
//     width: 34,
//     height: 34,
//     borderRadius: 14,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   iconCircleActive: {
//     backgroundColor: C.activeBg,
//   },

//   tabText: {
//     marginTop: 2,
//     fontSize: 10,
//     color: C.muted,
//     fontWeight: "800",
//   },

//   activeText: {
//     color: C.white,
//     fontWeight: "900",
//   },

//   activeDot: {
//     marginTop: 3,
//     width: 5,
//     height: 5,
//     borderRadius: 5,
//     backgroundColor: C.white,
//   },
// });

























import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Import Screens
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import ManageSellersScreen from "../screens/admin/ManageSellersScreen";
import ManageOrdersScreen from "../screens/admin/ManageOrdersScreen";
import ManageProductsScreen from "../screens/admin/ManageProductsScreen";
import AdminReportsScreen from "../screens/admin/AdminReportsScreen";
import AdminProfileScreen from "../screens/admin/AdminProfileScreen";
import AdminNotificationsScreen from "../screens/admin/AdminNotificationsScreen";

const Tab = createBottomTabNavigator();

const C = {
  primary: "#0e3243",
  white: "#FFFFFF",
  muted: "#B8CDD6",
  activeBg: "rgba(255,255,255,0.16)",
};

export default function AdminTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="AdminDashboard"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tab.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={focused ? "home" : "home-outline"}
              label="Home"
              focused={focused}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ManageSellers"
        component={ManageSellersScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={focused ? "storefront" : "storefront-outline"}
              label="Sellers"
              focused={focused}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ManageProducts"
        component={ManageProductsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={focused ? "cube" : "cube-outline"}
              label="Products"
              focused={focused}
            />
          ),
        }}
      />

      <Tab.Screen
        name="AdminReports"
        component={AdminReportsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={focused ? "bar-chart" : "bar-chart-outline"}
              label="Reports"
              focused={focused}
            />
          ),
        }}
      />

      <Tab.Screen
        name="AdminProfile"
        component={AdminProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={focused ? "person" : "person-outline"}
              label="Profile"
              focused={focused}
            />
          ),
        }}
      />

      
    </Tab.Navigator>
  );
}

function TabIcon({ icon, label, focused }) {
  return (
    <View style={styles.tabItem}>
      <View style={[styles.iconCircle, focused && styles.iconCircleActive]}>
        <Ionicons name={icon} size={22} color={focused ? C.white : C.muted} />
      </View>

      <Text style={[styles.tabText, focused && styles.activeText]}>{label}</Text>

      {focused ? <View style={styles.activeDot} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    height: 74,
    borderRadius: 26,
    backgroundColor: C.primary,
    borderTopWidth: 0,
    elevation: 14,
    shadowColor: C.primary,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 18 : 8,
  },

  tabBarItem: {
    height: 64,
  },

  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 58,
  },

  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  iconCircleActive: {
    backgroundColor: C.activeBg,
  },

  tabText: {
    marginTop: 2,
    fontSize: 10,
    color: C.muted,
    fontWeight: "800",
  },

  activeText: {
    color: C.white,
    fontWeight: "900",
  },

  activeDot: {
    marginTop: 3,
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: C.white,
  },
});