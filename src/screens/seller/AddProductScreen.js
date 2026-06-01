


import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useShop } from "../../context/ShopContext";

const C = {
  primary: "#082843",
  primaryDark: "#082843",
  white: "#FFFFFF",
  bg: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  border: "#F3D6E2",
  soft: "#FFFFFF",
  success: "#16A34A",
  danger: "#EF4444",
  greenSoft: "#ECFDF5",
  greenBorder: "#BBF7D0",
  orangeSoft: "#FFF7ED",
  orangeBorder: "#FED7AA",
  orange: "#EA580C",
  blueSoft: "#EFF6FF",
  blueBorder: "#BFDBFE",
  blue: "#2563EB",
};

const COMMISSION_RATE = 0.10; // 10%

const CATEGORY_SUBCATEGORY_MAP = {
  Bags: ["Tote Bags", "Jute Bags", "Sling Bags", "Potli Bags"],
  Candles: ["Scented Candles", "Decor Candles", "Gel Candles", "Floating Candles"],
  Cards: ["Greeting Cards", "Birthday Cards", "Wedding Cards", "Thank You Cards"],
  Decor: ["Wall Decor", "Table Decor", "Door Hangings", "Showpieces"],
  Dresses: ["Frocks", "Kurtis", "Sarees", "Lehengas", "Sweaters"],
  Festive: [
    "Ganesh Idols", "Rakhis", "Diyas", "Rangoli",
    "Pooja Items", "Lanterns", "Navratri Decor", "Christmas Decor",
  ],
  Jewelry: ["Earrings", "Necklaces", "Bangles", "Anklets"],
  Paintings: ["Canvas Paintings", "Madhubani Paintings", "Warli Paintings", "Mini Paintings"],
  Pickles: ["Mango Pickle", "Lemon Pickle", "Gongura Pickle", "Mixed Pickle"],
  Pottery: ["Clay Pots", "Vases", "Clay Cups", "Planters"],
  Sweets: ["Laddus", "Halwa", "Traditional Sweets", "Dry Fruit Sweets"],
};

const CATEGORIES = Object.keys(CATEGORY_SUBCATEGORY_MAP);

const cleanNumber = (value) => {
  const n = Number(String(value || "").replace(/[₹,%\s,]/g, ""));
  return Number.isNaN(n) ? 0 : n;
};

const formatPrice = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

