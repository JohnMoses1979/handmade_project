import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
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
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { forgotCustomerPasswordAPI, resetCustomerPasswordAPI, verifyCustomerOtpAPI } from "../../api/customerApi";
import { getCustomerAccount, setCustomerAccount } from "../../utils/authSession";
import { showAlert } from "../../utils/showAlert";

const COLORS = {
  primary: "#082843",
  primaryDark: "#041a2d",
  primarySoft: "#d9ecfb",
  accent: "#ff7b54",
  accentSoft: "#ffe7dd",
  bg: "#f6f9fc",
  card: "#ffffff",
  text: "#112033",
  textSec: "#5d6f82",
  border: "#e3ebf2",
  success: "#1f8b5b",
  successSoft: "#e6f8ef",
  danger: "#c2410c",
};

const createState = (email = "") => ({
  email,
  otp: "",
  newPassword: "",
  confirmPassword: "",
  step: "email",
  sending: false,
  verifying: false,
  resetting: false,
});

const normalizeEmail = (value) => String(value ?? "").trim().toLowerCase();

const isValidEmail = (value) => /\S+@\S+\.\S+/.test(normalizeEmail(value));

const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = "default",
  icon,
  maxLength,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.fieldBox, focused && styles.fieldBoxFocused]}>
        {icon ? <Ionicons name={icon} size={18} color={COLORS.textSec} style={styles.fieldIcon} /> : null}
        <TextInput
          style={styles.fieldInput}
          placeholder={placeholder}
          placeholderTextColor="#9aa9b8"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
    </View>
  );
};

