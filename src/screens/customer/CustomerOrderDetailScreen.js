
// // screens/customer/OrderDetailScreen.js

// import React, { useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   SafeAreaView,
//   Platform,
//   Modal,
//   TextInput,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import * as ImagePicker from "expo-image-picker";

// import { COLORS } from "../../constants/colors";
// import { useShop } from "../../context/ShopContext";

// const placeholder = require("../../../assets/images/placeholder.png");

// const CUSTOMER_COLOR = COLORS?.customer || "#E83E7C";
// const TEXT_COLOR = COLORS?.text || "#111827";
// const MUTED_COLOR = COLORS?.muted || "#6B7280";

// const getImageSource = (image) => {
//   if (!image) return placeholder;
//   if (typeof image === "string") return { uri: image };
//   return image;
// };

// const getProductImage = (item) =>
//   item?.image ||
//   item?.coverImage ||
//   item?.thumbnail ||
//   item?.images?.[0] ||
//   item?.productImages?.[0];

// const getProductKey = (item, index) =>
//   String(item?.id || item?.productId || item?.name || index);

// const getPriceText = (price) => {
//   if (String(price || "").includes("₹")) return String(price);
//   return `₹${price || 0}`;
// };

// export default function OrderDetailScreen({ navigation, route }) {
//   const {
//     orders = [],
//     returnRequests = [],
//     notifications = [],
//     createReturnRequest = () => {},
//     addProductReview = () => {},
//     formatPrice = (n) => `₹${n || 0}`,
//     cleanPrice = (n) => Number(String(n || "0").replace(/[₹,\s]/g, "")) || 0,
//   } = useShop();

//   const routeOrder = route?.params?.order || {};
//   const liveOrder =
//     orders.find((o) => String(o.id) === String(routeOrder.id)) || routeOrder;

//   const products = liveOrder?.products || liveOrder?.items || [];
//   const status = liveOrder?.status || "Processing";
//   const isDelivered = status === "Delivered";
//   const isCancelled = status === "Cancelled";

//   const [localStatus, setLocalStatus] = useState(status);
//   const [localReviews, setLocalReviews] = useState({});
//   const [localReturns, setLocalReturns] = useState({});
//   const [localCancelData, setLocalCancelData] = useState(null);

//   const [returnModalVisible, setReturnModalVisible] = useState(false);
//   const [reviewModalVisible, setReviewModalVisible] = useState(false);
//   const [cancelModalVisible, setCancelModalVisible] = useState(false);

//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [selectedProductIndex, setSelectedProductIndex] = useState(0);

//   const [returnReason, setReturnReason] = useState("");
//   const [returnError, setReturnError] = useState("");

//   const [cancelReason, setCancelReason] = useState("");
//   const [cancelError, setCancelError] = useState("");

//   const [rating, setRating] = useState(0);
//   const [reviewText, setReviewText] = useState("");
//   const [reviewImages, setReviewImages] = useState([]);
//   const [reviewError, setReviewError] = useState("");

//   const unreadCount = notifications.filter((n) => !n.read).length;

//   const orderTotal = useMemo(() => {
//     if (liveOrder?.price) return liveOrder.price;
//     if (liveOrder?.totalAmount) return formatPrice(liveOrder.totalAmount);

//     const total = products.reduce((sum, item) => {
//       const qty = Number(item?.qty || item?.quantity || 1);
//       const price = cleanPrice(item?.finalPrice || item?.price);
//       return sum + price * qty;
//     }, 0);

//     return formatPrice(total);
//   }, [liveOrder, products, formatPrice, cleanPrice]);

//   const openNotifications = () => {
//     navigation.navigate("CustomerNotifications", { notifications });
//   };

//   const getReturnData = (item, index) => {
//     const productKey = getProductKey(item, index);

//     return (
//       localReturns[productKey] ||
//       liveOrder?.returns?.[productKey] ||
//       returnRequests.find(
//         (r) =>
//           String(r.orderId) === String(liveOrder.id) &&
//           String(r.productId || r.product) ===
//             String(item?.id || item?.productId || item?.name)
//       )
//     );
//   };

//   const getReviewData = (item, index) => {
//     const productKey = getProductKey(item, index);

//     return (
//       localReviews[productKey] ||
//       liveOrder?.reviews?.[productKey] ||
//       item?.customerReview ||
//       item?.review ||
//       null
//     );
//   };

//   const openReturnModal = (item, index) => {
//     setSelectedProduct(item);
//     setSelectedProductIndex(index);
//     setReturnReason("");
//     setReturnError("");
//     setReturnModalVisible(true);
//   };

//   const submitReturn = () => {
//     if (!returnReason.trim()) {
//       setReturnError("Please enter return reason.");
//       return;
//     }

//     if (!selectedProduct || !liveOrder?.id) return;

//     const productKey = getProductKey(selectedProduct, selectedProductIndex);
//     const productName = selectedProduct?.name || selectedProduct?.title || "Product";
//     const productPrice = selectedProduct?.finalPrice || selectedProduct?.price || "₹0";

//     const returnData = {
//       orderId: liveOrder.id,
//       customer:
//         liveOrder.customer || liveOrder.customerName || liveOrder.address?.name,
//       product: productName,
//       productId: selectedProduct?.id || selectedProduct?.productId || productName,
//       price: productPrice,
//       reason: returnReason.trim(),
//       status: "Return Requested",
//       refundCredited: false,
//       image: getProductImage(selectedProduct),
//       productImage: getProductImage(selectedProduct),
//     };

//     createReturnRequest(returnData);

//     setLocalReturns((prev) => ({
//       ...prev,
//       [productKey]: returnData,
//     }));

//     setReturnModalVisible(false);
//     setReturnReason("");
//     setReturnError("");
//   };

//   const openReviewModal = (item, index) => {
//     setSelectedProduct(item);
//     setSelectedProductIndex(index);
//     setRating(0);
//     setReviewText("");
//     setReviewImages([]);
//     setReviewError("");
//     setReviewModalVisible(true);
//   };

//   const pickReviewImages = async () => {
//     const { status: permission } =
//       await ImagePicker.requestMediaLibraryPermissionsAsync();

//     if (permission !== "granted") {
//       setReviewError("Gallery permission is required.");
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsMultipleSelection: true,
//       quality: 0.75,
//     });

//     if (!result.canceled && result.assets?.length > 0) {
//       setReviewImages((prev) => [
//         ...prev,
//         ...result.assets.map((asset) => asset.uri),
//       ]);
//       setReviewError("");
//     }
//   };

//   const removeReviewImage = (indexToRemove) => {
//     setReviewImages((prev) => prev.filter((_, index) => index !== indexToRemove));
//   };

//   const submitReview = () => {
//     if (rating === 0) {
//       setReviewError("Please select rating.");
//       return;
//     }

//     if (!reviewText.trim()) {
//       setReviewError("Please write your review.");
//       return;
//     }

//     if (!selectedProduct || !liveOrder?.id) return;

//     const productKey = getProductKey(selectedProduct, selectedProductIndex);
//     const productName = selectedProduct?.name || selectedProduct?.title || "Product";
//     const productId =
//       selectedProduct?.id || selectedProduct?.productId || productName;

//     const reviewData = {
//       orderId: liveOrder.id,
//       productId,
//       product: productName,
//       customer:
//         liveOrder.customer || liveOrder.customerName || liveOrder.address?.name,
//       rating,
//       comment: reviewText.trim(),
//       text: reviewText.trim(),
//       images: reviewImages,
//       createdAt: "Just now",
//     };

