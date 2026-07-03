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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { adminLoginAPI } from "../../api/adminApi";
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
};

export default function AdminLoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert("Login Failed", "Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const result = await adminLoginAPI({
        email: email.trim(),
        password,
      });

      if (!result?.success) {
        showAlert("Login Failed", result?.message || "Invalid admin credentials.");
        return;
      }

      setAuthSession({
        role: "admin",
        email: result?.admin?.email || email.trim().toLowerCase(),
        name: result?.admin?.name || "Admin",
      });

      navigation.replace("AdminTabs");
    } catch (error) {
      showAlert("Login Failed", error?.message || "Unable to log in right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topSection}>
            <View style={styles.logoWrap}>
              <Ionicons name="shield-checkmark" size={48} color={C.white} />
            </View>
            <Text style={styles.appName}>Admin Portal</Text>
            <Text style={styles.tagline}>Secure access for administrators</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to manage your platform</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="mail-outline" size={18} color={C.muted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="admin@selfbusiness.com"
                  placeholderTextColor={C.muted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
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
                  placeholder="admin123"
                  placeholderTextColor={C.muted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPass}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setShowPass((v) => !v)} style={styles.eyeBtn}>
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
                <ActivityIndicator color={C.white} />
              ) : (
                <>
                  <Ionicons name="log-in-outline" size={20} color={C.white} />
                  <Text style={styles.loginBtnText}>Sign In</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.secureRow}>
              <Ionicons name="shield-checkmark-outline" size={14} color={C.muted} />
              <Text style={styles.secureText}>Admin credentials are verified by backend</Text>
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
