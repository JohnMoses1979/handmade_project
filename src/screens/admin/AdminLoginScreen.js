// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   StatusBar,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// const C = {
//   primary: "#082843",
//   primary2: "#001B36",
//   white: "#FFFFFF",
//   bg: "#FFFFFF",
//   text: "#0F172A",
//   muted: "#64748B",
//   border: "#E2E8F0",
//   soft: "#F1F5F9",
//   gold: "#F6C344",
//   danger: "#EF4444",
// };

// export default function AdminLoginScreen({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [remember, setRemember] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");

//   const handleLogin = () => {
//     setError("");

//     if (!email.trim()) {
//       setError("Please enter admin email.");
//       return;
//     }

//     if (!password.trim()) {
//       setError("Please enter password.");
//       return;
//     }

//     navigation.replace("AdminTabs");
//   };

//   return (
//     <View style={styles.safe}>
//       <StatusBar barStyle="light-content" backgroundColor={C.primary} />

//       <KeyboardAvoidingView
//         style={styles.flex}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//           contentContainerStyle={styles.scroll}
//         >
//           <View style={styles.topHeader}>
//             <View style={styles.logoCircle}>
//               <Ionicons name="shield-outline" size={76} color={C.white} />
//               <Ionicons
//                 name="person"
//                 size={31}
//                 color={C.white}
//                 style={styles.logoPerson}
//               />
//               <Ionicons
//                 name="priceless"
//                 size={27}
//                 color={C.gold}
//                 style={styles.logoCrown}
//               />
//             </View>

//             <Text style={styles.title}>Admin Login</Text>
//             <Text style={styles.subtitle}>
//               Welcome back! Please sign in to continue
//             </Text>
//           </View>

//           <View style={styles.form}>
//             <Text style={styles.label}>Email</Text>
//             <View style={styles.inputBox}>
//               <View style={styles.inputIconBox}>
//                 <Ionicons name="mail-outline" size={24} color={C.primary} />
//               </View>
//               <TextInput
//                 value={email}
//                 onChangeText={setEmail}
//                 placeholder="Enter admin email"
//                 placeholderTextColor="#94A3B8"
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 style={styles.input}
//               />
//             </View>

//             <Text style={[styles.label, { marginTop: 22 }]}>Password</Text>
//             <View style={styles.inputBox}>
//               <View style={styles.inputIconBox}>
//                 <Ionicons name="lock-closed-outline" size={24} color={C.primary} />
//               </View>
//               <TextInput
//                 value={password}
//                 onChangeText={setPassword}
//                 placeholder="Enter password"
//                 placeholderTextColor="#94A3B8"
//                 secureTextEntry={!showPassword}
//                 style={styles.input}
//               />
//               <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
//                 <Ionicons
//                   name={showPassword ? "eye-off-outline" : "eye-outline"}
//                   size={28}
//                   color="#475569"
//                 />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.row}>
//               <TouchableOpacity
//                 style={styles.rememberRow}
//                 onPress={() => setRemember((v) => !v)}
//               >
//                 <View style={[styles.checkBox, remember && styles.checkedBox]}>
//                   {remember && (
//                     <Ionicons name="checkmark" size={18} color={C.white} />
//                   )}
//                 </View>
//                 <Text style={styles.rememberText}>Remember me</Text>
//               </TouchableOpacity>

//               <TouchableOpacity>
//                 <Text style={styles.forgotText}>Forgot Password?</Text>
//               </TouchableOpacity>
//             </View>

//             {error ? <Text style={styles.errorText}>{error}</Text> : null}

//             <TouchableOpacity
//               style={styles.loginBtn}
//               activeOpacity={0.9}
//               onPress={handleLogin}
//             >
//               <Ionicons name="lock-closed-outline" size={27} color={C.white} />
//               <Text style={styles.loginText}>Login</Text>
//             </TouchableOpacity>

//             <View style={styles.orRow}>
//               <View style={styles.line} />
//               <Text style={styles.orText}>OR</Text>
//               <View style={styles.line} />
//             </View>

//             <View style={styles.secureBtn}>
//               <Ionicons name="shield-checkmark-outline" size={30} color={C.primary} />
//               <Text style={styles.secureBtnText}>Secure Admin Access</Text>
//             </View>

//             <View style={styles.infoCard}>
//               <View style={styles.infoIcon}>
//                 <Ionicons name="shield-checkmark-outline" size={40} color={C.primary} />
//               </View>