//     addProductReview(reviewData);

//     setLocalReviews((prev) => ({
//       ...prev,
//       [productKey]: reviewData,
//     }));

//     setReviewModalVisible(false);
//     setRating(0);
//     setReviewText("");
//     setReviewImages([]);
//     setReviewError("");
//   };

//   const openCancelModal = () => {
//     setCancelReason("");
//     setCancelError("");
//     setCancelModalVisible(true);
//   };

//   const submitCancelOrder = () => {
//     if (!cancelReason.trim()) {
//       setCancelError("Please enter cancellation reason.");
//       return;
//     }

//     const cancelData = {
//       orderId: liveOrder?.id,
//       reason: cancelReason.trim(),
//       status: "Cancellation Requested",
//       requestedAt: "Just now",
//     };

//     setLocalCancelData(cancelData);
//     setLocalStatus("Cancelled");
//     setCancelModalVisible(false);
//     setCancelReason("");
//     setCancelError("");
//   };

//   const displayStatus = localStatus || status;
//   const displayDelivered = displayStatus === "Delivered";
//   const displayCancelled = displayStatus === "Cancelled";

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity
//             style={styles.headerIconBtn}
//             activeOpacity={0.85}
//             onPress={() => navigation.goBack()}
//           >
//             <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
//           </TouchableOpacity>

//           <Text style={styles.headerTitle}>Order Details</Text>

//           <TouchableOpacity
//             style={styles.headerIconBtn}
//             activeOpacity={0.85}
//             onPress={openNotifications}
//           >
//             <Ionicons name="notifications-outline" size={23} color="#FFFFFF" />
//             {unreadCount > 0 && (
//               <View style={styles.headerBadge}>
//                 <Text style={styles.headerBadgeText}>
//                   {unreadCount > 99 ? "99+" : unreadCount}
//                 </Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>

//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scroll}
//         >
//           <View style={styles.successCard}>
//             <View
//               style={[
//                 styles.successIcon,
//                 displayCancelled && styles.cancelIconBg,
//               ]}
//             >
//               <Ionicons
//                 name={
//                   displayCancelled
//                     ? "close-circle"
//                     : displayDelivered
//                     ? "checkmark-circle"
//                     : "cube-outline"
//                 }
//                 size={46}
//                 color={
//                   displayCancelled
//                     ? "#DC2626"
//                     : displayDelivered
//                     ? "#16A34A"
//                     : CUSTOMER_COLOR
//                 }
//               />
//             </View>

//             <Text style={styles.successTitle}>
//               {displayCancelled
//                 ? "Order Cancelled"
//                 : displayDelivered
//                 ? "Order Delivered"
//                 : "Order Status"}
//             </Text>

//             <Text style={styles.successText}>
//               Your order is currently {String(displayStatus).toLowerCase()}.
//             </Text>
//           </View>

//           <View style={styles.card}>
//             <Text style={styles.cardTitle}>Order Summary</Text>
//             <InfoRow label="Order ID" value={liveOrder?.id || "Not available"} />
//             <InfoRow label="Status" value={displayStatus} highlight />
//             <InfoRow label="Date" value={liveOrder?.date || "Not available"} />
//             <InfoRow label="Payment" value={liveOrder?.payment || "Not available"} />
//             <InfoRow label="Total Amount" value={orderTotal} highlight />

//             {localCancelData ? (
//               <View style={styles.cancelInfoBox}>
//                 <Ionicons name="alert-circle-outline" size={19} color="#DC2626" />
//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.cancelInfoTitle}>
//                     Cancellation Requested
//                   </Text>
//                   <Text style={styles.cancelInfoText}>
//                     Reason: {localCancelData.reason}
//                   </Text>
//                 </View>
//               </View>
//             ) : null}

//             {!displayDelivered && !displayCancelled ? (
//               <TouchableOpacity
//                 style={styles.cancelOrderBtn}
//                 activeOpacity={0.85}
//                 onPress={openCancelModal}
//               >
//                 <Ionicons name="close-circle-outline" size={18} color="#DC2626" />
//                 <Text style={styles.cancelOrderText}>Cancel Order</Text>
//               </TouchableOpacity>
//             ) : null}
//           </View>

//           {liveOrder?.address ? (
//             <View style={styles.card}>
//               <Text style={styles.cardTitle}>Delivery Address</Text>
//               <Text style={styles.addressName}>
//                 {liveOrder.address.name || "Not available"}
//               </Text>
//               <Text style={styles.addressText}>{liveOrder.address.line1 || ""}</Text>
//               {liveOrder.address.line2 ? (
//                 <Text style={styles.addressText}>{liveOrder.address.line2}</Text>
//               ) : null}
//               <Text style={styles.addressText}>
//                 {[
//                   liveOrder.address.city,
//                   liveOrder.address.state,
//                   liveOrder.address.pincode,
//                 ]
//                   .filter(Boolean)
//                   .join(", ")}
//               </Text>
//             </View>
//           ) : null}

//           <View style={styles.card}>
//             <Text style={styles.cardTitle}>Ordered Products</Text>

//             {products.length === 0 ? (
//               <Text style={styles.emptyText}>No ordered products found.</Text>
//             ) : (
//               products.map((item, index) => {
//                 const productKey = getProductKey(item, index);
//                 const qty = item?.qty || item?.quantity || 1;
//                 const returnData = getReturnData(item, index);
//                 const reviewData = getReviewData(item, index);
//                 const refundText =
//                   returnData?.refundAmountText ||
//                   returnData?.price ||
//                   getPriceText(item?.finalPrice || item?.price);

//                 return (
//                   <View key={productKey} style={styles.productCard}>
//                     <Image
//                       source={getImageSource(getProductImage(item))}
//                       defaultSource={
//                         Platform.OS === "android" ? placeholder : undefined
//                       }
//                       style={styles.productImage}
//                       resizeMode="cover"
//                     />

//                     <View style={styles.productContent}>
//                       <Text style={styles.productName} numberOfLines={2}>
//                         {item?.name || item?.title || "Product"}
//                       </Text>

//                       <Text style={styles.productSeller} numberOfLines={1}>
//                         {item?.seller ||
//                           item?.sellerName ||
//                           item?.sellerId ||
//                           "Seller"}
//                       </Text>

//                       <View style={styles.productMetaRow}>
//                         <Text style={styles.productQty}>Qty: {qty}</Text>
//                         <Text style={styles.productPrice}>
//                           {getPriceText(item?.finalPrice || item?.price)}
//                         </Text>
//                       </View>

//                       {displayDelivered && (
//                         <View style={styles.actionRow}>

//                           {!returnData ? (
//                             <TouchableOpacity
//                               style={styles.outlineBtn}
//                               onPress={() => openReturnModal(item, index)}
//                             >
//                               <Ionicons
//                                 name="return-up-back-outline"
//                                 size={16}
//                                 color={CUSTOMER_COLOR}
//                               />
//                               <Text style={styles.outlineBtnText}>Return</Text>
//                             </TouchableOpacity>
//                           ) : (
//                             <View style={styles.returnStatusBox}>
//                               <Ionicons
//                                 name={
//                                   returnData.refundCredited
//                                     ? "wallet"
//                                     : "time-outline"
//                                 }
//                                 size={15}
//                                 color={
//                                   returnData.refundCredited
//                                     ? "#15803D"
//                                     : "#B45309"
//                                 }
//                               />
//                               <View style={{ flex: 1 }}>
//                                 <Text
//                                   style={[
//                                     styles.returnStatusText,
//                                     returnData.refundCredited && {
//                                       color: "#15803D",
//                                     },
//                                   ]}
//                                 >
//                                   {returnData.status || "Return Requested"}
//                                 </Text>
//                                 <Text style={styles.refundSmallText}>
//                                   {returnData.refundCredited
//                                     ? `Refund credited: ${refundText}`
//                                     : `Refund pending: ${refundText}`}
//                                 </Text>
//                               </View>
//                             </View>
//                           )}

