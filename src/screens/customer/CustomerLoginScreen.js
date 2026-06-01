

import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";  // Ensure COLORS are correctly imported
import { getCustomerAccount, setAuthSession, setCustomerAccount } from "../../utils/authSession";
import { useShop } from "../../context/ShopContext";
import { showAlert } from "../../utils/showAlert";

export default function CustomerLoginScreen({ navigation, route }) {
  const { reloadCustomerCommerceData, reloadCustomerAddresses, updateCustomerProfile } = useShop();
  const role = route.params?.role || "customer";  // Default to 'customer' if no role is passed
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Role configuration for different login flows
  const roleConfig = {
    customer: {
      title: "Customer Login",
      color: "#082843",  // Color for Customer
      next: "CustomerTabs",  // Navigate to CustomerTabs after login
    },
    seller: {
      title: "Seller Login",
      color: "#082843",  // Color for Seller
      next: "SellerTabs",  // Navigate to SellerTabs after login
    },
    admin: {
      title: "Admin Login",
      color: "#082843",  // Color for Admin
      next: "AdminTabs",  // Navigate to AdminTabs after login
    },
  };

  const current = roleConfig[role];  // Get the current role configuration

  // Login handler function
  const handleLogin = () => {
    const inputValue = email.trim();
    const normalizedInput = inputValue.toLowerCase();
    if (!normalizedInput || !password.trim()) {
      showAlert("Required", "Please enter email or phone and password.");
      return;
    }

    if (role === "customer") {
      const savedCustomer = getCustomerAccount();
      if (savedCustomer) {
        const savedEmail = String(savedCustomer.email ?? "").trim().toLowerCase();
        const savedPhone = String(savedCustomer.phone ?? "").trim();
        const emailMatches = !!savedEmail && savedEmail === normalizedInput;
        const phoneMatches = !!savedPhone && savedPhone === inputValue;

        if ((!emailMatches && !phoneMatches) || savedCustomer.password !== password) {
          showAlert("Login Failed", "Please use your registered customer credentials.");
          return;
        }

        updateCustomerProfile?.({
          ...savedCustomer,
          email: savedEmail,
          phone: savedPhone,
        });
      } else {
        const nextCustomer = {
          email: normalizedInput.includes("@") ? normalizedInput : "",
          phone: normalizedInput.includes("@") ? "" : inputValue,
          password,
          registeredAt: new Date().toISOString(),
        };
        setCustomerAccount(nextCustomer);
        updateCustomerProfile?.(nextCustomer);
      }
    }

    if (role === "admin") {
      if (normalizedInput !== "admin@selfbusiness.com" || password !== "admin123") {
        showAlert("Login Failed", "Use admin@selfbusiness.com / admin123");
        return;
      }
    }
    if (role === "seller") {
      if (normalizedInput !== "seller@selfbusiness.com" || password !== "seller123") {
        showAlert("Login Failed", "Use seller@selfbusiness.com / seller123");
        return;
      }
    }

    const savedCustomer = role === "customer" ? getCustomerAccount() : null;
    setAuthSession({
      role,
      email: savedCustomer?.email ?? normalizedInput,
      phone: savedCustomer?.phone ?? "",
      name: savedCustomer?.name ?? "",
      location: savedCustomer?.location ?? "",
      bio: savedCustomer?.bio ?? "",
      avatar: savedCustomer?.avatar ?? null,
    });

    if (role === "customer") {
      reloadCustomerCommerceData?.();
      reloadCustomerAddresses?.();
    }

    if (role === "customer") {
      navigation.replace(current.next, { screen: "ProfileTab" });
      return;
    }

    navigation.replace(current.next);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* BACK BUTTON */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}  // Go back to the previous screen
      >
        <Ionicons name="arrow-back" size={24} color={current.color} />
      </TouchableOpacity>

      <View style={styles.card}>
        {/* Title based on the current role */}
        <Text style={[styles.title, { color: current.color }]}>
          {current.title}
        </Text>

        {/* Email or Phone Input */}
        <TextInput
          style={styles.input}
          placeholder="Email or Phone"
          keyboardType="default"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry  // Mask the password input
          value={password}
          onChangeText={setPassword}
        />

        {/* LOGIN BUTTON */}
        <TouchableOpacity
          style={[styles.loginBtn, { backgroundColor: current.color }]}  // Dynamic background color based on role
          onPress={handleLogin}  // Handle login and navigate
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.or}>or continue with</Text>

        {/* Social Media Login Buttons */}
        <View style={styles.socialRow}>
          <Ionicons name="logo-google" size={30} color="#EA4335" />
          <Ionicons name="logo-facebook" size={30} color="#1877F2" />
          <Ionicons name="logo-apple" size={30} color="#111" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",  // Background color based on global color settings
    justifyContent: "center",  // Center content vertically
    padding: 20,  // Padding around the screen
  },
  backBtn: {
    position: "absolute",
    top: 50,  // Position the back button at the top left
    left: 20,
    zIndex: 10,  // Make sure it's above other components
  },
  card: {
    backgroundColor: "#fff",  // White background for the login card
    padding: 24,
    borderRadius: 20,  // Rounded corners for the card
    elevation: 5,  // Shadow effect for the card
  },
  title: {
    fontSize: 26,  // Font size for the title
    fontWeight: "900",  // Bold font weight
    textAlign: "center",  // Center the title
    marginBottom: 20,  // Space below the title
  },
  input: {
    height: 48,  // Set height for input fields
    borderWidth: 1,
    borderColor: "#E5E7EB",  // Light grey border color
    borderRadius: 12,  // Rounded corners for the input fields
    paddingHorizontal: 12,  // Padding inside the input
    marginBottom: 12,  // Space between input fields
  },
  loginBtn: {
    height: 48,  // Height of the login button
    borderRadius: 12,  // Rounded corners for the button
    alignItems: "center",  // Center the text inside the button
    justifyContent: "center",  // Center the text inside the button vertically
    marginTop: 10,  // Space above the button
  },
  loginText: {
    color: "#fff",  // White text color for the login button
    fontWeight: "900",  // Bold text
    fontSize: 16,  // Font size of the button text
  },
  or: {
    textAlign: "center",  // Center the 'or continue with' text
    marginVertical: 14,  // Space above and below the 'or' text
    color: "#6B7280",  // Dark grey color for the text
  },
  socialRow: {
    flexDirection: "row",  // Arrange social media icons in a row
    justifyContent: "center",  // Center them horizontally
    gap: 25,  // Space between icons
  },
});
