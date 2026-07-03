import React, { useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Share,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useShop } from "../../context/ShopContext";

const { width } = Dimensions.get("window");

const placeholder = require("../../../assets/images/placeholder.png");

const CTA = "#B4128B";
const CTA_DARK = "#8D0E6D";
const GREEN = "#22A86A";
const TEXT = "#202124";
const MUTED = "#6B7280";
const SOFT = "#F7F7FA";

const DEFAULT_SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"];
const DEFAULT_FEATURE_BADGES = [
  "Ok-Ok Size / Fit",
  "Ok-Ok Fabric Softness",
  "Ok-Ok Transparency",
];

function resolveImage(source) {
  if (!source) return placeholder;
  if (typeof source === "number") return source;
  if (typeof source === "string") return { uri: source };
  if (source?.uri) return source;
  return placeholder;
}

function cleanPrice(value) {
  if (typeof value === "number") return value;
  const parsed = Number(String(value ?? "0").replace(/[^\d.]/g, ""));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatPrice(value) {
  return `\u20B9${Number(value ?? 0).toLocaleString("en-IN")}`;
}

function buildGallery(product) {
  const images = [];

  if (Array.isArray(product?.images)) {
    images.push(...product.images);
  }

  if (product?.image) {
    images.unshift(product.image);
  }

  const unique = images.filter(
    (item, index) =>
      item != null &&
      images.findIndex((candidate) => JSON.stringify(candidate) === JSON.stringify(item)) ===
        index
  );

  return unique.length > 0 ? unique : [placeholder];
}

function buildSizes(product, basePrice) {
  const normalizedOrder = ["S", "M", "L", "XL", "XXL", "XXXL"];
  const priceForIndex = (index) => Math.max(basePrice + index * 35, 0);

  if (Array.isArray(product?.sizes) && product.sizes.length > 0) {
    const mapped = product.sizes.map((item, index) => {
      if (typeof item === "string") {
        return {
          id: `${item}-${index}`,
          label: item,
          price: priceForIndex(index),
        };
      }
      return {
        id: `${item?.label ?? item?.name ?? index}`,
        label: item?.label ?? item?.name ?? "Free Size",
        price: cleanPrice(item?.price ?? priceForIndex(index)),
      };
    });

    return mapped.sort((a, b) => {
      const aIndex = normalizedOrder.indexOf(String(a.label).toUpperCase());
      const bIndex = normalizedOrder.indexOf(String(b.label).toUpperCase());
      return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
    });
  }

  return DEFAULT_SIZES.map((label, index) => ({
    id: `${label}-${index}`,
    label,
    price: priceForIndex(index),
  }));
}

function buildHighlights(product) {
  return [
    { label: "Bottomwear Fabric", value: product?.material || "Cotton Blend" },
    { label: "Kurta Color", value: product?.color || "Black" },
    { label: "Stitch Type", value: "Stitched" },
    { label: "Bottomwear Color", value: product?.color || "Black" },
  ];
}

function getRatingLabel(rating) {
  const value = Number(rating ?? 0);
  if (value >= 5) return "Very Good";
  if (value >= 4) return "Good";
  if (value >= 3) return "Ok-Ok";
  if (value >= 2) return "Bad";
  return "Very Bad";
}

function buildReviews(product) {
  if (Array.isArray(product?.customerReviews) && product.customerReviews.length > 0) {
    return product.customerReviews.map((review, index) => {
      const rating = Number(review.rating ?? 4);
      return {
        id: review.id || `review-${index}`,
        user: review.customer || "Meesho User",
        rating,
        title: getRatingLabel(rating),
        text:
          review.comment ||
          review.text ||
          "Nice product. Worth the price and looks good in real use.",
        date: review.createdOn || "Posted recently",
        helpful: 2 + index,
        images: Array.isArray(review.images) ? review.images : [],
      };
    });
  }

  return [];
}

function buildDistribution(reviews) {
  const counts = {
    excellent: 0,
    good: 0,
    okay: 0,
    bad: 0,
    poor: 0,
  };

  if (reviews.length > 0) {
    counts.excellent = reviews.filter((item) => Number(item.rating) >= 5).length;
    counts.good = reviews.filter(
      (item) => Number(item.rating) >= 4 && Number(item.rating) < 5
    ).length;
    counts.okay = reviews.filter(
      (item) => Number(item.rating) >= 3 && Number(item.rating) < 4
    ).length;
    counts.bad = reviews.filter(
      (item) => Number(item.rating) >= 2 && Number(item.rating) < 3
    ).length;
    counts.poor = reviews.filter((item) => Number(item.rating) < 2).length;
  }

  const total =
    counts.excellent + counts.good + counts.okay + counts.bad + counts.poor || 1;

  return [
    { label: "Very Good", value: counts.excellent, color: GREEN, width: counts.excellent / total },
    { label: "Good", value: counts.good, color: "#37C172", width: counts.good / total },
    { label: "Ok-Ok", value: counts.okay, color: "#F4B740", width: counts.okay / total },
    { label: "Bad", value: counts.bad, color: "#F28132", width: counts.bad / total },
    { label: "Very Bad", value: counts.poor, color: "#E24A42", width: counts.poor / total },
  ];
}

function RelatedCard({ item, onPress }) {
  const image = resolveImage(item?.image || item?.images?.[0]);
  const price = item?.finalPrice || item?.price || "\u20B90";
  const rating = Number(item?.rating ?? 4).toFixed(1);
  const reviews = item?.reviews ?? 16;

  return (
    <TouchableOpacity style={styles.relatedCard} activeOpacity={0.9} onPress={onPress}>
      <Image source={image} style={styles.relatedImage} resizeMode="cover" />
      <Text numberOfLines={2} style={styles.relatedTitle}>
        {item?.name || "Kurti with Dupatta"}
      </Text>
      <Text style={styles.relatedPrice}>{price}</Text>
      <View style={styles.relatedMeta}>
        <View style={styles.ratingPill}>
          <Text style={styles.ratingPillText}>{rating} ★</Text>
        </View>
        <Text style={styles.relatedReviews}>({reviews})</Text>
      </View>
    </TouchableOpacity>
  );
}

function ReviewCard({ review, onOpenImages }) {
  const previewImages = Array.isArray(review?.images) ? review.images.slice(0, 2) : [];
  const extraCount = Math.max((review?.images?.length ?? 0) - previewImages.length, 0);

  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewTopRow}>
        <View style={styles.reviewTitleRow}>
          <View style={styles.smallRatingBadge}>
            <Text style={styles.smallRatingText}>{review.rating}★</Text>
          </View>
          <Text style={styles.reviewTitle}>{review.title}</Text>
          <Text style={styles.reviewDate}>{review.date}</Text>
        </View>
      </View>

      <Text style={styles.reviewBody}>{review.text}</Text>
      <Text style={styles.reviewUser}>- {review.user}</Text>

      {previewImages.length > 0 ? (
        <View style={styles.reviewImagesRow}>
          {previewImages.map((image, index) => {
            const showMore = index === previewImages.length - 1 && extraCount > 0;
            return (
              <TouchableOpacity
                key={`${review.id}-img-${index}`}
                activeOpacity={0.9}
                onPress={() => onOpenImages(review.images)}
              >
                <Image
                  source={resolveImage(image)}
                  style={styles.reviewImage}
                  resizeMode="cover"
                />
                {showMore ? (
                  <View style={styles.reviewImageMoreOverlay}>
                    <Text style={styles.reviewImageMoreText}>+{extraCount}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}

      <View style={styles.helpfulRow}>
        <Ionicons name="thumbs-up-outline" size={16} color={MUTED} />
        <Text style={styles.helpfulText}>Helpful ({review.helpful})</Text>
      </View>
    </View>
  );
}

export default function ProductDetailsScreen({ route, navigation }) {
  const scrollRef = useRef(null);
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    customerVisibleProducts = [],
    productReviews = {},
  } = useShop();

  const product = route?.params?.product || {};
  const gallery = useMemo(() => buildGallery(product), [product]);

  const basePrice = useMemo(
    () => cleanPrice(product?.finalPrice ?? product?.price ?? 379),
    [product]
  );
  const originalPrice = useMemo(() => {
    const parsed = cleanPrice(product?.originalPrice ?? product?.price ?? basePrice);
    return parsed >= basePrice ? parsed : basePrice + 63;
  }, [product, basePrice]);
  const discount = useMemo(() => {
    const raw = Number(product?.discount ?? 0);
    if (raw > 0) return raw;
    return Math.max(Math.round(((originalPrice - basePrice) / originalPrice) * 100), 0);
  }, [product, originalPrice, basePrice]);

  const productCategoryKey = String(product?.category ?? "").trim().toLowerCase();
  const isDressProduct = ["dress", "dresses", "dresees"].includes(productCategoryKey);
  const sizes = useMemo(
    () => (isDressProduct ? buildSizes(product, originalPrice) : []),
    [isDressProduct, product, originalPrice]
  );
  const [selectedSize, setSelectedSize] = useState(sizes[0]?.label || "M");
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewsModalVisible, setReviewsModalVisible] = useState(false);
  const [reviewImagesModal, setReviewImagesModal] = useState([]);

  const productId = String(product?.id ?? product?.name ?? "product");
  const productReviewKeys = useMemo(
    () =>
      [
        product?.id,
        product?.productId,
        product?.originalId,
        product?.name,
      ]
        .filter(Boolean)
        .map((item) => String(item)),
    [product]
  );
  const wishlisted = Boolean(isInWishlist?.(productId));

  const selectedSizePrice = isDressProduct
    ? sizes.find((item) => item.label === selectedSize)?.price ?? originalPrice
    : originalPrice;
  const selectedDiscount = Math.max(
    Math.round(((originalPrice - selectedSizePrice) / originalPrice) * 100),
    0
  );

  const displaySeller =
    product?.sellerName || product?.seller || "JBF_COLLECTION";
  const displayDeliveryDate = "Tue, 2 Jun";
  const reviewList = useMemo(() => {
    const liveReviews = productReviewKeys.flatMap((key) => productReviews[key] ?? []);
    const existingReviews = Array.isArray(product?.customerReviews)
      ? product.customerReviews
      : [];
    const seen = new Set();
    const mergedReviews = [...liveReviews, ...existingReviews].filter((review, index) => {
      const key = String(review?.id ?? `${review?.orderId ?? "review"}-${index}`);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return buildReviews({ ...product, customerReviews: mergedReviews });
  }, [product, productReviewKeys, productReviews]);
  const displayRating = useMemo(() => {
    if (reviewList.length > 0) {
      const total = reviewList.reduce((sum, item) => sum + Number(item.rating ?? 0), 0);
      return (total / reviewList.length).toFixed(1);
    }
    return Number(product?.rating ?? 3.9).toFixed(1);
  }, [reviewList, product]);
  const displayReviewCount = reviewList.length || product?.reviews || 0;
  const ratingDistribution = useMemo(() => buildDistribution(reviewList), [reviewList]);
  const relatedProducts = useMemo(() => {
    const routeRelated = Array.isArray(route?.params?.relatedProducts)
      ? route.params.relatedProducts
      : [];
    const sameCategoryFromRoute = routeRelated.filter((item) => {
      const sameProduct = String(item?.id) === String(productId);
      const sameCategory =
        product?.category &&
        String(item?.category ?? "").trim().toLowerCase() ===
          String(product.category ?? "").trim().toLowerCase();
      const sameSubcategory =
        product?.subcategory &&
        String(item?.subcategory ?? "").trim().toLowerCase() ===
          String(product.subcategory ?? "").trim().toLowerCase();
      return !sameProduct && (sameCategory || sameSubcategory);
    });

    if (sameCategoryFromRoute.length > 0) {
      return sameCategoryFromRoute.slice(0, 8);
    }

    const matching = customerVisibleProducts.filter((item) => {
      const sameProduct = String(item?.id) === String(productId);
      const sameCategory =
        product?.category &&
        String(item?.category ?? "").trim().toLowerCase() ===
          String(product.category ?? "").trim().toLowerCase();
      const sameSubcategory =
        product?.subcategory &&
        String(item?.subcategory ?? "").trim().toLowerCase() ===
          String(product.subcategory ?? "").trim().toLowerCase();
      return !sameProduct && (sameCategory || sameSubcategory);
    });

    return matching.slice(0, 8);
  }, [route?.params?.relatedProducts, customerVisibleProducts, productId, product]);

  const realPhotoGallery = useMemo(
    () => reviewList.flatMap((item) => item.images).slice(0, 3),
    [reviewList]
  );
  const realPhotoExtraCount = Math.max(reviewList.flatMap((item) => item.images).length - 3, 0);
  const highlights = useMemo(() => buildHighlights(product), [product]);
  const openReviewImages = (images = []) => {
    if (!Array.isArray(images) || images.length === 0) return;
    setReviewImagesModal(images);
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      id: productId,
      image: gallery[0],
      qty: 1,
      ...(isDressProduct ? { selectedSize } : {}),
      price: formatPrice(selectedSizePrice),
      originalPrice: formatPrice(originalPrice),
      finalPrice: formatPrice(selectedSizePrice),
      sellerName: displaySeller,
    });
  };

  const handleAddWishlistOnly = () => {
    if (!wishlisted) {
      toggleWishlist({
        ...product,
        id: productId,
        image: gallery[0],
        price: formatPrice(selectedSizePrice),
        finalPrice: formatPrice(selectedSizePrice),
        sellerName: displaySeller,
      });
    }
  };

  const handleOpenWishlist = () => {
    const parent = navigation.getParent?.();

    if (parent?.navigate) {
      parent.navigate("WishlistTab");
      return;
    }

    navigation.navigate("CustomerTabs", {
      screen: "WishlistTab",
    });
  };

  const handleShare = async () => {
    await Share.share({
      title: product?.name || "Product",
      message: `${product?.name || "Product"}\nPrice: ${formatPrice(
        selectedSizePrice
      )}\nSeller: ${displaySeller}`,
    });
  };

  const handleBuyNow = () => {
    navigation.navigate("Checkout", {
      cartItems: [
        {
          ...product,
          id: productId,
          image: gallery[0],
          qty: 1,
          ...(isDressProduct ? { selectedSize } : {}),
          price: formatPrice(selectedSizePrice),
          originalPrice: formatPrice(originalPrice),
          finalPrice: formatPrice(selectedSizePrice),
          sellerName: displaySeller,
        },
      ],
      action: "buyNow",
      itemTotal: selectedSizePrice,
      totalAmount: selectedSizePrice + 40,
      deliveryCharge: 40,
    });
  };

  const scrollToGalleryIndex = (index) => {
    setSelectedImage(index);
    scrollRef.current?.scrollTo({
      x: width * index,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topIconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={TEXT} />
        </TouchableOpacity>

        <View style={styles.topBarRight}>
          <TouchableOpacity style={styles.topIconButton}>
            <Ionicons name="search-outline" size={22} color={TEXT} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.topIconButton}
            activeOpacity={0.9}
            onPress={handleOpenWishlist}
          >
            <Ionicons
              name={wishlisted ? "heart" : "heart-outline"}
              size={22}
              color={wishlisted ? CTA : TEXT}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topIconButton} onPress={handleAddToCart}>
            <Ionicons name="cart-outline" size={22} color={TEXT} />
            <View style={styles.cartDot}>
              <Text style={styles.cartDotText}>1</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.galleryWrap}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
              setSelectedImage(nextIndex);
            }}
          >
            {gallery.map((image, index) => (
              <View key={`gallery-${index}`} style={styles.galleryPage}>
                <Image source={resolveImage(image)} style={styles.heroImage} resizeMode="contain" />
              </View>
            ))}
          </ScrollView>

          <View style={styles.dotsRow}>
            {gallery.map((_, index) => (
              <TouchableOpacity
                key={`dot-${index}`}
                activeOpacity={0.8}
                onPress={() => scrollToGalleryIndex(index)}
                style={[styles.dot, selectedImage === index && styles.dotActive]}
              />
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.productTitle}>
            {(product?.name || "Women Plain Kurti Sets With Dupatta").toUpperCase()}
          </Text>

          <View style={styles.actionMetaRow}>
            <TouchableOpacity style={styles.wishMetaItem} activeOpacity={0.85} onPress={handleAddWishlistOnly}>
              <Ionicons name="heart-outline" size={20} color={TEXT} />
              <Text style={styles.wishMetaText}>Wishlist</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.wishMetaItem} activeOpacity={0.85} onPress={handleShare}>
              <Ionicons name="share-social-outline" size={20} color={TEXT} />
              <Text style={styles.wishMetaText}>Share</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.mainPrice}>{formatPrice(selectedSizePrice)}</Text>
            <Text style={styles.cutPrice}>{formatPrice(originalPrice)}</Text>
            <Text style={styles.discountText}>{selectedDiscount || discount}% off</Text>
            <Ionicons name="information-circle-outline" size={15} color={MUTED} />
          </View>

          <View style={styles.offerCard}>
            <Text style={styles.offerLine}>UPI Offer applied for you!!</Text>
            <View style={styles.payLaterRow}>
              <Text style={styles.payLaterPrice}>{formatPrice(Math.max(selectedSizePrice - 91, 0))}</Text>
              <Text style={styles.payLaterText}> with Meesho Pay Later</Text>
              <Ionicons name="chevron-forward" size={16} color={MUTED} />
            </View>
          </View>

          <View style={styles.ratingSummary}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingBadgeText}>{displayRating} ★</Text>
            </View>
            <Text style={styles.ratingCount}>({displayReviewCount.toLocaleString("en-IN")})</Text>
          </View>
        </View>

        <View style={styles.separator} />

        {isDressProduct ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Select Size</Text>
            <View style={styles.sizeGrid}>
              {sizes.map((item) => {
                const active = item.label === selectedSize;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.sizeCard, active && styles.sizeCardActive]}
                    activeOpacity={0.9}
                    onPress={() => setSelectedSize(item.label)}
                  >
                    <Text style={[styles.sizeLabel, active && styles.sizeLabelActive]}>
                      {item.label}
                    </Text>
                    <Text style={[styles.sizePrice, active && styles.sizePriceActive]}>
                      {formatPrice(item.price)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : null}

        <View style={styles.sellerCard}>
          <View style={styles.sellerLeft}>
            <Text style={styles.soldByText}>Sold by</Text>
            <Text style={styles.sellerName}>{displaySeller}</Text>
            <View style={styles.sellerRatingWrap}>
              <Text style={styles.sellerRatingText}>4 ★</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={MUTED} />
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Product Highlights</Text>
            <Text style={styles.copyText}>COPY</Text>
          </View>

          <View style={styles.highlightGrid}>
            {highlights.map((item) => (
              <View key={item.label} style={styles.highlightItem}>
                <Text style={styles.highlightLabel}>{item.label}</Text>
                <Text style={styles.highlightValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.additionalRow}>
            <Text style={styles.additionalText}>Additional Details</Text>
            <Ionicons name="chevron-down" size={18} color={TEXT} />
          </View>
        </View>

        {relatedProducts.length > 0 ? (
          <View style={styles.sectionCard}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>You might also like</Text>
              <Text style={styles.adBadge}>Ad</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {relatedProducts.map((item) => (
                <RelatedCard
                  key={`related-${item.id}`}
                  item={item}
                  onPress={() => navigation.push("ProductDetails", { product: item })}
                />
              ))}
            </ScrollView>
          </View>
        ) : (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>You might also like</Text>
            <Text style={styles.emptyRelatedText}>
              More products from this category will appear here.
            </Text>
          </View>
        )}

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Customer Ratings & Reviews</Text>

          <View style={styles.reviewHeader}>
            <View style={styles.bigRatingCard}>
              <Text style={styles.bigRatingNumber}>{displayRating}★</Text>
              <Text style={styles.bigRatingMeta}>
                {displayReviewCount.toLocaleString("en-IN")} ratings
              </Text>
              <Text style={styles.bigRatingMeta}>750 reviews</Text>
            </View>

            <View style={styles.distributionWrap}>
              {ratingDistribution.map((item) => (
                <View key={item.label} style={styles.distributionRow}>
                  <Text style={styles.distributionLabel}>{item.label}</Text>
                  <View style={styles.distributionTrack}>
                    <View
                      style={[
                        styles.distributionFill,
                        {
                          width: item.value > 0 ? `${Math.max(item.width * 100, 8)}%` : "0%",
                          backgroundColor: item.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.distributionValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.featureBadgeRow}>
            {DEFAULT_FEATURE_BADGES.map((item) => (
              <View key={item} style={styles.featureBadge}>
                <Text style={styles.featureBadgeText}>{item}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.realPhotosTitle}>
            Real Photos ({reviewList.flatMap((item) => item.images).length})
          </Text>

          {realPhotoGallery.length > 0 ? (
            <View style={styles.realPhotoRow}>
              {realPhotoGallery.map((item, index) => (
                <TouchableOpacity
                  key={`real-${index}`}
                  activeOpacity={0.9}
                  onPress={() => openReviewImages(reviewList.flatMap((review) => review.images))}
                >
                  <Image
                    source={resolveImage(item)}
                    style={styles.realPhoto}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}

              {realPhotoExtraCount > 0 ? (
                <TouchableOpacity
                  style={styles.realPhotoMore}
                  activeOpacity={0.9}
                  onPress={() => openReviewImages(reviewList.flatMap((review) => review.images))}
                >
                  <Text style={styles.realPhotoMoreText}>+{realPhotoExtraCount}{"\n"}More</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : (
            <Text style={styles.emptyReviewText}>Customer uploaded photos will appear here.</Text>
          )}

          {reviewList.length > 0 ? (
            reviewList
              .slice(0, 2)
              .map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onOpenImages={openReviewImages}
                />
              ))
          ) : (
            <Text style={styles.emptyReviewText}>
              Customer reviews will appear after buyers upload their feedback.
            </Text>
          )}

          {reviewList.length > 0 ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setReviewsModalVisible(true)}
            >
              <Text style={styles.viewAllReviews}>VIEW ALL REVIEWS</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.deliveryCard}>
          <View>
            <Text style={styles.deliveryLabel}>Delivery by {displayDeliveryDate}</Text>
            <Text style={styles.deliveryPin}>at 500090</Text>
          </View>
          <TouchableOpacity
            style={styles.changeButton}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate("CustomerSavedAddress", {
                source: "productDelivery",
                productId,
              })
            }
          >
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.assuranceRow}>
          <View style={styles.assuranceItem}>
            <Ionicons name="pricetags-outline" size={22} color={GREEN} />
            <Text style={styles.assuranceText}>Lowest Price</Text>
          </View>
          <View style={styles.assuranceItem}>
            <Ionicons name="cash-outline" size={22} color={GREEN} />
            <Text style={styles.assuranceText}>Cash on Delivery</Text>
          </View>
          <View style={styles.assuranceItem}>
            <Ionicons name="cube-outline" size={22} color={GREEN} />
            <Text style={styles.assuranceText}>7-day Returns</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cartButton} activeOpacity={0.9} onPress={handleAddToCart}>
          <Ionicons name="cart-outline" size={18} color={CTA} />
          <Text style={styles.cartButtonText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buyButton} activeOpacity={0.9} onPress={handleBuyNow}>
          <Ionicons name="play-forward" size={18} color="#FFFFFF" />
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={reviewsModalVisible}
        animationType="slide"
        onRequestClose={() => setReviewsModalVisible(false)}
      >
        <View style={styles.modalScreen}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.topIconButton}
              activeOpacity={0.85}
              onPress={() => setReviewsModalVisible(false)}
            >
              <Ionicons name="chevron-back" size={24} color={TEXT} />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>All Reviews</Text>
            <View style={styles.modalHeaderSpacer} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalScrollContent}
          >
            <Text style={styles.modalReviewCount}>
              {reviewList.length.toLocaleString("en-IN")} customer reviews
            </Text>
            {reviewList.map((review) => (
              <ReviewCard
                key={`all-${review.id}`}
                review={review}
                onOpenImages={openReviewImages}
              />
            ))}
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={reviewImagesModal.length > 0}
        transparent
        animationType="fade"
        onRequestClose={() => setReviewImagesModal([])}
      >
        <View style={styles.imageModalOverlay}>
          <View style={styles.imageModalCard}>
            <View style={styles.imageModalHeader}>
              <Text style={styles.imageModalTitle}>
                Review Photos ({reviewImagesModal.length})
              </Text>
              <TouchableOpacity
                style={styles.imageModalClose}
                activeOpacity={0.85}
                onPress={() => setReviewImagesModal([])}
              >
                <Ionicons name="close" size={20} color={TEXT} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.imageGrid}>
                {reviewImagesModal.map((image, index) => (
                  <Image
                    key={`review-modal-img-${index}`}
                    source={resolveImage(image)}
                    style={styles.imageGridItem}
                    resizeMode="cover"
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    paddingBottom: 18,
    backgroundColor: "#FFFFFF",
  },

  topBar: {
    paddingTop: 46,
    paddingHorizontal: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },

  topBarRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  topIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
    position: "relative",
  },

  cartDot: {
    position: "absolute",
    top: 2,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CTA,
  },

  cartDotText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },

  galleryWrap: {
    backgroundColor: "#FFFFFF",
  },

  galleryPage: {
    width,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },

  heroImage: {
    width: width - 48,
    height: 430,
    borderRadius: 12,
    backgroundColor: SOFT,
  },

  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 6,
    gap: 6,
  },

  dot: {
    width: 14,
    height: 4,
    borderRadius: 999,
    backgroundColor: "#E8D7E4",
  },

  dotActive: {
    width: 26,
    backgroundColor: CTA,
  },

  sectionCard: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  separator: {
    height: 8,
    backgroundColor: "#F4F5F8",
  },

  productTitle: {
    color: "#4B5563",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
    paddingRight: 60,
  },

  actionMetaRow: {
    position: "absolute",
    right: 16,
    top: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  wishMetaItem: {
    alignItems: "center",
    marginLeft: 18,
  },

  wishMetaText: {
    color: "#4B5563",
    fontSize: 11,
    marginTop: 3,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    flexWrap: "wrap",
  },

  mainPrice: {
    fontSize: 22,
    fontWeight: "900",
    color: TEXT,
    marginRight: 6,
  },

  cutPrice: {
    fontSize: 15,
    color: MUTED,
    textDecorationLine: "line-through",
    marginRight: 6,
  },

  discountText: {
    color: "#4B5563",
    fontWeight: "700",
    marginRight: 4,
  },

  offerCard: {
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EEE8F7",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },

  offerLine: {
    color: "#4B5563",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },

  payLaterRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },

  payLaterPrice: {
    fontSize: 24,
    fontWeight: "900",
    color: TEXT,
  },

  payLaterText: {
    color: "#4B5563",
    fontSize: 15,
    fontWeight: "600",
  },

  ratingSummary: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  ratingBadge: {
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  ratingBadgeText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 13,
  },

  ratingCount: {
    color: MUTED,
    fontSize: 13,
    marginLeft: 8,
  },

  sectionTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
  },

  sizeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  sizeCard: {
    minWidth: 56,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#BFC5CF",
    marginRight: 10,
    marginBottom: 12,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  sizeCardActive: {
    borderColor: CTA,
    backgroundColor: "#FDF0FB",
  },

  sizeLabel: {
    color: TEXT,
    fontWeight: "800",
    fontSize: 17,
  },

  sizeLabelActive: {
    color: CTA,
  },

  sizePrice: {
    color: MUTED,
    fontSize: 12,
    marginTop: 3,
  },

  sizePriceActive: {
    color: CTA_DARK,
    fontWeight: "700",
  },

  sellerCard: {
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F1F3F6",
  },

  sellerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    flex: 1,
  },

  soldByText: {
    color: MUTED,
    fontSize: 13,
    marginRight: 6,
  },

  sellerName: {
    color: TEXT,
    fontSize: 14,
    fontWeight: "800",
  },

  sellerRatingWrap: {
    marginLeft: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C8F1DD",
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "#F3FFF8",
  },

  sellerRatingText: {
    color: GREEN,
    fontSize: 12,
    fontWeight: "800",
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  copyText: {
    color: CTA,
    fontWeight: "800",
    fontSize: 12,
  },

  highlightGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },

  highlightItem: {
    width: "50%",
    paddingRight: 12,
    marginBottom: 14,
  },

  highlightLabel: {
    color: MUTED,
    fontSize: 12,
    marginBottom: 4,
  },

  highlightValue: {
    color: TEXT,
    fontSize: 15,
    fontWeight: "700",
  },

  additionalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "#F1F3F6",
    paddingTop: 10,
  },

  additionalText: {
    color: TEXT,
    fontSize: 15,
    fontWeight: "700",
  },

  adBadge: {
    fontSize: 11,
    color: "#9CA3AF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },

  relatedCard: {
    width: 146,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ECEEF2",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },

  relatedImage: {
    width: "100%",
    height: 164,
    backgroundColor: SOFT,
  },

  relatedTitle: {
    color: "#4B5563",
    fontSize: 12,
    lineHeight: 16,
    paddingHorizontal: 8,
    paddingTop: 6,
    minHeight: 40,
  },

  relatedPrice: {
    color: TEXT,
    fontWeight: "900",
    fontSize: 21,
    paddingHorizontal: 8,
    paddingTop: 2,
  },

  relatedMeta: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 8,
    paddingTop: 4,
  },

  ratingPill: {
    backgroundColor: GREEN,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  ratingPillText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  relatedReviews: {
    color: MUTED,
    marginLeft: 6,
    fontSize: 12,
  },

  reviewHeader: {
    flexDirection: "row",
  },

  bigRatingCard: {
    width: 96,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEF0F3",
    marginRight: 14,
    paddingBottom: 10,
  },

  bigRatingNumber: {
    backgroundColor: GREEN,
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    paddingVertical: 18,
  },

  bigRatingMeta: {
    textAlign: "center",
    color: MUTED,
    fontSize: 12,
    marginTop: 6,
  },

  distributionWrap: {
    flex: 1,
    justifyContent: "center",
  },

  distributionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  distributionLabel: {
    width: 68,
    color: "#4B5563",
    fontSize: 12,
  },

  distributionTrack: {
    flex: 1,
    height: 5,
    borderRadius: 4,
    backgroundColor: "#ECEEF3",
    marginHorizontal: 10,
    overflow: "hidden",
  },

  distributionFill: {
    height: "100%",
    borderRadius: 4,
  },

  distributionValue: {
    width: 32,
    textAlign: "right",
    color: MUTED,
    fontSize: 12,
  },

  featureBadgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  },

  featureBadge: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 16,
    backgroundColor: "#FFF7DA",
    marginRight: 8,
    marginBottom: 8,
  },

  featureBadgeText: {
    color: "#685B36",
    fontSize: 13,
    fontWeight: "700",
  },

  realPhotosTitle: {
    marginTop: 14,
    marginBottom: 10,
    color: TEXT,
    fontSize: 16,
    fontWeight: "800",
  },

  realPhotoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  realPhoto: {
    width: 72,
    height: 72,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: SOFT,
  },

  realPhotoMore: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: "#5B5563",
    alignItems: "center",
    justifyContent: "center",
  },

  realPhotoMoreText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "900",
    lineHeight: 20,
  },

  emptyReviewText: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 20,
    marginBottom: 14,
  },

  reviewCard: {
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: "#ECEEF2",
  },

  reviewTopRow: {
    marginBottom: 8,
  },

  reviewTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },

  smallRatingBadge: {
    backgroundColor: GREEN,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },

  smallRatingText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },

  reviewTitle: {
    color: TEXT,
    fontWeight: "700",
    marginRight: 8,
  },

  reviewDate: {
    color: "#8B95A7",
    fontSize: 12,
  },

  reviewBody: {
    color: "#333B48",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },

  reviewUser: {
    color: MUTED,
    fontSize: 13,
    marginBottom: 8,
  },

  reviewImagesRow: {
    flexDirection: "row",
    marginBottom: 8,
  },

  reviewImage: {
    width: 72,
    height: 72,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: SOFT,
  },

  reviewImageMoreOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 72,
    height: 72,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(32, 33, 36, 0.58)",
  },

  reviewImageMoreText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  helpfulRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  helpfulText: {
    color: MUTED,
    marginLeft: 6,
    fontSize: 13,
  },

  viewAllReviews: {
    color: CTA,
    fontWeight: "900",
    fontSize: 14,
    marginTop: 14,
  },

  modalScreen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  modalHeader: {
    paddingTop: 46,
    paddingHorizontal: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#ECEEF2",
    backgroundColor: "#FFFFFF",
  },

  modalHeaderTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: "900",
  },

  modalHeaderSpacer: {
    width: 36,
  },

  modalScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 26,
  },

  modalReviewCount: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "800",
    paddingTop: 14,
    paddingBottom: 2,
  },

  imageModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "flex-end",
  },

  imageModalCard: {
    maxHeight: "82%",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: "#FFFFFF",
    paddingBottom: 18,
  },

  imageModalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#ECEEF2",
  },

  imageModalTitle: {
    color: TEXT,
    fontSize: 17,
    fontWeight: "900",
  },

  imageModalClose: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F5F8",
  },

  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    paddingTop: 12,
  },

  imageGridItem: {
    width: (width - 40) / 3,
    height: (width - 40) / 3,
    borderRadius: 10,
    margin: 4,
    backgroundColor: SOFT,
  },

  deliveryCard: {
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ECEEF2",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  deliveryLabel: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "700",
  },

  deliveryPin: {
    color: MUTED,
    marginTop: 4,
    fontSize: 13,
  },

  changeButton: {
    borderWidth: 1,
    borderColor: CTA,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  changeButtonText: {
    color: CTA,
    fontWeight: "800",
  },

  assuranceRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 16,
  },

  assuranceItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: "#ECEEF2",
    paddingHorizontal: 6,
  },

  assuranceText: {
    color: "#4B5563",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },

  bottomBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderColor: "#ECEEF2",
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 12,
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
  },

  cartButton: {
    flex: 1,
    height: 46,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: CTA,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    backgroundColor: "#FFFFFF",
  },

  cartButtonText: {
    color: CTA,
    fontWeight: "800",
    fontSize: 16,
    marginLeft: 8,
  },

  buyButton: {
    flex: 1,
    height: 46,
    borderRadius: 4,
    backgroundColor: CTA,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buyButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
    marginLeft: 8,
  },
});
