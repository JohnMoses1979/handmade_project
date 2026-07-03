// import React from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   SafeAreaView,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { setAuthSession, setCustomerAccount } from "../../utils/authSession";
// import { useShop } from "../../context/ShopContext";
// import { showAlert } from "../../utils/showAlert";
// import { adminLoginAPI } from "../../api/adminApi";
// import { loginCustomerAPI } from "../../api/customerApi";
// import { loginSellerAPI } from "../../api/sellerApi";

// export default function CustomerLoginScreen({ navigation, route }) {
//   const { reloadCustomerCommerceData, reloadCustomerAddresses, updateCustomerProfile } = useShop();

//   const role = route.params?.role || "customer";

//   const [email, setEmail] = React.useState(route.params?.email ?? "");
//   const [password, setPassword] = React.useState("");
//   const [showPassword, setShowPassword] = React.useState(false);

//   React.useEffect(() => {
//     if (typeof route.params?.email === "string" && route.params.email.trim()) {
//       setEmail(route.params.email);
//     }
//   }, [route.params?.email]);

//   const roleConfig = {
//     customer: {
//       title: "Customer Login",
//       subtitle: "Welcome back! Login to continue shopping.",
//       color: "#082843",
//       next: "CustomerTabs",
//       icon: "person-circle-outline",
//     },
//     seller: {
//       title: "Seller Login",
//       subtitle: "Manage products, orders and your shop.",
//       color: "#082843",
//       next: "SellerTabs",
//       icon: "storefront-outline",
//     },
//     admin: {
//       title: "Admin Login",
//       subtitle: "Manage users, sellers and platform data.",
//       color: "#082843",
//       next: "AdminTabs",
//       icon: "shield-checkmark-outline",
//     },
//   };

//   const current = roleConfig[role] || roleConfig.customer;

//   const handleBackPress = () => {
//     if (navigation.canGoBack?.()) {
//       navigation.goBack();
//       return;
//     }

//     navigation.navigate("RoleSelectionScreen");
//   };

//   const finishCustomerLogin = async (customerProfile, rawPassword) => {
//     const nextCustomer = {
//       email: customerProfile?.email ?? customerProfile?.customerEmail ?? email.trim().toLowerCase(),
//       phone: customerProfile?.phone ?? "",
//       name: customerProfile?.name ?? "",
//       password: rawPassword,
//       onboardingSeen: Boolean(customerProfile?.onboardingSeen),
//       registeredAt: customerProfile?.createdAt ?? new Date().toISOString(),
//     };

//     setCustomerAccount(nextCustomer);
//     updateCustomerProfile?.(nextCustomer);
//     setAuthSession({
//       role: "customer",
//       email: nextCustomer.email,
//       phone: nextCustomer.phone,
//       name: nextCustomer.name,
//       location: "",
//       bio: "",
//       avatar: null,
//     });

//     reloadCustomerCommerceData?.();
//     reloadCustomerAddresses?.();

//     if (!nextCustomer.onboardingSeen) {
//       navigation.reset({
//         index: 0,
//         routes: [{ name: "CustomerOnboardingScreen", params: { fromLogin: true } }],
//       });
//       return;
//     }

//     navigation.reset({
//       index: 0,
//       routes: [
//         {
//           name: "CustomerTabs",
//           params: {
//             screen: "HomeTab",
//             params: { screen: "CustomerHomeMain" },
//           },
//         },
//       ],
//     });
//   };

//   const handleLogin = async () => {
//     const inputValue = email.trim();
//     const normalizedInput = inputValue.toLowerCase();
//     const rawPassword = password.trim();

//     if (!normalizedInput || !rawPassword) {
//       showAlert("Required", "Please enter email or phone and password.");
//       return;
//     }

