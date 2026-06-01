import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useShop } from "../../context/ShopContext";
import { forgotPasswordAPI, resetPasswordAPI, verifyOtpAPI } from "../../api/sellerApi";
import { setAuthSession } from "../../utils/authSession";
import { showAlert } from "../../utils/showAlert";

const { width } = Dimensions.get("window");

const C = {
  primary: "#082843",
  primaryDark: "#041a2d",
  primarySoft: "#dcecf7",
  white: "#FFFFFF",
  bg: "#f7fafc",
  card: "#FFFFFF",
  border: "#d7e2ec",
  text: "#102033",
  textSec: "#5f7184",
  textHint: "#9aabbb",
  accent: "#dd6b20",
  accentSoft: "#fff0e4",
  success: "#138a5b",
  successSoft: "#e7f8ef",
  danger: "#c2410c",
};

const createForgotState = () => ({
  email: "",
  otp: "",
  newPassword: "",
  confirmPassword: "",
  step: "email",
  sending: false,
  verifying: false,
  resetting: false,
});

const normalizeEmail = (value) => value.trim().toLowerCase();

const isValidEmail = (value) => /\S+@\S+\.\S+/.test(normalizeEmail(value));

const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = "default",
  icon,
  rightElement,
  editable = true,
  autoCapitalize = "none",
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={s.fieldWrap}>
      {label ? <Text style={s.fieldLabel}>{label}</Text> : null}
      <View
        style={[
          s.fieldBox,
          focused && s.fieldBoxFocused,
          !editable && s.fieldBoxDisabled,
        ]}
      >
        {icon ? <Text style={s.fieldIcon}>{icon}</Text> : null}
        <TextInput
          style={s.fieldInput}
          placeholder={placeholder}
          placeholderTextColor={C.textHint}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {rightElement}
      </View>
    </View>
  );
};

