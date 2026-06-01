
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useShop } from "../../context/ShopContext";

const C = {
  primary: "#082843",
  teal: "#0F766E",
  gold: "#D99000",
  white: "#FFFFFF",
  bg: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  border: "#E5E7EB",
  soft: "#F8FAFC",
  green: "#16A34A",
  orange: "#F59E0B",
  red: "#EF4444",
};

export default function SellerDeliveryScreen({ navigation, route }) {
  const {
    orders = [],
    deliveryPartners = [],
    currentSeller,
    addDeliveryPartner,
    assignDeliveryPerson,
    reloadDeliveryPartners,
  } = useShop();

  const routeOrder = route?.params?.order;

  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    area: "",
    vehicle: "",
    vehicleNumber: "",
    price: "",
    experience: "",
  });

  const [selectedOrder, setSelectedOrder] = useState(routeOrder || null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [search, setSearch] = useState("");
  const [doneMessage, setDoneMessage] = useState("");
  const [savingPartner, setSavingPartner] = useState(false);

  useEffect(() => {
    if (currentSeller?.id) {
      reloadDeliveryPartners?.(currentSeller.id);
    }
  }, [currentSeller, reloadDeliveryPartners]);

  const deliveryOrders = useMemo(() => {
    const validOrders = orders.filter(
      (o) =>
        o.deliveryStatus === "Need Delivery" ||
        o.deliveryStatus === "Assigned" ||
        o.deliveryStatus === "Out for Delivery" ||
        o.status === "Processing" ||
        o.status === "Packed" ||
        o.status === "Ready to Ship"
    );

    if (routeOrder && !validOrders.some((o) => String(o.id) === String(routeOrder.id))) {
      return [routeOrder, ...validOrders];
    }

    return validOrders;
  }, [orders, routeOrder]);

  const partners = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return deliveryPartners;

    return deliveryPartners.filter(
      (p) =>
        String(p.name || "").toLowerCase().includes(q) ||
        String(p.phone || "").toLowerCase().includes(q) ||
        String(p.area || "").toLowerCase().includes(q) ||
        String(p.vehicle || "").toLowerCase().includes(q) ||
        String(p.vehicleNumber || "").toLowerCase().includes(q)
    );
  }, [search, deliveryPartners]);

  const assignedPartner = deliveryPartners.find(
    (p) => String(p.id) === String(selectedPartner)
  );

  const selectedAddress =
    selectedOrder?.address?.line1 && selectedOrder?.address?.city
      ? `${selectedOrder.address.line1}, ${selectedOrder.address.city}`
      : selectedOrder?.address || "Customer address not added";

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddDeliveryPerson = async () => {
    if (!form.name || !form.phone || !form.area || !form.vehicle) {
      setDoneMessage("Please fill name, phone, area and vehicle");
      setTimeout(() => setDoneMessage(""), 1200);
      return;
    }

    try {
      setSavingPartner(true);
      const newPartner = await addDeliveryPartner?.({
        sellerId: currentSeller?.id,
        name: form.name,
        phone: form.phone,
        area: form.area,
        vehicle: form.vehicle,
        vehicleNumber: form.vehicleNumber,
        price: form.price,
        experience: form.experience,
      });

      setSelectedPartner(newPartner?.id || null);
      setShowAddForm(false);
      setForm({
        name: "",
        phone: "",
        area: "",
        vehicle: "",
        vehicleNumber: "",
        price: "",
        experience: "",
      });

      setDoneMessage(`${newPartner?.name || "Delivery person"} added successfully`);
    } catch (error) {
      setDoneMessage(error?.message || "Unable to save delivery person");
    } finally {
      setSavingPartner(false);
      setTimeout(() => setDoneMessage(""), 1600);
    }
  };

  const handleAssign = () => {
    if (!selectedOrder || !selectedPartner) return;

    const partner = assignDeliveryPerson?.(selectedOrder.id, selectedPartner);
    const partnerName = partner?.name || assignedPartner?.name || "Delivery partner";

    setDoneMessage(`${partnerName} assigned for order ${selectedOrder.id}`);

    setTimeout(() => {
      setDoneMessage("");
      navigation.goBack();
    }, 900);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={C.text} />
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>Delivery Persons</Text>
          <Text style={styles.headerSub}>Add person and assign order</Text>
        </View>

        <View style={styles.headerIcon}>
          <MaterialCommunityIcons name="truck-delivery-outline" size={24} color={C.primary} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {doneMessage ? (
          <View style={styles.successToast}>
            <Ionicons name="checkmark-circle" size={18} color={C.green} />
            <Text style={styles.successToastText}>{doneMessage}</Text>
          </View>
        ) : null}

        <View style={styles.heroCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Manage Delivery</Text>
            <Text style={styles.heroText}>
              Seller can add delivery person details and assign them to customer orders.
            </Text>
          </View>

          <View style={styles.deliveryPersonCircle}>
            <MaterialCommunityIcons name="bike-fast" size={46} color={C.white} />
          </View>
        </View>

        <View style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.addTopBtn}
            onPress={() => setShowAddForm(!showAddForm)}
          >
            <Ionicons name={showAddForm ? "close" : "add"} size={22} color={C.white} />
            <Text style={styles.addTopBtnText}>
              {showAddForm ? "Close Add Form" : "Add Delivery Person"}
            </Text>
          </TouchableOpacity>

          {showAddForm ? (
            <View style={styles.formBox}>
              <Text style={styles.sectionTitle}>Add Delivery Person Details</Text>

              <Input label="Person Name" value={form.name} onChangeText={(v) => updateForm("name", v)} />
              <Input label="Phone Number" value={form.phone} onChangeText={(v) => updateForm("phone", v)} keyboardType="phone-pad" />
              <Input label="Delivery Area" value={form.area} onChangeText={(v) => updateForm("area", v)} />
              <Input label="Vehicle Type" value={form.vehicle} onChangeText={(v) => updateForm("vehicle", v)} placeholder="Bike / Scooter / Auto" />
              <Input label="Vehicle Number" value={form.vehicleNumber} onChangeText={(v) => updateForm("vehicleNumber", v)} />
              <Input label="Delivery Fee" value={form.price} onChangeText={(v) => updateForm("price", v)} keyboardType="numeric" />
              <Input label="Experience" value={form.experience} onChangeText={(v) => updateForm("experience", v)} placeholder="Example: 2 Years" />

              <TouchableOpacity
                style={[styles.saveBtn, savingPartner && { opacity: 0.6 }]}
                onPress={handleAddDeliveryPerson}
                disabled={savingPartner}
              >
                <Ionicons name="save-outline" size={20} color={C.white} />
                <Text style={styles.saveBtnText}>
                  {savingPartner ? "Saving..." : "Save Delivery Person"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Select Order</Text>

          {deliveryOrders.length === 0 ? (
            <EmptyBox title="No orders need delivery" />
          ) : (
            deliveryOrders.map((order) => {
              const active = String(selectedOrder?.id) === String(order.id);

              return (
                <TouchableOpacity
                  key={order.id}
                  activeOpacity={0.85}
                  onPress={() => {
                    setSelectedOrder(order);
                    setSelectedPartner(order.deliveryPersonId || null);
                  }}
                  style={[styles.orderCard, active && styles.activeOrder]}
                >
                  <View style={styles.orderIcon}>
                    <Ionicons name="bag-handle" size={21} color={C.primary} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <Text style={styles.orderProduct}>
                      {order.title || order.productName || "Product Order"}
                    </Text>
                    <Text style={styles.orderAddress}>
                      {order.customer || order.address?.name || "Customer"} •{" "}
                      {order.deliveryStatus || order.status || "Need Delivery"}
                    </Text>
                  </View>

                  <Text style={styles.orderAmount}>
                    {order.price || order.total || order.amount || "₹0"}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Delivery Persons</Text>
            <Text style={styles.countText}>{partners.length} found</Text>
          </View>

          <View style={styles.searchBox}>
            <Ionicons name="search" size={19} color={C.muted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search name, phone, area, vehicle"
              placeholderTextColor="#A1A1AA"
              style={styles.searchInput}
            />
          </View>

          {partners.length === 0 ? (
            <EmptyBox title="No delivery person found" />
          ) : (
            partners.map((partner) => {
              const active = String(selectedPartner) === String(partner.id);
              const busy = partner.status === "Busy";

              return (
                <TouchableOpacity
                  key={partner.id}
                  activeOpacity={0.85}
                  disabled={busy}
                  onPress={() => setSelectedPartner(partner.id)}
                  style={[
                    styles.partnerCard,
                    active && styles.partnerActive,
                    busy && styles.busyPartner,
                  ]}
                >
                  <View style={styles.avatarCircle}>
                    <Ionicons name="person" size={24} color={C.white} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.partnerName}>{partner.name}</Text>
                      <Text style={styles.partnerPrice}>₹{partner.price || 40}</Text>
                    </View>

                    <Text style={styles.partnerSub}>
                      {partner.area || "Nearby Area"} • {partner.vehicle || "Bike"} • ⭐{" "}
                      {partner.rating || "New"}
                    </Text>

                    <View style={styles.partnerMetaRow}>
                      <SmallChip icon="call-outline" text={partner.phone || "No phone"} />
                      <SmallChip icon="bicycle-outline" text={partner.vehicleNumber || "No vehicle"} />
                      <SmallChip icon="shield-checkmark-outline" text={partner.idProof || "Pending"} />
                    </View>

                    <Text
                      style={[
                        styles.partnerStatus,
                        busy && { color: C.orange },
                        active && { color: C.green },
                      ]}
                    >
                      {active ? "Selected for this order" : partner.status || "Available"}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {assignedPartner ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Selected Delivery Person Details</Text>

            <View style={styles.profileBox}>
              <View style={styles.profileAvatar}>
                <Ionicons name="person" size={34} color={C.white} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.profileName}>{assignedPartner.name}</Text>
                <Text style={styles.profileSub}>{assignedPartner.area} Delivery Partner</Text>
              </View>
            </View>

            <Info label="Phone Number" value={assignedPartner.phone} />
            <Info label="Area" value={assignedPartner.area} />
            <Info label="Vehicle Type" value={assignedPartner.vehicle} />
            <Info label="Vehicle Number" value={assignedPartner.vehicleNumber} />
            <Info label="Status" value={assignedPartner.status} />
            <Info label="Experience" value={assignedPartner.experience} />
            <Info label="Completed Orders" value={assignedPartner.completedOrders} />
            <Info label="ID Proof" value={assignedPartner.idProof} />
            <Info label="Delivery Fee" value={`₹${assignedPartner.price || 40}`} />
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order & Delivery Summary</Text>

          <Info label="Order ID" value={selectedOrder?.id} />
          <Info label="Product" value={selectedOrder?.title || selectedOrder?.productName} />
          <Info label="Customer" value={selectedOrder?.customer || selectedOrder?.address?.name} />
          <Info label="Customer Phone" value={selectedOrder?.phone || selectedOrder?.address?.phone} />
          <Info label="Delivery Address" value={selectedAddress} />
          <Info label="Delivery Person" value={assignedPartner?.name || "Not selected"} />
          <Info label="Delivery Phone" value={assignedPartner?.phone || "—"} />
          <Info label="Vehicle" value={assignedPartner?.vehicle || "—"} />
          <Info label="Vehicle Number" value={assignedPartner?.vehicleNumber || "—"} />

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!selectedOrder || !selectedPartner}
            onPress={handleAssign}
            style={[
              styles.assignBtn,
              (!selectedOrder || !selectedPartner) && { opacity: 0.45 },
            ]}
          >
            <MaterialCommunityIcons name="truck-check-outline" size={21} color={C.white} />
            <Text style={styles.assignText}>
              {!selectedOrder
                ? "Select Order First"
                : selectedPartner
                ? "Assign Delivery Person"
                : "Select Delivery Person"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Input({ label, value, onChangeText, placeholder, keyboardType }) {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || label}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType || "default"}
        style={styles.input}
      />
    </View>
  );
}

function SmallChip({ icon, text }) {
  return (
    <View style={styles.smallChip}>
      <Ionicons name={icon} size={12} color={C.primary} />
      <Text style={styles.smallChipText}>{text}</Text>
    </View>
  );
}

function Info({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || "—"}</Text>
    </View>
  );
}

function EmptyBox({ title }) {
  return (
    <View style={styles.emptyBox}>
      <Ionicons name="information-circle-outline" size={28} color={C.muted} />
      <Text style={styles.emptyText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: {
    minHeight: 72,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    backgroundColor: C.white,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.soft,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: C.text,
    textAlign: "center",
  },
  headerSub: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 2,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.soft,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { padding: 16, paddingBottom: 120 },
  successToast: {
    backgroundColor: "#ECFDF5",
    borderColor: "#BBF7D0",
    borderWidth: 1,
    padding: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  successToastText: {
    marginLeft: 8,
    color: C.green,
    fontWeight: "900",
    fontSize: 13,
  },
  heroCard: {
    backgroundColor: C.primary,
    borderRadius: 26,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  heroTitle: { color: C.white, fontSize: 22, fontWeight: "900" },
  heroText: {
    color: "#DDEBFF",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
    fontWeight: "600",
  },
  deliveryPersonCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: C.gold,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  card: {
    backgroundColor: C.white,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 16,
    elevation: 2,
  },
  addTopBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: C.teal,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addTopBtnText: {
    color: C.white,
    fontWeight: "900",
    fontSize: 15,
    marginLeft: 8,
  },
  formBox: { marginTop: 16 },
  inputWrap: { marginBottom: 12 },
  inputLabel: {
    color: C.text,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 7,
  },
  input: {
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.soft,
    paddingHorizontal: 14,
    color: C.text,
    fontWeight: "700",
  },
  saveBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: C.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  saveBtnText: {
    color: C.white,
    fontWeight: "900",
    marginLeft: 8,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: C.text,
    marginBottom: 14,
  },
  countText: {
    color: C.primary,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 14,
  },
  searchBox: {
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.soft,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: C.text,
    fontWeight: "700",
  },
  orderCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 13,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 10,
    backgroundColor: C.white,
  },
  activeOrder: { backgroundColor: "#F0FDFA", borderColor: C.teal },
  orderIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: C.soft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  orderId: { fontSize: 12, color: C.muted, fontWeight: "900" },
  orderProduct: {
    fontSize: 14,
    color: C.text,
    fontWeight: "900",
    marginTop: 3,
  },
  orderAddress: {
    fontSize: 11.5,
    color: C.muted,
    fontWeight: "700",
    marginTop: 3,
  },
  orderAmount: { fontSize: 13, color: C.text, fontWeight: "900" },
  partnerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 13,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 10,
    backgroundColor: C.white,
  },
  partnerActive: { backgroundColor: "#ECFDF5", borderColor: "#86EFAC" },
  busyPartner: { opacity: 0.5 },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  partnerName: { fontSize: 14, color: C.text, fontWeight: "900" },
  partnerSub: {
    fontSize: 11.5,
    color: C.muted,
    fontWeight: "700",
    marginTop: 3,
  },
  partnerMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  smallChip: {
    backgroundColor: C.soft,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  smallChipText: {
    marginLeft: 4,
    fontSize: 10,
    color: C.primary,
    fontWeight: "900",
  },
  partnerStatus: {
    fontSize: 11,
    color: C.green,
    fontWeight: "900",
    marginTop: 7,
  },
  partnerPrice: { fontSize: 14, color: C.text, fontWeight: "900" },
  profileBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.soft,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  profileAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  profileName: { fontSize: 16, color: C.text, fontWeight: "900" },
  profileSub: {
    fontSize: 12,
    color: C.muted,
    fontWeight: "700",
    marginTop: 3,
  },
  infoRow: {
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  infoLabel: { color: C.muted, fontSize: 13, fontWeight: "700" },
  infoValue: {
    color: C.text,
    fontSize: 13,
    fontWeight: "900",
    flex: 1,
    textAlign: "right",
  },
  assignBtn: {
    height: 54,
    borderRadius: 17,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    flexDirection: "row",
  },
  assignText: {
    color: C.white,
    fontSize: 15,
    fontWeight: "900",
    marginLeft: 8,
  },
  emptyBox: {
    padding: 24,
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    backgroundColor: "#FAFAFA",
  },
  emptyText: { color: C.muted, fontWeight: "800", marginTop: 8 },
});