//     const adminResult = await adminLoginAPI({
//       email: normalizedInput,
//       password: rawPassword,
//     });
//     if (adminResult?.success) {
//       setAuthSession({
//         role: "admin",
//         email: adminResult?.admin?.email || normalizedInput,
//         name: adminResult?.admin?.name || "Admin",
//         phone: "",
//         location: "",
//         bio: "",
//         avatar: null,
//       });
//       navigation.replace("AdminTabs");
//       return;
//     }
//     if (role === "admin") {
//       showAlert(
//         "Login Failed",
//         adminResult?.message || "Use the correct admin email and password."
//       );
//       return;
//     }

//     if (role === "customer") {
//       const backendResult = await loginCustomerAPI(normalizedInput, rawPassword);

//       if (backendResult?.success) {
//         await finishCustomerLogin(
//           backendResult.customer || {
//             email: normalizedInput,
//             name: "",
//             phone: "",
//             onboardingSeen: false,
//           },
//           rawPassword
//         );
//         return;
//       }

//       const backendMessage = String(backendResult?.message ?? "").trim();
//       showAlert(
//         "Login Failed",
//         backendMessage || "Unable to login right now. Please try again."
//       );
//       return;
//     }

//     if (role === "seller") {
//       const backendResult = await loginSellerAPI(normalizedInput, rawPassword);

//       if (backendResult?.success && backendResult?.seller) {
//         setAuthSession({
//           role: "seller",
//           email: backendResult?.seller?.email || normalizedInput,
//           phone: backendResult?.seller?.phone || "",
//           name: backendResult?.seller?.name || "",
//           location: "",
//           bio: "",
//           avatar: null,
//           seller: backendResult.seller,
//         });
//         navigation.replace("SellerTabs");
//         return;
//       }

//       if (backendResult?.error === "pending") {
//         showAlert("Account Pending", backendResult?.message || "Your seller account is pending.");
//         return;
//       }

//       if (backendResult?.error === "rejected") {
//         showAlert("Account Rejected", backendResult?.message || "Your seller account was rejected.");
//         return;
//       }

//       if (backendResult?.error === "not_found") {
//         showAlert("Login Failed", backendResult?.message || "Invalid seller credentials.");
//         return;
//       }

//       showAlert(
//         "Login Failed",
//         backendResult?.message || "Invalid seller credentials. Please try again."
//       );
//       return;
//     }

//     setAuthSession({
//       role,
//       email: normalizedInput,
//       phone: "",
//       name: "",
//       location: "",
//       bio: "",
//       avatar: null,
//     });

//     navigation.replace(current.next);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         style={styles.keyboardView}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <TouchableOpacity
//           style={styles.backBtn}
//           activeOpacity={0.8}
//           onPress={handleBackPress}
//         >
//           <Ionicons name="arrow-back" size={23} color={current.color} />
//         </TouchableOpacity>

//         <View style={styles.topCircle} />
//         <View style={styles.bottomCircle} />

//         <View style={styles.card}>
//           <View style={styles.logoBox}>
//             <Ionicons name={current.icon} size={42} color={current.color} />
//           </View>

//           <Text style={[styles.title, { color: current.color }]}>{current.title}</Text>
//           <Text style={styles.subtitle}>{current.subtitle}</Text>

//           <View style={styles.inputWrapper}>
//             <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Email or Phone"
//               placeholderTextColor="#9CA3AF"
//               keyboardType="default"
//               autoCapitalize="none"
//               value={email}
//               onChangeText={setEmail}
//             />
//           </View>

//           <View style={styles.inputWrapper}>
//             <Ionicons
//               name="lock-closed-outline"
//               size={20}
//               color="#6B7280"
//               style={styles.inputIcon}
//             />

//             <TextInput
//               style={styles.input}
//               placeholder="Password"
//               placeholderTextColor="#9CA3AF"
//               secureTextEntry={!showPassword}
//               value={password}
//               onChangeText={setPassword}
//             />

//             <TouchableOpacity
//               activeOpacity={0.8}
//               onPress={() => setShowPassword((prev) => !prev)}
//               style={styles.eyeBtn}
//             >
//               <Ionicons
//                 name={showPassword ? "eye-outline" : "eye-off-outline"}
//                 size={21}
//                 color="#6B7280"
//               />
//             </TouchableOpacity>
//           </View>