//               <View style={styles.infoTextBox}>
//                 <Text style={styles.infoTitle}>Admin Portal</Text>
//                 <Text style={styles.infoText}>
//                   Only authorized administrators can access this area. All
//                   activities are monitored.
//                 </Text>
//               </View>
//             </View>

//             <View style={styles.footer}>
//               <Ionicons name="shield-checkmark-outline" size={22} color={C.muted} />
//               <Text style={styles.footerText}>Secure • Private • Protected</Text>
//             </View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: C.bg,
//   },
//   flex: {
//     flex: 1,
//   },
//   scroll: {
//     flexGrow: 1,
//     paddingBottom: 40,
//   },

//   topHeader: {
//     height: 325,
//     backgroundColor: C.primary,
//     borderBottomLeftRadius: 100,
//     borderBottomRightRadius: 100,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingTop: Platform.OS === "ios" ? 30 : 16,
//   },
//   logoCircle: {
//     width: 118,
//     height: 118,
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 18,
//     position: "relative",
//   },
//   logoPerson: {
//     position: "absolute",
//     bottom: 29,
//   },
//   logoCrown: {
//     position: "absolute",
//     top: 28,
//   },
//   title: {
//     color: C.white,
//     fontSize: 37,
//     fontWeight: "900",
//     letterSpacing: 0.2,
//   },
//   subtitle: {
//     marginTop: 12,
//     color: "rgba(255,255,255,0.82)",
//     fontSize: 19,
//     fontWeight: "600",
//     textAlign: "center",
//   },

//   form: {
//     paddingHorizontal: 28,
//     paddingTop: 42,
//   },
//   label: {
//     color: C.text,
//     fontSize: 22,
//     fontWeight: "900",
//     marginBottom: 12,
//   },
//   inputBox: {
//     height: 74,
//     borderWidth: 1.6,
//     borderColor: C.border,
//     borderRadius: 19,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 18,
//     backgroundColor: C.white,
//   },
//   inputIconBox: {
//     width: 46,
//     height: 46,
//     borderRadius: 13,
//     backgroundColor: "#F1F5FF",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 16,
//   },
//   input: {
//     flex: 1,
//     fontSize: 18,
//     fontWeight: "700",
//     color: C.text,
//     height: "100%",
//   },

//   row: {
//     marginTop: 24,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   rememberRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   checkBox: {
//     width: 27,
//     height: 27,
//     borderRadius: 6,
//     borderWidth: 1.8,
//     borderColor: C.primary,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 10,
//   },
//   checkedBox: {
//     backgroundColor: C.primary,
//   },
//   rememberText: {
//     fontSize: 17,
//     fontWeight: "700",
//     color: C.text,
//   },
//   forgotText: {
//     fontSize: 17,
//     fontWeight: "800",
//     color: "#1646C8",
//   },
//   errorText: {
//     marginTop: 14,
//     fontSize: 14,
//     fontWeight: "800",
//     color: C.danger,
//   },

//   loginBtn: {
//     marginTop: 28,
//     height: 70,
//     borderRadius: 17,
//     backgroundColor: C.primary,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     gap: 18,
//     shadowColor: C.primary,
//     shadowOpacity: 0.28,
//     shadowRadius: 14,
//     shadowOffset: { width: 0, height: 8 },
//     elevation: 8,
//   },
//   loginText: {
//     color: C.white,
//     fontSize: 24,
//     fontWeight: "900",
//   },

//   orRow: {
//     marginTop: 38,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 22,
//   },
//   line: {
//     flex: 1,
//     height: 1.5,
//     backgroundColor: C.border,
//   },
//   orText: {
//     fontSize: 19,
//     color: "#475569",
//     fontWeight: "800",
//   },

//   secureBtn: {
//     marginTop: 28,
//     height: 72,
//     borderWidth: 1.5,
//     borderColor: C.border,
//     borderRadius: 18,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     gap: 14,
//     backgroundColor: C.white,
//   },
//   secureBtnText: {
//     color: C.text,
//     fontSize: 20,
//     fontWeight: "900",
//   },

//   infoCard: {
//     marginTop: 28,
//     borderRadius: 18,
//     borderWidth: 1.5,
//     borderColor: "#DBEAFE",
//     backgroundColor: "#F8FBFF",
//     padding: 24,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   infoIcon: {
//     width: 78,
//     height: 78,
//     borderRadius: 39,
//     backgroundColor: "#EAF2FF",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 18,
//   },
//   infoTextBox: {
//     flex: 1,
//   },
//   infoTitle: {
//     fontSize: 21,
//     fontWeight: "900",
//     color: C.primary,
//   },
//   infoText: {
//     marginTop: 7,
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#475569",
//     lineHeight: 23,
//   },

