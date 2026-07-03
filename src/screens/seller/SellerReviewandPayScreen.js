// // import React, { useState } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ScrollView,
// //   TouchableOpacity,
// //   Image,
// //   StatusBar,
// //   Platform,
// //   Alert,
// //   ActivityIndicator,
// // } from "react-native";
// // import { LinearGradient } from "expo-linear-gradient";
// // import { Ionicons } from "@expo/vector-icons";
// // import { useShop } from "../../context/ShopContext";

// // const C = {
// //   primary: "#082843",
// //   primaryDark: "#082843",
// //   white: "#FFFFFF",
// //   bg: "#FFFFFF",
// //   text: "#111827",
// //   muted: "#6B7280",
// //   border: "#F3D6E2",
// //   soft: "#F9FAFB",
// //   success: "#16A34A",
// //   danger: "#EF4444",
// //   greenSoft: "#ECFDF5",
// //   greenBorder: "#BBF7D0",
// // };

// // const formatPrice = (amount) =>
// //   `₹${Number(amount || 0).toLocaleString("en-IN")}`;

// // // Payment Methods
// // const PAYMENT_METHODS = [
// //   {
// //     id: "upi",
// //     label: "UPI / QR",
// //     sub: "Pay using any UPI app",
// //     icon: "qr-code-outline",
// //     badge: "UPI",
// //     badgeColor: "#5F5FA8",
// //   },
// //   {
// //     id: "card",
// //     label: "Credit / Debit Card",
// //     sub: "Visa, MasterCard, Rupay",
// //     icon: "card-outline",
// //     badge: "CARD",
// //     badgeColor: "#1A56DB",
// //   },
// //   {
// //     id: "netbanking",
// //     label: "Net Banking",
// //     sub: "All major banks supported",
// //     icon: "business-outline",
// //     badge: "NET",
// //     badgeColor: "#6B7280",
// //   },
// //   {
// //     id: "wallet",
// //     label: "Wallets",
// //     sub: "Pay using wallets",
// //     icon: "wallet-outline",
// //     badge: "PAY",
// //     badgeColor: "#059669",
// //   },
// // ];

// // // Why we charge reasons
// // const WHY_CHARGE = [
// //   { icon: "shield-checkmark-outline", color: "#16A34A", text: "Platform maintenance & security" },
// //   { icon: "megaphone-outline", color: "#2563EB", text: "Marketing & customer support" },
// //   { icon: "card-outline", color: "#EA580C", text: "Payment gateway & transaction charges" },
// //   { icon: "happy-outline", color: "#7C3AED", text: "Improving seller & buyer experience" },
// // ];

// // export default function ReviewAndPayScreen({ navigation, route }) {
// //   const { addSellerProductPending, addSellerNotification, addAdminNotification } = useShop();

// //   const { productData = {}, adminCommission = 0, sellerWillGet = 0 } = route?.params || {};

// //   const [selectedMethod, setSelectedMethod] = useState("upi");
// //   const [processing, setProcessing] = useState(false);

// //   const handlePay = () => {
// //     Alert.alert(
// //       "Confirm Payment",
// //       `Pay ${formatPrice(adminCommission)} via ${
// //         PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.label || "UPI"
// //       }?`,
// //       [
// //         { text: "Cancel", style: "cancel" },
// //         {
// //           text: "Pay Now",
// //           onPress: () => processPayment(),
// //         },
// //       ]
// //     );
// //   };

// //   const processPayment = () => {
// //     setProcessing(true);

// //     // Simulate Razorpay payment processing
// //     setTimeout(() => {
// //       setProcessing(false);

// //       // Add product as pending (awaiting admin approval)
// //       if (addSellerProductPending) {
// //         addSellerProductPending({
// //           ...productData,
// //           status: "Pending Approval",
// //           visibleToCustomer: false,
// //           paymentStatus: "Paid",
// //           uploadFee: adminCommission,
// //           paymentMethod: selectedMethod,
// //           paidAt: new Date().toISOString(),
// //         });
// //       }

// //       // Notify seller
// //       if (addSellerNotification) {
// //         addSellerNotification(
// //           "Product Submitted for Review 🎉",
// //           `"${productData.name}" has been submitted. Admin will review and approve within 24 hours.`,
// //           "product"
// //         );
// //       }

// //       // Notify admin
// //       if (addAdminNotification) {
// //         addAdminNotification(
// //           "New Product Pending Approval",
// //           `A seller has submitted "${productData.name}" for approval after paying ${formatPrice(adminCommission)}.`,
// //           "product"
// //         );
// //       }

// //       Alert.alert(
// //         "Payment Successful! 🎉",
// //         `Your product "${productData.name}" has been submitted for admin approval. You'll be notified once approved.`,
// //         [
// //           {
// //             text: "View My Products",
// //             onPress: () => {
// //               navigation.reset({
// //                 index: 0,
// //                 routes: [{ name: "MyProductsScreen" }],
// //               });
// //             },
// //           },
// //         ]
// //       );
// //     }, 2000);
// //   };

// //   const stars = Array.from({ length: 5 }, (_, i) => i + 1);

// //   return (
// //     <View style={styles.root}>
// //       <StatusBar barStyle="dark-content" backgroundColor={C.white} />

// //       {/* ── Header ── */}
// //       <View style={styles.header}>
// //         <TouchableOpacity
// //           onPress={() => navigation.goBack()}
// //           style={styles.iconBtn}
// //           activeOpacity={0.85}
// //         >
// //           <Ionicons name="chevron-back" size={24} color={C.text} />
// //         </TouchableOpacity>
// //         <Text style={styles.headerTitle}>Review & Pay</Text>
// //         <View style={{ width: 42 }} />
// //       </View>

// //       <ScrollView
// //         contentContainerStyle={styles.content}
// //         showsVerticalScrollIndicator={false}
// //       >
// //         {/* ── Product Preview Card ── */}
// //         <View style={styles.previewCard}>
// //           <View style={styles.previewCardHeader}>
// //             <Text style={styles.previewCardTitle}>Product Preview</Text>
// //             <TouchableOpacity
// //               onPress={() => navigation.goBack()}
// //               style={styles.editBtn}
// //             >
// //               <Ionicons name="create-outline" size={15} color={C.muted} />
// //               <Text style={styles.editText}>Edit</Text>
// //             </TouchableOpacity>
// //           </View>

// //           <View style={styles.previewContent}>
// //             {/* Product Image */}
// //             <View style={styles.productThumb}>
// //               {productData.image ? (
// //                 <Image source={{ uri: productData.image }} style={styles.productImage} />
// //               ) : (
// //                 <View style={styles.productImagePlaceholder}>
// //                   <Ionicons name="image-outline" size={32} color={C.muted} />
// //                 </View>
// //               )}
// //             </View>

// //             {/* Product Info */}
// //             <View style={{ flex: 1 }}>
// //               <Text style={styles.productName} numberOfLines={2}>
// //                 {productData.name || "Product Name"}
// //               </Text>