//           {role === "customer" ? (
//             <TouchableOpacity
//               style={styles.forgotRow}
//               activeOpacity={0.8}
//               onPress={() =>
//                 navigation.navigate("CustomerForgotPasswordScreen", {
//                   email: email.trim(),
//                 })
//               }
//             >
//               <Text style={styles.forgotText}>Forgot Password?</Text>
//             </TouchableOpacity>
//           ) : null}

//           <TouchableOpacity
//             style={[styles.loginBtn, { backgroundColor: current.color }]}
//             activeOpacity={0.9}
//             onPress={handleLogin}
//           >
//             <Text style={styles.loginText}>Login</Text>
//             <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
//           </TouchableOpacity>

//           <Text style={styles.footerText}>Secure login for handmade shopping</Text>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#FFFFFF" },
//   keyboardView: { flex: 1, justifyContent: "center", paddingHorizontal: 20 },
//   backBtn: {
//     position: "absolute",
//     top: 48,
//     left: 20,
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: "#F3F4F6",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 20,
//   },
//   topCircle: {
//     position: "absolute",
//     top: -80,
//     right: -80,
//     width: 210,
//     height: 210,
//     borderRadius: 105,
//     backgroundColor: "#EFF6FF",
//   },
//   bottomCircle: {
//     position: "absolute",
//     bottom: -100,
//     left: -90,
//     width: 230,
//     height: 230,
//     borderRadius: 115,
//     backgroundColor: "#FDF2F8",
//   },
//   card: {
//     backgroundColor: "#FFFFFF",
//     paddingHorizontal: 22,
//     paddingVertical: 28,
//     borderRadius: 28,
//     borderWidth: 1,
//     borderColor: "#EEF2F7",
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 18,
//     shadowOffset: { width: 0, height: 8 },
//     elevation: 8,
//   },
//   logoBox: {
//     width: 78,
//     height: 78,
//     borderRadius: 24,
//     backgroundColor: "#F3F7FB",
//     alignItems: "center",
//     justifyContent: "center",
//     alignSelf: "center",
//     marginBottom: 16,
//   },
//   title: { fontSize: 27, fontWeight: "900", textAlign: "center" },
//   subtitle: {
//     marginTop: 8,
//     marginBottom: 24,
//     fontSize: 14,
//     color: "#6B7280",
//     textAlign: "center",
//     fontWeight: "600",
//     lineHeight: 20,
//   },
//   inputWrapper: {
//     height: 54,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 16,
//     backgroundColor: "#F9FAFB",
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 14,
//     paddingHorizontal: 14,
//   },
//   inputIcon: { marginRight: 10 },
//   input: {
//     flex: 1,
//     height: "100%",
//     fontSize: 15,
//     color: "#111827",
//     fontWeight: "600",
//   },
//   eyeBtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   forgotRow: {
//     alignSelf: "flex-end",
//     marginTop: -6,
//     marginBottom: 16,
//   },
//   forgotText: { color: "#082843", fontSize: 13, fontWeight: "900" },
//   loginBtn: {
//     height: 54,
//     borderRadius: 16,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 8,
//     flexDirection: "row",
//     gap: 8,
//     shadowColor: "#082843",
//     shadowOpacity: 0.24,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 5 },
//     elevation: 5,
//   },
//   loginText: { color: "#FFFFFF", fontWeight: "900", fontSize: 16 },
//   footerText: {
//     marginTop: 18,
//     textAlign: "center",
//     color: "#6B7280",
//     fontSize: 12,
//     fontWeight: "700",
//   },
// });  


































import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { setAuthSession, setCustomerAccount } from "../../utils/authSession";
import { useShop } from "../../context/ShopContext";
import { showAlert } from "../../utils/showAlert";
import { adminLoginAPI } from "../../api/adminApi";
import { loginCustomerAPI } from "../../api/customerApi";
import { loginSellerAPI } from "../../api/sellerApi";

