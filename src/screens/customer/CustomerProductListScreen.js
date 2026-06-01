import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Header from "../../components/Header";
import { COLORS } from "../../constants/colors";
import { useShop } from "../../context/ShopContext";

const placeholder = require("../../../assets/images/placeholder.png");

const CATEGORY_META = {
  All: {
    title: "All Products",
    subtitle: "Live seller products from approved stores",
  },
  Bags: { title: "Bag Types", subtitle: "Choose handmade bag category" },
  Candles: { title: "Candle Types", subtitle: "Choose handmade candle category" },
  Cards: { title: "Card Types", subtitle: "Choose handmade card category" },
  Decor: { title: "Decor Types", subtitle: "Choose handmade decor category" },
  Dresses: { title: "Dress Types", subtitle: "Choose handmade dress category" },
  Festive: { title: "Festive Products", subtitle: "Choose festival category" },
  Jewelry: { title: "Jewelry Types", subtitle: "Choose handmade jewelry category" },
  Paintings: { title: "Painting Types", subtitle: "Choose handmade painting category" },
  Pickles: { title: "Pickle Types", subtitle: "Choose handmade pickle category" },
  Pottery: { title: "Pottery Types", subtitle: "Choose handmade pottery category" },
  Sweets: { title: "Sweet Types", subtitle: "Choose handmade sweet category" },
};

const CATEGORY_ALIASES = {
  all: "All",
  bag: "Bags",
  bags: "Bags",
  candle: "Candles",
  candles: "Candles",
  card: "Cards",
  cards: "Cards",
  decor: "Decor",
  "home decor": "Decor",
  decoration: "Decor",
  dress: "Dresses",
  dresses: "Dresses",
  dresees: "Dresses",
  festive: "Festive",
  festival: "Festive",
  jewelry: "Jewelry",
  jewellery: "Jewelry",
  painting: "Paintings",
  paintings: "Paintings",
  pickle: "Pickles",
  pickles: "Pickles",
  pottery: "Pottery",
  sweet: "Sweets",
  sweets: "Sweets",
};

function normalizeCategoryName(name) {
  const raw = String(name || "").trim();
  if (!raw) return "All";
  const lower = raw.toLowerCase();
  if (lower === "all") return "All";
  return CATEGORY_ALIASES[lower] || raw;
}

function resolveImage(source) {
  if (!source) return placeholder;
  if (typeof source === "number") return source;
  if (typeof source === "string") return { uri: source };
  if (source?.uri) return source;
  return placeholder;
}

function buildDisplayProduct(item = {}) {
  const image =
    item.image ||
    (Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : placeholder);

  const images =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : [image || placeholder];

  return {
    ...item,
    category: normalizeCategoryName(item.category),
    subcategory: item.subcategory || "Seller Products",
    image,
    images,
    fromSeller: true,
    rating: item.rating || "4.8",
    seller: item.sellerName || "Seller Hub",
    sellerName: item.sellerName || "Seller Hub",
    stock: item.stock ? `${item.stock} Available` : "Available",
    delivery: item.delivery || "Delivery in 3 - 5 days",
    returnPolicy: item.returnPolicy || "7 days return available",
    description: item.description || `${item.name} is added by a seller.`,
  };
}

function buildSubcategoryNames(products, selectedCategory) {
  const filtered = products.filter((item) => {
    const category = normalizeCategoryName(item.category);
    return selectedCategory === "All" || category === selectedCategory;
  });

  const unique = [];
  filtered.forEach((item) => {
    const value = String(item.subcategory || "").trim();
    if (value && !unique.includes(value)) {
      unique.push(value);
    }
  });

  return ["All", ...unique];
}

const ProductImage = memo(({ source }) => {
  const [imgSrc, setImgSrc] = useState(source || placeholder);

  useEffect(() => {
    setImgSrc(source || placeholder);
  }, [source]);

  const resolved =
    typeof imgSrc === "number"
      ? imgSrc
      : typeof imgSrc === "string"
      ? { uri: imgSrc }
      : imgSrc || placeholder;

  return (
    <Image
      source={resolved}
      defaultSource={placeholder}
      style={styles.productImage}
      resizeMode="cover"
      fadeDuration={0}
      onError={() => setImgSrc(placeholder)}
    />
  );
});