// //               {/* Category Tags */}
// //               <View style={styles.tagRow}>
// //                 {productData.category ? (
// //                   <View style={styles.tag}>
// //                     <Text style={styles.tagText}>{productData.category}</Text>
// //                   </View>
// //                 ) : null}
// //                 {productData.subcategory ? (
// //                   <View style={styles.tag}>
// //                     <Text style={styles.tagText}>{productData.subcategory}</Text>
// //                   </View>
// //                 ) : null}
// //               </View>

// //               {/* Price */}
// //               <View style={styles.previewPriceRow}>
// //                 <Text style={styles.previewFinalPrice}>
// //                   {formatPrice(productData.finalPrice)}
// //                 </Text>
// //                 {productData.discount > 0 ? (
// //                   <Text style={styles.previewOldPrice}>
// //                     {formatPrice(productData.price)}
// //                   </Text>
// //                 ) : null}
// //               </View>

// //               {/* Meta */}
// //               <Text style={styles.previewMeta}>
// //                 Stock: {productData.stock} · Weight: {productData.weight || "N/A"} kg
// //               </Text>

// //               {/* Stars */}
// //               <View style={styles.starsRow}>
// //                 {stars.map((s) => (
// //                   <Ionicons key={s} name="star" size={12} color="#F59E0B" />
// //                 ))}
// //                 <Text style={styles.reviewCount}> (0)</Text>
// //               </View>
// //             </View>
// //           </View>
// //         </View>

// //         {/* ── Upload Fee Details ── */}
// //         <View style={styles.section}>
// //           <Text style={styles.sectionTitle}>Upload Fee Details</Text>

// //           <View style={styles.feeLine}>
// //             <Text style={styles.feeLabel}>Product Price</Text>
// //             <Text style={styles.feeValue}>{formatPrice(productData.price)}</Text>
// //           </View>

// //           <View style={styles.feeLine}>
// //             <Text style={styles.feeLabel}>Admin Commission (10%)</Text>
// //             <Text style={styles.feeCommission}>- {formatPrice(adminCommission)}</Text>
// //           </View>

// //           <View style={styles.feeDivider} />

// //           <View style={styles.feeLine}>
// //             <Text style={styles.feeYouGetLabel}>You Will Get</Text>
// //             <Text style={styles.feeYouGetValue}>{formatPrice(sellerWillGet)}</Text>
// //           </View>
// //         </View>

// //         {/* ── Why We Charge ── */}
// //         <View style={styles.section}>
// //           <View style={styles.whyHeader}>
// //             <Text style={styles.sectionTitle}>Why do we charge 10%?</Text>
// //             <TouchableOpacity>
// //               <Ionicons name="help-circle-outline" size={18} color={C.muted} />
// //             </TouchableOpacity>
// //           </View>

// //           {WHY_CHARGE.map((item, idx) => (
// //             <View key={idx} style={styles.whyRow}>
// //               <View style={[styles.whyIcon, { backgroundColor: item.color + "15" }]}>
// //                 <Ionicons name={item.icon} size={18} color={item.color} />
// //               </View>
// //               <Text style={styles.whyText}>{item.text}</Text>
// //             </View>
// //           ))}
// //         </View>

// //         {/* ── Payment Method ── */}
// //         <View style={styles.section}>
// //           <View style={styles.paymentHeader}>
// //             <Text style={styles.sectionTitle}>Payment Method</Text>
// //             <View style={styles.razorpayBadge}>
// //               <Text style={styles.razorpayText}>Secured by Razorpay</Text>
// //             </View>
// //           </View>

// //           {PAYMENT_METHODS.map((method) => (
// //             <TouchableOpacity
// //               key={method.id}
// //               style={[
// //                 styles.methodCard,
// //                 selectedMethod === method.id && styles.methodCardActive,
// //               ]}
// //               onPress={() => setSelectedMethod(method.id)}
// //               activeOpacity={0.85}
// //             >
// //               {/* Left Icon */}
// //               <View style={[styles.methodIcon, { backgroundColor: method.badgeColor + "15" }]}>
// //                 <Ionicons name={method.icon} size={20} color={method.badgeColor} />
// //               </View>

// //               {/* Labels */}
// //               <View style={{ flex: 1 }}>
// //                 <Text style={styles.methodLabel}>{method.label}</Text>
// //                 <Text style={styles.methodSub}>{method.sub}</Text>
// //               </View>

// //               {/* Selected Circle */}
// //               <View
// //                 style={[
// //                   styles.radioOuter,
// //                   selectedMethod === method.id && styles.radioOuterActive,
// //                 ]}
// //               >
// //                 {selectedMethod === method.id && (
// //                   <View style={styles.radioInner} />
// //                 )}
// //               </View>
// //             </TouchableOpacity>
// //           ))}

// //           {/* Secure Note */}
// //           <View style={styles.secureRow}>
// //             <Ionicons name="lock-closed-outline" size={16} color={C.muted} />
// //             <Text style={styles.secureText}>
// //               100% Secure Payment — Your payment is safe and encrypted powered by Razorpay.
// //             </Text>
// //           </View>
// //         </View>

// //         {/* ── Pay & Submit Button ── */}
// //         <TouchableOpacity
// //           style={[styles.payWrap, processing && { opacity: 0.7 }]}
// //           onPress={handlePay}
// //           activeOpacity={0.88}
// //           disabled={processing}
// //         >
// //           <LinearGradient colors={[C.primary, C.primaryDark]} style={styles.payBtn}>
// //             {processing ? (
// //               <ActivityIndicator color={C.white} size="small" />
// //             ) : (
// //               <>
// //                 <Text style={styles.payText}>
// //                   Pay {formatPrice(adminCommission)} & Submit
// //                 </Text>
// //                 <Ionicons name="arrow-forward" size={20} color={C.white} />
// //               </>
// //             )}
// //           </LinearGradient>
// //         </TouchableOpacity>

// //         <Text style={styles.afterPayNote}>
// //           After payment, product will be sent for admin approval.
// //         </Text>

// //         {/* ── Bottom Badges ── */}
// //         <View style={styles.badgeRow}>
// //           <View style={styles.badgeItem}>
// //             <Ionicons name="shield-checkmark-outline" size={22} color={C.success} />
// //             <Text style={styles.badgeText}>Safe & Secure{"\n"}Payment</Text>
// //           </View>
// //           <View style={styles.badgeDivider} />
// //           <View style={styles.badgeItem}>
// //             <Ionicons name="flash-outline" size={22} color="#F59E0B" />
// //             <Text style={styles.badgeText}>Quick{"\n"}Approval</Text>
// //           </View>
// //           <View style={styles.badgeDivider} />
// //           <View style={styles.badgeItem}>
// //             <Ionicons name="trending-up-outline" size={22} color={C.primary} />
// //             <Text style={styles.badgeText}>Boost Your{"\n"}Sales</Text>
// //           </View>
// //         </View>
// //       </ScrollView>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   root: { flex: 1, backgroundColor: C.bg },

// //   header: {
// //     paddingTop: Platform.OS === "android" ? 38 : 54,
// //     paddingHorizontal: 16,
// //     paddingBottom: 12,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     borderBottomWidth: 1,
// //     borderBottomColor: "#F8EAF1",
// //   },

// //   iconBtn: {
// //     width: 42,
// //     height: 42,
// //     borderRadius: 21,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     backgroundColor: C.soft,
// //     borderWidth: 1,
// //     borderColor: C.border,
// //   },