const SellerLoginScreen = ({ navigation }) => {
  const { loginSeller } = useShop();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgot, setForgot] = useState(createForgotState);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 650, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 7, useNativeDriver: true }),
    ]).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -10, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    );
    loop.start();

    return () => loop.stop();
  }, [fadeAnim, floatAnim, scaleAnim, slideAnim]);

  const updateForgot = (patch) => {
    setForgot((current) => ({ ...current, ...patch }));
  };

  const resetForgotFlow = () => {
    setForgotOpen(false);
    setForgot(createForgotState());
  };

  const handleLogin = () => {
    if (!email.trim()) {
      showAlert("Required", "Please enter email or phone number.");
      return;
    }
    if (!password) {
      showAlert("Required", "Please enter your password.");
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      const result = await loginSeller(email.trim(), password);
      setLoading(false);

      if (!result) {
        showAlert("Login Failed", "Invalid credentials. Please try again.");
        return;
      }

      if (result.error === "pending") {
        showAlert(
          "Account Pending",
          result.message || "Your account is pending admin approval."
        );
        return;
      }

      if (result.error === "rejected") {
        showAlert("Account Rejected", result.message || "Your seller account was rejected.");
        return;
      }

      if (result.error === "not_found") {
        showAlert(
          "Login Failed",
          result.message || "No account found with these credentials.",
          [
            { text: "Register", onPress: () => navigation.navigate("SellerRegistrationScreen") },
            { text: "Try Again", style: "cancel" },
          ]
        );
        return;
      }

      setAuthSession({
        role: "seller",
        email: result.email ?? email.trim().toLowerCase(),
        seller: result,
      });
      navigation.replace("SellerTabs");
    }, 1200);
  };

  const handleSendOtp = async () => {
    const targetEmail = normalizeEmail(forgot.email || email);
    if (!isValidEmail(targetEmail)) {
      showAlert("Invalid Email", "Enter a valid seller email address.");
      return;
    }

    updateForgot({ sending: true });
    const response = await forgotPasswordAPI(targetEmail);
    updateForgot({ sending: false });

    if (!response?.success) {
      showAlert("Unable to Send OTP", response?.message || "Please try again.");
      return;
    }

    setEmail(targetEmail);
    updateForgot({
      email: targetEmail,
      step: "otp",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    });
    showAlert("OTP Sent", response.message || "Check your email for the 6-digit OTP.");
  };

  const handleVerifyOtp = async () => {
    const targetEmail = normalizeEmail(forgot.email);
    const otpValue = forgot.otp.trim();

    if (!targetEmail || !isValidEmail(targetEmail)) {
      showAlert("Invalid Email", "Please enter a valid email first.");
      return;
    }
    if (!/^\d{6}$/.test(otpValue)) {
      showAlert("Invalid OTP", "Enter the 6-digit OTP sent to your email.");
      return;
    }

    updateForgot({ verifying: true });
    const response = await verifyOtpAPI(targetEmail, otpValue);
    updateForgot({ verifying: false });

    if (!response?.success) {
      showAlert("OTP Verification Failed", response?.message || "Please try again.");
      return;
    }

    updateForgot({ step: "reset" });
    showAlert("OTP Verified", response.message || "Set your new password now.");
  };

  const handleResetPassword = async () => {
    const targetEmail = normalizeEmail(forgot.email);
    const otpValue = forgot.otp.trim();
    const nextPassword = forgot.newPassword.trim();
    const confirmPassword = forgot.confirmPassword.trim();

    if (nextPassword.length < 6) {
      showAlert("Weak Password", "New password must be at least 6 characters.");
      return;
    }
    if (nextPassword !== confirmPassword) {
      showAlert("Password Mismatch", "New password and confirm password must match.");
      return;
    }

    updateForgot({ resetting: true });
    const response = await resetPasswordAPI(targetEmail, otpValue, nextPassword);
    updateForgot({ resetting: false });

    if (!response?.success) {
      showAlert("Reset Failed", response?.message || "Please try again.");
      return;
    }

    setPassword("");
    showAlert("Password Updated", response.message || "You can now login with your new password.");
    resetForgotFlow();
  };

  const renderForgotPanel = () => (
    <View style={s.forgotPanel}>
      <View style={s.forgotHeader}>
        <View>
          <Text style={s.forgotTitle}>Reset seller password</Text>
          <Text style={s.forgotSubtitle}>
            Use your registered email to receive an OTP and set a new password.
          </Text>
        </View>
        <TouchableOpacity onPress={resetForgotFlow} style={s.forgotClose}>
          <Text style={s.forgotCloseText}>Close</Text>
        </TouchableOpacity>
      </View>

      <View style={s.stepRow}>
        <View style={[s.stepChip, forgot.step === "email" && s.stepChipActive]}>
          <Text style={[s.stepChipText, forgot.step === "email" && s.stepChipTextActive]}>
            1. Email
          </Text>
        </View>
        <View style={[s.stepChip, forgot.step === "otp" && s.stepChipActive]}>
          <Text style={[s.stepChipText, forgot.step === "otp" && s.stepChipTextActive]}>
            2. OTP
          </Text>
        </View>
        <View style={[s.stepChip, forgot.step === "reset" && s.stepChipActive]}>
          <Text style={[s.stepChipText, forgot.step === "reset" && s.stepChipTextActive]}>
            3. Reset
          </Text>
        </View>
      </View>

      <InputField
        label="Registered Email"
        placeholder="seller@example.com"
        value={forgot.email}
        onChangeText={(value) => updateForgot({ email: value })}
        icon="@"
        keyboardType="email-address"
      />

      {forgot.step !== "email" ? (
        <InputField
          label="OTP Code"
          placeholder="Enter 6-digit OTP"
          value={forgot.otp}
          onChangeText={(value) => updateForgot({ otp: value.replace(/[^\d]/g, "").slice(0, 6) })}
          icon="#"
          keyboardType="number-pad"
        />
      ) : null}

      {forgot.step === "reset" ? (
        <>
          <InputField
            label="New Password"
            placeholder="Enter new password"
            value={forgot.newPassword}
            onChangeText={(value) => updateForgot({ newPassword: value })}
            icon="*"
            secureTextEntry
          />
          <InputField
            label="Confirm Password"
            placeholder="Re-enter new password"
            value={forgot.confirmPassword}
            onChangeText={(value) => updateForgot({ confirmPassword: value })}
            icon="*"
            secureTextEntry
          />
        </>
      ) : null}

      <View style={s.forgotActionRow}>
        {forgot.step === "email" ? (
          <TouchableOpacity
            style={s.secondaryBtn}
            onPress={handleSendOtp}
            disabled={forgot.sending}
          >
            {forgot.sending ? (
              <ActivityIndicator color={C.primary} size="small" />
            ) : (
              <Text style={s.secondaryBtnText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        ) : null}

        {forgot.step === "otp" ? (
          <>
            <TouchableOpacity
              style={s.ghostBtn}
              onPress={handleSendOtp}
              disabled={forgot.sending}
            >
              <Text style={s.ghostBtnText}>{forgot.sending ? "Sending..." : "Resend OTP"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.secondaryBtn}
              onPress={handleVerifyOtp}
              disabled={forgot.verifying}
            >
              {forgot.verifying ? (
                <ActivityIndicator color={C.primary} size="small" />
              ) : (
                <Text style={s.secondaryBtnText}>Verify OTP</Text>
              )}
            </TouchableOpacity>
          </>
        ) : null}

        {forgot.step === "reset" ? (
          <TouchableOpacity
            style={s.secondaryBtn}
            onPress={handleResetPassword}
            disabled={forgot.resetting}
          >
            {forgot.resetting ? (
              <ActivityIndicator color={C.primary} size="small" />
            ) : (
              <Text style={s.secondaryBtnText}>Update Password</Text>
            )}
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={s.forgotHintBox}>
        <Text style={s.forgotHintTitle}>SMTP and email note</Text>
        <Text style={s.forgotHintText}>
          OTP is delivered to the seller email from your backend SMTP configuration.
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <View style={s.bgBlob1} />
      <View style={s.bgBlob2} />

      <ScrollView
        style={s.screen}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => navigation.navigate("SellerOnboardingScreen")}
        >
          <Text style={s.backArrow}>{"<"}</Text>
        </TouchableOpacity>

        <Animated.View
          style={[s.heroSection, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
        >
          <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
            <LinearGradient colors={[C.primarySoft, C.white]} style={s.avatarCircle}>
              <Text style={s.avatarEmoji}>S</Text>
            </LinearGradient>
          </Animated.View>
          <View style={[s.orbitBadge, s.orbitBadge1]}>
            <Text style={s.orbitText}>Shop</Text>
          </View>
          <View style={[s.orbitBadge, s.orbitBadge2]}>
            <Text style={s.orbitText}>Sales</Text>
          </View>
          <View style={[s.orbitBadge, s.orbitBadge3]}>
            <Text style={s.orbitText}>OTP</Text>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={s.welcomeTextBlock}>
            <Text style={s.welcomeHello}>Seller Login</Text>
            <Text style={s.welcomeSub}>
              Sign in to manage your store, products, and password reset safely.
            </Text>
          </View>

          <View style={s.formCard}>
            <InputField
              label="Email or Phone Number"
              placeholder="Enter email or phone"
              value={email}
              onChangeText={setEmail}
              icon="@"
              keyboardType="email-address"
            />
            <InputField
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              icon="*"
              secureTextEntry={!showPwd}
              rightElement={
                <TouchableOpacity onPress={() => setShowPwd((value) => !value)} style={s.eyeBtn}>
                  <Text style={s.eyeBtnText}>{showPwd ? "Hide" : "Show"}</Text>
                </TouchableOpacity>
              }
            />

            <TouchableOpacity
              onPress={() => {
                setForgotOpen(true);
                if (!forgot.email && email.trim()) {
                  updateForgot({ email: normalizeEmail(email) });
                }
              }}
              style={s.forgotWrap}
            >
              <Text style={s.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.loginBtn}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[C.primary, C.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.loginBtnGrad}
              >
                {loading ? (
                  <ActivityIndicator color={C.white} size="small" />
                ) : (
                  <Text style={s.loginBtnText}>Login to Dashboard</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {forgotOpen ? renderForgotPanel() : null}

          <View style={s.orRow}>
            <View style={s.orLine} />
            <Text style={s.orText}>or continue with</Text>
            <View style={s.orLine} />
          </View>

          <View style={s.socialRow}>
            <TouchableOpacity
              style={s.socialBtn}
              onPress={() => showAlert("Google", "Google login coming soon.")}
              activeOpacity={0.8}
            >
              <Text style={s.googleG}>G</Text>
              <Text style={s.socialText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.socialBtn, s.fbBtn]}
              onPress={() => showAlert("Facebook", "Facebook login coming soon.")}
              activeOpacity={0.8}
            >
              <Text style={s.fbF}>f</Text>
              <Text style={[s.socialText, { color: C.white }]}>Facebook</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={s.registerRow}
            onPress={() => navigation.navigate("SellerRegistrationScreen")}
          >
            <Text style={s.registerText}>
              New seller? <Text style={s.registerBold}>Create an Account</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  content: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 48 },
  bgBlob1: {
    position: "absolute",
    top: -90,
    right: -50,
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: "#d8eefe",
    opacity: 0.9,
  },
  bgBlob2: {
    position: "absolute",
    bottom: 100,
    left: -80,
    width: width * 0.45,
    height: width * 0.45,
    borderRadius: width * 0.225,
    backgroundColor: "#ffe5cf",
    opacity: 0.8,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  backArrow: { fontSize: 18, color: C.primary, fontWeight: "800" },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    height: 170,
    marginVertical: 8,
    position: "relative",
  },
  avatarCircle: {
    width: 118,
    height: 118,
    borderRadius: 59,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.primary,
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  avatarEmoji: { fontSize: 46, color: C.primary, fontWeight: "900" },
  orbitBadge: {
    position: "absolute",
    minWidth: 54,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  orbitBadge1: { top: 12, left: "12%" },
  orbitBadge2: { top: 16, right: "10%" },
  orbitBadge3: { bottom: 12, left: "50%", marginLeft: -27 },
  orbitText: { fontSize: 11, color: C.text, fontWeight: "800" },
  welcomeTextBlock: { alignItems: "center", marginBottom: 24 },
  welcomeHello: { fontSize: 28, fontWeight: "900", color: C.text, textAlign: "center" },
  welcomeSub: {
    fontSize: 13,
    color: C.textSec,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
    maxWidth: 320,
  },
  formCard: {
    backgroundColor: C.white,
    borderRadius: 26,
    padding: 20,
    shadowColor: C.primary,
    shadowOpacity: 0.09,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#edf2f7",
  },
  fieldWrap: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: "800",
    color: C.text,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  fieldBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fcfdff",
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 13 : 7,
    minHeight: 52,
  },
  fieldBoxFocused: {
    borderColor: C.primary,
    borderWidth: 2,
    backgroundColor: C.white,
  },
  fieldBoxDisabled: { backgroundColor: "#f8fafc" },
  fieldIcon: {
    width: 18,
    marginRight: 8,
    fontSize: 14,
    color: C.textSec,
    textAlign: "center",
    fontWeight: "800",
  },
  fieldInput: { flex: 1, fontSize: 14, color: C.text, padding: 0 },
  eyeBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  eyeBtnText: { color: C.primary, fontSize: 12, fontWeight: "800" },
  forgotWrap: { alignSelf: "flex-end", marginTop: -6, marginBottom: 16 },
  forgotText: { fontSize: 13, color: C.primary, fontWeight: "800" },
  loginBtn: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: C.primary,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  loginBtnGrad: { paddingVertical: 17, alignItems: "center", justifyContent: "center" },
  loginBtnText: { color: C.white, fontSize: 16, fontWeight: "900", letterSpacing: 0.2 },
  forgotPanel: {
    backgroundColor: C.card,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e7eef5",
    marginBottom: 16,
    shadowColor: "#082843",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  forgotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
    gap: 12,
  },
  forgotTitle: { fontSize: 18, fontWeight: "900", color: C.text },
  forgotSubtitle: { fontSize: 12.5, lineHeight: 18, color: C.textSec, marginTop: 4, maxWidth: 250 },
  forgotClose: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  forgotCloseText: { color: C.primary, fontSize: 12, fontWeight: "800" },
  stepRow: { flexDirection: "row", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  stepChip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "#eef3f7",
  },
  stepChipActive: { backgroundColor: C.primary },
  stepChipText: { fontSize: 12, fontWeight: "800", color: C.textSec },
  stepChipTextActive: { color: C.white },
  forgotActionRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 4,
    marginBottom: 12,
  },
  secondaryBtn: {
    minWidth: 140,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 13,
    backgroundColor: C.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: { color: C.primary, fontWeight: "900", fontSize: 14 },
  ghostBtn: {
    minWidth: 120,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.white,
  },
  ghostBtnText: { color: C.text, fontWeight: "800", fontSize: 13 },
  forgotHintBox: {
    backgroundColor: C.successSoft,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#cfeedd",
  },
  forgotHintTitle: { color: C.success, fontWeight: "900", fontSize: 12.5, marginBottom: 3 },
  forgotHintText: { color: "#226b4a", fontSize: 12.5, lineHeight: 18 },
  orRow: { flexDirection: "row", alignItems: "center", marginBottom: 16, gap: 10 },
  orLine: { flex: 1, height: 1, backgroundColor: C.border },
  orText: { fontSize: 12, color: C.textSec },
  socialRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    backgroundColor: C.white,
    borderWidth: 1.5,
    borderColor: C.border,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  fbBtn: { backgroundColor: "#1877F2", borderColor: "#1877F2" },
  googleG: { fontSize: 18, fontWeight: "900", color: "#DB4437" },
  fbF: { fontSize: 18, fontWeight: "900", color: C.white },
  socialText: { fontSize: 14, fontWeight: "700", color: C.text },
  registerRow: { alignItems: "center", paddingVertical: 8 },
  registerText: { fontSize: 13.5, color: C.textSec },
  registerBold: { color: C.primary, fontWeight: "900" },
});

export default SellerLoginScreen;
