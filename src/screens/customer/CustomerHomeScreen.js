
// src/screens/customer/CustomerHomeScreen.js

import React, { memo, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShop } from "../../context/ShopContext";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#062B67",
  bg: "#FFFFFF",
  white: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  border: "#F3E8EE",
};

const IMAGES = {
  banner: require("../../../assets/images/banner.png"),

  dresses: require("../../../assets/images/dresses.png"),
  sweets: require("../../../assets/images/sweets.png"),
  festive: require("../../../assets/images/festive.png"),
  pickles: require("../../../assets/images/pickels.png"),
  candles: require("../../../assets/images/candles.png"),
  decor: require("../../../assets/images/decor.png"),
  jewelry: require("../../../assets/images/jewelry.png"),
  cards: require("../../../assets/images/cards.png"),

};

const categories = [
  {
    id: "1",
    name: "Dresses",
    label: "Dresses",
    image: IMAGES.dresses,
  },
  {
    id: "2",
    name: "Sweets",
    label: "Sweets",
    image: IMAGES.sweets,
  },
  {
    id: "3",
    name: "Festive",
    label: "Festive",
    image: IMAGES.festive,
  },
  {
    id: "4",
    name: "Pickles",
    label: "Pickles",
    image: IMAGES.pickles,
  },
  {
    id: "5",
    name: "Candles",
    label: "Candles",
    image: IMAGES.candles,
  },
  {
    id: "6",
    name: "Decor",
    label: "Decor",
    image: IMAGES.decor,
  },
  {
    id: "7",
    name: "Jewelry",
    label: "Jewelry",
    image: IMAGES.jewelry,
  },
  {
    id: "8",
    name: "Cards",
    label: "Cards",
    image: IMAGES.cards,
  },
];

const FastImage = memo(({ source, style, resizeMode = "cover" }) => (
  <Image
    source={typeof source === "string" ? { uri: source } : source}
    style={style}
    resizeMode={resizeMode}
    fadeDuration={0}
  />
));

export default function CustomerHomeScreen({ navigation }) {
  const { cartCount, toggleWishlist, isInWishlist, customerVisibleProducts = [] } = useShop();

  const goToNotifications = useCallback(() => {
    navigation.navigate("CustomerNotifications");
  }, [navigation]);

  const goToCart = useCallback(() => {
    navigation.navigate("CartTab");
  }, [navigation]);

  const goToCategory = useCallback(
    (category) => {
      navigation.navigate("ShopTab", {
        screen: "CustomerShopMain",
        params: { category },
      });
    },
    [navigation]
  );

  const goToProductDetails = useCallback(
    (product) => {
      navigation.navigate("ProductDetails", { product });
    },
    [navigation]
  );

  const goToAllCategories = useCallback(() => {
    navigation.navigate("AllCategoriesScreen");
  }, [navigation]);

  const goToAllProducts = useCallback(() => {
    navigation.navigate("ShopTab", {
      screen: "CustomerShopMain",
      params: { category: "All" },
    });
  }, [navigation]);

  const goToAiChat = useCallback(() => {
    navigation.navigate("CustomerAIChatScreen");
  }, [navigation]);

  const liveProducts = useMemo(
    () =>
      customerVisibleProducts.slice(0, 6).map((item) => ({
        ...item,
        image:
          item.image ||
          (Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : null),
        price: item.price || item.finalPrice || "\u20B90",
        rating: item.rating || "4.8",
      })),
    [customerVisibleProducts]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.hello}>Hello, Customer 👋</Text>

            <Text style={styles.subText}>
              Discover Handmade Products
            </Text>
          </View>

          <View style={styles.headerIcons}>
            {/* Notification */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.iconBtn}
              onPress={goToNotifications}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color={COLORS.text}
              />
            </TouchableOpacity>

            {/* Cart */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.iconBtn}
              onPress={goToCart}
            >
              <Ionicons
                name="cart-outline"
                size={24}
                color={COLORS.text}
              />

              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {cartCount > 99 ? "99+" : cartCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* FULL IMAGE BANNER */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerCard}>

            <Image
              source={IMAGES.banner}
              style={styles.fullBannerImage}
              resizeMode="cover"
            />

            <View style={styles.bannerOverlay} />

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.shopNowButton}
              onPress={() => goToCategory("All")}
            >
              <Text style={styles.shopNowText}>
                Shop Now
              </Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>

          </View>
        </View>

        {/* FEATURES */}
        <View style={styles.featureRow}>
          <FeatureCard
            icon="shield-check"
            title="Secure"
            subtitle="Payments"
            color="#7C3AED"
          />

          <FeatureCard
            icon="truck-fast"
            title="Fast"
            subtitle="Delivery"
            color="#16A34A"
          />

          <FeatureCard
            icon="medal-outline"
            title="Best"
            subtitle="Quality"
            color="#EC4899"
          />

          <FeatureCard
            icon="headset"
            title="24/7"
            subtitle="Support"
            color="#F59E0B"
          />
        </View>

        {/* CATEGORY */}
        <SectionTitle
          title="Shop by Category"
          onPress={goToAllCategories}
        />

        <View style={styles.categoryGrid}>
          {categories.map((item) => (
            <CategoryCard
              key={item.id}
              item={item}
              onPress={() => goToCategory(item.name)}
            />
          ))}
        </View>

        {/* PRODUCTS */}
        <SectionTitle
          title="Popular Products"
          onPress={goToAllProducts}
        />

        <View style={styles.productGrid}>
          {liveProducts.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              onPress={() => goToProductDetails(item)}
              toggleWishlist={toggleWishlist}
              isInWishlist={isInWishlist}
            />
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.aiChatFab}
        onPress={goToAiChat}
        activeOpacity={0.9}
      >
        <Ionicons name="chatbubbles" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* CATEGORY CARD */