// //   headerTitle: { fontSize: 18, fontWeight: "900", color: C.text },

// //   content: { padding: 16, paddingBottom: 40 },

// //   // ── Product Preview ───────────────────────────────────────────────────────
// //   previewCard: {
// //     backgroundColor: C.primary,
// //     borderRadius: 20,
// //     padding: 16,
// //     marginBottom: 16,
// //   },

// //   previewCardHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 14,
// //   },

// //   previewCardTitle: {
// //     fontSize: 14,
// //     fontWeight: "900",
// //     color: "rgba(255,255,255,0.85)",
// //   },

// //   editBtn: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 4,
// //     backgroundColor: "rgba(255,255,255,0.15)",
// //     paddingHorizontal: 10,
// //     paddingVertical: 5,
// //     borderRadius: 99,
// //   },

// //   editText: { fontSize: 12, fontWeight: "800", color: C.white },

// //   previewContent: { flexDirection: "row", gap: 14 },

// //   productThumb: {
// //     width: 90,
// //     height: 90,
// //     borderRadius: 14,
// //     overflow: "hidden",
// //     backgroundColor: "rgba(255,255,255,0.1)",
// //   },

// //   productImage: { width: "100%", height: "100%" },

// //   productImagePlaceholder: {
// //     width: "100%",
// //     height: "100%",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   productName: {
// //     fontSize: 15,
// //     fontWeight: "900",
// //     color: C.white,
// //     lineHeight: 20,
// //     marginBottom: 6,
// //   },

// //   tagRow: { flexDirection: "row", gap: 6, marginBottom: 8 },

// //   tag: {
// //     backgroundColor: "rgba(255,255,255,0.2)",
// //     paddingHorizontal: 8,
// //     paddingVertical: 3,
// //     borderRadius: 999,
// //   },

// //   tagText: { fontSize: 10, fontWeight: "800", color: C.white },

// //   previewPriceRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },

// //   previewFinalPrice: { fontSize: 17, fontWeight: "900", color: C.white },

// //   previewOldPrice: {
// //     fontSize: 12,
// //     fontWeight: "700",
// //     color: "rgba(255,255,255,0.55)",
// //     textDecorationLine: "line-through",
// //   },

// //   previewMeta: {
// //     fontSize: 11,
// //     color: "rgba(255,255,255,0.7)",
// //     fontWeight: "700",
// //     marginBottom: 6,
// //   },

// //   starsRow: { flexDirection: "row", alignItems: "center" },

// //   reviewCount: { fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: "700" },

// //   // ── Sections ──────────────────────────────────────────────────────────────
// //   section: {
// //     backgroundColor: C.white,
// //     borderWidth: 1,
// //     borderColor: "#F1F5F9",
// //     borderRadius: 20,
// //     padding: 16,
// //     marginBottom: 14,
// //     elevation: 1,
// //     shadowColor: "#000",
// //     shadowOpacity: 0.04,
// //     shadowRadius: 8,
// //     shadowOffset: { width: 0, height: 2 },
// //   },

// //   sectionTitle: { fontSize: 16, fontWeight: "900", color: C.text, marginBottom: 14 },

// //   // ── Fee Lines ─────────────────────────────────────────────────────────────
// //   feeLine: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     marginBottom: 10,
// //   },

// //   feeLabel: { fontSize: 14, fontWeight: "700", color: C.muted },

// //   feeValue: { fontSize: 14, fontWeight: "900", color: C.text },

// //   feeCommission: { fontSize: 14, fontWeight: "900", color: C.danger },

// //   feeDivider: { height: 1, backgroundColor: "#F1F5F9", marginVertical: 10 },

// //   feeYouGetLabel: { fontSize: 15, fontWeight: "900", color: C.text },

// //   feeYouGetValue: { fontSize: 18, fontWeight: "900", color: C.success },

// //   // ── Why Charge ────────────────────────────────────────────────────────────
// //   whyHeader: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     marginBottom: 14,
// //   },

// //   whyRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 12,
// //     marginBottom: 12,
// //   },

// //   whyIcon: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 12,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   whyText: { flex: 1, fontSize: 13, fontWeight: "700", color: C.text },

// //   // ── Payment Method ────────────────────────────────────────────────────────
// //   paymentHeader: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     marginBottom: 14,
// //   },

// //   razorpayBadge: {
// //     backgroundColor: "#F0FDF4",
// //     borderWidth: 1,
// //     borderColor: "#BBF7D0",
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 99,
// //   },

// //   razorpayText: { fontSize: 10, fontWeight: "900", color: C.success },

// //   methodCard: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     padding: 14,
// //     borderRadius: 16,
// //     borderWidth: 1.5,
// //     borderColor: "#E2E8F0",
// //     marginBottom: 10,
// //     gap: 12,
// //     backgroundColor: C.white,
// //   },

// //   methodCardActive: {
// //     borderColor: C.primary,
// //     backgroundColor: "#EFF6FF",
// //   },

// //   methodIcon: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 12,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   methodLabel: { fontSize: 14, fontWeight: "900", color: C.text },

// //   methodSub: { fontSize: 11, fontWeight: "700", color: C.muted, marginTop: 2 },

// //   radioOuter: {
// //     width: 22,
// //     height: 22,
// //     borderRadius: 11,
// //     borderWidth: 2,
// //     borderColor: "#CBD5E1",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   radioOuterActive: { borderColor: C.primary },

// //   radioInner: {
// //     width: 12,
// //     height: 12,
// //     borderRadius: 6,
// //     backgroundColor: C.primary,
// //   },

// //   secureRow: {
// //     flexDirection: "row",
// //     alignItems: "flex-start",
// //     gap: 8,
// //     marginTop: 8,
// //     backgroundColor: "#F8FAFC",
// //     borderRadius: 12,
// //     padding: 12,
// //   },

// //   secureText: { flex: 1, fontSize: 12, color: C.muted, fontWeight: "700" },

// //   // ── Pay Button ────────────────────────────────────────────────────────────
// //   payWrap: { borderRadius: 18, overflow: "hidden", marginTop: 4 },

// //   payBtn: {
// //     height: 58,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     flexDirection: "row",
// //     gap: 10,
// //   },

// //   payText: { color: C.white, fontSize: 16, fontWeight: "900" },

// //   afterPayNote: {
// //     textAlign: "center",
// //     fontSize: 12,
// //     color: C.muted,
// //     fontWeight: "700",
// //     marginTop: 10,
// //     marginBottom: 20,
// //   },

// //   // ── Bottom Badges ─────────────────────────────────────────────────────────
// //   badgeRow: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     paddingVertical: 16,
// //     borderTopWidth: 1,
// //     borderTopColor: "#F1F5F9",
// //     marginBottom: 10,
// //   },

// //   badgeItem: { flex: 1, alignItems: "center", gap: 6 },

// //   badgeDivider: { width: 1, height: 40, backgroundColor: "#F1F5F9" },

// //   badgeText: {
// //     fontSize: 11,
// //     fontWeight: "800",
// //     color: C.muted,
// //     textAlign: "center",
// //     lineHeight: 16,
// //   },
// // });





