//   footer: {
//     marginTop: 44,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     gap: 10,
//   },
//   footerText: {
//     fontSize: 17,
//     fontWeight: "700",
//     color: C.muted,
//   },
// });
















// // src/screens/admin/AdminLoginScreen.js

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   StatusBar,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// const C = {
//   primary: "#082843",
//   primary2: "#001B36",
//   white: "#FFFFFF",
//   bg: "#FFFFFF",
//   text: "#0F172A",
//   muted: "#64748B",
//   border: "#E2E8F0",
//   soft: "#F1F5F9",
//   gold: "#F6C344",
//   danger: "#EF4444",
// };

// export default function AdminLoginScreen({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [remember, setRemember] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");

//   const handleLogin = () => {
//     setError("");

//     if (!email.trim()) {
//       setError("Please enter admin email.");
//       return;
//     }

//     if (!password.trim()) {
//       setError("Please enter password.");
//       return;
//     }

//     // After login go to AdminTabs
//     navigation.replace("AdminTabs");
//   };

//   return (
//     <View style={styles.safe}>
//       <StatusBar barStyle="light-content" backgroundColor={C.primary} />

//       <KeyboardAvoidingView
//         style={styles.flex}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//           contentContainerStyle={styles.scroll}
//         >
//           <View style={styles.topHeader}>
//             <TouchableOpacity
//               style={styles.backBtn}
//               onPress={() => navigation.goBack()}
//               activeOpacity={0.8}
//             >
//               <Ionicons name="arrow-back" size={24} color={C.white} />
//             </TouchableOpacity>

//             <View style={styles.logoCircle}>
//               <Ionicons name="shield-outline" size={76} color={C.white} />
//               <Ionicons
//                 name="person"
//                 size={31}
//                 color={C.white}
//                 style={styles.logoPerson}
//               />
//               <Ionicons
//                 name="star"
//                 size={27}
//                 color={C.gold}
//                 style={styles.logoCrown}
//               />
//             </View>

//             <Text style={styles.title}>Admin Login</Text>
//             <Text style={styles.subtitle}>
//               Welcome back! Please sign in to continue
//             </Text>
//           </View>

//           <View style={styles.form}>
//             <Text style={styles.label}>Email</Text>

//             <View style={styles.inputBox}>
//               <View style={styles.inputIconBox}>
//                 <Ionicons name="mail-outline" size={24} color={C.primary} />
//               </View>

//               <TextInput
//                 value={email}
//                 onChangeText={setEmail}
//                 placeholder="Enter admin email"
//                 placeholderTextColor="#94A3B8"
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 autoCorrect={false}
//                 style={styles.input}
//               />
//             </View>

//             <Text style={[styles.label, { marginTop: 22 }]}>Password</Text>

//             <View style={styles.inputBox}>
//               <View style={styles.inputIconBox}>
//                 <Ionicons
//                   name="lock-closed-outline"
//                   size={24}
//                   color={C.primary}
//                 />
//               </View>

//               <TextInput
//                 value={password}
//                 onChangeText={setPassword}
//                 placeholder="Enter password"
//                 placeholderTextColor="#94A3B8"
//                 secureTextEntry={!showPassword}
//                 autoCapitalize="none"
//                 autoCorrect={false}
//                 style={styles.input}
//               />

//               <TouchableOpacity
//                 onPress={() => setShowPassword((v) => !v)}
//                 activeOpacity={0.8}
//               >
//                 <Ionicons
//                   name={showPassword ? "eye-off-outline" : "eye-outline"}
//                   size={28}
//                   color="#475569"
//                 />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.row}>
//               <TouchableOpacity
//                 style={styles.rememberRow}
//                 onPress={() => setRemember((v) => !v)}
//                 activeOpacity={0.8}
//               >
//                 <View style={[styles.checkBox, remember && styles.checkedBox]}>
//                   {remember && (
//                     <Ionicons name="checkmark" size={18} color={C.white} />
//                   )}
//                 </View>

//                 <Text style={styles.rememberText}>Remember me</Text>
//               </TouchableOpacity>

//               <TouchableOpacity activeOpacity={0.8}>
//                 <Text style={styles.forgotText}>Forgot Password?</Text>
//               </TouchableOpacity>
//             </View>

//             {error ? <Text style={styles.errorText}>{error}</Text> : null}

//             <TouchableOpacity
//               style={styles.loginBtn}
//               activeOpacity={0.9}
//               onPress={handleLogin}
//             >
//               <Ionicons name="lock-closed-outline" size={27} color={C.white} />
//               <Text style={styles.loginText}>Login</Text>
//             </TouchableOpacity>

