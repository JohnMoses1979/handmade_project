


// SplashScreen.js

import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Image,
  Text,
  Platform,
} from "react-native";
import { getAuthSession } from "../utils/authSession";

const { width, height } = Dimensions.get("window");

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const translateAnim = useRef(new Animated.Value(40)).current;
  const glowAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),

      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),

      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),

          Animated.timing(glowAnim, {
            toValue: 0.75,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    // SINGLE NAVIGATION
    const timer = setTimeout(() => {
      const session = getAuthSession();
      if (session?.role === "customer") {
        navigation.replace("CustomerTabs", { screen: "ProfileTab" });
        return;
      }
      if (session?.role === "seller") {
        navigation.replace("SellerTabs");
        return;
      }
      if (session?.role === "admin") {
        navigation.replace("AdminTabs");
        return;
      }

      navigation.replace("RoleSelectionScreen");
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* BACKGROUND */}
      <View style={styles.backgroundGlowTop} />
      <View style={styles.backgroundGlowBottom} />

      {/* OVERLAY */}
      <View style={styles.overlay} />

      {/* MAIN CONTENT */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: translateAnim },
            ],
          },
        ]}
      >
        {/* BIG GLOW */}
        <Animated.View
          style={[
            styles.logoGlow,
            {
              opacity: glowAnim,
              transform: [{ scale: glowAnim }],
            },
          ]}
        />

        {/* LOGO */}
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* TAGLINE */}
        <Text style={styles.tagline}>
          SHOP • SELL • GROW
        </Text>

        {/* DIVIDER */}
        <View style={styles.dividerRow}>
          <View style={styles.line} />

          <View style={styles.bagContainer}>
            <Text style={styles.bag}>🛍</Text>
          </View>

          <View style={styles.line} />
        </View>

        {/* SUBTITLE */}
        <Text style={styles.subtitle}>
          Your Marketplace, Your Success
        </Text>

        {/* LOADING DOTS */}
        <View style={styles.loadingContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
        </View>
      </Animated.View>

      {/* BOTTOM GOLD GLOW */}
      <View style={styles.bottomGlow} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#031923",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  overlay: {
    position: "absolute",
    width: width,
    height: height,
    backgroundColor: "rgba(0,0,0,0.16)",
  },

  backgroundGlowTop: {
    position: "absolute",
    top: -120,
    width: width + 100,
    height: 280,
    backgroundColor: "rgba(0,255,255,0.06)",
    borderBottomLeftRadius: 300,
    borderBottomRightRadius: 300,
  },

  backgroundGlowBottom: {
    position: "absolute",
    bottom: -150,
    width: width + 120,
    height: 300,
    backgroundColor: "rgba(255,180,0,0.05)",
    borderTopLeftRadius: 300,
    borderTopRightRadius: 300,
  },

  contentContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  logoGlow: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(0,255,255,0.10)",
  },

  // BIG LOGO
  logo: {
    width: width * 1.05,
    height: width * 1.05,
    marginBottom: -10,
  },

  // TAGLINE
  tagline: {
    marginTop: -60,
    color: "#F7B53A",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 5,
    textAlign: "center",
  },

  // DIVIDER
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "84%",
    marginTop: 28,
    marginBottom: 18,
  },

  line: {
    flex: 1,
    height: 1.5,
    backgroundColor: "rgba(0,255,255,0.40)",
  },

  bagContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(0,255,255,0.20)",
  },

  bag: {
    fontSize: 18,
  },

  // SUBTITLE
  subtitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: 0.4,
    paddingHorizontal: 20,
    textShadowColor: "rgba(255,255,255,0.15)",
    textShadowOffset: {
      width: 0,
      height: 0,
    },
    textShadowRadius: 8,
  },

  // LOADING
  loadingContainer: {
    flexDirection: "row",
    marginTop: 55,
    alignItems: "center",
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.25)",
    marginHorizontal: 6,
  },

  activeDot: {
    backgroundColor: "#00F0FF",
    shadowColor: "#00F0FF",
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 6,
  },

  // BOTTOM GLOW
  bottomGlow: {
    position: "absolute",
    bottom: -120,
    width: width,
    height: 240,
    backgroundColor: "rgba(255,180,0,0.08)",
    borderTopLeftRadius: 260,
    borderTopRightRadius: 260,
  },
});
