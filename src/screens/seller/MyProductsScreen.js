

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  Platform,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useShop } from "../../context/ShopContext";

const C = {
  primary: "#082843",
  white: "#fff",
  bg: "#fff",
  text: "#111827",
  muted: "#6B7280",
  border: "#F3D6E2",
  soft: "#FFFFFF",
  success: "#22C55E",
  danger: "#EF4444",
};

const formatPrice = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function MyProductsScreen({ navigation }) {
  const { sellerProducts, toggleSellerProductActive, deleteSellerProduct } =
    useShop();

  const [tab, setTab] = useState("All");

  const handleBackPress = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("SellerDashboardScreen");
  };

  const filtered = useMemo(() => {
    return sellerProducts.filter((p) => {
      if (tab === "All") return true;
      if (tab === "Active") return p.active;
      return !p.active;
    });
  }, [sellerProducts, tab]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.iconBtn}
        >
          <Ionicons name="chevron-back" size={24} color={C.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Products</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("AddProductScreen")}
          style={styles.iconBtn}
        >
          <Ionicons name="add" size={25} color={C.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {["All", "Active", "Inactive"].map((x) => (
          <TouchableOpacity
            key={x}
            style={[styles.tab, tab === x && styles.tabActive]}
            onPress={() => setTab(x)}
          >
            <Text style={[styles.tabText, tab === x && styles.tabTextActive]}>
              {x}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="cube-outline" size={46} color={C.primary} />
            <Text style={styles.emptyTitle}>No products yet</Text>
            <Text style={styles.emptySub}>
              Add your first product. It will appear here automatically.
            </Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => navigation.navigate("AddProductScreen")}
            >
              <Text style={styles.addBtnText}>Add Product</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filtered.map((p) => {
            const finalPrice = p.finalPrice ?? p.price;
            const originalPrice = p.originalPrice ?? p.price;
            const hasDiscount = Number(p.discount || 0) > 0;
            const isSoldOut = Number(p.stock ?? 0) <= 0;
            return (
              <View key={p.id} style={styles.card}>
                <TouchableOpacity
                  style={styles.topRow}
                  activeOpacity={0.86}
                  onPress={() =>
                    navigation.navigate("ProductDetailsScreen", { product: p })
                  }
                >
                  <View style={styles.thumb}>
                    {p.image ? (
                      <Image source={{ uri: p.image }} style={styles.img} />
                    ) : (
                      <Ionicons name="cube-outline" size={30} color={C.primary} />
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.name} numberOfLines={1}>
                      {p.name}
                    </Text>

                    <Text style={styles.cat} numberOfLines={1}>
                      {p.category} / {p.subcategory}
                    </Text>

                    <View style={styles.priceRow}>
                      <Text style={styles.price}>{formatPrice(finalPrice)}</Text>
                      {hasDiscount ? (
                        <>
                          <Text style={styles.oldPrice}>
                            {formatPrice(originalPrice)}
                          </Text>
                          <Text style={styles.discount}>{p.discount}% OFF</Text>
                        </>
                      ) : null}
                    </View>

                    <Text style={styles.stock}>Stock: {p.stock}</Text>
                    {isSoldOut ? <Text style={styles.stock}>Sold Out</Text> : null}
                  </View>

                  <Switch
                    value={!!p.active && !isSoldOut}
                    onValueChange={() => toggleSellerProductActive(p.id)}
                    trackColor={{ true: "#BBF7D0", false: "#E5E7EB" }}
                    thumbColor={p.active && !isSoldOut ? C.success : "#A1A1AA"}
                  />
                </TouchableOpacity>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() =>
                      navigation.navigate("AddProductScreen", {
                        mode: "edit",
                        product: p,
                      })
                    }
                  >
                    <Ionicons name="create-outline" size={17} color={C.white} />
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => deleteSellerProduct(p.id)}
                  >
                    <Ionicons name="trash-outline" size={17} color={C.danger} />
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: {
    paddingTop: Platform.OS === "android" ? 38 : 54,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.soft,
  },
  headerTitle: { fontSize: 18, fontWeight: "900", color: C.text },
  tabs: { flexDirection: "row", paddingHorizontal: 18, gap: 8, marginTop: 6 },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#F8F8F8",
  },
  tabActive: { backgroundColor: C.primary },
  tabText: { fontSize: 12, color: C.muted, fontWeight: "800" },
  tabTextActive: { color: C.white },
  list: { padding: 18, paddingBottom: 100 },
  card: {
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 13,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
    elevation: 1,
  },
  topRow: { flexDirection: "row", alignItems: "center" },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: C.soft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  img: { width: "100%", height: "100%" },
  name: { fontSize: 14, fontWeight: "900", color: C.text },
  cat: { fontSize: 11, color: C.muted, fontWeight: "700", marginTop: 3 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 5 },
  price: { fontSize: 14, color: C.text, fontWeight: "900" },
  oldPrice: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "800",
    textDecorationLine: "line-through",
  },
  discount: { fontSize: 10, color: C.success, fontWeight: "900" },
  stock: { fontSize: 12, color: C.muted, marginTop: 4 },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F8EAF1",
  },
  editBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  editText: { color: C.white, fontWeight: "900", fontSize: 13 },
  deleteBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFF1F2",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  deleteText: { color: C.danger, fontWeight: "900", fontSize: 13 },
  emptyBox: {
    marginTop: 50,
    alignItems: "center",
    backgroundColor: C.soft,
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: C.border,
  },
  emptyTitle: { fontSize: 17, fontWeight: "900", color: C.text, marginTop: 10 },
  emptySub: {
    fontSize: 12,
    color: C.muted,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 6,
  },
  addBtn: {
    marginTop: 16,
    backgroundColor: C.primary,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  addBtnText: { color: C.white, fontWeight: "900" },
});



















