



// src/navigation/AppNavigator.js
// ✅ UPDATED — Added SellerPaymentSuccessScreen, SellerMyStoreScreen, SellerSettingsScreen, SellerHelpSupportScreen

import React, { useCallback, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, StyleSheet } from "react-native";

import { ShopProvider } from "../context/ShopContext";
import FloatingAIButton from "../components/FloatingAIButton";

// Common Screens
import SplashScreen from "../screens/SplashScreen";
import RoleSelectionScreen from "../screens/RoleSelectionScreen";

// Seller Screens
import SellerOnboardingScreen from "../screens/seller/SellerOnboardingScreen";
import SellerRegistrationScreen from "../screens/seller/SellerRegistrationScreen";
import SellerLoginScreen from "../screens/seller/SellerLoginScreen";
import SellerDashboardScreen from "../screens/seller/SellerDashboardScreen";
import AddProductScreen from "../screens/seller/AddProductScreen";
import ReviewAndPayScreen from "../screens/seller/SellerReviewandPayScreen";
import SellerPaymentSuccessScreen from "../screens/seller/SellerPaymentSucessScreen"; // ✅ NEW
import MyProductsScreen from "../screens/seller/MyProductsScreen";
import SellerOrdersScreen from "../screens/seller/SellerOrdersScreen";
import SellerProfileScreen from "../screens/seller/SellerProfileScreen";
import SellerNotificationScreen from "../screens/seller/SellerNotificationsScreen";
import SellerPayoutScreen from "../screens/seller/SellerPayoutsScreen";
import SellerDeliveryScreen from "../screens/seller/SellerDeliveryScreen";
import SellerReturnScreen from "../screens/seller/SellerReturnScreen";
import SellerComplaintNotificationScreen from "../screens/seller/SellerComplaintNotificationScreen";
import SellerComplaintDetailsScreen from "../screens/seller/SellerComplaintDetailsScreen";
import SellerMyStoreScreen from "../screens/seller/SellerMyStoreScreen";       // ✅ NEW
import SellerSettingsScreen from "../screens/seller/SellerSettingsScreen";     // ✅ NEW
import SellerHelpSupportScreen from "../screens/seller/SellerHelpSupportScreen"; // ✅ NEW

// Customer Screens
import CustomerOnboardingScreen from "../screens/customer/CustomerOnBoardingScreen";
import CustomerLoginScreen from "../screens/customer/CustomerLoginScreen";
import CustomerNotifications from "../screens/customer/CustomerNotificationsScreen";
import CustomerAIChatScreen from "../screens/customer/CustomerAIChatScreen";
import ProductListScreen from "../screens/customer/CustomerProductListScreen";
import CustomerProductDetailsScreen from "../screens/customer/CustomerProductDetailsScreen";
import CheckoutScreen from "../screens/customer/CheckoutScreen";
import MyOrdersScreen from "../screens/customer/CustomerMyOrdersScreen";
import OrderDetailScreen from "../screens/customer/CustomerOrderDetailScreen";
import CustomerSavedAddressScreen from "../screens/customer/CustomerSavedAddressScreen";
import CustomerChatSupportScreen from "../screens/customer/CustomerChatSupportScreen";
import CustomerComplaintScreen from "../screens/customer/CustomerComplaintScreen";
import AllCategoriesScreen from "../screens/customer/AllCategoriesScreen";
import CustomerEditProfile from "../screens/customer/CustomerEditProfile";
import CartScreen from "../screens/customer/CartScreen";

