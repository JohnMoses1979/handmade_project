import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { showAlert } from "../../utils/showAlert";
import { signupCustomerAPI } from "../../api/customerApi";

const COLOR = "#082843";

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? "").trim());

export default function CustomerSignupScreen({ navigation, route }) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState(route.params?.email ?? "");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);

  const handleBackPress = () => {
    if (navigation.canGoBack?.()) {
      navigation.goBack();
      return;
    }
    navigation.navigate("CustomerLoginScreen", { role: "customer" });
  };

  const validate = () => {
    const nextErrors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (!trimmedName) {
      nextErrors.name = "Full name is required";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Email is required";
    } else if (!isValidEmail(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!trimmedPassword) {
      nextErrors.password = "Password is required";
    } else if (trimmedPassword.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    if (!trimmedConfirm) {
      nextErrors.confirmPassword = "Please confirm your password";
    } else if (trimmedPassword && trimmedConfirm !== trimmedPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) {
      return;
    }

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();

    setSubmitting(true);
    const result = await signupCustomerAPI({
      name: trimmedName,
      email: normalizedEmail,
      password: trimmedPassword,
      confirmPassword: trimmedConfirm,
    });
    setSubmitting(false);

    if (!result?.success) {
      showAlert("Sign Up Failed", result?.message || "Unable to create your account. Please try again.");
      return;
    }

    showAlert("Account Created", result?.message || "Your account has been created. Please login to continue.");
    navigation.replace("CustomerLoginScreen", {
      role: "customer",
      email: normalizedEmail,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={23} color={COLOR} />
        </TouchableOpacity>

        <View style={styles.topCircle} />
        <View style={styles.bottomCircle} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.logoBox}>
              <Ionicons name="person-add-outline" size={42} color={COLOR} />
            </View>

            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to start shopping handmade goods.</Text>

            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                value={name}
                onChangeText={(value) => {
                  setName(value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
              />
            </View>
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
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
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(value) => {
                  setConfirmPassword(value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowConfirmPassword((prev) => !prev)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={21}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

            <TouchableOpacity
              style={[styles.signupBtn, { backgroundColor: COLOR }, submitting && styles.btnDisabled]}
              activeOpacity={0.9}
              onPress={handleSignup}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.signupText}>Sign Up</Text>
                  <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginRow}
              activeOpacity={0.8}
              onPress={() =>
                navigation.replace("CustomerLoginScreen", {
                  role: "customer",
                  email: email.trim(),
                })
              }
            >
              <Text style={styles.loginRowText}>
                Already have an account? <Text style={styles.loginRowLink}>Login</Text>
              </Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>Secure sign up for handmade shopping</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
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
  title: { fontSize: 27, fontWeight: "900", textAlign: "center", color: COLOR },
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
    marginBottom: 6,
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
  errorText: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
    marginLeft: 4,
  },
  signupBtn: {
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    flexDirection: "row",
    gap: 8,
    shadowColor: COLOR,
    shadowOpacity: 0.24,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  btnDisabled: { opacity: 0.7 },
  signupText: { color: "#FFFFFF", fontWeight: "900", fontSize: 16 },
  loginRow: {
    marginTop: 18,
    alignSelf: "center",
  },
  loginRowText: {
    fontSize: 13.5,
    color: "#6B7280",
    fontWeight: "600",
  },
  loginRowLink: {
    color: COLOR,
    fontWeight: "900",
  },
  footerText: {
    marginTop: 14,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
  },
});