export default function CustomerLoginScreen({ navigation, route }) {
  const { reloadCustomerCommerceData, reloadCustomerAddresses, updateCustomerProfile } = useShop();

  const role = route.params?.role || "customer";

  const [email, setEmail] = React.useState(route.params?.email ?? "");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  React.useEffect(() => {
    if (typeof route.params?.email === "string" && route.params.email.trim()) {
      setEmail(route.params.email);
    }
  }, [route.params?.email]);

  const roleConfig = {
    customer: {
      title: "Customer Login",
      subtitle: "Welcome back! Login to continue shopping.",
      color: "#082843",
      next: "CustomerTabs",
      icon: "person-circle-outline",
    },
    seller: {
      title: "Seller Login",
      subtitle: "Manage products, orders and your shop.",
      color: "#082843",
      next: "SellerTabs",
      icon: "storefront-outline",
    },
    admin: {
      title: "Admin Login",
      subtitle: "Manage users, sellers and platform data.",
      color: "#082843",
      next: "AdminTabs",
      icon: "shield-checkmark-outline",
    },
  };

  const current = roleConfig[role] || roleConfig.customer;

  const handleBackPress = () => {
    if (navigation.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("RoleSelectionScreen");
  };

  const finishCustomerLogin = async (customerProfile, rawPassword) => {
    const nextCustomer = {
      email: customerProfile?.email ?? customerProfile?.customerEmail ?? email.trim().toLowerCase(),
      phone: customerProfile?.phone ?? "",
      name: customerProfile?.name ?? "",
      password: rawPassword,
      onboardingSeen: Boolean(customerProfile?.onboardingSeen),
      registeredAt: customerProfile?.createdAt ?? new Date().toISOString(),
    };

    setCustomerAccount(nextCustomer);
    updateCustomerProfile?.(nextCustomer);
    setAuthSession({
      role: "customer",
      email: nextCustomer.email,
      phone: nextCustomer.phone,
      name: nextCustomer.name,
      location: "",
      bio: "",
      avatar: null,
    });

    reloadCustomerCommerceData?.();
    reloadCustomerAddresses?.();

    if (!nextCustomer.onboardingSeen) {
      navigation.reset({
        index: 0,
        routes: [{ name: "CustomerOnboardingScreen", params: { fromLogin: true } }],
      });
      return;
    }

    navigation.reset({
      index: 0,
      routes: [
        {
          name: "CustomerTabs",
          params: {
            screen: "HomeTab",
            params: { screen: "CustomerHomeMain" },
          },
        },
      ],
    });
  };

  const handleLogin = async () => {
    const inputValue = email.trim();
    const normalizedInput = inputValue.toLowerCase();
    const rawPassword = password.trim();

    if (!normalizedInput || !rawPassword) {
      showAlert("Required", "Please enter email or phone and password.");
      return;
    }

    const adminResult = await adminLoginAPI({
      email: normalizedInput,
      password: rawPassword,
    });
    if (adminResult?.success) {
      setAuthSession({
        role: "admin",
        email: adminResult?.admin?.email || normalizedInput,
        name: adminResult?.admin?.name || "Admin",
        phone: "",
        location: "",
        bio: "",
        avatar: null,
      });
      navigation.replace("AdminTabs");
      return;
    }
    if (role === "admin") {
      showAlert(
        "Login Failed",
        adminResult?.message || "Use the correct admin email and password."
      );
      return;
    }

    if (role === "customer") {
      const backendResult = await loginCustomerAPI(normalizedInput, rawPassword);

      if (backendResult?.success) {
        await finishCustomerLogin(
          backendResult.customer || {
            email: normalizedInput,
            name: "",
            phone: "",
            onboardingSeen: false,
          },
          rawPassword
        );
        return;
      }

      const backendMessage = String(backendResult?.message ?? "").trim();
      showAlert(
        "Login Failed",
        backendMessage || "Unable to login right now. Please try again."
      );
      return;
    }

    if (role === "seller") {
      const backendResult = await loginSellerAPI(normalizedInput, rawPassword);

      if (backendResult?.success && backendResult?.seller) {
        setAuthSession({
          role: "seller",
          email: backendResult?.seller?.email || normalizedInput,
          phone: backendResult?.seller?.phone || "",
          name: backendResult?.seller?.name || "",
          location: "",
          bio: "",
          avatar: null,
          seller: backendResult.seller,
        });
        navigation.replace("SellerTabs");
        return;
      }

      if (backendResult?.error === "pending") {
        showAlert("Account Pending", backendResult?.message || "Your seller account is pending.");
        return;
      }

      if (backendResult?.error === "rejected") {
        showAlert("Account Rejected", backendResult?.message || "Your seller account was rejected.");
        return;
      }

      if (backendResult?.error === "not_found") {
        showAlert("Login Failed", backendResult?.message || "Invalid seller credentials.");
        return;
      }

      showAlert(
        "Login Failed",
        backendResult?.message || "Invalid seller credentials. Please try again."
      );
      return;
    }

    setAuthSession({
      role,
      email: normalizedInput,
      phone: "",
      name: "",
      location: "",
      bio: "",
      avatar: null,
    });

    navigation.replace(current.next);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.8}
          onPress={handleBackPress}
        >
          <Ionicons name="arrow-back" size={23} color={current.color} />
        </TouchableOpacity>

        <View style={styles.topCircle} />
        <View style={styles.bottomCircle} />

        <View style={styles.card}>
          <View style={styles.logoBox}>
            <Ionicons name={current.icon} size={42} color={current.color} />
          </View>

          <Text style={[styles.title, { color: current.color }]}>{current.title}</Text>
          <Text style={styles.subtitle}>{current.subtitle}</Text>

          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email or Phone"
              placeholderTextColor="#9CA3AF"
              keyboardType="default"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#6B7280"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowPassword((prev) => !prev)}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={21}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {role === "customer" ? (
            <TouchableOpacity
              style={styles.forgotRow}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("CustomerForgotPasswordScreen", {
                  email: email.trim(),
                })
              }
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={[styles.loginBtn, { backgroundColor: current.color }]}
            activeOpacity={0.9}
            onPress={handleLogin}
          >
            <Text style={styles.loginText}>Login</Text>
            <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
          </TouchableOpacity>

          {role === "customer" ? (
            <TouchableOpacity
              style={styles.signupRow}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("CustomerSignupScreen", {
                  email: email.trim(),
                })
              }
            >
              <Text style={styles.signupRowText}>
                Don&apos;t have an account? <Text style={styles.signupRowLink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          ) : null}

          <Text style={styles.footerText}>Secure login for handmade shopping</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  keyboardView: { flex: 1, justifyContent: "center", paddingHorizontal: 20 },
  backBtn: {
    position: "absolute",
    top: 48,
    left: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  topCircle: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "#EFF6FF",
  },
  bottomCircle: {
    position: "absolute",
    bottom: -100,
    left: -90,
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "#FDF2F8",
  },
  card: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 22,
    paddingVertical: 28,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  logoBox: {
    width: 78,
    height: 78,
    borderRadius: 24,
    backgroundColor: "#F3F7FB",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  title: { fontSize: 27, fontWeight: "900", textAlign: "center" },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    fontWeight: "600",
    lineHeight: 20,
  },
  inputWrapper: {
    height: 54,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    backgroundColor: "#F9FAFB",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
  },
  eyeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  forgotRow: {
    alignSelf: "flex-end",
    marginTop: -6,
    marginBottom: 16,
  },
  forgotText: { color: "#082843", fontSize: 13, fontWeight: "900" },
  signupRow: {
    marginTop: 18,
    alignSelf: "center",
  },
  signupRowText: {
    fontSize: 13.5,
    color: "#6B7280",
    fontWeight: "600",
  },
  signupRowLink: {
    color: "#082843",
    fontWeight: "900",
  },
  loginBtn: {
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    flexDirection: "row",
    gap: 8,
    shadowColor: "#082843",
    shadowOpacity: 0.24,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  loginText: { color: "#FFFFFF", fontWeight: "900", fontSize: 16 },
  footerText: {
    marginTop: 18,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
  },
});