export default function CustomerForgotPasswordScreen({ navigation, route }) {
  const initialEmail = useMemo(() => normalizeEmail(route.params?.email), [route.params?.email]);
  const [state, setState] = useState(() => createState(initialEmail));

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(28)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 650, useNativeDriver: true }),
    ]).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -8, duration: 1800, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [fadeAnim, floatAnim, slideAnim]);

  useEffect(() => {
    if (initialEmail) {
      setState((current) => ({ ...current, email: initialEmail }));
    }
  }, [initialEmail]);

  const updateState = (patch) => {
    setState((current) => ({ ...current, ...patch }));
  };

  const handleBackPress = () => {
    if (navigation.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("CustomerLoginScreen", { role: "customer", email: state.email });
  };

  const resetFlow = () => {
    const rememberedEmail = normalizeEmail(state.email);
    setState(createState(rememberedEmail));
  };

  const handleSendOtp = async () => {
    const targetEmail = normalizeEmail(state.email);
    if (!isValidEmail(targetEmail)) {
      showAlert("Invalid Email", "Please enter a valid registered email.");
      return;
    }

    updateState({ sending: true });
    const response = await forgotCustomerPasswordAPI(targetEmail);
    updateState({ sending: false });

    if (!response?.success) {
      showAlert("Unable to Send OTP", response?.message || "Please try again.");
      return;
    }

    updateState({
      email: targetEmail,
      step: "otp",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    });

    showAlert("OTP Sent", response.message || "Check your email for the 6-digit OTP.");
  };

  const handleVerifyOtp = async () => {
    const targetEmail = normalizeEmail(state.email);
    const otpValue = String(state.otp ?? "").trim();

    if (!isValidEmail(targetEmail)) {
      showAlert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    if (!/^\d{6}$/.test(otpValue)) {
      showAlert("Invalid OTP", "Enter the 6-digit OTP sent to your email.");
      return;
    }

    updateState({ verifying: true });
    const response = await verifyCustomerOtpAPI(targetEmail, otpValue);
    updateState({ verifying: false });

    if (!response?.success) {
      showAlert("OTP Verification Failed", response?.message || "Please try again.");
      return;
    }

    updateState({ step: "reset" });
    showAlert("OTP Verified", response.message || "Create your new password now.");
  };

  const handleResetPassword = async () => {
    const targetEmail = normalizeEmail(state.email);
    const otpValue = String(state.otp ?? "").trim();
    const nextPassword = String(state.newPassword ?? "").trim();
    const confirmPassword = String(state.confirmPassword ?? "").trim();

    if (nextPassword.length < 6) {
      showAlert("Weak Password", "Password must be at least 6 characters.");
      return;
    }
    if (nextPassword !== confirmPassword) {
      showAlert("Password Mismatch", "New password and confirm password must match.");
      return;
    }

    updateState({ resetting: true });
    const response = await resetCustomerPasswordAPI(targetEmail, otpValue, nextPassword);
    updateState({ resetting: false });

    if (!response?.success) {
      showAlert("Reset Failed", response?.message || "Please try again.");
      return;
    }

    const currentAccount = getCustomerAccount() || {};
    setCustomerAccount({
      ...currentAccount,
      email: targetEmail,
      password: nextPassword,
      phone: currentAccount.phone ?? "",
      name: currentAccount.name ?? "",
      registeredAt: currentAccount.registeredAt ?? new Date().toISOString(),
    });

    showAlert("Password Updated", response.message || "You can now login with your new password.");
    navigation.replace("CustomerLoginScreen", {
      role: "customer",
      email: targetEmail,
    });
  };

  const renderStepChip = (label, stepKey) => (
    <View style={[styles.stepChip, state.step === stepKey && styles.stepChipActive]}>
      <Text style={[styles.stepChipText, state.step === stepKey && styles.stepChipTextActive]}>{label}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <View style={styles.bgBlob1} />
      <View style={styles.bgBlob2} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.backBtn} onPress={handleBackPress} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>

        <Animated.View style={[styles.hero, { opacity: fadeAnim, transform: [{ translateY: floatAnim }] }]}>
          <LinearGradient
            colors={[COLORS.primarySoft, "#ffffff"]}
            style={styles.heroCircle}
          >
            <Ionicons name="mail-unread-outline" size={42} color={COLORS.primary} />
          </LinearGradient>
          <View style={[styles.badge, styles.badgeLeft]}>
            <Text style={styles.badgeText}>Email OTP</Text>
          </View>
          <View style={[styles.badge, styles.badgeRight]}>
            <Text style={styles.badgeText}>Secure Reset</Text>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.headerCard}>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your email, verify the OTP sent to your inbox, and set a new password.
            </Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.stepRow}>
              {renderStepChip("1. Email", "email")}
              {renderStepChip("2. OTP", "otp")}
              {renderStepChip("3. Reset", "reset")}
            </View>

            <InputField
              label="Registered Email"
              placeholder="you@example.com"
              value={state.email}
              onChangeText={(value) => updateState({ email: value })}
              icon="mail-outline"
              keyboardType="email-address"
            />

            {state.step !== "email" ? (
              <InputField
                label="OTP Code"
                placeholder="Enter 6-digit OTP"
                value={state.otp}
                onChangeText={(value) =>
                  updateState({ otp: String(value ?? "").replace(/[^\d]/g, "").slice(0, 6) })
                }
                icon="keypad-outline"
                keyboardType="number-pad"
                maxLength={6}
              />
            ) : null}

            {state.step === "reset" ? (
              <>
                <InputField
                  label="New Password"
                  placeholder="Create a new password"
                  value={state.newPassword}
                  onChangeText={(value) => updateState({ newPassword: value })}
                  icon="lock-closed-outline"
                  secureTextEntry
                />
                <InputField
                  label="Confirm Password"
                  placeholder="Re-enter new password"
                  value={state.confirmPassword}
                  onChangeText={(value) => updateState({ confirmPassword: value })}
                  icon="shield-checkmark-outline"
                  secureTextEntry
                />
              </>
            ) : null}

            <View style={styles.actionRow}>
              {state.step === "email" ? (
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handleSendOtp}
                  disabled={state.sending}
                  activeOpacity={0.9}
                >
                  {state.sending ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.primaryBtnText}>Send OTP</Text>
                      <Ionicons name="paper-plane-outline" size={18} color="#fff" />
                    </>
                  )}
                </TouchableOpacity>
              ) : null}

              {state.step === "otp" ? (
                <>
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={handleSendOtp}
                    disabled={state.sending}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.secondaryBtnText}>Resend OTP</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={handleVerifyOtp}
                    disabled={state.verifying}
                    activeOpacity={0.9}
                  >
                    {state.verifying ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Text style={styles.primaryBtnText}>Verify OTP</Text>
                        <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                      </>
                    )}
                  </TouchableOpacity>
                </>
              ) : null}

              {state.step === "reset" ? (
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handleResetPassword}
                  disabled={state.resetting}
                  activeOpacity={0.9}
                >
                  {state.resetting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.primaryBtnText}>Update Password</Text>
                      <Ionicons name="save-outline" size={18} color="#fff" />
                    </>
                  )}
                </TouchableOpacity>
              ) : null}
            </View>

            <TouchableOpacity style={styles.clearBtn} onPress={resetFlow} activeOpacity={0.8}>
              <Text style={styles.clearBtnText}>Start over</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.noteCard}>
            <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.success} />
            <Text style={styles.noteText}>
              We send the OTP to your registered email. After reset, your new password is saved
              for future logins too.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 28,
  },
  bgBlob1: {
    position: "absolute",
    top: -80,
    right: -55,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "#dceffd",
    opacity: 0.95,
  },
  bgBlob2: {
    position: "absolute",
    bottom: 80,
    left: -90,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#ffe5d8",
    opacity: 0.7,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    alignSelf: "flex-start",
  },
  hero: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
    position: "relative",
    height: 160,
  },
  heroCircle: {
    width: 124,
    height: 124,
    borderRadius: 62,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  badge: {
    position: "absolute",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.card,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  badgeLeft: { left: "10%", top: 20 },
  badgeRight: { right: "10%", bottom: 18 },
  badgeText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: "800",
  },
  headerCard: {
    marginBottom: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 29,
    fontWeight: "900",
    color: COLORS.text,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    color: COLORS.textSec,
    textAlign: "center",
    fontSize: 13.5,
    lineHeight: 20,
    maxWidth: 320,
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    marginBottom: 14,
  },
  stepRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 16,
  },
  stepChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#eef4f9",
  },
  stepChipActive: {
    backgroundColor: COLORS.primary,
  },
  stepChipText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.textSec,
  },
  stepChipTextActive: {
    color: "#fff",
  },
  fieldWrap: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 7,
    letterSpacing: 0.2,
  },
  fieldBox: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 54,
    backgroundColor: "#fbfdff",
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 14,
  },
  fieldBoxFocused: {
    borderColor: COLORS.primary,
    backgroundColor: "#ffffff",
  },
  fieldIcon: {
    marginRight: 10,
  },
  fieldInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    padding: 0,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  primaryBtn: {
    minHeight: 52,
    flexGrow: 1,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 14.5,
    fontWeight: "900",
  },
  secondaryBtn: {
    minHeight: 52,
    flexGrow: 1,
    borderRadius: 16,
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    color: COLORS.primary,
    fontSize: 14.5,
    fontWeight: "900",
  },
  clearBtn: {
    marginTop: 14,
    alignSelf: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  clearBtnText: {
    color: COLORS.textSec,
    fontSize: 12.5,
    fontWeight: "800",
  },
  noteCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: COLORS.successSoft,
    borderWidth: 1,
    borderColor: "#cfeedd",
    borderRadius: 18,
    padding: 14,
  },
  noteText: {
    flex: 1,
    color: "#22694a",
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: "600",
  },
});
