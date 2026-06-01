
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  Animated,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useShop } from "../../context/ShopContext";

const BRAND = "#0E3243";
const BRAND_DARK = "#082330";
const BRAND_SOFT = "#EAF4F7";
const BORDER = "#D7E7EC";
const TEXT = "#111827";
const MUTED = "#6B7280";
const DANGER = "#E53935";

const CART_ROUTE = "CartTab";
const WISHLIST_ROUTE = "WishlistTab";

const ADDRESS_TYPES = [
  { key: "home", label: "Home", icon: "home-outline", activeIcon: "home" },
  { key: "work", label: "Work", icon: "briefcase-outline", activeIcon: "briefcase" },
  { key: "other", label: "Other", icon: "location-outline", activeIcon: "location" },
];

const INITIAL_ADDRESSES = [
  {
    id: "1",
    type: "home",
    name: "Arjun Reddy",
    phone: "+91 98765 43210",
    line1: "Flat 4B, Srinivasa Residency",
    line2: "Banjara Hills, Road No. 12",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500034",
    isDefault: true,
  },
  {
    id: "2",
    type: "work",
    name: "Arjun Reddy",
    phone: "+91 98765 43210",
    line1: "Tower B, 5th Floor, Cyber Towers",
    line2: "HITEC City",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500081",
    isDefault: false,
  },
];