// // src/screens/seller/SellerReviewandPayScreen.js
// // ✅ UPDATED — navigates to SellerPaymentSuccessScreen after successful payment

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   StatusBar,
//   Platform,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons } from "@expo/vector-icons";
// import { useShop } from "../../context/ShopContext";

// const C = {
//   primary: "#082843",
//   primaryDark: "#082843",
//   white: "#FFFFFF",
//   bg: "#FFFFFF",
//   text: "#111827",
//   muted: "#6B7280",
//   border: "#F3D6E2",
//   soft: "#F9FAFB",
//   success: "#16A34A",
//   danger: "#EF4444",
//   greenSoft: "#ECFDF5",
//   greenBorder: "#BBF7D0",
// };

// const formatPrice = (amount) =>
//   `₹${Number(amount || 0).toLocaleString("en-IN")}`;

// const PAYMENT_METHODS = [
//   {
//     id: "upi",
//     label: "UPI / QR",
//     sub: "Pay using any UPI app",
//     icon: "qr-code-outline",
//     badge: "UPI",
//     badgeColor: "#5F5FA8",
//   },
//   {
//     id: "card",
//     label: "Credit / Debit Card",
//     sub: "Visa, MasterCard, Rupay",
//     icon: "card-outline",
//     badge: "CARD",
//     badgeColor: "#1A56DB",
//   },
//   {
//     id: "netbanking",
//     label: "Net Banking",
//     sub: "All major banks supported",
//     icon: "business-outline",
//     badge: "NET",
//     badgeColor: "#6B7280",
//   },
//   {
//     id: "wallet",
//     label: "Wallets",
//     sub: "Pay using wallets",
//     icon: "wallet-outline",
//     badge: "PAY",
//     badgeColor: "#059669",
//   },
// ];

// const WHY_CHARGE = [
//   { icon: "shield-checkmark-outline", color: "#16A34A", text: "Platform maintenance & security" },
//   { icon: "megaphone-outline", color: "#2563EB", text: "Marketing & customer support" },
//   { icon: "card-outline", color: "#EA580C", text: "Payment gateway & transaction charges" },
//   { icon: "happy-outline", color: "#7C3AED", text: "Improving seller & buyer experience" },
// ];

// export default function ReviewAndPayScreen({ navigation, route }) {
//   const { addSellerProductPending, addSellerNotification, addAdminNotification } = useShop();

//   const { productData = {}, adminCommission = 0, sellerWillGet = 0 } = route?.params || {};

//   const [selectedMethod, setSelectedMethod] = useState("upi");
//   const [processing, setProcessing] = useState(false);

//   const handlePay = () => {
//     Alert.alert(
//       "Confirm Payment",
//       `Pay ${formatPrice(adminCommission)} via ${
//         PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.label || "UPI"
//       }?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         { text: "Pay Now", onPress: () => processPayment() },
//       ]
//     );
//   };

//   const processPayment = () => {
//     setProcessing(true);

//     setTimeout(() => {
//       setProcessing(false);

//       // ✅ Add product as pending — admin must approve before customer sees it
//       if (addSellerProductPending) {
//         addSellerProductPending({
//           ...productData,
//           status: "Pending Approval",
//           visibleToCustomer: false,  // ✅ NOT visible until admin approves
//           paymentStatus: "Paid",
//           uploadFee: adminCommission,
//           paymentMethod: selectedMethod,
//           paidAt: new Date().toISOString(),
//         });
//       }

//       // Notify seller
//       if (addSellerNotification) {
//         addSellerNotification(
//           "Product Submitted for Review 🎉",
//           `"${productData.name}" has been submitted. Admin will review and approve within 24 hours.`,
//           "product"
//         );
//       }

//       // Notify admin
//       if (addAdminNotification) {
//         addAdminNotification(
//           "New Product Pending Approval",
//           `A seller has submitted "${productData.name}" for approval after paying ${formatPrice(adminCommission)}.`,
//           "product"
//         );
//       }

//       // ✅ Navigate to success screen instead of Alert
//       navigation.replace("SellerPaymentSuccessScreen", {
//         productData,
//         adminCommission,
//       });
//     }, 2000);
//   };

//   const stars = Array.from({ length: 5 }, (_, i) => i + 1);

//   return (
//     <View style={styles.root}>
//       <StatusBar barStyle="dark-content" backgroundColor={C.white} />

//       {/* ── Header ── */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.iconBtn}
//           activeOpacity={0.85}
//         >
//           <Ionicons name="chevron-back" size={24} color={C.text} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Review & Pay</Text>
//         <View style={{ width: 42 }} />
//       </View>

//       <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
//         {/* ── Product Preview Card ── */}
//         <View style={styles.previewCard}>
//           <View style={styles.previewCardHeader}>
//             <Text style={styles.previewCardTitle}>Product Preview</Text>
//             <TouchableOpacity onPress={() => navigation.goBack()} style={styles.editBtn}>
//               <Ionicons name="create-outline" size={15} color={C.muted} />
//               <Text style={styles.editText}>Edit</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.previewContent}>
//             <View style={styles.productThumb}>
//               {productData.image ? (
//                 <Image source={{ uri: productData.image }} style={styles.productImage} />
//               ) : (
//                 <View style={styles.productImagePlaceholder}>
//                   <Ionicons name="image-outline" size={32} color={C.muted} />
//                 </View>
//               )}
//             </View>

//             <View style={{ flex: 1 }}>
//               <Text style={styles.productName} numberOfLines={2}>
//                 {productData.name || "Product Name"}
//               </Text>

//               <View style={styles.tagRow}>
//                 {productData.category ? (
//                   <View style={styles.tag}>
//                     <Text style={styles.tagText}>{productData.category}</Text>
//                   </View>
//                 ) : null}
//                 {productData.subcategory ? (
//                   <View style={styles.tag}>
//                     <Text style={styles.tagText}>{productData.subcategory}</Text>
//                   </View>
//                 ) : null}
//               </View>

//               <View style={styles.previewPriceRow}>
//                 <Text style={styles.previewFinalPrice}>
//                   {formatPrice(productData.finalPrice)}
//                 </Text>
//                 {productData.discount > 0 ? (
//                   <Text style={styles.previewOldPrice}>
//                     {formatPrice(productData.price)}
//                   </Text>
//                 ) : null}
//               </View>

//               <Text style={styles.previewMeta}>
//                 Stock: {productData.stock} · Weight: {productData.weight || "N/A"} kg
//               </Text>

//               <View style={styles.starsRow}>
//                 {stars.map((s) => (
//                   <Ionicons key={s} name="star" size={12} color="#F59E0B" />
//                 ))}
//                 <Text style={styles.reviewCount}> (0)</Text>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* ── Upload Fee Details ── */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Upload Fee Details</Text>

//           <View style={styles.feeLine}>
//             <Text style={styles.feeLabel}>Product Price</Text>
//             <Text style={styles.feeValue}>{formatPrice(productData.price)}</Text>
//           </View>

//           <View style={styles.feeLine}>
//             <Text style={styles.feeLabel}>Admin Commission (10%)</Text>
//             <Text style={styles.feeCommission}>- {formatPrice(adminCommission)}</Text>
//           </View>

//           <View style={styles.feeDivider} />