//             <View style={styles.orRow}>
//               <View style={styles.line} />
//               <Text style={styles.orText}>OR</Text>
//               <View style={styles.line} />
//             </View>

//             <View style={styles.secureBtn}>
//               <Ionicons
//                 name="shield-checkmark-outline"
//                 size={30}
//                 color={C.primary}
//               />
//               <Text style={styles.secureBtnText}>Secure Admin Access</Text>
//             </View>

//             <View style={styles.infoCard}>
//               <View style={styles.infoIcon}>
//                 <Ionicons
//                   name="shield-checkmark-outline"
//                   size={40}
//                   color={C.primary}
//                 />
//               </View>

//               <View style={styles.infoTextBox}>
//                 <Text style={styles.infoTitle}>Admin Portal</Text>
//                 <Text style={styles.infoText}>
//                   Only authorized administrators can access this area. All
//                   activities are monitored.
//                 </Text>
//               </View>
//             </View>

//             <View style={styles.footer}>
//               <Ionicons
//                 name="shield-checkmark-outline"
//                 size={22}
//                 color={C.muted}
//               />
//               <Text style={styles.footerText}>
//                 Secure • Private • Protected
//               </Text>
//             </View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: C.bg,
//   },
//   flex: {
//     flex: 1,
//   },
//   scroll: {
//     flexGrow: 1,
//     paddingBottom: 40,
//   },
//   topHeader: {
//     height: 325,
//     backgroundColor: C.primary,
//     borderBottomLeftRadius: 100,
//     borderBottomRightRadius: 100,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingTop: Platform.OS === "ios" ? 30 : 16,
//   },
//   backBtn: {
//     position: "absolute",
//     top: Platform.OS === "ios" ? 55 : 35,
//     left: 22,
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: "rgba(255,255,255,0.16)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   logoCircle: {
//     width: 118,
//     height: 118,
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 18,
//     position: "relative",
//   },
//   logoPerson: {
//     position: "absolute",
//     bottom: 29,
//   },
//   logoCrown: {
//     position: "absolute",
//     top: 28,
//   },
//   title: {
//     color: C.white,
//     fontSize: 37,
//     fontWeight: "900",
//     letterSpacing: 0.2,
//   },
//   subtitle: {
//     marginTop: 12,
//     color: "rgba(255,255,255,0.82)",
//     fontSize: 19,
//     fontWeight: "600",
//     textAlign: "center",
//     paddingHorizontal: 20,
//   },
//   form: {
//     paddingHorizontal: 28,
//     paddingTop: 42,
//   },
//   label: {
//     color: C.text,
//     fontSize: 22,
//     fontWeight: "900",
//     marginBottom: 12,
//   },
//   inputBox: {
//     height: 74,
//     borderWidth: 1.6,
//     borderColor: C.border,
//     borderRadius: 19,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 18,
//     backgroundColor: C.white,
//   },
//   inputIconBox: {
//     width: 46,
//     height: 46,
//     borderRadius: 13,
//     backgroundColor: "#F1F5FF",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 16,
//   },
//   input: {
//     flex: 1,
//     fontSize: 18,
//     fontWeight: "700",
//     color: C.text,
//     height: "100%",
//   },
//   row: {
//     marginTop: 24,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   rememberRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   checkBox: {
//     width: 27,
//     height: 27,
//     borderRadius: 6,
//     borderWidth: 1.8,
//     borderColor: C.primary,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 10,
//   },
//   checkedBox: {
//     backgroundColor: C.primary,
//   },
//   rememberText: {
//     fontSize: 17,
//     fontWeight: "700",
//     color: C.text,
//   },
//   forgotText: {
//     fontSize: 17,
//     fontWeight: "800",
//     color: "#1646C8",
//   },
//   errorText: {
//     marginTop: 14,
//     fontSize: 14,
//     fontWeight: "800",
//     color: C.danger,
//   },
//   loginBtn: {
//     marginTop: 28,
//     height: 70,
//     borderRadius: 17,
//     backgroundColor: C.primary,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     gap: 18,
//     shadowColor: C.primary,
//     shadowOpacity: 0.28,
//     shadowRadius: 14,
//     shadowOffset: { width: 0, height: 8 },
//     elevation: 8,
//   },
//   loginText: {
//     color: C.white,
//     fontSize: 24,
//     fontWeight: "900",
//   },
//   orRow: {
//     marginTop: 38,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 22,
//   },
//   line: {
//     flex: 1,
//     height: 1.5,
//     backgroundColor: C.border,
//   },
//   orText: {
//     fontSize: 19,
//     color: "#475569",
//     fontWeight: "800",
//   },
//   secureBtn: {
//     marginTop: 28,
//     height: 72,
//     borderWidth: 1.5,
//     borderColor: C.border,
//     borderRadius: 18,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     gap: 14,
//     backgroundColor: C.white,
//   },
//   secureBtnText: {
//     color: C.text,
//     fontSize: 20,
//     fontWeight: "900",
//   },
//   infoCard: {
//     marginTop: 28,
//     borderRadius: 18,
//     borderWidth: 1.5,
//     borderColor: "#DBEAFE",
//     backgroundColor: "#F8FBFF",
//     padding: 24,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   infoIcon: {
//     width: 78,
//     height: 78,
//     borderRadius: 39,
//     backgroundColor: "#EAF2FF",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 18,
//   },
//   infoTextBox: {
//     flex: 1,
//   },
//   infoTitle: {
//     fontSize: 21,
//     fontWeight: "900",
//     color: C.primary,
//   },
//   infoText: {
//     marginTop: 7,
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#475569",
//     lineHeight: 23,
//   },
//   footer: {
//     marginTop: 44,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     gap: 10,
//   },
//   footerText: {
//     fontSize: 17,
//     fontWeight: "700",
//     color: C.muted,
//   },
// });



