const EMPTY_FORM = {
  type: "home",
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

const TYPE_COLORS = {
  home: { bg: "#1565C0", light: "#EAF3FF" },
  work: { bg: "#2E7D32", light: "#ECFDF3" },
  other: { bg: "#6A1B9A", light: "#F5EDFF" },
};

function AnimatedCard({ children, index }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

function DeleteConfirmBanner({ onConfirm, onCancel }) {
  return (
    <View style={styles.deleteBanner}>
      <View style={styles.deleteBannerLeft}>
        <Ionicons name="warning" size={15} color={DANGER} />
        <Text style={styles.deleteBannerText}>Remove this address?</Text>
      </View>

      <View style={styles.deleteBannerActions}>
        <TouchableOpacity style={styles.deleteCancelBtn} onPress={onCancel}>
          <Text style={styles.deleteCancelText}>Keep</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteConfirmBtn} onPress={onConfirm}>
          <Ionicons name="trash" size={11} color="#FFFFFF" />
          <Text style={styles.deleteConfirmText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function AddressCard({ address, onEdit, onDelete, onSetDefault, onSelect, index }) {
  const typeConfig =
    ADDRESS_TYPES.find((t) => t.key === address.type) || ADDRESS_TYPES[2];

  const typeColor = TYPE_COLORS[address.type] || TYPE_COLORS.other;
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <AnimatedCard index={index}>
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={() => onSelect?.(address)}
        style={[styles.card, address.isDefault && styles.cardDefault]}
      >
        {address.isDefault && (
          <View style={styles.defaultRibbon}>
            <Ionicons name="checkmark-circle" size={11} color="#FFFFFF" />
            <Text style={styles.defaultRibbonText}>DEFAULT</Text>
          </View>
        )}

        <View style={styles.cardHeader}>
          <View style={[styles.typeTag, { backgroundColor: typeColor.bg }]}>
            <Ionicons name={typeConfig.activeIcon} size={12} color="#FFFFFF" />
            <Text style={styles.typeTagText}>
              {typeConfig.label.toUpperCase()}
            </Text>
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity
              onPress={() => {
                setConfirmingDelete(false);
                onEdit(address);
              }}
              style={styles.actionBtn}
            >
              <Ionicons name="pencil" size={15} color={BRAND} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setConfirmingDelete((v) => !v)}
              style={[
                styles.actionBtn,
                confirmingDelete && { backgroundColor: DANGER },
              ]}
            >
              <Ionicons
                name="trash"
                size={15}
                color={confirmingDelete ? "#FFFFFF" : DANGER}
              />
            </TouchableOpacity>
          </View>
        </View>

        {confirmingDelete && (
          <DeleteConfirmBanner
            onConfirm={() => {
              setConfirmingDelete(false);
              onDelete(address.id);
            }}
            onCancel={() => setConfirmingDelete(false)}
          />
        )}

        <View style={styles.cardDivider} />

        <View style={styles.namePhoneRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>
              {address.name ? address.name[0].toUpperCase() : "?"}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.cardName}>{address.name}</Text>
            <View style={styles.phoneRow}>
              <Ionicons name="call" size={11} color={BRAND} />
              <Text style={styles.cardPhone}>{address.phone}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.addressBlock, { borderLeftColor: typeColor.bg }]}>
          <Text style={styles.cardAddress}>
            {address.line1}
            {address.line2 ? `\n${address.line2}` : ""}
            {"\n"}
            {address.city}, {address.state}
          </Text>

          <View style={styles.pincodeChip}>
            <Ionicons name="pin" size={10} color={typeColor.bg} />
            <Text style={[styles.pincodeText, { color: typeColor.bg }]}>
              {address.pincode}
            </Text>
          </View>
        </View>

        {!address.isDefault && (
          <TouchableOpacity
            onPress={() => onSetDefault(address.id)}
            style={styles.setDefaultBtn}
            activeOpacity={0.8}
          >
            <View style={styles.radioOuter} />
            <Text style={styles.setDefaultText}>
              Set as default delivery address
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </AnimatedCard>
  );
}

function FieldError({ message }) {
  if (!message) return null;

  return (
    <View style={styles.fieldError}>
      <Ionicons name="alert-circle" size={12} color={DANGER} />
      <Text style={styles.fieldErrorText}>{message}</Text>
    </View>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  maxLength,
  required,
  icon,
  error,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>
        {label}
        {required && <Text style={{ color: DANGER }}> *</Text>}
      </Text>

      <View
        style={[
          styles.fieldInputWrap,
          focused && { borderColor: BRAND },
          error && !focused && { borderColor: DANGER },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={15}
            color={error && !focused ? DANGER : focused ? BRAND : MUTED}
            style={{ marginRight: 8 }}
          />
        )}

        <TextInput
          style={styles.fieldInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        {error && !focused ? (
          <Ionicons name="alert-circle" size={16} color={DANGER} />
        ) : value?.length > 0 ? (
          <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
        ) : null}
      </View>

      <FieldError message={error} />
    </View>
  );
}

function AddressFormModal({ visible, initial, onSave, onClose }) {
  const [form, setForm] = useState(() =>
    initial ? { ...initial } : { ...EMPTY_FORM }
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (visible) {
      setForm(initial ? { ...initial } : { ...EMPTY_FORM });
      setErrors({});
    }
  }, [visible, initial]);

  const set = useCallback(
    (key) => (val) => {
      setForm((f) => ({ ...f, [key]: val }));
      setErrors((e) => ({ ...e, [key]: undefined }));
    },
    []
  );

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.line1.trim()) newErrors.line1 = "Address line 1 is required";
    if (!form.city.trim()) newErrors.city = "City is required";

    if (!form.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (form.pincode.trim().length !== 6) {
      newErrors.pincode = "Must be exactly 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    onSave({
      ...form,
      name: form.name.trim(),
      phone: form.phone.trim(),
      line1: form.line1.trim(),
      line2: form.line2.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
    });
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalSheet}>
                <View style={styles.sheetHandle} />

                <View style={styles.modalHeader}>
                  <View style={styles.modalHeaderLeft}>
                    <View style={styles.modalHeaderIcon}>
                      <Ionicons
                        name={initial ? "pencil" : "add"}
                        size={16}
                        color={BRAND}
                      />
                    </View>

                    <Text style={styles.modalTitle}>
                      {initial ? "Edit Address" : "Add New Address"}
                    </Text>
                  </View>

                  <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
                    <Ionicons name="close" size={20} color={MUTED} />
                  </TouchableOpacity>
                </View>

                {hasErrors && (
                  <View style={styles.errorSummaryBar}>
                    <Ionicons name="alert-circle" size={14} color="#FFFFFF" />
                    <Text style={styles.errorSummaryText}>
                      Please fix the highlighted fields below
                    </Text>
                  </View>
                )}

                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  style={{ flex: 1 }}
                >
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.modalScrollContent}
                    keyboardShouldPersistTaps="handled"
                  >
                    <Text style={styles.fieldLabel}>
                      Address Type <Text style={{ color: DANGER }}>*</Text>
                    </Text>

                    <View style={styles.typeSelector}>
                      {ADDRESS_TYPES.map((t) => {
                        const isActive = form.type === t.key;
                        const color = TYPE_COLORS[t.key];

                        return (
                          <TouchableOpacity
                            key={t.key}
                            style={[
                              styles.typeOption,
                              {
                                borderColor: color.bg,
                                backgroundColor: isActive ? color.bg : color.light,
                              },
                            ]}
                            onPress={() => set("type")(t.key)}
                            activeOpacity={0.8}
                          >
                            <Ionicons
                              name={isActive ? t.activeIcon : t.icon}
                              size={16}
                              color={isActive ? "#FFFFFF" : color.bg}
                            />

                            <Text
                              style={[
                                styles.typeOptionText,
                                { color: isActive ? "#FFFFFF" : color.bg },
                              ]}
                            >
                              {t.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    <FormField
                      label="Full Name"
                      value={form.name}
                      onChangeText={set("name")}
                      placeholder="e.g. Arjun Reddy"
                      icon="person-outline"
                      required
                      error={errors.name}
                    />

                    <FormField
                      label="Phone Number"
                      value={form.phone}
                      onChangeText={set("phone")}
                      placeholder="+91 XXXXX XXXXX"
                      keyboardType="phone-pad"
                      maxLength={15}
                      icon="call-outline"
                      required
                      error={errors.phone}
                    />

                    <FormField
                      label="Address Line 1"
                      value={form.line1}
                      onChangeText={set("line1")}
                      placeholder="Flat / House No., Building Name"
                      icon="home-outline"
                      required
                      error={errors.line1}
                    />

                    <FormField
                      label="Address Line 2"
                      value={form.line2}
                      onChangeText={set("line2")}
                      placeholder="Street, Area, Landmark"
                      icon="map-outline"
                    />

                    <View style={styles.rowFields}>
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <FormField
                          label="City"
                          value={form.city}
                          onChangeText={set("city")}
                          placeholder="City"
                          icon="business-outline"
                          required
                          error={errors.city}
                        />
                      </View>

                      <View style={{ flex: 1 }}>
                        <FormField
                          label="Pincode"
                          value={form.pincode}
                          onChangeText={set("pincode")}
                          placeholder="6-digit"
                          keyboardType="numeric"
                          maxLength={6}
                          icon="pin-outline"
                          required
                          error={errors.pincode}
                        />
                      </View>
                    </View>

                    <FormField
                      label="State"
                      value={form.state}
                      onChangeText={set("state")}
                      placeholder="State"
                      icon="globe-outline"
                    />

                    <TouchableOpacity
                      style={styles.defaultToggle}
                      onPress={() => set("isDefault")(!form.isDefault)}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          styles.toggleBox,
                          form.isDefault && styles.toggleBoxActive,
                        ]}
                      >
                        {form.isDefault && (
                          <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                        )}
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.toggleLabel}>Set as default address</Text>
                        <Text style={styles.toggleSub}>
                          Used automatically at checkout
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </ScrollView>
                </KeyboardAvoidingView>

                <View style={styles.modalFooter}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Ionicons
                      name={initial ? "checkmark-circle" : "add-circle"}
                      size={18}
                      color="#FFFFFF"
                    />

                    <Text style={styles.saveBtnText}>
                      {initial ? "Update Address" : "Save Address"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

function EmptyState({ onAdd }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="location" size={56} color={BRAND} />
      </View>

      <Text style={styles.emptyTitle}>No Saved Addresses</Text>

      <Text style={styles.emptySubtitle}>
        Save your home, work or favourite address for quicker checkout.
      </Text>

      <TouchableOpacity style={styles.emptyAddBtn} onPress={onAdd} activeOpacity={0.85}>
        <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
        <Text style={styles.emptyAddBtnText}>Add Your First Address</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function CustomerSavedAddressScreen({ navigation, route }) {
  const {
    cartCount = 0,
    wishlistCount = 0,
    customerAddresses = [],
    saveCustomerAddress,
    deleteCustomerAddress,
    setDefaultCustomerAddress,
  } = useShop() || {};

  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const openedFromCheckout = route?.params?.returnTo === "Checkout";

  const openAdd = () => {
    setEditingAddress(null);
    setModalVisible(true);
  };

  const openEdit = (address) => {
    setEditingAddress({ ...address });
    setModalVisible(true);
  };

  const goCart = () => {
    navigation.navigate(CART_ROUTE);
  };

  const goWishlist = () => {
    navigation.navigate(WISHLIST_ROUTE);
  };

  const handleSelectAddress = (address) => {
    if (!openedFromCheckout || !address?.id) return;
    setDefaultCustomerAddress?.(address.id);
    navigation.goBack();
  };

  const handleDelete = (id) => {
    deleteCustomerAddress?.(id);
  };

  const handleSetDefault = (id) => {
    setDefaultCustomerAddress?.(id);
  };

  const handleSave = (form) => {
    const nextAddress = {
      ...form,
      isDefault: openedFromCheckout ? true : form.isDefault,
    };

    saveCustomerAddress?.(nextAddress, editingAddress?.id ?? null);
    setModalVisible(false);
    setEditingAddress(null);

    if (openedFromCheckout) {
      navigation.goBack();
    }
  };

  const sortedAddresses = [...customerAddresses].sort((a, b) =>
    b.isDefault ? 1 : a.isDefault ? -1 : 0
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>My Addresses</Text>
          <Text style={styles.headerSub}>{customerAddresses.length} saved</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={goCart}>
            <Ionicons name="cart-outline" size={22} color="#FFFFFF" />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {cartCount > 9 ? "9+" : cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerIconBtn} onPress={goWishlist}>
            <Ionicons name="heart-outline" size={22} color="#FFFFFF" />
            {wishlistCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.subHeader}>
        <View style={styles.subHeaderLeft}>
          <Ionicons name="shield-checkmark" size={13} color={BRAND} />
          <Text style={styles.subHeaderText}>Secure & encrypted addresses</Text>
        </View>

        <TouchableOpacity onPress={openAdd} style={styles.addAddressBtn}>
          <Ionicons name="add" size={14} color={BRAND} />
          <Text style={styles.addAddressBtnText}>Add New</Text>
        </TouchableOpacity>
      </View>

      {customerAddresses.length === 0 ? (
        <EmptyState onAdd={openAdd} />
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {sortedAddresses.map((address, index) => (
            <AddressCard
              key={address.id}
              address={address}
              index={index}
              onEdit={openEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
              onSelect={handleSelectAddress}
            />
          ))}

          <TouchableOpacity style={styles.addMoreCard} onPress={openAdd} activeOpacity={0.75}>
            <View style={styles.addMoreIcon}>
              <Ionicons name="add" size={22} color={BRAND} />
            </View>

            <View>
              <Text style={styles.addMoreText}>Add another address</Text>
              <Text style={styles.addMoreSub}>Home, work, or anywhere</Text>
            </View>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      {customerAddresses.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={openAdd} activeOpacity={0.85}>
          <Ionicons name="add" size={26} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      <View style={styles.bottomNav}>
        {[
          { icon: "home-outline", label: "Home", route: "Home" },
          { icon: "bag-outline", label: "Orders", route: "MyOrders" },
          { icon: "location", label: "Address", route: null, active: true },
          { icon: "chatbubble-outline", label: "Support", route: "CustomerChatSupport" },
          { icon: "person-outline", label: "Profile", route: "Profile" },
        ].map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.navItem}
            onPress={() => item.route && navigation.navigate(item.route)}
          >
            <View style={item.active ? styles.navActiveIconWrap : null}>
              <Ionicons
                name={item.icon}
                size={22}
                color={item.active ? BRAND : "#9CA3AF"}
              />
            </View>

            <Text style={[styles.navLabel, item.active && styles.navLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <AddressFormModal
        visible={modalVisible}
        initial={editingAddress}
        onSave={handleSave}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 54 : 36,
    paddingBottom: 14,
    paddingHorizontal: 14,
    backgroundColor: BRAND,
    elevation: 8,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  headerSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    marginTop: 1,
    fontWeight: "700",
  },
  headerRight: {
    flexDirection: "row",
    width: 84,
    justifyContent: "flex-end",
    gap: 4,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 1,
    right: 0,
    backgroundColor: "#FF3D00",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
    borderWidth: 1.5,
    borderColor: BRAND,
  },
  badgeText: { color: "#FFFFFF", fontSize: 9, fontWeight: "900" },

  subHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: BRAND_SOFT,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  subHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 5 },
  subHeaderText: { fontSize: 12, color: BRAND, fontWeight: "800" },
  addAddressBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: BRAND,
    backgroundColor: "#FFFFFF",
  },
  addAddressBtnText: { fontSize: 12, color: BRAND, fontWeight: "900" },

  list: { flex: 1 },
  listContent: { padding: 14, paddingTop: 14 },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    elevation: 3,
    overflow: "hidden",
  },
  cardDefault: {
    borderColor: BRAND,
    borderWidth: 2,
    backgroundColor: "#F8FCFD",
  },
  defaultRibbon: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: BRAND,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomLeftRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  defaultRibbonText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  typeTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  typeTagText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  cardActions: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BRAND_SOFT,
  },

  deleteBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF5F5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#FFD6D6",
  },
  deleteBannerLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  deleteBannerText: { fontSize: 13, color: DANGER, fontWeight: "700" },
  deleteBannerActions: { flexDirection: "row", gap: 8 },
  deleteCancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  deleteCancelText: { fontSize: 12, color: MUTED, fontWeight: "700" },
  deleteConfirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: DANGER,
  },
  deleteConfirmText: { fontSize: 12, color: "#FFFFFF", fontWeight: "800" },

  cardDivider: { height: 1, backgroundColor: BORDER, marginBottom: 12 },
  namePhoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BRAND_SOFT,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: BORDER,
  },
  avatarLetter: { fontSize: 16, fontWeight: "900", color: BRAND },
  cardName: {
    fontSize: 15,
    fontWeight: "900",
    color: TEXT,
    marginBottom: 3,
  },
  phoneRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  cardPhone: { fontSize: 12.5, color: MUTED, fontWeight: "700" },

  addressBlock: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
    marginBottom: 12,
    gap: 6,
  },
  cardAddress: { fontSize: 13, color: "#374151", lineHeight: 19 },
  pincodeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
  },
  pincodeText: { fontSize: 11, fontWeight: "900" },

  setDefaultBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: BRAND_SOFT,
    borderWidth: 1,
    borderColor: BORDER,
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: BRAND,
  },
  setDefaultText: { fontSize: 12.5, color: BRAND, fontWeight: "800" },

  addMoreCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: BORDER,
    borderStyle: "dashed",
    backgroundColor: "#FFFFFF",
    marginBottom: 14,
  },
  addMoreIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BRAND_SOFT,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: BORDER,
  },
  addMoreText: { fontSize: 14, color: BRAND, fontWeight: "900" },
  addMoreSub: { fontSize: 11.5, color: MUTED, marginTop: 2 },

  fab: {
    position: "absolute",
    right: 18,
    bottom: 78,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: BRAND,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },

  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    paddingBottom: Platform.OS === "ios" ? 24 : 8,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    elevation: 16,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4,
  },
  navActiveIconWrap: {
    backgroundColor: BRAND_SOFT,
    borderRadius: 12,
    padding: 4,
    marginBottom: 1,
  },
  navLabel: {
    fontSize: 9.5,
    color: "#9CA3AF",
    marginTop: 3,
    fontWeight: "700",
  },
  navLabelActive: { color: BRAND, fontWeight: "900" },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: BRAND_SOFT,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
    borderWidth: 3,
    borderColor: BORDER,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: TEXT,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: MUTED,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  emptyAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: BRAND,
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 30,
    elevation: 6,
  },
  emptyAddBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "900" },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: "93%",
    paddingBottom: Platform.OS === "ios" ? 32 : 12,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  modalHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  modalHeaderIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: BRAND_SOFT,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: { fontSize: 17, fontWeight: "900", color: TEXT },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  errorSummaryBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: DANGER,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  errorSummaryText: { fontSize: 13, color: "#FFFFFF", fontWeight: "800" },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
  },
  typeSelector: { flexDirection: "row", gap: 8, marginTop: 6, marginBottom: 18 },
  typeOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  typeOptionText: { fontSize: 12.5, fontWeight: "900" },

  fieldWrap: { marginBottom: 14 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: MUTED,
    marginBottom: 6,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  fieldInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: "#FFFFFF",
  },
  fieldInput: { flex: 1, fontSize: 14.5, color: TEXT, padding: 0 },
  fieldError: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  fieldErrorText: { fontSize: 11.5, color: DANGER, fontWeight: "700" },
  rowFields: { flexDirection: "row" },

  defaultToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: BRAND_SOFT,
    borderWidth: 1.5,
    borderColor: BORDER,
    marginTop: 6,
    marginBottom: 4,
  },
  toggleBox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: BRAND,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  toggleBoxActive: { backgroundColor: BRAND, borderColor: BRAND },
  toggleLabel: { fontSize: 14, color: TEXT, fontWeight: "900" },
  toggleSub: { fontSize: 11.5, color: MUTED, marginTop: 2 },

  modalFooter: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: "#F9FAFB",
  },
  cancelBtnText: { fontSize: 14, color: MUTED, fontWeight: "900" },
  saveBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: BRAND,
  },
  saveBtnText: { fontSize: 15, color: "#FFFFFF", fontWeight: "900" },
});