//                           {!reviewData ? (
//                             <TouchableOpacity
//                               style={styles.filledBtn}
//                               onPress={() => openReviewModal(item, index)}
//                             >
//                               <Ionicons
//                                 name="star-outline"
//                                 size={16}
//                                 color="#FFFFFF"
//                               />
//                               <Text style={styles.filledBtnText}>Review</Text>
//                             </TouchableOpacity>
//                           ) : (
//                             <View style={styles.reviewPreview}>
//                               <Text style={styles.reviewStars}>
//                                 {"★".repeat(Number(reviewData.rating || 0))}
//                               </Text>
//                               <Text style={styles.reviewPreviewText}>
//                                 {reviewData.text ||
//                                   reviewData.comment ||
//                                   "Review submitted"}
//                               </Text>

//                               {reviewData.images?.length > 0 ? (
//                                 <ScrollView
//                                   horizontal
//                                   showsHorizontalScrollIndicator={false}
//                                   style={{ marginTop: 8 }}
//                                 >
//                                   {reviewData.images.map((uri, imgIndex) => (
//                                     <Image
//                                       key={`${uri}-${imgIndex}`}
//                                       source={{ uri }}
//                                       style={styles.reviewPreviewImage}
//                                     />
//                                   ))}
//                                 </ScrollView>
//                               ) : null}
//                             </View>
//                           )}
//                         </View>
//                       )}

//                       {displayCancelled ? (
//                         <View style={styles.cancelledProductBox}>
//                           <Ionicons
//                             name="close-circle-outline"
//                             size={16}
//                             color="#DC2626"
//                           />
//                           <Text style={styles.cancelledProductText}>
//                             This order has been cancelled.
//                           </Text>
//                         </View>
//                       ) : null}
//                     </View>
//                   </View>
//                 );
//               })
//             )}
//           </View>

//           <View style={styles.card}>
//             <Text style={styles.cardTitle}>Tracking</Text>

//             <TrackStep
//               title="Order Placed"
//               subtitle="Your order has been confirmed"
//               active
//             />

//             <TrackStep
//               title="Processing"
//               subtitle="Seller is preparing your order"
//               active={["Processing", "Shipped", "Delivered"].includes(
//                 displayStatus
//               )}
//             />

//             <TrackStep
//               title="Shipped"
//               subtitle="Order is on the way"
//               active={["Shipped", "Delivered"].includes(displayStatus)}
//             />

//             <TrackStep
//               title={displayCancelled ? "Cancelled" : "Delivered"}
//               subtitle={
//                 displayCancelled
//                   ? "Order cancelled by customer"
//                   : "Order delivered successfully"
//               }
//               active={displayStatus === "Delivered" || displayStatus === "Cancelled"}
//               cancelled={displayCancelled}
//               last
//             />
//           </View>

//           <TouchableOpacity
//             style={styles.ordersBtn}
//             activeOpacity={0.85}
//             onPress={() => navigation.navigate("MyOrders")}
//           >
//             <Text style={styles.ordersBtnText}>Back to My Orders</Text>
//           </TouchableOpacity>

//           <View style={{ height: 100 }} />
//         </ScrollView>

//         <Modal visible={cancelModalVisible} transparent animationType="fade">
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalCard}>
//               <Text style={styles.modalTitle}>Cancel Order</Text>
//               <Text style={styles.modalSub}>
//                 Please tell us why you want to cancel this order.
//               </Text>

//               <TextInput
//                 style={styles.textArea}
//                 placeholder="Enter cancellation reason..."
//                 placeholderTextColor="#9CA3AF"
//                 multiline
//                 value={cancelReason}
//                 onChangeText={(text) => {
//                   setCancelReason(text);
//                   setCancelError("");
//                 }}
//               />

//               {cancelError ? <Text style={styles.errorText}>{cancelError}</Text> : null}

//               <View style={styles.modalActions}>
//                 <TouchableOpacity
//                   style={styles.cancelBtn}
//                   onPress={() => setCancelModalVisible(false)}
//                 >
//                   <Text style={styles.cancelText}>Close</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={styles.deleteSubmitBtn}
//                   onPress={submitCancelOrder}
//                 >
//                   <Text style={styles.submitText}>Cancel Order</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>

//         <Modal visible={returnModalVisible} transparent animationType="fade">
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalCard}>
//               <Text style={styles.modalTitle}>Return Product</Text>
//               <Text style={styles.modalSub}>
//                 Tell the seller why you want to return this product.
//               </Text>

//               <TextInput
//                 style={styles.textArea}
//                 placeholder="Enter return reason..."
//                 placeholderTextColor="#9CA3AF"
//                 multiline
//                 value={returnReason}
//                 onChangeText={(text) => {
//                   setReturnReason(text);
//                   setReturnError("");
//                 }}
//               />

//               {returnError ? <Text style={styles.errorText}>{returnError}</Text> : null}

//               <View style={styles.modalActions}>
//                 <TouchableOpacity
//                   style={styles.cancelBtn}
//                   onPress={() => setReturnModalVisible(false)}
//                 >
//                   <Text style={styles.cancelText}>Cancel</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity style={styles.submitBtn} onPress={submitReturn}>
//                   <Text style={styles.submitText}>Send to Seller</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>

//         <Modal visible={reviewModalVisible} transparent animationType="fade">
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalCard}>
//               <Text style={styles.modalTitle}>Write Review</Text>
//               <Text style={styles.modalSub}>
//                 Add rating, review text, and product photos.
//               </Text>

//               <View style={styles.starRow}>
//                 {[1, 2, 3, 4, 5].map((num) => (
//                   <TouchableOpacity key={num} onPress={() => setRating(num)}>
//                     <Ionicons
//                       name={num <= rating ? "star" : "star-outline"}
//                       size={34}
//                       color="#F59E0B"
//                     />
//                   </TouchableOpacity>
//                 ))}
//               </View>

//               <TextInput
//                 style={styles.textArea}
//                 placeholder="Write your product review..."
//                 placeholderTextColor="#9CA3AF"
//                 multiline
//                 value={reviewText}
//                 onChangeText={(text) => {
//                   setReviewText(text);
//                   setReviewError("");
//                 }}
//               />

//               <TouchableOpacity
//                 style={styles.imagePickerBtn}
//                 onPress={pickReviewImages}
//               >
//                 <Ionicons name="image-outline" size={18} color={CUSTOMER_COLOR} />
//                 <Text style={styles.imagePickerText}>Add Review Images</Text>
//               </TouchableOpacity>

//               {reviewImages.length > 0 && (
//                 <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                   {reviewImages.map((uri, index) => (
//                     <View key={`${uri}-${index}`} style={styles.reviewImageBox}>
//                       <Image source={{ uri }} style={styles.reviewImage} />
//                       <TouchableOpacity
//                         style={styles.removeImageBtn}
//                         onPress={() => removeReviewImage(index)}
//                       >
//                         <Ionicons name="close" size={13} color="#FFFFFF" />
//                       </TouchableOpacity>
//                     </View>
//                   ))}
//                 </ScrollView>
//               )}