//           <View style={styles.feeLine}>
//             <Text style={styles.feeYouGetLabel}>You Will Get</Text>
//             <Text style={styles.feeYouGetValue}>{formatPrice(sellerWillGet)}</Text>
//           </View>
//         </View>

//         {/* ── Why We Charge ── */}
//         <View style={styles.section}>
//           <View style={styles.whyHeader}>
//             <Text style={styles.sectionTitle}>Why do we charge 10%?</Text>
//             <TouchableOpacity>
//               <Ionicons name="help-circle-outline" size={18} color={C.muted} />
//             </TouchableOpacity>
//           </View>

//           {WHY_CHARGE.map((item, idx) => (
//             <View key={idx} style={styles.whyRow}>
//               <View style={[styles.whyIcon, { backgroundColor: item.color + "15" }]}>
//                 <Ionicons name={item.icon} size={18} color={item.color} />
//               </View>
//               <Text style={styles.whyText}>{item.text}</Text>
//             </View>
//           ))}
//         </View>

//         {/* ── Payment Method ── */}
//         <View style={styles.section}>
//           <View style={styles.paymentHeader}>
//             <Text style={styles.sectionTitle}>Payment Method</Text>
//             <View style={styles.razorpayBadge}>
//               <Text style={styles.razorpayText}>Secured by Razorpay</Text>
//             </View>
//           </View>

//           {PAYMENT_METHODS.map((method) => (
//             <TouchableOpacity
//               key={method.id}
//               style={[
//                 styles.methodCard,
//                 selectedMethod === method.id && styles.methodCardActive,
//               ]}
//               onPress={() => setSelectedMethod(method.id)}
//               activeOpacity={0.85}
//             >
//               <View style={[styles.methodIcon, { backgroundColor: method.badgeColor + "15" }]}>
//                 <Ionicons name={method.icon} size={20} color={method.badgeColor} />
//               </View>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.methodLabel}>{method.label}</Text>
//                 <Text style={styles.methodSub}>{method.sub}</Text>
//               </View>
//               <View
//                 style={[
//                   styles.radioOuter,
//                   selectedMethod === method.id && styles.radioOuterActive,
//                 ]}
//               >
//                 {selectedMethod === method.id && <View style={styles.radioInner} />}
//               </View>
//             </TouchableOpacity>
//           ))}

//           <View style={styles.secureRow}>
//             <Ionicons name="lock-closed-outline" size={16} color={C.muted} />
//             <Text style={styles.secureText}>
//               100% Secure Payment — Your payment is safe and encrypted powered by Razorpay.
//             </Text>
//           </View>
//         </View>

//         {/* ── Pay & Submit Button ── */}
//         <TouchableOpacity
//           style={[styles.payWrap, processing && { opacity: 0.7 }]}
//           onPress={handlePay}
//           activeOpacity={0.88}
//           disabled={processing}
//         >
//           <LinearGradient colors={[C.primary, C.primaryDark]} style={styles.payBtn}>
//             {processing ? (
//               <ActivityIndicator color={C.white} size="small" />
//             ) : (
//               <>
//                 <Text style={styles.payText}>
//                   Pay {formatPrice(adminCommission)} & Submit
//                 </Text>
//                 <Ionicons name="arrow-forward" size={20} color={C.white} />
//               </>
//             )}
//           </LinearGradient>
//         </TouchableOpacity>

//         <Text style={styles.afterPayNote}>
//           After payment, product will be sent for admin approval.
//         </Text>

//         {/* ── Bottom Badges ── */}
//         <View style={styles.badgeRow}>
//           <View style={styles.badgeItem}>
//             <Ionicons name="shield-checkmark-outline" size={22} color={C.success} />
//             <Text style={styles.badgeText}>Safe & Secure{"\n"}Payment</Text>
//           </View>
//           <View style={styles.badgeDivider} />
//           <View style={styles.badgeItem}>
//             <Ionicons name="flash-outline" size={22} color="#F59E0B" />
//             <Text style={styles.badgeText}>Quick{"\n"}Approval</Text>
//           </View>
//           <View style={styles.badgeDivider} />
//           <View style={styles.badgeItem}>
//             <Ionicons name="trending-up-outline" size={22} color={C.primary} />
//             <Text style={styles.badgeText}>Boost Your{"\n"}Sales</Text>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: C.bg },
//   header: {
//     paddingTop: Platform.OS === "android" ? 38 : 54,
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     borderBottomWidth: 1,
//     borderBottomColor: "#F8EAF1",
//   },
//   iconBtn: {
//     width: 42, height: 42, borderRadius: 21,
//     alignItems: "center", justifyContent: "center",
//     backgroundColor: C.soft, borderWidth: 1, borderColor: C.border,
//   },
//   headerTitle: { fontSize: 18, fontWeight: "900", color: C.text },
//   content: { padding: 16, paddingBottom: 40 },
//   previewCard: {
//     backgroundColor: C.primary, borderRadius: 20, padding: 16, marginBottom: 16,
//   },
//   previewCardHeader: {
//     flexDirection: "row", justifyContent: "space-between",
//     alignItems: "center", marginBottom: 14,
//   },
//   previewCardTitle: {
//     fontSize: 14, fontWeight: "900", color: "rgba(255,255,255,0.85)",
//   },
//   editBtn: {
//     flexDirection: "row", alignItems: "center", gap: 4,
//     backgroundColor: "rgba(255,255,255,0.15)",
//     paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99,
//   },
//   editText: { fontSize: 12, fontWeight: "800", color: C.white },
//   previewContent: { flexDirection: "row", gap: 14 },
//   productThumb: {
//     width: 90, height: 90, borderRadius: 14, overflow: "hidden",
//     backgroundColor: "rgba(255,255,255,0.1)",
//   },
//   productImage: { width: "100%", height: "100%" },
//   productImagePlaceholder: {
//     width: "100%", height: "100%", alignItems: "center", justifyContent: "center",
//   },
//   productName: {
//     fontSize: 15, fontWeight: "900", color: C.white, lineHeight: 20, marginBottom: 6,
//   },
//   tagRow: { flexDirection: "row", gap: 6, marginBottom: 8 },
//   tag: {
//     backgroundColor: "rgba(255,255,255,0.2)",
//     paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999,
//   },
//   tagText: { fontSize: 10, fontWeight: "800", color: C.white },
//   previewPriceRow: {
//     flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4,
//   },
//   previewFinalPrice: { fontSize: 17, fontWeight: "900", color: C.white },
//   previewOldPrice: {
//     fontSize: 12, fontWeight: "700",
//     color: "rgba(255,255,255,0.55)", textDecorationLine: "line-through",
//   },
//   previewMeta: {
//     fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: "700", marginBottom: 6,
//   },
//   starsRow: { flexDirection: "row", alignItems: "center" },
//   reviewCount: { fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: "700" },
//   section: {
//     backgroundColor: C.white, borderWidth: 1, borderColor: "#F1F5F9",
//     borderRadius: 20, padding: 16, marginBottom: 14,
//     elevation: 1, shadowColor: "#000", shadowOpacity: 0.04,
//     shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
//   },
//   sectionTitle: { fontSize: 16, fontWeight: "900", color: C.text, marginBottom: 14 },
//   feeLine: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
//   feeLabel: { fontSize: 14, fontWeight: "700", color: C.muted },
//   feeValue: { fontSize: 14, fontWeight: "900", color: C.text },
//   feeCommission: { fontSize: 14, fontWeight: "900", color: C.danger },
//   feeDivider: { height: 1, backgroundColor: "#F1F5F9", marginVertical: 10 },
//   feeYouGetLabel: { fontSize: 15, fontWeight: "900", color: C.text },
//   feeYouGetValue: { fontSize: 18, fontWeight: "900", color: C.success },
//   whyHeader: {
//     flexDirection: "row", alignItems: "center",
//     justifyContent: "space-between", marginBottom: 14,
//   },
//   whyRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
//   whyIcon: {
//     width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center",
//   },
//   whyText: { flex: 1, fontSize: 13, fontWeight: "700", color: C.text },
//   paymentHeader: {
//     flexDirection: "row", alignItems: "center",
//     justifyContent: "space-between", marginBottom: 14,
//   },
//   razorpayBadge: {
//     backgroundColor: "#F0FDF4", borderWidth: 1, borderColor: "#BBF7D0",
//     paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99,
//   },
//   razorpayText: { fontSize: 10, fontWeight: "900", color: C.success },
//   methodCard: {
//     flexDirection: "row", alignItems: "center", padding: 14,
//     borderRadius: 16, borderWidth: 1.5, borderColor: "#E2E8F0",
//     marginBottom: 10, gap: 12, backgroundColor: C.white,
//   },
//   methodCardActive: { borderColor: C.primary, backgroundColor: "#EFF6FF" },
//   methodIcon: {
//     width: 40, height: 40, borderRadius: 12,
//     alignItems: "center", justifyContent: "center",
//   },
//   methodLabel: { fontSize: 14, fontWeight: "900", color: C.text },
//   methodSub: { fontSize: 11, fontWeight: "700", color: C.muted, marginTop: 2 },
//   radioOuter: {
//     width: 22, height: 22, borderRadius: 11, borderWidth: 2,
//     borderColor: "#CBD5E1", alignItems: "center", justifyContent: "center",
//   },
//   radioOuterActive: { borderColor: C.primary },
//   radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: C.primary },
//   secureRow: {
//     flexDirection: "row", alignItems: "flex-start", gap: 8, marginTop: 8,
//     backgroundColor: "#F8FAFC", borderRadius: 12, padding: 12,
//   },
//   secureText: { flex: 1, fontSize: 12, color: C.muted, fontWeight: "700" },
//   payWrap: { borderRadius: 18, overflow: "hidden", marginTop: 4 },
//   payBtn: {
//     height: 58, alignItems: "center", justifyContent: "center",
//     flexDirection: "row", gap: 10,
//   },
//   payText: { color: C.white, fontSize: 16, fontWeight: "900" },
//   afterPayNote: {
//     textAlign: "center", fontSize: 12, color: C.muted,
//     fontWeight: "700", marginTop: 10, marginBottom: 20,
//   },
//   badgeRow: {
//     flexDirection: "row", justifyContent: "space-between", alignItems: "center",
//     paddingVertical: 16, borderTopWidth: 1, borderTopColor: "#F1F5F9", marginBottom: 10,
//   },
//   badgeItem: { flex: 1, alignItems: "center", gap: 6 },
//   badgeDivider: { width: 1, height: 40, backgroundColor: "#F1F5F9" },
//   badgeText: {
//     fontSize: 11, fontWeight: "800", color: C.muted,
//     textAlign: "center", lineHeight: 16,
//   },
// }); 













































