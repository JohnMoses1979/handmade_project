// src/screens/customer/AllCategoriesScreen.js

import React, { useMemo } from "react";
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
import { useShop } from "../../context/ShopContext";

const COLORS = {
  bg: "#ffffff",
  white: "#fff",
  text: "#111827",
  primary: "#082429",
  muted: "#6B7280",
};

export default function AllCategoriesScreen({ navigation }) {
  const { customerCategoryCatalog = [] } = useShop();

  const categories = useMemo(
    () =>
      [...customerCategoryCatalog].sort((first, second) => {
        const countDiff = Number(second.count || 0) - Number(first.count || 0);
        if (countDiff !== 0) return countDiff;
        return String(first.label || first.name || "").localeCompare(
          String(second.label || second.name || "")
        );
      }),
    [customerCategoryCatalog]
  );

  const handleCategoryPress = (item) => {
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
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.label}</Text>
          <Text style={styles.count}>{item.count || 0} products</Text>
        </View>

        <View style={styles.chipWrap}>
          {(item.subcategories || []).slice(0, 3).map((subcat) => (
            <View key={subcat} style={styles.chip}>
              <Text style={styles.chipText} numberOfLines={1}>
                {subcat}
              </Text>
            </View>
          ))}

          {Array.isArray(item.subcategories) && item.subcategories.length > 3 ? (
            <View style={styles.moreChip}>
              <Text style={styles.moreChipText}>
                +{item.subcategories.length - 3} more
              </Text>
            </View>
          ) : null}
        </View>
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
        keyExtractor={(item) => item.name}
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
    minHeight: 260,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F3E8EE",
  },

  image: {
    width: "100%",
    height: 140,
  },

  cardBody: {
    padding: 12,
  },

  cardHeader: {
    marginBottom: 10,
  },

  title: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "900",
  },

  count: {
    marginTop: 3,
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "700",
  },

  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#EFF6FF",
  },

  chipText: {
    color: "#1D4ED8",
    fontSize: 11,
    fontWeight: "800",
    maxWidth: 110,
  },

  moreChip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },

  moreChipText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "800",
  },
});
