
// src/screens/seller/SellerPaymentSuccessScreen.js

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const C = {
  primary: "#082843",
  primaryDark: "#0D3A5C",
  white: "#FFFFFF",
  bg: "#F4F7FB",
  text: "#111827",
  muted: "#6B7280",
  success: "#16A34A",
  successSoft: "#ECFDF5",
  successBorder: "#BBF7D0",
  blueSoft: "#EFF6FF",
  purpleSoft: "#F5F3FF",
};

export default function SellerPaymentSuccessScreen({
  navigation,
  route,
}) {
  const {
    productData = {},
    adminCommission = 0,
  } = route?.params || {};

  const scaleAnim = useRef(
    new Animated.Value(0)
  ).current;

  const fadeAnim = useRef(
    new Animated.Value(0)
  ).current;

  const slideAnim = useRef(
    new Animated.Value(30)
  ).current;

  const pulseAnim = useRef(
    new Animated.Value(1)
  ).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 70,
        useNativeDriver: true,
      }),

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),

        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(
            Easing.ease
          ),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 900,
          useNativeDriver: true,
        }),

        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const formatPrice = (amount) =>
    `₹${Number(amount || 0).toLocaleString(
      "en-IN"
    )}`;

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={C.bg}
      />

      <LinearGradient
        colors={["#ECFDF5", "#FFFFFF"]}
        style={styles.topBg}
      />

      <View style={styles.container}>
        {/* SUCCESS ICON */}

        <Animated.View
          style={[
            styles.successWrap,
            {
              transform: [
                { scale: scaleAnim },
                { scale: pulseAnim },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={["#22C55E", "#16A34A"]}
            style={styles.successCircle}
          >
            <Ionicons
              name="checkmark"
              size={58}
              color={C.white}
            />
          </LinearGradient>
        </Animated.View>

        {/* CONTENT */}

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim,
              },
            ],
            width: "100%",
          }}
        >
          <Text style={styles.title}>
            Payment Successful 🎉
          </Text>

          <Text style={styles.subtitle}>
            Your product is now live and
            visible to customers with all
            selected images.
          </Text>

          {/* PRODUCT CARD */}

          <View style={styles.card}>
            <View style={styles.row}>
              <View
                style={styles.iconBox}
              >
                <Ionicons
                  name="cube-outline"
                  size={20}
                  color={C.primary}
                />
              </View>

              <View
                style={{ flex: 1 }}
              >
                <Text
                  style={styles.smallLabel}
                >
                  Product Published
                </Text>

                <Text
                  style={styles.bigText}
                  numberOfLines={1}
                >
                  {productData.name ||
                    "Your Product"}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor:
                      "#FEF3C7",
                  },
                ]}
              >
                <Ionicons
                  name="wallet-outline"
                  size={20}
                  color="#F59E0B"
                />
              </View>

              <View
                style={{ flex: 1 }}
              >
                <Text
                  style={styles.smallLabel}
                >
                  Amount Paid
                </Text>

                <Text
                  style={styles.bigText}
                >
                  {formatPrice(
                    adminCommission
                  )}
                </Text>
              </View>

              <View
                style={styles.paidBadge}
              >
                <Text
                  style={
                    styles.paidText
                  }
                >
                  PAID
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor:
                      C.successSoft,
                  },
                ]}
              >
                <Ionicons
                  name="flash-outline"
                  size={20}
                  color={C.success}
                />
              </View>

              <View
                style={{ flex: 1 }}
              >
                <Text
                  style={styles.smallLabel}
                >
                  Product Status
                </Text>

                <Text
                  style={[
                    styles.bigText,
                    {
                      color:
                        C.primary,
                    },
                  ]}
                >
                  Live
                </Text>
              </View>
            </View>
          </View>

          {/* NEXT STEPS */}

          <View style={styles.stepsCard}>
            <Text style={styles.stepsTitle}>
              Your Product is Now Live 🚀
            </Text>

            {[
              {
                icon:
                  "checkmark-circle-outline",
                color: C.success,
                bg: C.successSoft,
                text:
                  "Payment completed successfully",
              },

              {
                icon:
                  "shield-checkmark-outline",
                color: "#2563EB",
                bg: C.blueSoft,
                text:
                  "Customers can now see your product and images",
              },

              {
                icon:
                  "storefront-outline",
                color: "#7C3AED",
                bg: C.purpleSoft,
                text:
                  "The listing fee is recorded in payouts automatically",
              },
            ].map(
              (item, index) => (
                <View
                  key={index}
                  style={
                    styles.stepRow
                  }
                >
                  <View
                    style={[
                      styles.stepIcon,
                      {
                        backgroundColor:
                          item.bg,
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        item.icon
                      }
                      size={18}
                      color={
                        item.color
                      }
                    />
                  </View>

                  <Text
                    style={
                      styles.stepText
                    }
                  >
                    {item.text}
                  </Text>

                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={C.success}
                  />
                </View>
              )
            )}
          </View>
        </Animated.View>
      </View>

      {/* BUTTONS */}

      <Animated.View
        style={[
          styles.bottomArea,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          style={
            styles.primaryBtn
          }
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [
                {
                  name:
                    "SellerTabs",
                },
              ],
            })
          }
        >
          <LinearGradient
            colors={[
              C.primaryDark,
              C.primary,
            ]}
            style={
              styles.primaryGradient
            }
          >
            <Ionicons
              name="grid-outline"
              size={20}
              color={C.white}
            />

            <Text
              style={
                styles.primaryText
              }
            >
              Go to Dashboard
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={
            styles.secondaryBtn
          }
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [
                {
                  name:
                    "MyProductsScreen",
                },
              ],
            })
          }
        >
          <Ionicons
            name="cube-outline"
            size={18}
            color={C.primary}
          />

          <Text
            style={
              styles.secondaryText
            }
          >
            View My Products
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },

  topBg: {
    ...StyleSheet.absoluteFillObject,
  },

  container: {
    flex: 1,
    alignItems: "center",
    paddingTop:
      Platform.OS === "android"
        ? 70
        : 90,
    paddingHorizontal: 24,
  },

  successWrap: {
    marginBottom: 30,
  },

  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    elevation: 12,
    shadowColor: "#16A34A",
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 10,
    },
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: C.text,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: C.muted,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
    marginBottom: 24,
    fontWeight: "600",
  },

  card: {
    backgroundColor: C.white,
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  smallLabel: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "700",
    marginBottom: 4,
  },

  bigText: {
    fontSize: 15,
    fontWeight: "900",
    color: C.text,
  },

  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 14,
  },

  paidBadge: {
    backgroundColor:
      C.successSoft,
    borderWidth: 1,
    borderColor:
      C.successBorder,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  paidText: {
    color: C.success,
    fontSize: 10,
    fontWeight: "900",
  },

  stepsCard: {
    backgroundColor: C.white,
    borderRadius: 24,
    padding: 18,
  },

  stepsTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: C.text,
    marginBottom: 16,
  },

  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  stepText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: C.text,
    lineHeight: 20,
  },

  bottomArea: {
    paddingHorizontal: 24,
    paddingBottom:
      Platform.OS === "android"
        ? 24
        : 38,
  },

  primaryBtn: {
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 12,
  },

  primaryGradient: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryText: {
    color: C.white,
    fontSize: 16,
    fontWeight: "900",
    marginLeft: 8,
  },

  secondaryBtn: {
    height: 54,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: C.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryText: {
    color: C.primary,
    fontSize: 15,
    fontWeight: "900",
    marginLeft: 8,
  },
});