//               {reviewError ? <Text style={styles.errorText}>{reviewError}</Text> : null}

//               <View style={styles.modalActions}>
//                 <TouchableOpacity
//                   style={styles.cancelBtn}
//                   onPress={() => setReviewModalVisible(false)}
//                 >
//                   <Text style={styles.cancelText}>Cancel</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity style={styles.submitBtn} onPress={submitReview}>
//                   <Text style={styles.submitText}>Submit Review</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </SafeAreaView>
//   );
// }

// function InfoRow({ label, value, highlight }) {
//   return (
//     <View style={styles.infoRow}>
//       <Text style={styles.infoLabel}>{label}</Text>
//       <Text style={[styles.infoValue, highlight && styles.highlightText]}>
//         {value}
//       </Text>
//     </View>
//   );
// }

// function TrackStep({ title, subtitle, active, last, cancelled }) {
//   return (
//     <View style={styles.trackRow}>
//       <View style={styles.trackLeft}>
//         <View
//           style={[
//             styles.trackDot,
//             active && styles.activeTrackDot,
//             cancelled && styles.cancelTrackDot,
//           ]}
//         >
//           {active ? (
//             <Ionicons
//               name={cancelled ? "close" : "checkmark"}
//               size={13}
//               color="#FFFFFF"
//             />
//           ) : null}
//         </View>

//         {!last && (
//           <View style={[styles.trackLine, active && styles.activeTrackLine]} />
//         )}
//       </View>

//       <View style={styles.trackContent}>
//         <Text
//           style={[
//             styles.trackTitle,
//             active && styles.activeTrackTitle,
//             cancelled && styles.cancelTrackTitle,
//           ]}
//         >
//           {title}
//         </Text>
//         <Text style={styles.trackSubtitle}>{subtitle}</Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: CUSTOMER_COLOR },
//   container: { flex: 1, backgroundColor: "#FFFFFF" },

//   header: {
//     height: Platform.OS === "web" ? 64 : 58,
//     backgroundColor: CUSTOMER_COLOR,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     elevation: 4,
//   },
//   headerTitle: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: 19,
//     fontWeight: "900",
//     color: "#FFFFFF",
//   },
//   headerIconBtn: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: "rgba(255,255,255,0.18)",
//     alignItems: "center",
//     justifyContent: "center",
//     position: "relative",
//   },
//   headerBadge: {
//     position: "absolute",
//     top: 4,
//     right: 3,
//     minWidth: 18,
//     height: 18,
//     borderRadius: 9,
//     backgroundColor: "#EF4444",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1.5,
//     borderColor: "#FFFFFF",
//     paddingHorizontal: 4,
//   },
//   headerBadgeText: { color: "#FFFFFF", fontSize: 9, fontWeight: "900" },

//   scroll: { padding: 16, paddingBottom: 20 },

//   successCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 24,
//     padding: 20,
//     alignItems: "center",
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: "#F3F4F6",
//   },
//   successIcon: {
//     width: 76,
//     height: 76,
//     borderRadius: 38,
//     backgroundColor: "#DCFCE7",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   cancelIconBg: { backgroundColor: "#FEE2E2" },
//   successTitle: {
//     marginTop: 14,
//     fontSize: 21,
//     fontWeight: "900",
//     color: TEXT_COLOR,
//     textAlign: "center",
//   },
//   successText: {
//     marginTop: 6,
//     fontSize: 13,
//     fontWeight: "700",
//     color: MUTED_COLOR,
//     textAlign: "center",
//   },

//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 22,
//     padding: 16,
//     marginTop: 16,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: "#F3F4F6",
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: "900",
//     color: TEXT_COLOR,
//     marginBottom: 12,
//   },

//   infoRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 9,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//     gap: 12,
//   },
//   infoLabel: { fontSize: 13, fontWeight: "800", color: MUTED_COLOR },
//   infoValue: {
//     flex: 1,
//     textAlign: "right",
//     fontSize: 13,
//     fontWeight: "900",
//     color: TEXT_COLOR,
//   },
//   highlightText: { color: CUSTOMER_COLOR },

//   cancelInfoBox: {
//     marginTop: 12,
//     padding: 12,
//     borderRadius: 16,
//     backgroundColor: "#FEF2F2",
//     flexDirection: "row",
//     gap: 8,
//   },
//   cancelInfoTitle: {
//     fontSize: 13,
//     fontWeight: "900",
//     color: "#DC2626",
//   },
//   cancelInfoText: {
//     marginTop: 3,
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#7F1D1D",
//   },
//   cancelOrderBtn: {
//     marginTop: 14,
//     height: 44,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: "#DC2626",
//     backgroundColor: "#FEF2F2",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 7,
//   },
//   cancelOrderText: {
//     color: "#DC2626",
//     fontSize: 13,
//     fontWeight: "900",
//   },

//   addressName: {
//     fontSize: 15,
//     fontWeight: "900",
//     color: TEXT_COLOR,
//     marginBottom: 6,
//   },
//   addressText: {
//     fontSize: 13,
//     fontWeight: "700",
//     color: MUTED_COLOR,
//     marginBottom: 5,
//   },

//   emptyText: { fontSize: 13, fontWeight: "700", color: MUTED_COLOR },

