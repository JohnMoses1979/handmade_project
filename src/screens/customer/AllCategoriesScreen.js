// src/screens/customer/AllCategoriesScreen.js

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  bg: "#ffffff",
  white: "#fff",
  text: "#111827",
  primary: "#082429",
  muted: "#6B7280",
};

const categories = [
  {
    id: "1",
    label: "Dresses",
    name: "Dresses",
    image: require("../../../assets/images/dresses.png"),
  },
  {
    id: "2",
    label: "Sweets",
    name: "Sweets",
    image: require("../../../assets/images/sweets.png"),
  },
  {
    id: "3",
    label: "Festive Items",
    name: "Festive",
    image: require("../../../assets/images/festive.png"),
  },
  {
    id: "4",
    label: "Pickles",
    name: "Pickles",
    image: require("../../../assets/images/pickels.png"),
  },
  {
    id: "5",
    label: "Candles & Soaps",
    name: "Candles",
    image: require("../../../assets/images/candles.png"),
  },
  {
    id: "6",
    label: "Home Decor",
    name: "Decor",
    image: require("../../../assets/images/decor.png"),
  },
  {
    id: "7",
    label: "Handmade Jewelry",
    name: "Jewelry",
    image: require("../../../assets/images/jewelry.png"),
  },
  {
    id: "8",
    label: "Greeting Cards",
    name: "Cards",
    image: require("../../../assets/images/cards.png"),
  },
  {
    id: "9",
    label: "Pottery & Crafts",
    name: "Pottery",
    image: require("../../../assets/images/pottery.png"),
  },
  {
    id: "10",
    label: "Bags",
    name: "Bags",
    image: require("../../../assets/images/bags.png"),
  },
  {
    id: "11",
    label: "Paintings",
    name: "Paintings",
    image: require("../../../assets/images/painting.png"),
  },
];

export default function AllCategoriesScreen({ navigation }) {
  const handleCategoryPress = (item) => {
    // Navigate to ShopTab with the selected category
    navigation.navigate("ShopTab", {
      screen: "CustomerShopMain",
      params: { category: item.name },
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => handleCategoryPress(item)}
    >
      <Image source={item.image} style={styles.image} resizeMode="cover" />
      <View style={styles.overlay}>
        <Text style={styles.title}>{item.label}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={26} color="#111" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>All Categories</Text>

        <View style={{ width: 42 }} />
      </View>

      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.text,
  },

  listContent: {
    padding: 10,
    paddingBottom: 120,
  },

  card: {
    flex: 1,
    margin: 8,
    height: 180,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.38)",
  },

  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
});