// ─── Reusable Input ────────────────────────────────────────────────────────
function Input({ label, value, onChangeText, placeholder, keyboardType, multiline, error, required }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={{ color: C.danger }}> *</Text> : null}
      </Text>
      <TextInput
        style={[styles.input, multiline && styles.area, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.muted}
        keyboardType={keyboardType}
        multiline={multiline}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

// ─── Reusable Dropdown ─────────────────────────────────────────────────────
function Dropdown({ label, value, options, onChange, error, placeholder, required }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={[styles.field, { zIndex: open ? 99 : 1 }]}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={{ color: C.danger }}> *</Text> : null}
      </Text>
      <TouchableOpacity
        style={[styles.dropBox, error && styles.inputError]}
        onPress={() => setOpen(!open)}
        activeOpacity={0.85}
      >
        <Text style={[styles.dropText, !value && { color: C.muted }]}>
          {value || placeholder || `Select ${label}`}
        </Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={18} color={C.primary} />
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {open && (
        <View style={styles.dropList}>
          {options.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.dropItem}
              onPress={() => { onChange(item); setOpen(false); }}
              activeOpacity={0.8}
            >
              <Text style={styles.dropItemText}>{item}</Text>
              {value === item && (
                <Ionicons name="checkmark-circle" size={18} color={C.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────
export default function AddProductScreen({ navigation, route }) {
  const { addSellerProductPending } = useShop();

  const [images, setImages] = useState([]);
  const [savedMsg, setSavedMsg] = useState("");
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    category: "",
    subcategory: "",
    price: "",
    discount: "",
    stock: "",
    weight: "",
    description: "",
    material: "",
    color: "",
    size: "",
  });

  const priceNumber = cleanNumber(form.price);
  const discountNumber = Math.min(cleanNumber(form.discount), 100);
  const finalPrice = Math.max(priceNumber - (priceNumber * discountNumber) / 100, 0);

  // Upload fee = 10% of product price
  const adminCommission = Math.round(priceNumber * COMMISSION_RATE);
  const sellerWillGet = priceNumber - adminCommission;

  const set = (key, value) => {
    setForm((prev) => {
      if (key === "category") return { ...prev, category: value, subcategory: "" };
      return { ...prev, [key]: value };
    });
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const subcategoryOptions = form.category
    ? CATEGORY_SUBCATEGORY_MAP[form.category] || []
    : [];

  const pickImages = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setSavedMsg("Gallery permission needed.");
      setTimeout(() => setSavedMsg(""), 1600);
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.75,
    });
    if (!res.canceled) {
      setImages((prev) => [...prev, ...res.assets].slice(0, 5));
    }
  };

  const removeImage = (uri) =>
    setImages((prev) => prev.filter((item) => item.uri !== uri));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Product name is required.";
    if (!form.category) next.category = "Category is required.";
    if (!form.subcategory) next.subcategory = "Subcategory is required.";
    if (!form.price.trim()) next.price = "Price is required.";
    if (priceNumber <= 0) next.price = "Enter valid price.";
    if (discountNumber < 0 || discountNumber > 100)
      next.discount = "Discount must be 0 to 100.";
    if (!form.stock.trim()) next.stock = "Stock is required.";
    if (cleanNumber(form.stock) <= 0) next.stock = "Enter valid stock.";
    if (!form.description.trim()) next.description = "Description is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const resetForm = () => {
    setForm({
      name: "", category: "", subcategory: "", price: "", discount: "",
      stock: "", weight: "", description: "", material: "", color: "", size: "",
    });
    setImages([]);
    setErrors({});
  };

  // ── Proceed to Payment → navigate to ReviewAndPayScreen ─────────────────
  const handleProceedToPayment = () => {
    if (!validate()) return;

    const productData = {
      name: form.name.trim(),
      category: form.category,
      subcategory: form.subcategory,
      price: priceNumber,
      originalPrice: priceNumber,
      discount: discountNumber,
      finalPrice,
      stock: cleanNumber(form.stock),
      weight: form.weight.trim(),
      description: form.description.trim(),
      material: form.material.trim() || "Handmade / Premium Quality",
      color: form.color.trim() || "As shown in image",
      size: form.size.trim() || "Medium",
      image: images[0]?.uri || null,
      images: images.map((img) => img.uri),
      rawImages: images,
    };

    navigation.navigate("ReviewAndPayScreen", {
      productData,
      adminCommission,
      sellerWillGet,
    });
  };

  // ── Save Draft (no payment) ────────────────────────────────────────────
  const saveDraft = () => {
    setSavedMsg("Draft saved successfully.");
    setTimeout(() => setSavedMsg(""), 2000);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}
          activeOpacity={0.85}
        >
          <Ionicons name="chevron-back" size={24} color={C.text} />
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <Text style={styles.headerTitle}>Add Product</Text>
        </View>

        <TouchableOpacity onPress={saveDraft} activeOpacity={0.85}>
          <Text style={styles.saveDraftText}>Save Draft</Text>
        </TouchableOpacity>
      </View>

      {/* ── Toast ── */}
      {savedMsg ? (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={18} color={C.success} />
          <Text style={styles.toastText}>{savedMsg}</Text>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Admin Approval Banner ── */}
        <View style={styles.approvalBanner}>
          <View style={styles.approvalIconWrap}>
            <Ionicons name="shield-checkmark" size={22} color={C.success} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.approvalTitle}>Admin Approval Required</Text>
            <Text style={styles.approvalSub}>
              Your product will be reviewed by admin after successful payment.
            </Text>
          </View>
          <Ionicons name="clipboard-outline" size={28} color={C.success} style={{ opacity: 0.5 }} />
        </View>

        {/* ── Product Images ── */}
        <Text style={styles.sectionTitle}>
          Product Images <Text style={styles.maxHint}>(Max 5)</Text>
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imageRow}
        >
          {images.map((img) => (
            <View key={img.uri} style={styles.previewWrap}>
              <Image source={{ uri: img.uri }} style={styles.preview} />
              <TouchableOpacity style={styles.remove} onPress={() => removeImage(img.uri)}>
                <Ionicons name="close" size={14} color={C.white} />
              </TouchableOpacity>
            </View>
          ))}

          {images.length < 5 && (
            <TouchableOpacity style={styles.addImage} onPress={pickImages}>
              <Ionicons name="add-circle-outline" size={30} color={C.primary} />
              <Text style={styles.addImageText}>Add More</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* ── Product Name ── */}
        <Input
          label="Product Name"
          placeholder="Handmade Macrame Wall Hanging"
          value={form.name}
          onChangeText={(v) => set("name", v)}
          error={errors.name}
          required
        />

        {/* ── Category ── */}
        <Dropdown
          label="Category"
          value={form.category}
          options={CATEGORIES}
          onChange={(v) => set("category", v)}
          error={errors.category}
          placeholder="Select category"
          required
        />

        {/* ── Subcategory ── */}
        {form.category ? (
          <Dropdown
            label="Subcategory"
            value={form.subcategory}
            options={subcategoryOptions}
            onChange={(v) => set("subcategory", v)}
            error={errors.subcategory}
            placeholder="Select subcategory"
            required
          />
        ) : null}

        {/* ── Price & Discount ── */}
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Input
              label="Price (₹)"
              placeholder="500"
              keyboardType="numeric"
              value={form.price}
              onChangeText={(v) => set("price", v)}
              error={errors.price}
              required
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label="Discount (%)"
              placeholder="10"
              keyboardType="numeric"
              value={form.discount}
              onChangeText={(v) => set("discount", v)}
              error={errors.discount}
            />
          </View>
        </View>

        {/* ── Price Preview ── */}
        {priceNumber > 0 && (
          <View style={styles.pricePreview}>
            <View>
              <Text style={styles.previewLabel}>Customer Price</Text>
              <View style={styles.priceLine}>
                <Text style={styles.finalPriceText}>{formatPrice(finalPrice)}</Text>
                {discountNumber > 0 ? (
                  <Text style={styles.oldPrice}>{formatPrice(priceNumber)}</Text>
                ) : null}
              </View>
            </View>
            {discountNumber > 0 ? (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{discountNumber}% OFF</Text>
              </View>
            ) : (
              <View style={styles.noDiscountBadge}>
                <Text style={styles.noDiscountText}>No Discount</Text>
              </View>
            )}
          </View>
        )}

        {/* ── Stock & Weight ── */}
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Input
              label="Stock"
              placeholder="25"
              keyboardType="numeric"
              value={form.stock}
              onChangeText={(v) => set("stock", v)}
              error={errors.stock}
              required
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label="Weight (kg)"
              placeholder="0.45"
              keyboardType="numeric"
              value={form.weight}
              onChangeText={(v) => set("weight", v)}
            />
          </View>
        </View>

        {/* ── Material ── */}
        <Input
          label="Material"
          placeholder="Jute, Cotton, Clay..."
          value={form.material}
          onChangeText={(v) => set("material", v)}
        />

        {/* ── Color & Size ── */}
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Input
              label="Color"
              placeholder="Brown"
              value={form.color}
              onChangeText={(v) => set("color", v)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label="Size"
              placeholder="Medium"
              value={form.size}
              onChangeText={(v) => set("size", v)}
            />
          </View>
        </View>

        {/* ── Description ── */}
        <Input
          label="Description"
          placeholder="Describe your product..."
          multiline
          value={form.description}
          onChangeText={(v) => set("description", v)}
          error={errors.description}
          required
        />
        {form.description.length > 0 && (
          <Text style={styles.charCount}>{form.description.length}/500</Text>
        )}

        {/* ── Upload Fee Details Card ── */}
        {priceNumber > 0 && (
          <View style={styles.feeCard}>
            <View style={styles.feeCardHeader}>
              <Text style={styles.feeCardTitle}>Upload Fee Details</Text>
              <TouchableOpacity>
                <Ionicons name="information-circle-outline" size={18} color={C.muted} />
              </TouchableOpacity>
            </View>

            <View style={styles.feeLine}>
              <Text style={styles.feeLabel}>Product Price</Text>
              <Text style={styles.feeValue}>{formatPrice(priceNumber)}</Text>
            </View>

            <View style={styles.feeLine}>
              <Text style={styles.feeLabel}>Admin Commission (10%)</Text>
              <Text style={styles.feeCommission}>- {formatPrice(adminCommission)}</Text>
            </View>

            <View style={styles.feeDivider} />

            <View style={styles.feeLine}>
              <Text style={styles.feeYouGetLabel}>You Will Get</Text>
              <Text style={styles.feeYouGetValue}>{formatPrice(sellerWillGet)}</Text>
            </View>
          </View>
        )}

        {/* ── Warning: Pay to Upload ── */}
        {priceNumber > 0 && (
          <View style={styles.payWarning}>
            <Ionicons name="warning-outline" size={18} color={C.orange} />
            <Text style={styles.payWarningText}>
              You need to pay{" "}
              <Text style={{ fontWeight: "900", color: C.orange }}>
                {formatPrice(adminCommission)}
              </Text>{" "}
              (10% of product price) to upload this product.
            </Text>
          </View>
        )}

        {/* ── Proceed to Payment Button ── */}
        <TouchableOpacity
          style={[styles.proceedWrap, priceNumber <= 0 && { opacity: 0.5 }]}
          onPress={handleProceedToPayment}
          activeOpacity={0.88}
          disabled={priceNumber <= 0}
        >
          <LinearGradient colors={[C.primary, C.primaryDark]} style={styles.proceedBtn}>
            <Text style={styles.proceedText}>
              Proceed to Payment{" "}
              {priceNumber > 0 ? formatPrice(adminCommission) : ""}
            </Text>
            <Ionicons name="arrow-forward" size={20} color={C.white} />
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.secureNote}>
          <Ionicons name="lock-closed-outline" size={12} color={C.muted} />{" "}
          Secure payment powered by Razorpay
        </Text>
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
    borderBottomWidth: 1,
    borderBottomColor: "#F8EAF1",
  },

  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.soft,
    borderWidth: 1,
    borderColor: C.border,
  },

  headerTitle: { fontSize: 18, fontWeight: "900", color: C.text },

  saveDraftText: {
    fontSize: 14,
    fontWeight: "800",
    color: C.blue,
  },

  toast: {
    marginHorizontal: 18,
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: C.greenSoft,
    borderWidth: 1,
    borderColor: C.greenBorder,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  toastText: {
    marginLeft: 8,
    color: C.success,
    fontSize: 13,
    fontWeight: "900",
    flex: 1,
  },

  content: { padding: 18, paddingBottom: 40 },

  // ── Approval Banner ──────────────────────────────────────────────────────
  approvalBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.greenSoft,
    borderWidth: 1,
    borderColor: C.greenBorder,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    gap: 10,
  },

  approvalIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
  },

  approvalTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#065F46",
  },

  approvalSub: {
    fontSize: 12,
    color: "#047857",
    fontWeight: "600",
    marginTop: 2,
  },

  // ── Images ───────────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: C.text,
    marginBottom: 10,
  },

  maxHint: {
    fontSize: 12,
    fontWeight: "700",
    color: C.muted,
  },

  imageRow: {
    flexDirection: "row",
    gap: 10,
    paddingBottom: 18,
  },

  previewWrap: {
    width: 90,
    height: 90,
    borderRadius: 14,
  },

  preview: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
    backgroundColor: C.soft,
  },

  remove: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#11182799",
    alignItems: "center",
    justifyContent: "center",
  },

  addImage: {
    width: 90,
    height: 90,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    borderStyle: "dashed",
    backgroundColor: "#FDF2F8",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  addImageText: {
    fontSize: 11,
    fontWeight: "800",
    color: C.primary,
  },

  // ── Form Fields ───────────────────────────────────────────────────────────
  field: { marginBottom: 14 },

  label: { fontSize: 13, fontWeight: "900", color: C.text, marginBottom: 7 },

  input: {
    height: 52,
    borderWidth: 1.4,
    borderColor: C.border,
    borderRadius: 15,
    paddingHorizontal: 14,
    color: C.text,
    backgroundColor: C.white,
    fontWeight: "700",
    fontSize: 14,
  },

  inputError: { borderColor: C.danger },

  errorText: { color: C.danger, fontSize: 11, fontWeight: "800", marginTop: 5 },

  area: { height: 110, paddingTop: 12, textAlignVertical: "top" },

  charCount: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "700",
    textAlign: "right",
    marginTop: -10,
    marginBottom: 14,
  },

  row: { flexDirection: "row" },

  dropBox: {
    height: 52,
    borderWidth: 1.4,
    borderColor: C.border,
    borderRadius: 15,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
  },

  dropText: { flex: 1, fontSize: 14, color: C.text, fontWeight: "700" },

  dropList: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 15,
    backgroundColor: C.white,
    marginTop: 5,
    overflow: "hidden",
    elevation: 8,
  },

  dropItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F8EAF1",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dropItemText: { color: C.text, fontWeight: "800" },

  // ── Price Preview ─────────────────────────────────────────────────────────
  pricePreview: {
    backgroundColor: C.soft,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  previewLabel: { fontSize: 12, fontWeight: "800", color: C.muted, marginBottom: 4 },

  priceLine: { flexDirection: "row", alignItems: "center", gap: 8 },

  finalPriceText: { fontSize: 20, fontWeight: "900", color: C.text },

  oldPrice: {
    fontSize: 13,
    fontWeight: "800",
    color: C.muted,
    textDecorationLine: "line-through",
  },

  discountBadge: {
    backgroundColor: C.greenSoft,
    borderWidth: 1,
    borderColor: C.greenBorder,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  discountText: { color: C.success, fontSize: 12, fontWeight: "900" },

  noDiscountBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  noDiscountText: { color: C.muted, fontSize: 12, fontWeight: "900" },

  // ── Fee Card ──────────────────────────────────────────────────────────────
  feeCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    marginTop: 4,
  },

  feeCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  feeCardTitle: { fontSize: 15, fontWeight: "900", color: C.text },

  feeLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  feeLabel: { fontSize: 13, fontWeight: "700", color: C.muted },

  feeValue: { fontSize: 14, fontWeight: "900", color: C.text },

  feeCommission: { fontSize: 14, fontWeight: "900", color: C.danger },

  feeDivider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 10,
  },

  feeYouGetLabel: { fontSize: 14, fontWeight: "900", color: C.text },

  feeYouGetValue: { fontSize: 16, fontWeight: "900", color: C.success },

  // ── Pay Warning ───────────────────────────────────────────────────────────
  payWarning: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: C.orangeSoft,
    borderWidth: 1,
    borderColor: C.orangeBorder,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },

  payWarningText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#9A3412",
    lineHeight: 18,
  },

  // ── Proceed Button ────────────────────────────────────────────────────────
  proceedWrap: { borderRadius: 18, overflow: "hidden", marginTop: 4 },

  proceedBtn: {
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },

  proceedText: { color: C.white, fontSize: 16, fontWeight: "900" },

  secureNote: {
    textAlign: "center",
    fontSize: 11,
    color: C.muted,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 20,
  },
});