//   productCard: {
//     flexDirection: "row",
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   productImage: {
//     width: 78,
//     height: 86,
//     borderRadius: 16,
//     backgroundColor: "#FFF4F8",
//     marginRight: 12,
//   },
//   productContent: { flex: 1 },
//   productName: { fontSize: 15, fontWeight: "900", color: TEXT_COLOR },
//   productSeller: {
//     marginTop: 4,
//     fontSize: 12,
//     fontWeight: "700",
//     color: MUTED_COLOR,
//   },
//   productMetaRow: {
//     marginTop: 7,
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   productQty: { fontSize: 12, fontWeight: "900", color: CUSTOMER_COLOR },
//   productPrice: { fontSize: 14, fontWeight: "900", color: CUSTOMER_COLOR },

//   actionRow: {
//     marginTop: 12,
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//   },
//   outlineBtn: {
//     height: 36,
//     paddingHorizontal: 14,
//     borderRadius: 18,
//     borderWidth: 1,
//     borderColor: CUSTOMER_COLOR,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 5,
//   },
//   outlineBtnText: {
//     color: CUSTOMER_COLOR,
//     fontSize: 12,
//     fontWeight: "900",
//   },
//   filledBtn: {
//     height: 36,
//     paddingHorizontal: 14,
//     borderRadius: 18,
//     backgroundColor: CUSTOMER_COLOR,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 5,
//   },
//   filledBtnText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },

//   returnStatusBox: {
//     flex: 1,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     borderRadius: 14,
//     backgroundColor: "#FEF3C7",
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   returnStatusText: {
//     color: "#B45309",
//     fontSize: 11,
//     fontWeight: "900",
//   },
//   refundSmallText: {
//     marginTop: 2,
//     color: "#6B7280",
//     fontSize: 10.5,
//     fontWeight: "800",
//   },

//   reviewPreview: {
//     flex: 1,
//     backgroundColor: "#FFF7ED",
//     padding: 8,
//     borderRadius: 12,
//   },
//   reviewStars: { color: "#F59E0B", fontSize: 13, fontWeight: "900" },
//   reviewPreviewText: {
//     marginTop: 3,
//     color: TEXT_COLOR,
//     fontSize: 12,
//     fontWeight: "700",
//   },
//   reviewPreviewImage: {
//     width: 54,
//     height: 54,
//     borderRadius: 12,
//     marginRight: 7,
//     backgroundColor: "#F3F4F6",
//   },
//   cancelledProductBox: {
//     marginTop: 12,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     borderRadius: 14,
//     backgroundColor: "#FEF2F2",
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   cancelledProductText: {
//     flex: 1,
//     color: "#DC2626",
//     fontSize: 12,
//     fontWeight: "900",
//   },

//   trackRow: { flexDirection: "row" },
//   trackLeft: { width: 32, alignItems: "center" },
//   trackDot: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: "#E5E7EB",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   activeTrackDot: { backgroundColor: CUSTOMER_COLOR },
//   cancelTrackDot: { backgroundColor: "#DC2626" },
//   trackLine: {
//     width: 3,
//     flex: 1,
//     minHeight: 42,
//     backgroundColor: "#E5E7EB",
//   },
//   activeTrackLine: { backgroundColor: CUSTOMER_COLOR },
//   trackContent: { flex: 1, paddingBottom: 20 },
//   trackTitle: { fontSize: 14, fontWeight: "900", color: MUTED_COLOR },
//   activeTrackTitle: { color: TEXT_COLOR },
//   cancelTrackTitle: { color: "#DC2626" },
//   trackSubtitle: {
//     marginTop: 3,
//     fontSize: 12,
//     fontWeight: "700",
//     color: MUTED_COLOR,
//   },

//   ordersBtn: {
//     marginTop: 18,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: CUSTOMER_COLOR,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   ordersBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "900" },

//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.45)",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 18,
//   },
//   modalCard: {
//     width: "100%",
//     maxWidth: 460,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 24,
//     padding: 18,
//   },
//   modalTitle: { fontSize: 20, fontWeight: "900", color: TEXT_COLOR },
//   modalSub: {
//     marginTop: 6,
//     fontSize: 13,
//     fontWeight: "700",
//     color: MUTED_COLOR,
//     lineHeight: 19,
//   },
//   textArea: {
//     minHeight: 110,
//     marginTop: 16,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 16,
//     padding: 12,
//     textAlignVertical: "top",
//     fontSize: 14,
//     fontWeight: "700",
//     color: TEXT_COLOR,
//   },
//   errorText: {
//     marginTop: 8,
//     color: "#EF4444",
//     fontSize: 12,
//     fontWeight: "900",
//   },
//   modalActions: {
//     marginTop: 16,
//     flexDirection: "row",
//     gap: 10,
//   },
//   cancelBtn: {
//     flex: 1,
//     height: 46,
//     borderRadius: 16,
//     backgroundColor: "#F3F4F6",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   cancelText: { color: TEXT_COLOR, fontSize: 14, fontWeight: "900" },
//   submitBtn: {
//     flex: 1,
//     height: 46,
//     borderRadius: 16,
//     backgroundColor: CUSTOMER_COLOR,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   deleteSubmitBtn: {
//     flex: 1,
//     height: 46,
//     borderRadius: 16,
//     backgroundColor: "#DC2626",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   submitText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900" },

//   starRow: {
//     marginTop: 16,
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: 8,
//   },
//   imagePickerBtn: {
//     marginTop: 12,
//     height: 44,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: CUSTOMER_COLOR,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     gap: 8,
//   },
//   imagePickerText: {
//     color: CUSTOMER_COLOR,
//     fontSize: 13,
//     fontWeight: "900",
//   },
//   reviewImageBox: {
//     marginTop: 12,
//     marginRight: 8,
//     position: "relative",
//   },
//   reviewImage: {
//     width: 68,
//     height: 68,
//     borderRadius: 14,
//     backgroundColor: "#F3F4F6",
//   },
//   removeImageBtn: {
//     position: "absolute",
//     top: -6,
//     right: -6,
//     width: 22,
//     height: 22,
//     borderRadius: 11,
//     backgroundColor: "#EF4444",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1.5,
//     borderColor: "#FFFFFF",
//   },
// });


































// screens/customer/OrderDetailScreen.js

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { COLORS } from "../../constants/colors";
import { useShop } from "../../context/ShopContext";

const placeholder = require("../../../assets/images/placeholder.png");

const CUSTOMER_COLOR = COLORS?.customer || "#E83E7C";
const TEXT_COLOR = COLORS?.text || "#111827";
const MUTED_COLOR = COLORS?.muted || "#6B7280";

const getImageSource = (image) => {
  if (!image) return placeholder;
  if (typeof image === "string") return { uri: image };
  return image;
};

const getProductImage = (item) =>
  item?.image ||
  item?.coverImage ||
  item?.thumbnail ||
  item?.images?.[0] ||
  item?.productImages?.[0];

const getProductKey = (item, index) =>
  String(item?.id || item?.productId || item?.name || index);

const getPriceText = (price) => {
  if (String(price || "").includes("₹")) return String(price);
  return `₹${price || 0}`;
};

export default function OrderDetailScreen({ navigation, route }) {
  const {
    orders = [],
    returnRequests = [],
    customerNotifications: notifications = [],
    createReturnRequest = () => {},
    addProductReview = () => {},
    formatPrice = (n) => `₹${n || 0}`,
    cleanPrice = (n) => Number(String(n || "0").replace(/[₹,\s]/g, "")) || 0,
  } = useShop();

  const routeOrder = route?.params?.order || {};
  const liveOrder =
    orders.find((o) => String(o.id) === String(routeOrder.id)) || routeOrder;

  const products = liveOrder?.products || liveOrder?.items || [];
  const status = liveOrder?.status || "Processing";

  const [localStatus, setLocalStatus] = useState(status);
  const [localReviews, setLocalReviews] = useState({});
  const [localReturns, setLocalReturns] = useState({});
  const [localCancelData, setLocalCancelData] = useState(null);

  const [returnModalVisible, setReturnModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);

  const [returnReason, setReturnReason] = useState("");
  const [returnError, setReturnError] = useState("");

  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState("");

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewImages, setReviewImages] = useState([]);
  const [reviewError, setReviewError] = useState("");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const orderTotal = useMemo(() => {
    if (liveOrder?.price) return liveOrder.price;
    if (liveOrder?.totalAmount) return formatPrice(liveOrder.totalAmount);

    const total = products.reduce((sum, item) => {
      const qty = Number(item?.qty || item?.quantity || 1);
      const price = cleanPrice(item?.finalPrice || item?.price);
      return sum + price * qty;
    }, 0);

    return formatPrice(total);
  }, [liveOrder, products, formatPrice, cleanPrice]);

  const openNotifications = () => {
    navigation.navigate("CustomerNotifications");
  };

  const getReturnData = (item, index) => {
    const productKey = getProductKey(item, index);

    return (
      localReturns[productKey] ||
      liveOrder?.returns?.[productKey] ||
      returnRequests.find(
        (r) =>
          String(r.orderId) === String(liveOrder.id) &&
          String(r.productId || r.product) ===
            String(item?.id || item?.productId || item?.name)
      )
    );
  };

  const getReviewData = (item, index) => {
    const productKey = getProductKey(item, index);

    return (
      localReviews[productKey] ||
      liveOrder?.reviews?.[productKey] ||
      item?.customerReview ||
      item?.review ||
      null
    );
  };

  const openReturnModal = (item, index) => {
    setSelectedProduct(item);
    setSelectedProductIndex(index);
    setReturnReason("");
    setReturnError("");
    setReturnModalVisible(true);
  };

  const submitReturn = () => {
    if (!returnReason.trim()) {
      setReturnError("Please enter return reason.");
      return;
    }

    if (!selectedProduct || !liveOrder?.id) return;

    const productKey = getProductKey(selectedProduct, selectedProductIndex);
    const productName = selectedProduct?.name || selectedProduct?.title || "Product";
    const productPrice = selectedProduct?.finalPrice || selectedProduct?.price || "₹0";

    const returnData = {
      orderId: liveOrder.id,
      customer:
        liveOrder.customer || liveOrder.customerName || liveOrder.address?.name,
      customerEmail: liveOrder.customerEmail,
      sellerId: selectedProduct?.sellerId || liveOrder.sellerId,
      product: productName,
      productId: selectedProduct?.id || selectedProduct?.productId || productName,
      price: productPrice,
      reason: returnReason.trim(),
      status: "Return Requested",
      refundCredited: false,
      paymentMethod: liveOrder.paymentMethod,
      razorpayOrderId: liveOrder.razorpayOrderId,
      razorpayPaymentId: liveOrder.razorpayPaymentId,
      image: getProductImage(selectedProduct),
      productImage: getProductImage(selectedProduct),
    };

    createReturnRequest(returnData);

    setLocalReturns((prev) => ({
      ...prev,
      [productKey]: returnData,
    }));

    setReturnModalVisible(false);
    setReturnReason("");
    setReturnError("");
  };

  const openReviewModal = (item, index) => {
    setSelectedProduct(item);
    setSelectedProductIndex(index);
    setRating(0);
    setReviewText("");
    setReviewImages([]);
    setReviewError("");
    setReviewModalVisible(true);
  };

  const pickReviewImages = async () => {
    const { status: permission } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission !== "granted") {
      setReviewError("Gallery permission is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.75,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setReviewImages((prev) => [
        ...prev,
        ...result.assets.map((asset) => asset.uri),
      ]);
      setReviewError("");
    }
  };

  const removeReviewImage = (indexToRemove) => {
    setReviewImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const submitReview = async () => {
    if (rating === 0) {
      setReviewError("Please select rating.");
      return;
    }

    if (!reviewText.trim()) {
      setReviewError("Please write your review.");
      return;
    }

    if (!selectedProduct || !liveOrder?.id) return;

    const productKey = getProductKey(selectedProduct, selectedProductIndex);
    const productName = selectedProduct?.name || selectedProduct?.title || "Product";
    const productId =
      selectedProduct?.id ||
      selectedProduct?.productId ||
      selectedProduct?.originalId ||
      productName;

    const reviewData = {
      orderId: liveOrder.id,
      productId,
      product: productName,
      customer:
        liveOrder.customer || liveOrder.customerName || liveOrder.address?.name,
      rating,
      comment: reviewText.trim(),
      text: reviewText.trim(),
      images: reviewImages,
      createdAt: "Just now",
      createdOn: "Just now",
    };

    try {
      const savedReview = await addProductReview(reviewData);

      setLocalReviews((prev) => ({
        ...prev,
        [productKey]: savedReview || reviewData,
      }));

      setReviewModalVisible(false);
      setRating(0);
      setReviewText("");
      setReviewImages([]);
      setReviewError("");
    } catch (error) {
      setReviewError(error?.message || "Unable to submit review.");
    }
  };

  const openCancelModal = () => {
    setCancelReason("");
    setCancelError("");
    setCancelModalVisible(true);
  };

  const submitCancelOrder = () => {
    if (!cancelReason.trim()) {
      setCancelError("Please enter cancellation reason.");
      return;
    }

    const cancelData = {
      orderId: liveOrder?.id,
      reason: cancelReason.trim(),
      status: "Cancellation Requested",
      requestedAt: "Just now",
    };

    setLocalCancelData(cancelData);
    setLocalStatus("Cancelled");
    setCancelModalVisible(false);
    setCancelReason("");
    setCancelError("");
  };

  const displayStatus = localStatus || status;
  const displayDelivered = displayStatus === "Delivered";
  const displayCancelled = displayStatus === "Cancelled";

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

          <Text style={styles.headerTitle}>Order Details</Text>

          <TouchableOpacity
            style={styles.headerIconBtn}
            activeOpacity={0.85}
            onPress={openNotifications}
          >
            <Ionicons name="notifications-outline" size={23} color="#FFFFFF" />
            {unreadCount > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <View style={styles.successCard}>
            <View
              style={[
                styles.successIcon,
                displayCancelled && styles.cancelIconBg,
              ]}
            >
              <Ionicons
                name={
                  displayCancelled
                    ? "close-circle"
                    : displayDelivered
                    ? "checkmark-circle"
                    : "cube-outline"
                }
                size={46}
                color={
                  displayCancelled
                    ? "#DC2626"
                    : displayDelivered
                    ? "#16A34A"
                    : CUSTOMER_COLOR
                }
              />
            </View>

            <Text style={styles.successTitle}>
              {displayCancelled
                ? "Order Cancelled"
                : displayDelivered
                ? "Order Delivered"
                : "Order Status"}
            </Text>

            <Text style={styles.successText}>
              Your order is currently {String(displayStatus).toLowerCase()}.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Order Summary</Text>
            <InfoRow label="Order ID" value={liveOrder?.id || "Not available"} />
            <InfoRow label="Status" value={displayStatus} highlight />
            <InfoRow label="Date" value={liveOrder?.date || "Not available"} />
            <InfoRow label="Payment" value={liveOrder?.payment || "Not available"} />
            <InfoRow label="Total Amount" value={orderTotal} highlight />

            {localCancelData ? (
              <View style={styles.cancelInfoBox}>
                <Ionicons name="alert-circle-outline" size={19} color="#DC2626" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cancelInfoTitle}>
                    Cancellation Requested
                  </Text>
                  <Text style={styles.cancelInfoText}>
                    Reason: {localCancelData.reason}
                  </Text>
                </View>
              </View>
            ) : null}

            {!displayDelivered && !displayCancelled ? (
              <TouchableOpacity
                style={styles.cancelOrderBtn}
                activeOpacity={0.85}
                onPress={openCancelModal}
              >
                <Ionicons name="close-circle-outline" size={18} color="#DC2626" />
                <Text style={styles.cancelOrderText}>Cancel Order</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {liveOrder?.address ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Delivery Address</Text>
              <Text style={styles.addressName}>
                {liveOrder.address.name || "Not available"}
              </Text>
              <Text style={styles.addressText}>{liveOrder.address.line1 || ""}</Text>
              {liveOrder.address.line2 ? (
                <Text style={styles.addressText}>{liveOrder.address.line2}</Text>
              ) : null}
              <Text style={styles.addressText}>
                {[
                  liveOrder.address.city,
                  liveOrder.address.state,
                  liveOrder.address.pincode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </Text>
            </View>
          ) : null}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ordered Products</Text>

            {products.length === 0 ? (
              <Text style={styles.emptyText}>No ordered products found.</Text>
            ) : (
              products.map((item, index) => {
                const productKey = getProductKey(item, index);
                const qty = item?.qty || item?.quantity || 1;
                const returnData = getReturnData(item, index);
                const reviewData = getReviewData(item, index);
                const refundText =
                  returnData?.refundAmountText ||
                  returnData?.price ||
                  getPriceText(item?.finalPrice || item?.price);

                return (
                  <View key={productKey} style={styles.productCard}>
                    <Image
                      source={getImageSource(getProductImage(item))}
                      defaultSource={
                        Platform.OS === "android" ? placeholder : undefined
                      }
                      style={styles.productImage}
                      resizeMode="cover"
                    />

                    <View style={styles.productContent}>
                      <Text style={styles.productName} numberOfLines={2}>
                        {item?.name || item?.title || "Product"}
                      </Text>

                      <Text style={styles.productSeller} numberOfLines={1}>
                        {item?.seller ||
                          item?.sellerName ||
                          item?.sellerId ||
                          "Seller"}
                      </Text>

                      <View style={styles.productMetaRow}>
                        <Text style={styles.productQty}>Qty: {qty}</Text>
                        <Text style={styles.productPrice}>
                          {getPriceText(item?.finalPrice || item?.price)}
                        </Text>
                      </View>

                      {displayDelivered && (
                        <View style={styles.actionRow}>
                          {!returnData ? (
                            <TouchableOpacity
                              style={styles.outlineBtn}
                              onPress={() => openReturnModal(item, index)}
                            >
                              <Ionicons
                                name="return-up-back-outline"
                                size={16}
                                color={CUSTOMER_COLOR}
                              />
                              <Text style={styles.outlineBtnText}>Return</Text>
                            </TouchableOpacity>
                          ) : (
                            <View style={styles.returnStatusBox}>
                              <Ionicons
                                name={
                                  returnData.refundCredited
                                    ? "wallet"
                                    : "time-outline"
                                }
                                size={15}
                                color={
                                  returnData.refundCredited
                                    ? "#15803D"
                                    : "#B45309"
                                }
                              />
                              <View style={{ flex: 1 }}>
                                <Text
                                  style={[
                                    styles.returnStatusText,
                                    returnData.refundCredited && {
                                      color: "#15803D",
                                    },
                                  ]}
                                >
                                  {returnData.status || "Return Requested"}
                                </Text>
                                <Text style={styles.refundSmallText}>
                                  {returnData.refundCredited
                                    ? `Refund credited: ${refundText}`
                                    : `Refund pending: ${refundText}`}
                                </Text>
                              </View>
                            </View>
                          )}

                          {!reviewData ? (
                            <TouchableOpacity
                              style={styles.filledBtn}
                              onPress={() => openReviewModal(item, index)}
                            >
                              <Ionicons
                                name="star-outline"
                                size={16}
                                color="#FFFFFF"
                              />
                              <Text style={styles.filledBtnText}>Review</Text>
                            </TouchableOpacity>
                          ) : (
                            <View style={styles.reviewPreview}>
                              <Text style={styles.reviewStars}>
                                {"★".repeat(Number(reviewData.rating || 0))}
                              </Text>
                              <Text style={styles.reviewPreviewText}>
                                {reviewData.text ||
                                  reviewData.comment ||
                                  "Review submitted"}
                              </Text>

                              {reviewData.images?.length > 0 ? (
                                <ScrollView
                                  horizontal
                                  showsHorizontalScrollIndicator={false}
                                  style={{ marginTop: 8 }}
                                >
                                  {reviewData.images.map((uri, imgIndex) => (
                                    <Image
                                      key={`${uri}-${imgIndex}`}
                                      source={{ uri }}
                                      style={styles.reviewPreviewImage}
                                    />
                                  ))}
                                </ScrollView>
                              ) : null}
                            </View>
                          )}

                          <TouchableOpacity
                            style={styles.complaintBtn}
                            onPress={() =>
                              navigation.navigate("CustomerComplaintScreen", {
                                orderId: liveOrder?.id,
                                sellerId:
                                  item?.sellerId ||
                                  item?.seller_id ||
                                  item?.seller ||
                                  "",
                                product: {
                                  id: item?.id,
                                  productId: item?.productId,
                                  name: item?.name || item?.title,
                                  title: item?.title || item?.name,
                                  image: getProductImage(item),
                                  seller:
                                    item?.seller ||
                                    item?.sellerName ||
                                    item?.sellerId ||
                                    "Seller",
                                  sellerId:
                                    item?.sellerId ||
                                    item?.seller_id ||
                                    "",
                                  price: item?.price || item?.finalPrice,
                                },
                                orderStatus: displayStatus,
                              })
                            }
                          >
                            <Ionicons
                              name="warning-outline"
                              size={16}
                              color="#FFFFFF"
                            />
                            <Text style={styles.complaintBtnText}>Complaint</Text>
                          </TouchableOpacity>
                        </View>
                      )}

                      {displayCancelled ? (
                        <View style={styles.cancelledProductBox}>
                          <Ionicons
                            name="close-circle-outline"
                            size={16}
                            color="#DC2626"
                          />
                          <Text style={styles.cancelledProductText}>
                            This order has been cancelled.
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                );
              })
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Tracking</Text>

            <TrackStep
              title="Order Placed"
              subtitle="Your order has been confirmed"
              active
            />

            <TrackStep
              title="Processing"
              subtitle="Seller is preparing your order"
              active={["Processing", "Shipped", "Delivered"].includes(
                displayStatus
              )}
            />

            <TrackStep
              title="Shipped"
              subtitle="Order is on the way"
              active={["Shipped", "Delivered"].includes(displayStatus)}
            />

            <TrackStep
              title={displayCancelled ? "Cancelled" : "Delivered"}
              subtitle={
                displayCancelled
                  ? "Order cancelled by customer"
                  : "Order delivered successfully"
              }
              active={displayStatus === "Delivered" || displayStatus === "Cancelled"}
              cancelled={displayCancelled}
              last
            />
          </View>

          <TouchableOpacity
            style={styles.ordersBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("MyOrders")}
          >
            <Text style={styles.ordersBtnText}>Back to My Orders</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>

        <Modal visible={cancelModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Cancel Order</Text>
              <Text style={styles.modalSub}>
                Please tell us why you want to cancel this order.
              </Text>

              <TextInput
                style={styles.textArea}
                placeholder="Enter cancellation reason..."
                placeholderTextColor="#9CA3AF"
                multiline
                value={cancelReason}
                onChangeText={(text) => {
                  setCancelReason(text);
                  setCancelError("");
                }}
              />

              {cancelError ? <Text style={styles.errorText}>{cancelError}</Text> : null}

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setCancelModalVisible(false)}
                >
                  <Text style={styles.cancelText}>Close</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteSubmitBtn}
                  onPress={submitCancelOrder}
                >
                  <Text style={styles.submitText}>Cancel Order</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={returnModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Return Product</Text>
              <Text style={styles.modalSub}>
                Tell the seller why you want to return this product.
              </Text>

              <TextInput
                style={styles.textArea}
                placeholder="Enter return reason..."
                placeholderTextColor="#9CA3AF"
                multiline
                value={returnReason}
                onChangeText={(text) => {
                  setReturnReason(text);
                  setReturnError("");
                }}
              />

              {returnError ? <Text style={styles.errorText}>{returnError}</Text> : null}

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setReturnModalVisible(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitBtn} onPress={submitReturn}>
                  <Text style={styles.submitText}>Send to Seller</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={reviewModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Write Review</Text>
              <Text style={styles.modalSub}>
                Add rating, review text, and product photos.
              </Text>

              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <TouchableOpacity key={num} onPress={() => setRating(num)}>
                    <Ionicons
                      name={num <= rating ? "star" : "star-outline"}
                      size={34}
                      color="#F59E0B"
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.textArea}
                placeholder="Write your product review..."
                placeholderTextColor="#9CA3AF"
                multiline
                value={reviewText}
                onChangeText={(text) => {
                  setReviewText(text);
                  setReviewError("");
                }}
              />

              <TouchableOpacity
                style={styles.imagePickerBtn}
                onPress={pickReviewImages}
              >
                <Ionicons name="image-outline" size={18} color={CUSTOMER_COLOR} />
                <Text style={styles.imagePickerText}>Add Review Images</Text>
              </TouchableOpacity>

              {reviewImages.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {reviewImages.map((uri, index) => (
                    <View key={`${uri}-${index}`} style={styles.reviewImageBox}>
                      <Image source={{ uri }} style={styles.reviewImage} />
                      <TouchableOpacity
                        style={styles.removeImageBtn}
                        onPress={() => removeReviewImage(index)}
                      >
                        <Ionicons name="close" size={13} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}

              {reviewError ? <Text style={styles.errorText}>{reviewError}</Text> : null}

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setReviewModalVisible(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitBtn} onPress={submitReview}>
                  <Text style={styles.submitText}>Submit Review</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

function InfoRow({ label, value, highlight }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, highlight && styles.highlightText]}>
        {value}
      </Text>
    </View>
  );
}

function TrackStep({ title, subtitle, active, last, cancelled }) {
  return (
    <View style={styles.trackRow}>
      <View style={styles.trackLeft}>
        <View
          style={[
            styles.trackDot,
            active && styles.activeTrackDot,
            cancelled && styles.cancelTrackDot,
          ]}
        >
          {active ? (
            <Ionicons
              name={cancelled ? "close" : "checkmark"}
              size={13}
              color="#FFFFFF"
            />
          ) : null}
        </View>

        {!last && (
          <View style={[styles.trackLine, active && styles.activeTrackLine]} />
        )}
      </View>

      <View style={styles.trackContent}>
        <Text
          style={[
            styles.trackTitle,
            active && styles.activeTrackTitle,
            cancelled && styles.cancelTrackTitle,
          ]}
        >
          {title}
        </Text>
        <Text style={styles.trackSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: CUSTOMER_COLOR },
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    height: Platform.OS === "web" ? 64 : 58,
    backgroundColor: CUSTOMER_COLOR,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    elevation: 4,
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
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    paddingHorizontal: 4,
  },
  headerBadgeText: { color: "#FFFFFF", fontSize: 9, fontWeight: "900" },

  scroll: { padding: 16, paddingBottom: 20 },

  successCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  successIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelIconBg: { backgroundColor: "#FEE2E2" },
  successTitle: {
    marginTop: 14,
    fontSize: 21,
    fontWeight: "900",
    color: TEXT_COLOR,
    textAlign: "center",
  },
  successText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "700",
    color: MUTED_COLOR,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginTop: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: TEXT_COLOR,
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 12,
  },
  infoLabel: { fontSize: 13, fontWeight: "800", color: MUTED_COLOR },
  infoValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 13,
    fontWeight: "900",
    color: TEXT_COLOR,
  },
  highlightText: { color: CUSTOMER_COLOR },

  cancelInfoBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#FEF2F2",
    flexDirection: "row",
    gap: 8,
  },
  cancelInfoTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#DC2626",
  },
  cancelInfoText: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "700",
    color: "#7F1D1D",
  },
  cancelOrderBtn: {
    marginTop: 14,
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  cancelOrderText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "900",
  },

  addressName: {
    fontSize: 15,
    fontWeight: "900",
    color: TEXT_COLOR,
    marginBottom: 6,
  },
  addressText: {
    fontSize: 13,
    fontWeight: "700",
    color: MUTED_COLOR,
    marginBottom: 5,
  },

  emptyText: { fontSize: 13, fontWeight: "700", color: MUTED_COLOR },

  productCard: {
    flexDirection: "row",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  productImage: {
    width: 78,
    height: 86,
    borderRadius: 16,
    backgroundColor: "#FFF4F8",
    marginRight: 12,
  },
  productContent: { flex: 1 },
  productName: { fontSize: 15, fontWeight: "900", color: TEXT_COLOR },
  productSeller: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: MUTED_COLOR,
  },
  productMetaRow: {
    marginTop: 7,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productQty: { fontSize: 12, fontWeight: "900", color: CUSTOMER_COLOR },
  productPrice: { fontSize: 14, fontWeight: "900", color: CUSTOMER_COLOR },

  actionRow: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  outlineBtn: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: CUSTOMER_COLOR,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  outlineBtnText: {
    color: CUSTOMER_COLOR,
    fontSize: 12,
    fontWeight: "900",
  },
  filledBtn: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: CUSTOMER_COLOR,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  filledBtnText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },

  complaintBtn: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: "#DC2626",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  complaintBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  returnStatusBox: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "#FEF3C7",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  returnStatusText: {
    color: "#B45309",
    fontSize: 11,
    fontWeight: "900",
  },
  refundSmallText: {
    marginTop: 2,
    color: "#6B7280",
    fontSize: 10.5,
    fontWeight: "800",
  },

  reviewPreview: {
    width: "100%",
    backgroundColor: "#FFF7ED",
    padding: 8,
    borderRadius: 12,
  },
  reviewStars: { color: "#F59E0B", fontSize: 13, fontWeight: "900" },
  reviewPreviewText: {
    marginTop: 3,
    color: TEXT_COLOR,
    fontSize: 12,
    fontWeight: "700",
  },
  reviewPreviewImage: {
    width: 54,
    height: 54,
    borderRadius: 12,
    marginRight: 7,
    backgroundColor: "#F3F4F6",
  },
  cancelledProductBox: {
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "#FEF2F2",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cancelledProductText: {
    flex: 1,
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "900",
  },

  trackRow: { flexDirection: "row" },
  trackLeft: { width: 32, alignItems: "center" },
  trackDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  activeTrackDot: { backgroundColor: CUSTOMER_COLOR },
  cancelTrackDot: { backgroundColor: "#DC2626" },
  trackLine: {
    width: 3,
    flex: 1,
    minHeight: 42,
    backgroundColor: "#E5E7EB",
  },
  activeTrackLine: { backgroundColor: CUSTOMER_COLOR },
  trackContent: { flex: 1, paddingBottom: 20 },
  trackTitle: { fontSize: 14, fontWeight: "900", color: MUTED_COLOR },
  activeTrackTitle: { color: TEXT_COLOR },
  cancelTrackTitle: { color: "#DC2626" },
  trackSubtitle: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "700",
    color: MUTED_COLOR,
  },

  ordersBtn: {
    marginTop: 18,
    height: 50,
    borderRadius: 25,
    backgroundColor: CUSTOMER_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  ordersBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "900" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  modalCard: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
  },
  modalTitle: { fontSize: 20, fontWeight: "900", color: TEXT_COLOR },
  modalSub: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "700",
    color: MUTED_COLOR,
    lineHeight: 19,
  },
  textArea: {
    minHeight: 110,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 12,
    textAlignVertical: "top",
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_COLOR,
  },
  errorText: {
    marginTop: 8,
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "900",
  },
  modalActions: {
    marginTop: 16,
    flexDirection: "row",
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: { color: TEXT_COLOR, fontSize: 14, fontWeight: "900" },
  submitBtn: {
    flex: 1,
    height: 46,
    borderRadius: 16,
    backgroundColor: CUSTOMER_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteSubmitBtn: {
    flex: 1,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900" },

  starRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  imagePickerBtn: {
    marginTop: 12,
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CUSTOMER_COLOR,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  imagePickerText: {
    color: CUSTOMER_COLOR,
    fontSize: 13,
    fontWeight: "900",
  },
  reviewImageBox: {
    marginTop: 12,
    marginRight: 8,
    position: "relative",
  },
  reviewImage: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
  },
  removeImageBtn: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
});
