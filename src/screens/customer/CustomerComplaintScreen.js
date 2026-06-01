// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const C = {
//   primary: '#0e3243',
//   accent: '#1a9e6e',
//   white: '#FFFFFF',
//   bg: '#f4f6f9',
//   card: '#FFFFFF',
//   text: '#0e3243',
//   muted: '#7a93a0',
//   border: '#e2eaf0',
// };

// export default function CustomerComplaintScreen({ navigation }) {
//   const [complaintType, setComplaintType] = useState('');
//   const [description, setDescription] = useState('');

//   const handleSubmitComplaint = () => {
//     if (!complaintType || !description) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return;
//     }

//     // Simulate sending complaint to the backend
//     Alert.alert('Complaint Submitted', 'Your complaint has been submitted to the admin.');

//     // Navigate back or to another screen
//     navigation.goBack();
//   };

//   return (
//     <View style={styles.safe}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color={C.white} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Submit Complaint</Text>
//         <TouchableOpacity>
//           <Ionicons name="help-circle-outline" size={22} color={C.white} />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.content}>
//         <Text style={styles.label}>Complaint Type</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter complaint type (e.g., Poor condition, Delivery issue)"
//           value={complaintType}
//           onChangeText={setComplaintType}
//         />

//         <Text style={styles.label}>Complaint Description</Text>
//         <TextInput
//           style={styles.textArea}
//           placeholder="Describe the issue"
//           value={description}
//           onChangeText={setDescription}
//           multiline
//           numberOfLines={4}
//         />

//         <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitComplaint}>
//           <Text style={styles.submitText}>Submit Complaint</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: C.bg },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingTop: 16,
//     paddingBottom: 10,
//     backgroundColor: C.primary,
//   },
//   headerTitle: { color: C.white, fontSize: 18, fontWeight: '700' },
//   content: { padding: 16 },
//   label: { fontSize: 16, fontWeight: '600', color: C.text, marginBottom: 8 },
//   input: {
//     backgroundColor: C.white,
//     borderRadius: 8,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     marginBottom: 12,
//     fontSize: 14,
//     borderWidth: 1,
//     borderColor: C.border,
//   },
//   textArea: {
//     backgroundColor: C.white,
//     borderRadius: 8,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     marginBottom: 12,
//     fontSize: 14,
//     borderWidth: 1,
//     borderColor: C.border,
//     height: 100,
//   },
//   submitBtn: {
//     backgroundColor: C.primary,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   submitText: { color: C.white, fontSize: 16, fontWeight: '700' },
// });




































// screens/customer/CustomerComplaintScreen.js

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  Platform,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useShop } from "../../context/ShopContext";

const C = {
  primary: "#0E3243",
  accent: "#1A9E6E",
  danger: "#DC2626",
  warning: "#F59E0B",
  white: "#FFFFFF",
  bg: "#F4F6F9",
  card: "#FFFFFF",
  text: "#0E3243",
  muted: "#7A93A0",
  border: "#E2EAF0",
  softRed: "#FEF2F2",
  softGreen: "#ECFDF5",
};

const complaintTypes = [
  "Damaged Product",
  "Wrong Product",
  "Poor Quality",
  "Missing Item",
  "Late Delivery",
  "Refund Issue",
  "Seller Issue",
  "Other",
];

const getImageSource = (image) => {
  if (!image) return null;
  if (typeof image === "string") return { uri: image };
  return image;
};