const ProductCard = memo(
  ({ item, onPress, onToggleWishlist, onAddToCart, isWishlisted }) => (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.85}
      onPress={() => onPress(item)}
    >
      <ProductImage source={item.image} />

      {item.fromSeller && (
        <View style={styles.liveTag}>
          <Text style={styles.liveTagText}>Seller Live</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.heartBtn}
        activeOpacity={0.8}
        onPress={() => onToggleWishlist(item)}
      >
        <Ionicons
          name={isWishlisted ? "heart" : "heart-outline"}
          size={20}
          color={isWishlisted ? "#E83E7C" : COLORS.text || "#111827"}
        />
      </TouchableOpacity>

      <View style={styles.productContent}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.categoryText} numberOfLines={1}>
          {item.subcategory || item.category}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{item.price}</Text>
          <Text style={styles.rating}>{item.rating || "4.8"} ⭐</Text>
        </View>
        <TouchableOpacity
          style={styles.cartBtn}
          activeOpacity={0.85}
          onPress={() => onAddToCart(item)}
        >
          <Ionicons name="cart-outline" size={16} color="#FFFFFF" />
          <Text style={styles.cartBtnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
);

export default function ProductListScreen({ route, navigation }) {
  const { addToCart, toggleWishlist, isInWishlist, customerVisibleProducts = [] } = useShop();

  const rawCategory = route?.params?.category;
  const selectedCategory = normalizeCategoryName(rawCategory);
  const categoryInfo =
    CATEGORY_META[selectedCategory] || {
      title: `${selectedCategory} Products`,
      subtitle: "Live seller products from the marketplace",
    };

  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [toast, setToast] = useState("");

  useEffect(() => {
    setSelectedSubCategory("All");
  }, [selectedCategory]);

  const liveProducts = useMemo(() => {
    return customerVisibleProducts
      .filter((item) => {
        const itemCategory = normalizeCategoryName(item.category);
        const itemSubcategory = String(item.subcategory || "").trim();
        const categoryMatch =
          selectedCategory === "All" || itemCategory === selectedCategory;
        const subcategoryMatch =
          selectedSubCategory === "All" || itemSubcategory === selectedSubCategory;
        return categoryMatch && subcategoryMatch;
      })
      .map(buildDisplayProduct);
  }, [customerVisibleProducts, selectedCategory, selectedSubCategory]);

  const subCategoryNames = useMemo(
    () => buildSubcategoryNames(customerVisibleProducts, selectedCategory),
    [customerVisibleProducts, selectedCategory]
  );

  const handleProductPress = useCallback(
    (product) => {
      const safeProduct = {
        ...product,
        image: product?.image || placeholder,
        images:
          Array.isArray(product?.images) && product.images.length > 0
            ? product.images
            : [product?.image || placeholder],
        seller: product?.seller || "Seller Hub",
        sellerName: product?.sellerName || "Seller Hub",
        stock: product?.stock || "Available",
        delivery: product?.delivery || "Delivery in 3 - 5 days",
        returnPolicy: product?.returnPolicy || "7 days replacement available",
        description: product?.description || `${product?.name} handmade product`,
      };

      navigation.navigate("ProductDetails", {
        product: safeProduct,
        relatedProducts: liveProducts.filter(
          (item) =>
            String(item.id) !== String(product.id) &&
            normalizeCategoryName(item.category) === normalizeCategoryName(product.category)
        ),
      });
    },
    [navigation, liveProducts]
  );

  const handleAddToCart = useCallback(
    (product) => {
      addToCart(product);
      setToast(`${product.name} added to cart`);
      setTimeout(() => setToast(""), 1400);
    },
    [addToCart]
  );

  return (
    <View style={styles.container}>
      <Header
        title={selectedCategory === "All" ? "Shop" : selectedCategory}
        navigation={navigation}
        color={COLORS.customer || "#E83E7C"}
        rightIcon="notifications-outline"
        onRightPress={() => navigation.navigate("CustomerNotifications")}
      />

      {toast ? (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}

      <View style={styles.topBox}>
        <Text style={styles.title}>
          {selectedCategory === "All"
            ? categoryInfo.title
            : categoryInfo.title || `${selectedCategory} Products`}
        </Text>
        <Text style={styles.subtitle}>
          {selectedCategory === "All"
            ? categoryInfo.subtitle
            : categoryInfo.subtitle || "Live seller products from the marketplace"}
        </Text>
      </View>

      <View style={styles.chipOuter}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subCategoryScroll}
        >
          {subCategoryNames.map((item) => {
            const active = selectedSubCategory === item;
            return (
              <TouchableOpacity
                key={item}
                activeOpacity={0.85}
                onPress={() => setSelectedSubCategory(item)}
                style={[styles.subCategoryChip, active && styles.activeSubCategoryChip]}
              >
                <Text
                  style={[styles.subCategoryText, active && styles.activeSubCategoryText]}
                  numberOfLines={1}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.selectedRow}>
        <Text style={styles.selectedTitle} numberOfLines={1}>
          {selectedSubCategory}
        </Text>
        <Text style={styles.countText}>{liveProducts.length} Items</Text>
      </View>

      <FlatList
        data={liveProducts}
        keyExtractor={(item, index) => `${item.id ?? "product"}-${index}`}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onPress={handleProductPress}
            onToggleWishlist={toggleWishlist}
            onAddToCart={handleAddToCart}
            isWishlisted={isInWishlist(item.id)}
          />
        )}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productList}
        columnWrapperStyle={styles.columnWrapper}
        removeClippedSubviews={false}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={7}
        extraData={selectedSubCategory}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Image source={placeholder} style={styles.emptyImage} resizeMode="contain" />
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptyText}>New seller products will appear here.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    elevation: 2,
  },
  toastText: { fontSize: 13, fontWeight: "700", color: "#15803D", flex: 1 },

  topBox: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: "900", color: COLORS.text || "#111827" },
  subtitle: { marginTop: 4, fontSize: 13, color: COLORS.muted || "#6B7280", fontWeight: "600" },

  chipOuter: { minHeight: 70 },
  subCategoryScroll: { paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  subCategoryChip: {
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F1E3EA",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  activeSubCategoryChip: { backgroundColor: "#082843", borderColor: "#082843" },
  subCategoryText: { fontSize: 13, fontWeight: "800", color: COLORS.text || "#111827" },
  activeSubCategoryText: { color: "#FFFFFF" },

  selectedRow: {
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedTitle: { flex: 1, fontSize: 19, fontWeight: "900", color: COLORS.text || "#111827" },
  countText: { fontSize: 13, fontWeight: "800", color: "#082843" },

  productList: { paddingHorizontal: 12, paddingBottom: 110 },
  columnWrapper: { justifyContent: "space-between" },

  productCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F1E3EA",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  productImage: { width: "100%", height: 145, backgroundColor: "#FDE2E9" },

  liveTag: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#16A34A",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  liveTagText: { color: "#FFFFFF", fontSize: 10, fontWeight: "900" },

  heartBtn: {
    position: "absolute",
    right: 8,
    top: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },

  productContent: { padding: 10 },
  productName: { fontSize: 14, fontWeight: "900", color: COLORS.text || "#111827", minHeight: 38 },
  categoryText: { fontSize: 11, fontWeight: "700", color: COLORS.muted || "#6B7280", marginTop: 2 },
  priceRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: { fontSize: 16, fontWeight: "900", color: "#082843" },
  rating: { fontSize: 12, fontWeight: "800", color: COLORS.text || "#111827" },

  cartBtn: {
    marginTop: 10,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#082843",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  cartBtnText: { fontSize: 12, fontWeight: "900", color: "#FFFFFF" },

  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    paddingHorizontal: 24,
  },
  emptyImage: { width: 120, height: 120, opacity: 0.7 },
  emptyTitle: { marginTop: 12, fontSize: 18, fontWeight: "900", color: COLORS.text || "#111827" },
  emptyText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.muted || "#6B7280",
    textAlign: "center",
  },
});