const CategoryCard = memo(({ item, onPress }) => (
  <TouchableOpacity
    style={styles.categoryCard}
    activeOpacity={0.85}
    onPress={onPress}
  >
    <FastImage source={item.image} style={styles.categoryImage} />

    <Text style={styles.categoryText} numberOfLines={2}>
      {item.label}
    </Text>
  </TouchableOpacity>
));

/* PRODUCT CARD */
const ProductCard = memo(
  ({ item, onPress, toggleWishlist, isInWishlist }) => {
    const liked = isInWishlist ? isInWishlist(item.id) : false;

    return (
      <TouchableOpacity
        style={styles.productCard}
        activeOpacity={0.85}
        onPress={onPress}
      >
        <FastImage source={item.image} style={styles.productImage} />

        <TouchableOpacity
          style={styles.heartBtn}
          activeOpacity={0.8}
          onPress={(e) => {
            e.stopPropagation();

            if (toggleWishlist) {
              toggleWishlist(item);
            }
          }}
        >
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={20}
            color={liked ? "#EF4444" : COLORS.text}
          />
        </TouchableOpacity>

        <View style={styles.productContent}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>

          <View style={styles.productBottom}>
            <Text style={styles.productPrice}>{item.price}</Text>

            <Text style={styles.rating}>{item.rating} ⭐</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);

/* FEATURE CARD */
const FeatureCard = memo(({ icon, title, subtitle, color }) => (
  <View style={styles.featureCard}>
    <View
      style={[
        styles.featureIconContainer,
        { backgroundColor: `${color}18` },
      ]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={22}
        color={color}
      />
    </View>

    <Text style={styles.featureTitle}>{title}</Text>

    <Text style={styles.featureSubtitle}>{subtitle}</Text>
  </View>
));

/* SECTION TITLE */
const SectionTitle = memo(({ title, onPress }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>

    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Text style={styles.viewAll}>View All</Text>
    </TouchableOpacity>
  </View>
));

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  scrollContent: {
    paddingBottom: 120,
  },

  /* HEADER */
  header: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  hello: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.text,
  },

  subText: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "600",
  },

  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },

  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: COLORS.primary,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },

  aiChatFab: {
    position: "absolute",
    right: 18,
    bottom: 104,
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    zIndex: 50,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.9)",
  },

  /* FULL IMAGE BANNER */
  bannerContainer: {
    paddingHorizontal: 14,
    marginTop: 6,
  },

  bannerCard: {
    width: "100%",
    height: 210,
    borderRadius: 26,
    overflow: "hidden",
    position: "relative",

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 6,
  },

  fullBannerImage: {
    width: "100%",
    height: "100%",
  },

  bannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.08)",
  },

  shopNowButton: {
    position: "absolute",
    bottom: 18,
    left: 18,

    height: 44,
    paddingHorizontal: 20,
    borderRadius: 14,

    backgroundColor: "#062B67",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  shopNowText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginRight: 8,
  },

  /* FEATURES */
  featureRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    marginTop: 20,
  },

  featureCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 12,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 3,
  },

  featureIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },

  featureTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "900",
    color: COLORS.text,
  },

  featureSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "700",
  },

  /* SECTION */
  sectionHeader: {
    marginTop: 26,
    marginBottom: 14,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.text,
  },

  viewAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "800",
  },

  /* CATEGORY */
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },

  categoryCard: {
    width: "25%",
    alignItems: "center",
    marginBottom: 22,
  },

  categoryImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFF0F4",
  },

  categoryText: {
    marginTop: 8,
    fontSize: 11,
    color: COLORS.text,
    textAlign: "center",
    fontWeight: "800",
    paddingHorizontal: 4,
  },

  /* PRODUCTS */
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
  },

  productCard: {
    width: "47%",
    margin: "1.5%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  productImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#F8F8F8",
  },

  heartBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },

  productContent: {
    padding: 12,
  },

  productName: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "800",
    minHeight: 38,
  },

  productBottom: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  productPrice: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "900",
  },

  rating: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "700",
  },
});