// Admin Screens
import AdminLoginScreen from "../screens/admin/AdminLoginScreen";
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import AdminProfileScreen from "../screens/admin/AdminProfileScreen";
import AdminNotificationsScreen from "../screens/admin/AdminNotificationsScreen";
import ManageUsersScreen from "../screens/admin/ManageUsersScreen";
import ManageSellersScreen from "../screens/admin/ManageSellersScreen";
import ManageProductsScreen from "../screens/admin/ManageProductsScreen";
import AdminProductDetailsScreen from "../screens/admin/AdminProductDetailsScreen";
import ManageOrdersScreen from "../screens/admin/ManageOrdersScreen";
import AdminCommissionScreen from "../screens/admin/AdminCommissionScreen";
import AdminReportsScreen from "../screens/admin/AdminReportsScreen";
import AdminPayoutsScreen from "../screens/admin/AdmitPayoutsScreen";
import SellerApprovalScreen from "../screens/admin/SellerApprovalScreen";
import SellerDetailsScreen from "../screens/admin/SellerDetailsScreen";
import SellerDocumentsScreen from "../screens/admin/SellerDocumentsScreen";
import AdminComplaintReviewScreen from "../screens/admin/AdminComplaintReviewScreen";

// Navigators
import SellerTabNavigator from "./SellerTabNavigator";
import CustomerTabNavigator from "./CustomerTabNavigator";
import AdminTabNavigator from "./AdminTabNavigator";

const Stack = createNativeStackNavigator();

const HIDE_AI_ON = [
  "SplashScreen",
  "RoleSelectionScreen",
  "SellerOnboardingScreen",
  "SellerRegistrationScreen",
  "SellerLoginScreen",
  "CustomerOnboardingScreen",
  "CustomerLoginScreen",
  "CustomerAIChatScreen",
  "AdminLoginScreen",
];

