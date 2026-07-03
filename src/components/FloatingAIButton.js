import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function FloatingAIButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name="robot-outline" size={22} color="#FFFFFF" />
      </View>
      <Text style={styles.label}>AI</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 18,
    bottom: 96,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "rgba(8,40,67,0.9)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    elevation: 12,
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0px 6px 12px rgba(0,0,0,0.18)",
        }
      : {
          shadowColor: "#000",
          shadowOpacity: 0.18,
          shadowOffset: { width: 0, height: 6 },
          shadowRadius: 12,
        }),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  iconWrap: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    marginTop: -1,
  },
});
