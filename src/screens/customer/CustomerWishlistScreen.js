

import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { useShop } from "../../context/ShopContext";
import { showAlert } from "../../utils/showAlert";

const placeholder = require("../../../assets/images/placeholder.png");

const getPriceText = (price) => {
  if (String(price || "").includes("₹")) return String(price);
  return `₹${price || "0"}`;
};

const getImageSource = (image) => {
  if (!image) return placeholder;
  if (typeof image === "string") return { uri: image };
  return image;
};

export default function WishlistScreen({ navigation }) {
  const {
    wishlistItems = [],
    toggleWishlist,
    addToCart,
    unreadCustomerNotifications = 0,
  } = useShop();

  const openNotifications = () => {
    navigation.navigate("CustomerNotifications");
  };

  const removeFromWishlist = (item) => {
    showAlert(
      "Remove Wishlist",
      "Do you want to remove this product from wishlist?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => toggleWishlist(item),
        },
      ]
    );
  };

  const moveToCart = (item) => {
    addToCart(item);
    showAlert("Added to Cart", `${item.name} added to your cart.`);
  };

  const openDetails = (item) => {
    navigation.navigate("ProductDetails", {
      product: item,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            activeOpacity={0.85}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Wishlist</Text>

          <TouchableOpacity
            style={styles.headerIconBtn}
            activeOpacity={0.85}
            onPress={openNotifications}
          >
            <Ionicons name="notifications-outline" size={23} color="#FFFFFF" />

            {unreadCustomerNotifications > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>
                  {unreadCustomerNotifications > 99 ? "99+" : unreadCustomerNotifications}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {wishlistItems.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons
                name="heart-outline"
                size={86}
                color={COLORS.customer || "#E83E7C"}
              />

              <Text style={styles.emptyTitle}>Your wishlist is empty</Text>

              <Text style={styles.emptyText}>
                Tap heart icon on products to add items here.
              </Text>

              <TouchableOpacity
                style={styles.shopBtn}
                activeOpacity={0.85}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.shopBtnText}>Continue Shopping</Text>
              </TouchableOpacity>
            </View>
          ) : (
            wishlistItems.map((item) => (
              <TouchableOpacity
                key={String(item.id)}
                style={styles.card}
                activeOpacity={0.9}
                onPress={() => openDetails(item)}
              >
                <Image
                  source={getImageSource(item.image)}
                  defaultSource={placeholder}
                  style={styles.image}
                  resizeMode="cover"
                  fadeDuration={0}
                />

                <View style={styles.content}>
                  <View style={styles.topRow}>
                    <Text style={styles.name} numberOfLines={2}>
                      {item.name || "Product Name"}
                    </Text>

                    <TouchableOpacity
                      style={styles.removeBtn}
                      activeOpacity={0.8}
                      onPress={() => removeFromWishlist(item)}
                    >
                      <Ionicons name="heart" size={22} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.seller} numberOfLines={1}>
                    {item.seller || "Bliss Handmade Store"}
                  </Text>

                  <View style={styles.priceRow}>
                    <Text style={styles.price}>{getPriceText(item.price)}</Text>
                    <Text style={styles.rating}>⭐ {item.rating || "4.8"}</Text>
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.detailsBtn}
                      activeOpacity={0.85}
                      onPress={() => openDetails(item)}
                    >
                      <Text style={styles.detailsBtnText}>View Details</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cartBtn}
                      activeOpacity={0.85}
                      onPress={() => moveToCart(item)}
                    >
                      <Ionicons name="cart-outline" size={18} color="#FFFFFF" />
                      <Text style={styles.cartBtnText}>Add Cart</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.customer || "#E83E7C",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    height: Platform.OS === "web" ? 64 : 58,
    backgroundColor: COLORS.customer || "#E83E7C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 19,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  headerIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  headerBadge: {
    position: "absolute",
    top: 4,
    right: 3,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },

  headerBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    borderRadius: 18,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  image: {
    width: 96,
    height: 104,
    borderRadius: 15,
    marginRight: 12,
    backgroundColor: "#FFF4F8",
  },

  content: {
    flex: 1,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },

  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.text || "#111827",
  },

  removeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.customer || "#E83E7C",
    alignItems: "center",
    justifyContent: "center",
  },

  seller: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.muted || "#6B7280",
  },

  priceRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  price: {
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.customer || "#E83E7C",
  },

  rating: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.orange || "#F59E0B",
  },

  actionRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 8,
  },

  detailsBtn: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: COLORS.customer || "#E83E7C",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  detailsBtnText: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.customer || "#E83E7C",
  },

  cartBtn: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.customer || "#E83E7C",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },

  cartBtnText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 100,
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.text || "#111827",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.muted || "#6B7280",
    textAlign: "center",
    lineHeight: 21,
  },

  shopBtn: {
    marginTop: 22,
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: COLORS.customer || "#E83E7C",
    alignItems: "center",
    justifyContent: "center",
  },

  shopBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
});