export default function AppNavigator() {
  const navigationRef = useNavigationContainerRef();
  const [currentRoute, setCurrentRoute] = useState("SplashScreen");

  const shouldShowAI = !HIDE_AI_ON.includes(currentRoute);

  const handleStateChange = useCallback(() => {
    const routeName = navigationRef.getCurrentRoute()?.name;
    if (routeName) {
      setCurrentRoute(routeName);
    }
  }, [navigationRef]);

  const openAIChat = useCallback(() => {
    navigationRef.navigate("CustomerAIChatScreen");
  }, [navigationRef]);

  return (
    <ShopProvider>
      <View style={styles.container}>
        <NavigationContainer ref={navigationRef} onReady={handleStateChange} onStateChange={handleStateChange}>
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={{
            headerShown: false,
            animationEnabled: true,
            cardStyle: { opacity: 1 },
          }}
        >
          {/* ───────── COMMON ───────── */}
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{ animationEnabled: false }}
          />
          <Stack.Screen
            name="RoleSelectionScreen"
            component={RoleSelectionScreen}
            options={{ animationEnabled: false }}
          />

          {/* ───────── SELLER FLOW ───────── */}
          <Stack.Screen
            name="SellerOnboardingScreen"
            component={SellerOnboardingScreen}
            options={{ animationEnabled: false }}
          />
          <Stack.Screen name="SellerRegistrationScreen" component={SellerRegistrationScreen} />
          <Stack.Screen name="SellerLoginScreen" component={SellerLoginScreen} />
          <Stack.Screen
            name="SellerTabs"
            component={SellerTabNavigator}
            options={{ animationEnabled: false }}
          />
          <Stack.Screen name="SellerDashboardScreen" component={SellerDashboardScreen} />
          <Stack.Screen name="AddProductScreen" component={AddProductScreen} />

          {/* Review & Pay → Payment Success */}
          <Stack.Screen
            name="ReviewAndPayScreen"
            component={ReviewAndPayScreen}
            options={{ animationEnabled: true }}
          />
          <Stack.Screen
            name="SellerPaymentSuccessScreen"  // ✅ NEW
            component={SellerPaymentSuccessScreen}
            options={{ animationEnabled: true, gestureEnabled: false }}
          />

          <Stack.Screen name="MyProductsScreen" component={MyProductsScreen} />
          <Stack.Screen name="SellerOrdersScreen" component={SellerOrdersScreen} />
          <Stack.Screen name="SellerProfileScreen" component={SellerProfileScreen} />
          <Stack.Screen name="SellerNotificationScreen" component={SellerNotificationScreen} />
          <Stack.Screen name="SellerPayoutScreen" component={SellerPayoutScreen} />
          <Stack.Screen name="SellerDeliveryScreen" component={SellerDeliveryScreen} />
          <Stack.Screen name="SellerReturnScreen" component={SellerReturnScreen} />
          <Stack.Screen name="SellerComplaintNotificationScreen" component={SellerComplaintNotificationScreen} />
          <Stack.Screen name="SellerComplaintDetails" component={SellerComplaintDetailsScreen} />

          {/* ✅ NEW: Profile sub-screens */}
          <Stack.Screen
            name="SellerMyStoreScreen"
            component={SellerMyStoreScreen}
            options={{ animationEnabled: true }}
          />
          <Stack.Screen
            name="SellerSettingsScreen"
            component={SellerSettingsScreen}
            options={{ animationEnabled: true }}
          />
          <Stack.Screen
            name="SellerHelpSupportScreen"
            component={SellerHelpSupportScreen}
            options={{ animationEnabled: true }}
          />

          {/* ───────── CUSTOMER FLOW ───────── */}
          <Stack.Screen
            name="CustomerOnboardingScreen"
            component={CustomerOnboardingScreen}
            options={{ animationEnabled: false }}
          />
          <Stack.Screen name="CustomerLoginScreen" component={CustomerLoginScreen} />
          <Stack.Screen
            name="CustomerTabs"
            component={CustomerTabNavigator}
            options={{ animationEnabled: false }}
          />
          <Stack.Screen name="ProductList" component={ProductListScreen} />
          <Stack.Screen name="ProductDetails" component={CustomerProductDetailsScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
          <Stack.Screen name="CustomerSavedAddress" component={CustomerSavedAddressScreen} />
          <Stack.Screen name="CustomerComplaintScreen" component={CustomerComplaintScreen} />
          <Stack.Screen name="CustomerChatSupport" component={CustomerChatSupportScreen} />
          <Stack.Screen name="CartScreen" component={CartScreen} />
          <Stack.Screen name="CustomerNotifications" component={CustomerNotifications} />
          <Stack.Screen name="CustomerAIChatScreen" component={CustomerAIChatScreen} />
          <Stack.Screen name="AllCategoriesScreen" component={AllCategoriesScreen} />
          <Stack.Screen
            name="CustomerEditProfile"
            component={CustomerEditProfile}
            options={{ animationEnabled: true }}
          />

          {/* ───────── ADMIN FLOW ───────── */}
          <Stack.Screen
            name="AdminLoginScreen"
            component={AdminLoginScreen}
            options={{ animationEnabled: false }}
          />
          <Stack.Screen
            name="AdminTabs"
            component={AdminTabNavigator}
            options={{ animationEnabled: false }}
          />
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          <Stack.Screen name="ManageUsers" component={ManageUsersScreen} />
          <Stack.Screen name="ManageSellers" component={ManageSellersScreen} />
          <Stack.Screen name="ManageProducts" component={ManageProductsScreen} />
          <Stack.Screen name="AdminProductDetailsScreen" component={AdminProductDetailsScreen} />
          <Stack.Screen name="ManageOrders" component={ManageOrdersScreen} />
          <Stack.Screen name="AdminCommission" component={AdminCommissionScreen} />
          <Stack.Screen name="AdminReports" component={AdminReportsScreen} />
          <Stack.Screen name="AdminComplaintReviewScreen" component={AdminComplaintReviewScreen} />
          <Stack.Screen name="SellerDocumentsScreen" component={SellerDocumentsScreen} />
          <Stack.Screen name="AdminPayouts" component={AdminPayoutsScreen} />
          <Stack.Screen name="SellerApprovals" component={SellerApprovalScreen} />
          <Stack.Screen name="SellerDetails" component={SellerDetailsScreen} />
          <Stack.Screen name="SellerDetailsScreen" component={SellerDetailsScreen} />
          <Stack.Screen name="AdminProfile" component={AdminProfileScreen} />
          <Stack.Screen name="AdminNotifications" component={AdminNotificationsScreen} />
        </Stack.Navigator>
        </NavigationContainer>

        {shouldShowAI ? <FloatingAIButton onPress={openAIChat} /> : null}
      </View>
    </ShopProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
