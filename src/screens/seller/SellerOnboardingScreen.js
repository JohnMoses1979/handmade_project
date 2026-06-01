

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const COLORS = {
  primary: "#082843",
  primaryDark: "#082843",
  primaryLight: "#FFFFFF",
  white: "#FFFFFF",
  text: "#1F2937",
  muted: "#6B7280",
  soft: "#FFFFFF",
  border: "#FFFFFF",
  green: "#16A34A",
};

const IMAGE_WIDTH = width * 0.9;
const IMAGE_HEIGHT = height * 0.43;

export default function SellerOnboardingScreen({ navigation }) {
  const goToRegister = () => {
    navigation.navigate("SellerRegistrationScreen");
  };

  const goToLogin = () => {
    navigation.navigate("SellerLoginScreen");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <LinearGradient
              colors={[COLORS.primaryLight, COLORS.white]}
              style={styles.logoCircle}
            >
              <Ionicons name="storefront" size={21} color={COLORS.primary} />
            </LinearGradient>

            <View>
              <Text style={styles.brandText}>Seller Hub</Text>
              <Text style={styles.brandSub}>Handmade Marketplace</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.loginPill}
            activeOpacity={0.85}
            onPress={goToLogin}
          >
            <Text style={styles.loginPillText}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroWrap}>
          <View style={styles.circleOne} />
          <View style={styles.circleTwo} />
          <View style={styles.circleThree} />

          <View style={styles.imageCard}>
            <Image
              source={require("../../../assets/images/onboarding.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View style={styles.floatingBadge}>
            <Ionicons name="sparkles" size={15} color={COLORS.primary} />
            <Text style={styles.floatingBadgeText}>Creative Sellers</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.badge}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.green} />
            <Text style={styles.badgeText}>Start your online store today</Text>
          </View>

          <Text style={styles.title}>
            Turn Your Crafts Into{"\n"}
            <Text style={styles.titlePink}>A Growing Business</Text>
          </Text>

          <Text style={styles.subtitle}>
            Register your seller account, upload beautiful products, manage
            orders, and reach customers who love handmade items.
          </Text>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={goToRegister}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDark]}
              style={styles.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.primaryText}>Register Now</Text>
              <Ionicons name="arrow-forward-circle" size={22} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={goToLogin}
            activeOpacity={0.85}
          >
            <Ionicons name="log-in-outline" size={20} color={COLORS.primary} />
            <Text style={styles.secondaryText}>Already Registered</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
  },
  topBar: {
    paddingTop: Platform.OS === "android" ? 8 : 4,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  brandText: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.text,
  },
  brandSub: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: "700",
    marginTop: 1,
  },
  loginPill: {
    paddingHorizontal: 17,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: COLORS.soft,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  loginPillText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "900",
  },
  heroWrap: {
    height: IMAGE_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginTop: 4,
  },
  circleOne: {
    position: "absolute",
    width: width * 0.72,
    height: width * 0.72,
    borderRadius: width,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.7,
  },
  circleTwo: {
    position: "absolute",
    width: width * 0.38,
    height: width * 0.38,
    borderRadius: width,
    backgroundColor: "#FFF0F6",
    top: 18,
    right: 8,
  },
  circleThree: {
    position: "absolute",
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#FFE8F1",
    bottom: 18,
    left: 8,
  },
  imageCard: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
  floatingBadge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  floatingBadgeText: {
    marginLeft: 6,
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "900",
  },
  content: {
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 22 : 26,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 14,
  },
  badgeText: {
    marginLeft: 6,
    color: COLORS.green,
    fontSize: 12,
    fontWeight: "900",
  },
  title: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "900",
    color: COLORS.text,
    textAlign: "center",
    letterSpacing: -0.7,
  },
  titlePink: {
    color: COLORS.primary,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 14.5,
    lineHeight: 23,
    color: COLORS.muted,
    textAlign: "center",
    fontWeight: "500",
    paddingHorizontal: 4,
  },
  primaryBtn: {
    width: "100%",
    marginTop: 24,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 10,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  primaryGradient: {
    height: 58,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  primaryText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "900",
    marginRight: 8,
  },
  secondaryBtn: {
    width: "100%",
    height: 56,
    borderRadius: 20,
    marginTop: 13,
    backgroundColor: COLORS.soft,
    borderWidth: 1.4,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  secondaryText: {
    marginLeft: 8,
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "900",
  },
});