// src/screens/seller/SellerReviewandPayScreen.js

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  ActivityIndicator,
  AppState,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useShop } from "../../context/ShopContext";
import {
  createRazorpayOrderAPI,
  createRazorpayMobileSessionAPI,
  fetchRazorpayMobileSessionAPI,
  verifyRazorpayPaymentAPI,
} from "../../api/paymentApi";
import { showAlert } from "../../utils/showAlert";

const C = {
  primary: "#082843",
  primaryDark: "#0D3A5C",
  white: "#FFFFFF",
  bg: "#F4F7FB",
  text: "#111827",
  muted: "#6B7280",
  border: "#E5E7EB",
  soft: "#F9FAFB",
  success: "#16A34A",
  successSoft: "#ECFDF5",
  successBorder: "#BBF7D0",
  danger: "#EF4444",
  warning: "#F59E0B",
  purple: "#7C3AED",
  blue: "#2563EB",
};

const formatPrice = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const PAYMENT_METHODS = [
  {
    id: "upi",
    label: "UPI / QR",
    sub: "Google Pay, PhonePe, Paytm",
    icon: "qr-code-outline",
    color: "#5F5FA8",
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    sub: "Visa, Mastercard, Rupay",
    icon: "card-outline",
    color: "#2563EB",
  },
  {
    id: "wallet",
    label: "Wallet",
    sub: "Fast wallet payments",
    icon: "wallet-outline",
    color: "#16A34A",
  },
  {
    id: "netbanking",
    label: "Net Banking",
    sub: "All banks supported",
    icon: "business-outline",
    color: "#EA580C",
  },
];

