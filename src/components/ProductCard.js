import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

export default function ProductCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.seller}>{item.seller}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
        <Text style={styles.rating}>⭐ 4.8</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 10,
    borderRadius: 16,
    elevation: 3,
  },
  image: {
    width: 92,
    height: 92,
    borderRadius: 14,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },
  seller: {
    marginTop: 4,
    color: COLORS.muted,
  },
  price: {
    marginTop: 6,
    fontWeight: "800",
    color: COLORS.customer,
  },
  rating: {
    marginTop: 4,
    color: COLORS.orange,
  },
});