// src/screens/admin/AdminLoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { setAuthSession } from "../../utils/authSession";
import { showAlert } from "../../utils/showAlert";

const C = {
  primary: "#0e3243",
  accent: "#1a9e6e",
  white: "#FFFFFF",
  bg: "#f4f6f9",
  text: "#0e3243",
  muted: "#7a93a0",
  border: "#e2eaf0",
  red: "#e74c3c",
};

export default function AdminLoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      showAlert("Error", "Please enter email and password");
      return;
    }

    if (
      email.trim().toLowerCase() !== "admin@selfbusiness.com" ||
      password !== "admin123"
    ) {
      showAlert("Login Failed", "Use admin@selfbusiness.com / admin123");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAuthSession({ role: "admin", email: email.trim().toLowerCase() });
      navigation.replace("AdminTabs");
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Top Section */}
          <View style={styles.topSection}>
            <View style={styles.logoWrap}>
              <Ionicons name="shield-checkmark" size={48} color={C.white} />
            </View>
            <Text style={styles.appName}>Admin Portal</Text>
            <Text style={styles.tagline}>Secure access for administrators</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to manage your platform</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="mail-outline" size={18} color={C.muted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="admin@example.com"
                  placeholderTextColor={C.muted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrap}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={C.muted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={C.muted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPass}
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                  <Ionicons
                    name={showPass ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={C.muted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginBtn, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.loginBtnText}>Signing in...</Text>
              ) : (
                <>
                  <Ionicons name="log-in-outline" size={20} color={C.white} />
                  <Text style={styles.loginBtnText}>Sign In</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.secureRow}>
              <Ionicons name="shield-checkmark-outline" size={14} color={C.muted} />
              <Text style={styles.secureText}>Secured with 256-bit encryption</Text>
            </View>
          </View>

          <Text style={styles.version}>Admin Panel v1.0.0</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.primary },
  scroll: { flexGrow: 1, paddingBottom: 40 },
  topSection: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: C.primary,
  },
  logoWrap: {
    backgroundColor: "rgba(255,255,255,0.15)",
    width: 90,
    height: 90,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  appName: { color: C.white, fontSize: 26, fontWeight: "800", letterSpacing: 0.5 },
  tagline: { color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 4 },
  card: {
    backgroundColor: C.white,
    borderRadius: 28,
    padding: 28,
    margin: 20,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
  title: { fontSize: 22, fontWeight: "800", color: C.text, marginBottom: 6 },
  subtitle: { fontSize: 13, color: C.muted, marginBottom: 28 },
  inputGroup: { marginBottom: 18 },
  inputLabel: { fontSize: 12, fontWeight: "700", color: C.text, marginBottom: 8 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 12,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, height: 48, fontSize: 14, color: C.text },
  eyeBtn: { padding: 4 },
  forgotBtn: { alignSelf: "flex-end", marginBottom: 24 },
  forgotText: { fontSize: 13, color: C.primary, fontWeight: "700" },
  loginBtn: {
    backgroundColor: C.primary,
    borderRadius: 14,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  loginBtnText: { color: C.white, fontSize: 16, fontWeight: "800" },
  secureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  secureText: { fontSize: 11, color: C.muted },
  version: { textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 20 },
});


