const loadRazorpayCheckout = () =>
  new Promise((resolve, reject) => {
    if (Platform.OS !== "web") {
      reject(new Error("Razorpay Checkout is configured for web in this app."));
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Unable to load Razorpay Checkout."));
    document.body.appendChild(script);
  });

export default function SellerReviewandPayScreen({
  navigation,
  route,
}) {
  const {
    addSellerProductPending,
    addSellerNotification,
    currentSeller,
  } = useShop();

  const {
    productData = {},
    adminCommission = 0,
    sellerWillGet = 0,
  } = route?.params || {};

  const sanitizeProductDataForNavigation = (data) => {
    const { rawImages, ...rest } = data || {};
    return {
      ...rest,
      image: typeof rest.image === "string" ? rest.image : null,
      images: Array.isArray(rest.images)
        ? rest.images.filter((item) => typeof item === "string")
        : [],
    };
  };

  const [selectedMethod, setSelectedMethod] =
    useState("upi");

  const [processing, setProcessing] =
    useState(false);
  const pendingPaymentRef = useRef(null);
  const syncingPaymentRef = useRef(false);
  const appState = useRef(AppState.currentState);

  const submitPaidProduct = useCallback(async (paymentResponse) => {
    if (addSellerProductPending) {
      await addSellerProductPending({
        ...productData,
        status: "Live",
        visibleToCustomer: true,
        paymentStatus: "Paid",
        uploadFee: adminCommission,
        paymentMethod: "razorpay",
        paidAt: new Date().toISOString(),
        razorpayOrderId: paymentResponse.razorpay_order_id,
        razorpayPaymentId: paymentResponse.razorpay_payment_id,
      });
    }

    if (addSellerNotification) {
      addSellerNotification(
        "Product Published",
        `"${productData.name}" is now visible to customers.`,
        "product"
      );
    }

    navigation.replace("SellerPaymentSuccessScreen", {
      productData: sanitizeProductDataForNavigation(productData),
      adminCommission,
    });
  }, [addSellerNotification, addSellerProductPending, adminCommission, navigation, productData]);

  const clearPendingPayment = useCallback(() => {
    pendingPaymentRef.current = null;
    syncingPaymentRef.current = false;
  }, []);

  const syncPendingNativePayment = useCallback(async () => {
    const pending = pendingPaymentRef.current;
    if (!pending || syncingPaymentRef.current) return;

    syncingPaymentRef.current = true;
    try {
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const result = await fetchRazorpayMobileSessionAPI(pending.sessionId);
        if (result?.success && String(result?.status || "").toLowerCase() === "paid") {
          const payment = result?.payment || {};

          await submitPaidProduct({
            razorpay_order_id: result.orderId || pending.orderId,
            razorpay_payment_id: payment.razorpay_payment_id || pending.orderId,
            razorpay_signature: payment.razorpay_signature || "",
          });

          clearPendingPayment();
          return;
        }

        if (result?.success && ["cancelled", "expired"].includes(String(result?.status || "").toLowerCase())) {
          clearPendingPayment();
          showAlert("Payment not completed", "The payment link was cancelled or expired.");
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      showAlert("Payment pending", "Please return to the payment page and complete the payment.");
    } catch (error) {
      showAlert("Payment check failed", error?.message || "Unable to verify mobile payment.");
    } finally {
      syncingPaymentRef.current = false;
    }
  }, [clearPendingPayment, submitPaidProduct]);

  const handlePayment = async () => {
    if (Platform.OS !== "web" && pendingPaymentRef.current) {
      showAlert("Payment in progress", "Please complete the existing payment in your browser.");
      return;
    }

    setProcessing(true);

    try {
      if (Platform.OS !== "web") {
        const receipt = `seller_product_${Date.now()}`;
        const session = await createRazorpayMobileSessionAPI({
          amount: adminCommission,
          receipt,
          description: `Product upload fee for ${productData.name || "seller product"}`,
          customer: {
            name: currentSeller?.name || currentSeller?.shopName || "",
            email: currentSeller?.email || "",
            contact: currentSeller?.phone || "",
          },
        });

        if (!session?.success) {
          throw new Error(session?.message || "Unable to create payment session.");
        }

        const checkoutUrl = String(session?.checkoutUrl || "").trim();
        if (!checkoutUrl) {
          throw new Error("Payment page is not available.");
        }

        pendingPaymentRef.current = {
          sessionId: session.sessionId,
          orderId: session.orderId || null,
        };

        await Linking.openURL(checkoutUrl);
        setProcessing(false);
        showAlert("Payment opened", "Complete the payment in your browser, then return to the app.");
        return;
      }

      await loadRazorpayCheckout();

      const order = await createRazorpayOrderAPI({
        amount: adminCommission,
        receipt: `seller_product_${Date.now()}`,
      });

      if (!order?.success) {
        throw new Error(order?.message || "Unable to create Razorpay order.");
      }

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Selfbusiness",
        description: `Product upload fee for ${productData.name || "seller product"}`,
        order_id: order.orderId,
        prefill: {
          name: currentSeller?.name || currentSeller?.shopName || "",
          email: currentSeller?.email || "",
          contact: currentSeller?.phone || "",
        },
        notes: {
          productName: productData.name || "",
          sellerId: currentSeller?.id || "",
        },
        theme: { color: C.primary },
        handler: async (paymentResponse) => {
          try {
            const verification = await verifyRazorpayPaymentAPI(paymentResponse);
            if (!verification?.success) {
              throw new Error(verification?.message || "Payment verification failed.");
            }

            await submitPaidProduct(paymentResponse);
          } catch (error) {
            showAlert(
              "Product Submit Failed",
              error?.message ||
                "Payment was completed, but we could not send the product to admin review. Please contact support or try again."
            );
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          },
        },
      });

      checkout.open();
    } catch (error) {
      setProcessing(false);
      clearPendingPayment();
      showAlert("Payment Failed", error?.message || "Unable to start Razorpay payment.");
    }

    return;

    setTimeout(async () => {
      try {
      // PRODUCT WAITS FOR ADMIN APPROVAL
      if (addSellerProductPending) {
        await addSellerProductPending({
          ...productData,
          status: "Live",
          visibleToCustomer: true,
          paymentStatus: "Paid",
          uploadFee: adminCommission,
          paymentMethod: selectedMethod,
          paidAt: new Date().toISOString(),
        });
      }

      // SELLER NOTIFICATION
      if (addSellerNotification) {
        addSellerNotification(
          "Product Published 🎉",
          `"${productData.name}" is now LIVE for customers.`,
          "product"
        );
      }

      setProcessing(false);
      navigation.replace("SellerPaymentSuccessScreen", {
        productData: sanitizeProductDataForNavigation(productData),
        adminCommission,
      });
      } catch (error) {
        setProcessing(false);
        showAlert("Payment Submit Failed", error?.message || "Unable to submit product.");
      }
    }, 2200);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (appState.current === "background" && nextState === "active" && pendingPaymentRef.current) {
        syncPendingNativePayment();
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [syncPendingNativePayment]);

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={C.bg}
      />

      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={C.text}
          />
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>
            Review & Pay
          </Text>

          <Text style={styles.headerSub}>
            Complete payment to publish
          </Text>
        </View>

        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* PRODUCT PREVIEW */}

        <LinearGradient
          colors={[C.primaryDark, C.primary]}
          style={styles.previewCard}
        >
          <View style={styles.previewTop}>
            <Text style={styles.previewTitle}>
              Product Preview
            </Text>

            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="create-outline"
                size={15}
                color={C.white}
              />

              <Text style={styles.editText}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.productRow}>
            {productData.image ? (
              <Image
                source={{
                  uri: productData.image,
                }}
                style={styles.productImage}
              />
            ) : (
              <View
                style={styles.placeholder}
              >
                <Ionicons
                  name="image-outline"
                  size={32}
                  color={C.white}
                />
              </View>
            )}

            <View style={{ flex: 1 }}>
              <Text
                style={styles.productName}
                numberOfLines={2}
              >
                {productData.name ||
                  "Product Name"}
              </Text>

              <View style={styles.tagRow}>
                {productData.category ? (
                  <View style={styles.tag}>
                    <Text
                      style={styles.tagText}
                    >
                      {
                        productData.category
                      }
                    </Text>
                  </View>
                ) : null}

                {productData.subcategory ? (
                  <View style={styles.tag}>
                    <Text
                      style={styles.tagText}
                    >
                      {
                        productData.subcategory
                      }
                    </Text>
                  </View>
                ) : null}
              </View>

              <Text
                style={styles.productPrice}
              >
                {formatPrice(
                  productData.price
                )}
              </Text>

              <Text
                style={styles.productMeta}
              >
                Stock:{" "}
                {productData.stock || 0}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* PAYMENT BREAKDOWN */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Listing Fee Details
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.label}>
              Product Price
            </Text>

            <Text style={styles.value}>
              {formatPrice(
                productData.price
              )}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.label}>
              Platform Fee (10%)
            </Text>

            <Text
              style={[
                styles.value,
                { color: C.danger },
              ]}
            >
              -{" "}
              {formatPrice(
                adminCommission
              )}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text
              style={[
                styles.label,
                {
                  color: C.success,
                  fontSize: 15,
                },
              ]}
            >
              You Will Receive
            </Text>

            <Text
              style={[
                styles.value,
                {
                  color: C.success,
                  fontSize: 18,
                },
              ]}
            >
              {formatPrice(
                sellerWillGet
              )}
            </Text>
          </View>
        </View>

        {/* WHY CHARGE */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Why do we charge 10%?
          </Text>

          {[
            {
              icon:
                "shield-checkmark-outline",
              color: C.success,
              text:
                "Secure platform & seller protection",
            },
            {
              icon: "megaphone-outline",
              color: C.blue,
              text:
                "Marketing your products to customers",
            },
            {
              icon: "card-outline",
              color: C.warning,
              text:
                "Payment gateway & server maintenance",
            },
            {
              icon: "trending-up-outline",
              color: C.purple,
              text:
                "Helping sellers grow sales faster",
            },
          ].map((item, index) => (
            <View
              key={index}
              style={styles.whyRow}
            >
              <View
                style={[
                  styles.whyIcon,
                  {
                    backgroundColor:
                      item.color + "15",
                  },
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={item.color}
                />
              </View>

              <Text
                style={styles.whyText}
              >
                {item.text}
              </Text>
            </View>
          ))}
        </View>

        {/* PAYMENT METHODS */}

        <View style={styles.card}>
          <View style={styles.paymentHeader}>
            <Text style={styles.sectionTitle}>
              Payment Method
            </Text>

            <View
              style={styles.razorpay}
            >
              <Text
                style={
                  styles.razorpayText
                }
              >
                Razorpay
              </Text>
            </View>
          </View>

          {PAYMENT_METHODS.map(
            (method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodCard,
                  selectedMethod ===
                    method.id &&
                    styles.methodActive,
                ]}
                onPress={() =>
                  setSelectedMethod(
                    method.id
                  )
                }
              >
                <View
                  style={[
                    styles.methodIcon,
                    {
                      backgroundColor:
                        method.color +
                        "15",
                    },
                  ]}
                >
                  <Ionicons
                    name={method.icon}
                    size={22}
                    color={
                      method.color
                    }
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <Text
                    style={
                      styles.methodTitle
                    }
                  >
                    {method.label}
                  </Text>

                  <Text
                    style={
                      styles.methodSub
                    }
                  >
                    {method.sub}
                  </Text>
                </View>

                <View
                  style={[
                    styles.radio,
                    selectedMethod ===
                      method.id &&
                      styles.radioActive,
                  ]}
                >
                  {selectedMethod ===
                  method.id ? (
                    <View
                      style={
                        styles.radioDot
                      }
                    />
                  ) : null}
                </View>
              </TouchableOpacity>
            )
          )}

          <View style={styles.safeBox}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={C.success}
            />

            <Text style={styles.safeText}>
              100% secure encrypted
              payment powered by Razorpay
            </Text>
          </View>
        </View>

        {/* LIVE NOTICE */}

        <View style={styles.liveCard}>
          <Ionicons
            name="flash-outline"
            size={22}
            color={C.warning}
          />

          <Text style={styles.liveText}>
            After payment, your product
            will instantly appear for
            customers with all images.
          </Text>
        </View>

        {/* BUTTON */}

        <TouchableOpacity
          activeOpacity={0.9}
          disabled={processing}
          onPress={handlePayment}
          style={{ marginTop: 10 }}
        >
          <LinearGradient
            colors={[
              C.primaryDark,
              C.primary,
            ]}
            style={styles.payBtn}
          >
            {processing ? (
              <ActivityIndicator
                color={C.white}
              />
            ) : (
              <>
                <Text
                  style={styles.payText}
                >
                  Pay{" "}
                  {formatPrice(
                    adminCommission
                  )}{" "}
                  & Publish Product
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={22}
                  color={C.white}
                />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.bottomNote}>
          Secure payment · Instant product
          publishing
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },

  header: {
    paddingTop:
      Platform.OS === "android"
        ? 46
        : 60,
    paddingHorizontal: 18,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: C.text,
    textAlign: "center",
  },

  headerSub: {
    fontSize: 12,
    color: C.muted,
    marginTop: 4,
    textAlign: "center",
  },

  content: {
    paddingHorizontal: 18,
    paddingBottom: 120,
  },

  previewCard: {
    borderRadius: 28,
    padding: 18,
    marginBottom: 18,
  },

  previewTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    marginBottom: 16,
  },

  previewTitle: {
    color: C.white,
    fontSize: 15,
    fontWeight: "900",
  },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:
      "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },

  editText: {
    color: C.white,
    marginLeft: 4,
    fontWeight: "800",
    fontSize: 12,
  },

  productRow: {
    flexDirection: "row",
  },

  productImage: {
    width: 96,
    height: 96,
    borderRadius: 18,
    marginRight: 14,
  },

  placeholder: {
    width: 96,
    height: 96,
    borderRadius: 18,
    marginRight: 14,
    backgroundColor:
      "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  productName: {
    color: C.white,
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 22,
  },

  tagRow: {
    flexDirection: "row",
    marginTop: 10,
    flexWrap: "wrap",
  },

  tag: {
    backgroundColor:
      "rgba(255,255,255,0.16)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },

  tagText: {
    color: C.white,
    fontSize: 10,
    fontWeight: "800",
  },

  productPrice: {
    color: C.white,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 6,
  },

  productMeta: {
    color:
      "rgba(255,255,255,0.75)",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "700",
  },

  card: {
    backgroundColor: C.white,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: C.text,
    marginBottom: 16,
  },

  priceRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: C.muted,
  },

  value: {
    fontSize: 15,
    fontWeight: "900",
    color: C.text,
  },

  divider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 10,
  },

  whyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  whyIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  whyText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: C.text,
    lineHeight: 20,
  },

  paymentHeader: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  razorpay: {
    backgroundColor:
      C.successSoft,
    borderWidth: 1,
    borderColor:
      C.successBorder,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  razorpayText: {
    color: C.success,
    fontSize: 10,
    fontWeight: "900",
  },

  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: C.border,
    marginBottom: 12,
  },

  methodActive: {
    borderColor: C.primary,
    backgroundColor:
      "#EFF6FF",
  },

  methodIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  methodTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: C.text,
  },

  methodSub: {
    fontSize: 11,
    color: C.muted,
    marginTop: 3,
    fontWeight: "700",
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },

  radioActive: {
    borderColor: C.primary,
  },

  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: C.primary,
  },

  safeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:
      "#F8FAFC",
    padding: 14,
    borderRadius: 16,
    marginTop: 6,
  },

  safeText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 12,
    fontWeight: "700",
    color: C.muted,
    lineHeight: 18,
  },

  liveCard: {
    backgroundColor:
      "#FFF7ED",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  liveText: {
    flex: 1,
    marginLeft: 10,
    color: C.text,
    fontWeight: "700",
    lineHeight: 20,
  },

  payBtn: {
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  payText: {
    color: C.white,
    fontSize: 16,
    fontWeight: "900",
    marginRight: 8,
  },

  bottomNote: {
    textAlign: "center",
    marginTop: 14,
    color: C.muted,
    fontSize: 12,
    fontWeight: "700",
  },
});