export default function CustomerComplaintScreen({ navigation, route }) {
  const { currentCustomer, submitComplaint } = useShop();
  const orderId = route?.params?.orderId || "Not available";
  const product = route?.params?.product || {};
  const orderStatus = route?.params?.orderStatus || "Delivered";
  const routeSellerId = route?.params?.sellerId || "";
  const resolvedSellerId =
    routeSellerId || product?.sellerId || product?.seller_id || "";

  const [complaintType, setComplaintType] = useState("");
  const [description, setDescription] = useState("");
  const [complaintImages, setComplaintImages] = useState([]);
  const [error, setError] = useState("");
  const [successVisible, setSuccessVisible] = useState(false);

  const productImage = useMemo(() => getImageSource(product?.image), [product]);

  const pickComplaintImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      setError("Gallery permission is required to upload complaint images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.75,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setComplaintImages((prev) => [
        ...prev,
        ...result.assets.map((asset) => asset.uri),
      ]);
      setError("");
    }
  };

  const removeImage = (indexToRemove) => {
    setComplaintImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmitComplaint = async () => {
    if (!complaintType.trim()) {
      setError("Please select a complaint type.");
      return;
    }

    if (!description.trim()) {
      setError("Please describe your issue.");
      return;
    }

    setError("");
    try {
      await submitComplaint({
        title: complaintType,
        complaintType,
        description,
        orderId,
        productId: product?.productId ?? product?.id ?? product?.name ?? "",
        productName: product?.name || product?.title || "Product",
        customer: currentCustomer?.name || "Customer",
        customerEmail: currentCustomer?.email || "",
        sellerId: resolvedSellerId,
        sellerName: product?.sellerName || product?.seller || "Seller",
        images: complaintImages,
      });
      setSuccessVisible(true);
    } catch (submitError) {
      setError(submitError?.message || "Unable to submit complaint.");
    }
  };

  const closeSuccess = () => {
    setSuccessVisible(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIcon}
            activeOpacity={0.85}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color={C.white} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Submit Complaint</Text>

          <TouchableOpacity style={styles.headerIcon} activeOpacity={0.85}>
            <Ionicons name="help-circle-outline" size={22} color={C.white} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <View style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <Ionicons name="shield-checkmark-outline" size={34} color={C.accent} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>We are here to help</Text>
              <Text style={styles.heroText}>
                Submit a product-related complaint. Admin will review and contact you.
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Product Details</Text>

            <View style={styles.productRow}>
              {productImage ? (
                <Image source={productImage} style={styles.productImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Ionicons name="image-outline" size={30} color={C.muted} />
                </View>
              )}

              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {product?.name || product?.title || "Product Name"}
                </Text>

                <Text style={styles.productMeta}>Order ID: {orderId}</Text>
                <Text style={styles.productMeta}>Status: {orderStatus}</Text>

                {product?.seller ? (
                  <Text style={styles.productMeta} numberOfLines={1}>
                    Seller: {product.seller}
                  </Text>
                ) : null}

                {product?.price ? (
                  <Text style={styles.productPrice}>{product.price}</Text>
                ) : null}
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Complaint Type</Text>

            <View style={styles.chipWrap}>
              {complaintTypes.map((type) => {
                const active = complaintType === type;

                return (
                  <TouchableOpacity
                    key={type}
                    activeOpacity={0.85}
                    style={[styles.chip, active && styles.activeChip]}
                    onPress={() => {
                      setComplaintType(type);
                      setError("");
                    }}
                  >
                    <Text style={[styles.chipText, active && styles.activeChipText]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Describe Issue</Text>

            <TextInput
              style={styles.textArea}
              placeholder="Explain the problem clearly. Example: product damaged, wrong item received, poor quality, etc."
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                setError("");
              }}
              multiline
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={styles.uploadBtn}
              activeOpacity={0.85}
              onPress={pickComplaintImages}
            >
              <Ionicons name="cloud-upload-outline" size={20} color={C.primary} />
              <Text style={styles.uploadText}>Upload Complaint Images</Text>
            </TouchableOpacity>

            {complaintImages.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.imageScroll}
              >
                {complaintImages.map((uri, index) => (
                  <View key={`${uri}-${index}`} style={styles.imageBox}>
                    <Image source={{ uri }} style={styles.complaintImage} />
                    <TouchableOpacity
                      style={styles.removeImageBtn}
                      activeOpacity={0.85}
                      onPress={() => removeImage(index)}
                    >
                      <Ionicons name="close" size={13} color={C.white} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            ) : null}

            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={17} color={C.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.submitBtn}
              activeOpacity={0.88}
              onPress={handleSubmitComplaint}
            >
              <Ionicons name="send-outline" size={18} color={C.white} />
              <Text style={styles.submitText}>Submit Complaint</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal visible={successVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.successModal}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={58} color={C.accent} />
              </View>

              <Text style={styles.successTitle}>Complaint Submitted</Text>

              <Text style={styles.successMessage}>
                Your complaint has been submitted to admin successfully.
              </Text>

              <TouchableOpacity
                style={styles.doneBtn}
                activeOpacity={0.85}
                onPress={closeSuccess}
              >
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.primary,
  },
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    height: Platform.OS === "web" ? 64 : 58,
    backgroundColor: C.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    elevation: 4,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: C.white,
    fontSize: 18,
    fontWeight: "900",
  },
  scroll: {
    padding: 16,
    paddingBottom: 110,
  },
  heroCard: {
    backgroundColor: C.card,
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    elevation: 3,
    borderWidth: 1,
    borderColor: C.border,
    gap: 12,
  },
  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: C.softGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: C.text,
  },
  heroText: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
    color: C.muted,
    lineHeight: 19,
  },
  card: {
    backgroundColor: C.card,
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
    borderWidth: 1,
    borderColor: C.border,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: C.text,
    marginBottom: 14,
  },
  productRow: {
    flexDirection: "row",
  },
  productImage: {
    width: 86,
    height: 94,
    borderRadius: 18,
    backgroundColor: C.bg,
    marginRight: 12,
  },
  placeholderImage: {
    width: 86,
    height: 94,
    borderRadius: 18,
    backgroundColor: C.bg,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: "900",
    color: C.text,
    lineHeight: 20,
  },
  productMeta: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "700",
    color: C.muted,
  },
  productPrice: {
    marginTop: 7,
    fontSize: 16,
    fontWeight: "900",
    color: C.primary,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 18,
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
  },
  activeChip: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "900",
    color: C.text,
  },
  activeChipText: {
    color: C.white,
  },
  label: {
    fontSize: 14,
    fontWeight: "900",
    color: C.text,
    marginBottom: 8,
  },
  textArea: {
    minHeight: 130,
    backgroundColor: C.bg,
    borderRadius: 18,
    padding: 13,
    fontSize: 14,
    fontWeight: "700",
    color: C.text,
    borderWidth: 1,
    borderColor: C.border,
  },
  uploadBtn: {
    marginTop: 14,
    height: 46,
    borderRadius: 18,
    backgroundColor: "#EEF6F8",
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  uploadText: {
    fontSize: 13,
    fontWeight: "900",
    color: C.primary,
  },
  imageScroll: {
    marginTop: 12,
  },
  imageBox: {
    position: "relative",
    marginRight: 10,
  },
  complaintImage: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: C.bg,
  },
  removeImageBtn: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.danger,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: C.white,
  },
  errorBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: 14,
    backgroundColor: C.softRed,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "800",
    color: C.danger,
  },
  submitBtn: {
    marginTop: 16,
    height: 50,
    borderRadius: 20,
    backgroundColor: C.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitText: {
    color: C.white,
    fontSize: 15,
    fontWeight: "900",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 22,
  },
  successModal: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: C.white,
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
  },
  successIcon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: C.softGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  successTitle: {
    marginTop: 16,
    fontSize: 21,
    fontWeight: "900",
    color: C.text,
    textAlign: "center",
  },
  successMessage: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "700",
    color: C.muted,
    textAlign: "center",
    lineHeight: 21,
  },
  doneBtn: {
    marginTop: 20,
    height: 48,
    borderRadius: 18,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 34,
  },
  doneText: {
    color: C.white,
    fontSize: 15,
    fontWeight: "900",
  },
});
