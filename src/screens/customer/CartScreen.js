


// screens/customer/CartScreen.js

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Button from "../../components/Button";
import { COLORS } from "../../constants/colors";
import { useShop } from "../../context/ShopContext";

const placeholder = require("../../../assets/images/placeholder.png");

const CUSTOMER_COLOR = COLORS?.customer || "#E83E7C";
const TEXT_COLOR = COLORS?.text || "#111827";
const MUTED_COLOR = COLORS?.muted || "#6B7280";

const getPriceNumber = (price) => {
  if (typeof price === "number") return price;

  const clean = String(price || "0")
    .replace(/[₹,\s]/g, "")
    .replace(/[^\d.]/g, "");

  return Number(clean) || 0;
};

const formatMoney = (amount) => `₹${Number(amount || 0).toFixed(0)}`;

const getQty = (item) => {
  const qty = Number(item?.qty ?? item?.quantity ?? 1);
  return qty > 0 ? qty : 1;
};

const getImageSource = (item) => {
  const image =
    item?.image ||
    item?.coverImage ||
    item?.thumbnail ||
    item?.images?.[0] ||
    item?.productImages?.[0];

  if (!image) return placeholder;
  if (typeof image === "string") return { uri: image };
  return image;
};

export default function CartScreen({ navigation }) {
  const shop = useShop() || {};

  const {
    cartItems = [],
    removeFromCart = () => {},
    increaseQty = () => {},
    decreaseQty = () => {},
    clearCart = () => {},
    unreadCustomerNotifications = 0,
  } = shop;

  const [message, setMessage] = useState("");
  const [removeItemId, setRemoveItemId] = useState(null);
  const [clearModalVisible, setClearModalVisible] = useState(false);

  const openNotifications = () => {
    navigation.navigate("CustomerNotifications");
  };

  const itemTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      return sum + getPriceNumber(item?.price) * getQty(item);
    }, 0);
  }, [cartItems]);

  const deliveryCharge = cartItems.length > 0 ? 40 : 0;
  const totalAmount = itemTotal + deliveryCharge;

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2200);
  };

  const confirmRemoveItem = () => {
    if (removeItemId !== null && removeItemId !== undefined) {
      removeFromCart(removeItemId);
      showMessage("Item removed from cart.");
    }
    setRemoveItemId(null);
  };

  const confirmClearCart = () => {
    clearCart();
    setClearModalVisible(false);
    showMessage("Cart cleared successfully.");
  };

  const goShopping = () => {
    navigation.navigate("ProductList");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showMessage("Please add products to cart first.");
      return;
    }

    navigation.navigate("Checkout", {
      cartItems,
      totalAmount,
      itemTotal,
      deliveryCharge,
      action: "cart",
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            activeOpacity={0.85}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Cart</Text>

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

        {message ? (
          <View style={styles.messageBox}>
            <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {cartItems.length === 0 ? (
            <View style={styles.emptyBox}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="cart-outline" size={72} color={CUSTOMER_COLOR} />
              </View>

              <Text style={styles.emptyTitle}>Your cart is empty</Text>

              <Text style={styles.emptyText}>
                Add products to cart and they will appear here.
              </Text>

              <TouchableOpacity
                style={styles.shopBtn}
                activeOpacity={0.85}
                onPress={goShopping}
              >
                <Ionicons name="bag-handle-outline" size={18} color="#FFFFFF" />
                <Text style={styles.shopBtnText}>Continue Shopping</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.topRow}>
                <Text style={styles.itemCount}>
                  {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setClearModalVisible(true)}
                >
                  <Text style={styles.clearText}>Clear Cart</Text>
                </TouchableOpacity>
              </View>

              {cartItems.map((item, index) => {
                const qty = getQty(item);
                const price = getPriceNumber(item?.price);
                const imageSource = getImageSource(item);
                const itemId = item?.id ?? item?.productId ?? index;

                return (
                  <View key={String(itemId)} style={styles.card}>
                    <Image
                      source={imageSource}
                      defaultSource={
                        Platform.OS === "android" ? placeholder : undefined
                      }
                      style={styles.image}
                      resizeMode="cover"
                    />

                    <View style={styles.itemContent}>
                      <View style={styles.nameRow}>
                        <Text style={styles.name} numberOfLines={2}>
                          {item?.name || item?.title || "Product Name"}
                        </Text>

                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={styles.trashBtn}
                          onPress={() => setRemoveItemId(itemId)}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={20}
                            color="#EF4444"
                          />
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.seller} numberOfLines={1}>
                        {item?.seller ||
                          item?.sellerName ||
                          "Bliss Handmade Store"}
                      </Text>

                      <Text style={styles.price}>{formatMoney(price)}</Text>

                      <View style={styles.bottomRow}>
                        <View style={styles.qtyBox}>
                          <TouchableOpacity
                            style={styles.qtyBtn}
                            activeOpacity={0.8}
                            onPress={() => {
                              if (qty <= 1) {
                                setRemoveItemId(itemId);
                              } else {
                                decreaseQty(itemId);
                              }
                            }}
                          >
                            <Ionicons
                              name="remove"
                              size={18}
                              color={TEXT_COLOR}
                            />
                          </TouchableOpacity>

                          <Text style={styles.qtyText}>{qty}</Text>

                          <TouchableOpacity
                            style={styles.qtyBtn}
                            activeOpacity={0.8}
                            onPress={() => increaseQty(itemId)}
                          >
                            <Ionicons name="add" size={18} color={TEXT_COLOR} />
                          </TouchableOpacity>
                        </View>

                        <Text style={styles.itemTotal}>
                          {formatMoney(price * qty)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}

              <View style={styles.totalCard}>
                <Text style={styles.billTitle}>Bill Details</Text>

                <View style={styles.billRow}>
                  <Text style={styles.row}>Item Total</Text>
                  <Text style={styles.row}>{formatMoney(itemTotal)}</Text>
                </View>

                <View style={styles.billRow}>
                  <Text style={styles.row}>Delivery Charges</Text>
                  <Text style={styles.row}>{formatMoney(deliveryCharge)}</Text>
                </View>

                <View style={styles.line} />

                <View style={styles.billRow}>
                  <Text style={styles.total}>Total Amount</Text>
                  <Text style={styles.total}>{formatMoney(totalAmount)}</Text>
                </View>

                <View style={styles.checkoutBtnWrap}>
                  <Button title="Proceed to Checkout" onPress={handleCheckout} />
                </View>
              </View>
            </>
          )}
        </ScrollView>

        <ConfirmModal
          visible={removeItemId !== null && removeItemId !== undefined}
          title="Remove Item"
          message="Do you want to remove this item from cart?"
          confirmText="Remove"
          confirmColor="#EF4444"
          onCancel={() => setRemoveItemId(null)}
          onConfirm={confirmRemoveItem}
        />

        <ConfirmModal
          visible={clearModalVisible}
          title="Clear Cart"
          message="Do you want to remove all cart items?"
          confirmText="Clear"
          confirmColor="#EF4444"
          onCancel={() => setClearModalVisible(false)}
          onConfirm={confirmClearCart}
        />
      </View>
    </SafeAreaView>
  );
}

function ConfirmModal({
  visible,
  title,
  message,
  confirmText,
  confirmColor,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalIcon}>
            <Ionicons
              name="alert-circle-outline"
              size={34}
              color={confirmColor}
            />
          </View>

          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              activeOpacity={0.85}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: confirmColor }]}
              activeOpacity={0.85}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: CUSTOMER_COLOR,
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    height: Platform.OS === "web" ? 64 : 58,
    backgroundColor: CUSTOMER_COLOR,
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

  scrollContent: {
    paddingBottom: 120,
  },

  messageBox: {
    marginHorizontal: 16,
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "#111827",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  messageText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
  },

  topRow: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  itemCount: {
    fontSize: 16,
    fontWeight: "900",
    color: TEXT_COLOR,
  },

  clearText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#EF4444",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 14,
    padding: 12,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: "#F7E5EE",
  },

  image: {
    width: 94,
    height: 94,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: "#FFF4F8",
  },

  itemContent: {
    flex: 1,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },

  name: {
    flex: 1,
    fontWeight: "900",
    fontSize: 15.5,
    color: TEXT_COLOR,
    lineHeight: 21,
  },

  trashBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },

  seller: {
    color: MUTED_COLOR,
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
  },

  price: {
    color: CUSTOMER_COLOR,
    fontWeight: "900",
    marginTop: 6,
    fontSize: 16,
  },

  bottomRow: {
    marginTop: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF4F8",
    borderRadius: 22,
    padding: 4,
    borderWidth: 1,
    borderColor: "#FAD6E4",
  },

  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  qtyText: {
    minWidth: 30,
    textAlign: "center",
    fontWeight: "900",
    color: TEXT_COLOR,
  },

  itemTotal: {
    fontSize: 15,
    fontWeight: "900",
    color: TEXT_COLOR,
  },

  totalCard: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    padding: 18,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: "#F7E5EE",
  },

  billTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 12,
    color: TEXT_COLOR,
  },

  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  row: {
    fontSize: 15,
    color: TEXT_COLOR,
    fontWeight: "700",
  },

  line: {
    height: 1,
    backgroundColor: "#F1E3EA",
    marginVertical: 8,
  },

  total: {
    fontSize: 18,
    fontWeight: "900",
    marginVertical: 10,
    color: TEXT_COLOR,
  },

  checkoutBtnWrap: {
    marginTop: 8,
  },

  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 90,
  },

  emptyIconCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "#FFF4F8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FAD6E4",
  },

  emptyTitle: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: "900",
    color: TEXT_COLOR,
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: MUTED_COLOR,
    textAlign: "center",
    lineHeight: 21,
  },

  shopBtn: {
    marginTop: 22,
    height: 50,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: CUSTOMER_COLOR,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  shopBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
  },

  modalIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: TEXT_COLOR,
    textAlign: "center",
  },

  modalMessage: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "700",
    color: MUTED_COLOR,
    lineHeight: 20,
    textAlign: "center",
  },

  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    width: "100%",
  },

  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    fontSize: 14,
    fontWeight: "900",
    color: TEXT_COLOR,
  },

  confirmBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  confirmText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#FFFFFF",
  },
});
