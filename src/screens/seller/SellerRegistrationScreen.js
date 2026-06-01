

// // src/screens/seller/SellerRegistrationScreen.js
// // ✅ FIXED:
// //  - Login button in header after successful registration
// //  - Navigates to RoleSelectionScreen on login button click
// //  - Calls registerSeller() from ShopContext on submit
// //  - 10-second loading spinner on final submit
// //  - Admin gets notification automatically via ShopContext
// //  - After submit, shows success alert with option to proceed

// import React, { useState } from "react";
// import {
//   View, Text, TextInput, TouchableOpacity, ScrollView,
//   StyleSheet, Alert, Image, ActivityIndicator, StatusBar, Platform,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import * as ImagePicker from "expo-image-picker";
// import { useShop } from "../../context/ShopContext";

// const C = {
//   primary: "#0e3243",
//   primaryDark: "#0e3243",
//   white: "#FFFFFF",
//   bg: "#FFFFFF",
//   card: "#FFFFFF",
//   border: "#F1D5E1",
//   text: "#171827",
//   muted: "#6B7280",
//   hint: "#A1A1AA",
//   success: "#16A34A",
//   successBg: "#ECFDF5",
//   danger: "#EF4444",
// };

// const businessTypes = [
//   "Handmade Products", "Artisan Crafts", "Textile & Fabric",
//   "Pottery & Ceramics", "Jewellery", "Paintings & Art",
//   "Woodcraft", "Leather Goods", "Candles & Soaps", "Electronics",
//   "Fashion", "Home & Kitchen", "Beauty & Health", "Sports", "Other",
// ];

// const indianStates = [
//   "Andhra Pradesh", "Telangana", "Tamil Nadu", "Kerala", "Karnataka",
//   "Maharashtra", "Delhi", "Goa", "Gujarat", "Rajasthan", "Punjab",
//   "Uttar Pradesh", "West Bengal", "Odisha", "Madhya Pradesh", "Bihar", "Assam",
// ];

// function PrimaryButton({ title, onPress, loading }) {
//   return (
//     <TouchableOpacity
//       activeOpacity={0.85}
//       onPress={onPress}
//       disabled={loading}
//       style={styles.btnWrap}
//     >
//       <LinearGradient
//         colors={[C.primary, C.primaryDark]}
//         style={styles.btn}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//       >
//         {loading ? (
//           <View style={{ alignItems: "center" }}>
//             <ActivityIndicator color="#fff" />
//             <Text style={[styles.btnText, { marginTop: 6, fontSize: 12 }]}>
//               Submitting... Please wait
//             </Text>
//           </View>
//         ) : (
//           <Text style={styles.btnText}>{title}</Text>
//         )}
//       </LinearGradient>
//     </TouchableOpacity>
//   );
// }

// function Header({ title, onBack, showLoginBtn, onLoginPress, registrationComplete }) {
//   return (
//     <View style={styles.header}>
//       <TouchableOpacity onPress={onBack} style={styles.backBtn}>
//         <Text style={styles.backText}>‹</Text>
//       </TouchableOpacity>
//       <Text style={styles.headerTitle}>{title}</Text>
//       {registrationComplete && showLoginBtn ? (
//         <TouchableOpacity
//           onPress={onLoginPress}
//           style={styles.loginBtn}
//         >
//           <Text style={styles.loginBtnText}>Login</Text>
//         </TouchableOpacity>
//       ) : (
//         <View style={{ width: 42 }} />
//       )}
//     </View>
//   );
// }

// function Input({ label, value, onChangeText, placeholder, keyboardType, secureTextEntry, multiline, maxLength }) {
//   return (
//     <View style={styles.field}>
//       <Text style={styles.label}>{label}</Text>
//       <TextInput
//         value={value}
//         onChangeText={onChangeText}
//         placeholder={placeholder}
//         placeholderTextColor={C.hint}
//         keyboardType={keyboardType}
//         secureTextEntry={secureTextEntry}
//         multiline={multiline}
//         maxLength={maxLength}
//         style={[styles.input, multiline && styles.textArea]}
//       />
//     </View>
//   );
// }

// function Dropdown({ label, value, options, onSelect }) {
//   const [open, setOpen] = useState(false);
//   return (
//     <View style={[styles.field, { zIndex: open ? 1000 : 1 }]}>
//       <Text style={styles.label}>{label}</Text>
//       <TouchableOpacity
//         activeOpacity={0.8}
//         style={styles.dropdownBox}
//         onPress={() => setOpen(!open)}
//       >
//         <Text style={[styles.dropdownText, !value && { color: C.hint }]}>
//           {value || `Select ${label}`}
//         </Text>
//         <Text style={styles.arrow}>{open ? "▲" : "▼"}</Text>
//       </TouchableOpacity>
//       {open && (
//         <View style={styles.dropdownList}>
//           <ScrollView nestedScrollEnabled style={{ maxHeight: 190 }}>
//             {options.map((item) => (
//               <TouchableOpacity
//                 key={item}
//                 style={styles.dropdownItem}
//                 onPress={() => { onSelect(item); setOpen(false); }}
//               >
//                 <Text style={[styles.dropdownItemText, value === item && { color: C.primary, fontWeight: "900" }]}>
//                   {item}
//                 </Text>
//                 {value === item && <Text style={{ color: C.primary }}>✓</Text>}
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>
//       )}
//     </View>
//   );
// }

// function Steps({ step }) {
//   const items = ["Basic", "Business", "Docs", "Address", "Review"];
//   return (
//     <View style={styles.steps}>
//       {items.map((item, index) => {
//         const no = index + 1;
//         const active = no === step;
//         const done = no < step;
//         return (
//           <View key={item} style={styles.stepItem}>
//             <View style={[styles.stepCircle, active && styles.stepActive, done && styles.stepDone]}>
//               <Text style={styles.stepNo}>{done ? "✓" : no}</Text>
//             </View>
//             <Text style={[styles.stepLabel, active && { color: C.primary }, done && { color: C.success }]}>
//               {item}
//             </Text>
//           </View>
//         );
//       })}
//     </View>
//   );
// }

// async function pickFromGallery() {
//   const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//   if (!permission.granted) {
//     Alert.alert("Permission Needed", "Please allow gallery access.");
//     return null;
//   }
//   const result = await ImagePicker.launchImageLibraryAsync({
//     mediaTypes: ImagePicker.MediaTypeOptions.Images,
//     quality: 0.8,
//     allowsEditing: false,
//   });
//   if (result.canceled) return null;
//   return result.assets?.[0] || null;
// }

// function UploadCard({ title, file, onPick }) {
//   return (
//     <TouchableOpacity
//       activeOpacity={0.86}
//       style={[styles.uploadCard, file && styles.uploadDone]}
//       onPress={onPick}
//     >
//       {file?.uri ? (
//         <Image source={{ uri: file.uri }} style={styles.uploadImage} />
//       ) : (
//         <View style={styles.uploadIcon}>
//           <Text style={{ fontSize: 24 }}>📁</Text>
//         </View>
//       )}
//       <View style={{ flex: 1 }}>
//         <Text style={styles.uploadTitle}>{title}</Text>
//         <Text style={styles.uploadSub}>
//           {file ? "Uploaded successfully" : "Tap to choose from gallery"}
//         </Text>
//       </View>
//       <Text style={[styles.uploadStatus, file && { color: C.success }]}>
//         {file ? "Done" : "Upload"}
//       </Text>
//     </TouchableOpacity>
//   );
// }

// export default function SellerRegistrationScreen({ navigation }) {
//   // ✅ Get registerSeller from ShopContext
//   const { registerSeller } = useShop();

//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [registrationComplete, setRegistrationComplete] = useState(false);

//   const [personal, setPersonal] = useState({
//     fullName: "", email: "", phone: "", password: "", confirmPassword: "",
//   });

//   const [business, setBusiness] = useState({
//     shopName: "", businessType: "", gst: "", description: "",
//   });

//   const [docs, setDocs] = useState({
//     aadhar: null, pan: null, businessProof: null, bankDetails: null,
//   });

//   const [address, setAddress] = useState({
//     address1: "", address2: "", city: "", state: "", pin: "",
//   });

//   const updatePersonal = (k, v) => setPersonal({ ...personal, [k]: v });
//   const updateBusiness = (k, v) => setBusiness({ ...business, [k]: v });
//   const updateAddress = (k, v) => setAddress({ ...address, [k]: v });

//   const goBack = () => {
//     if (step > 1) setStep(step - 1);
//     else if (navigation?.canGoBack?.()) navigation.goBack();
//     else navigation.navigate("SellerOnboardingScreen");
//   };

//   // ✅ New: Handle login button press to go to RoleSelectionScreen
//   const handleLoginPress = () => {
//     navigation.reset({
//       index: 0,
//       routes: [{ name: "RoleSelectionScreen" }],
//     });
//   };

//   const validateStep = () => {
//     if (step === 1) {
//       if (!personal.fullName.trim()) return "Enter full name.";
//       if (!/\S+@\S+\.\S+/.test(personal.email)) return "Enter valid email.";
//       if (personal.phone.length < 10) return "Enter valid phone number.";
//       if (personal.password.length < 6) return "Password minimum 6 characters.";
//       if (personal.password !== personal.confirmPassword) return "Passwords do not match.";
//     }
//     if (step === 2) {
//       if (!business.shopName.trim()) return "Enter shop name.";
//       if (!business.businessType) return "Select business type.";
//     }
//     if (step === 3) {
//       if (!docs.aadhar) return "Upload Aadhar card.";
//       if (!docs.pan) return "Upload PAN card.";
//       if (!docs.businessProof) return "Upload business proof.";
//       if (!docs.bankDetails) return "Upload bank details.";
//     }
//     if (step === 4) {
//       if (!address.address1.trim()) return "Enter address.";
//       if (!address.city.trim()) return "Enter city.";
//       if (!address.state) return "Select state.";
//       if (address.pin.length !== 6) return "Enter valid 6-digit PIN code.";
//     }
//     return null;
//   };

//   const handleNext = () => {
//     const err = validateStep();
//     if (err) { Alert.alert("Required", err); return; }

//     if (step < 5) { setStep(step + 1); return; }

//     // ✅ Step 5 = Submit: 10-second loading, then registerSeller
//     setLoading(true);

//     setTimeout(() => {
//       try {
//         // ✅ Call ShopContext registerSeller — auto-notifies admin
//         registerSeller({
//           name: personal.fullName.trim(),
//           shopName: business.shopName.trim(),
//           email: personal.email.trim(),
//           phone: personal.phone.trim(),
//           category: business.businessType,
//           password: personal.password,
//           documents: [
//             docs.aadhar?.uri || null,
//             docs.pan?.uri || null,
//             docs.businessProof?.uri || null,
//             docs.bankDetails?.uri || null,
//           ].filter(Boolean),
//         });

//         setLoading(false);
//         // ✅ Mark registration as complete to show login button
//         setRegistrationComplete(true);

//         Alert.alert(
//           "Registration Submitted! 🎉",
//           "Your application has been sent to the admin for review.\n\nYou will be notified once your account is approved. This usually takes 1-2 business days.",
//           [
//             {
//               text: "OK",
//               onPress: () => {
//                 // User can now click the Login button in header to proceed
//               },
//             },
//           ]
//         );
//       } catch (error) {
//         setLoading(false);
//         Alert.alert("Error", "Registration failed. Please try again.");
//       }
//     }, 10000); // ✅ 10-second loading as required
//   };

//   const pickDoc = async (key) => {
//     const file = await pickFromGallery();
//     if (file) setDocs((prev) => ({ ...prev, [key]: file }));
//   };

//   return (
//     <View style={styles.root}>
//       <StatusBar barStyle="dark-content" backgroundColor={C.white} />
//       <Header
//         title="Seller Registration"
//         onBack={goBack}
//         showLoginBtn={true}
//         onLoginPress={handleLoginPress}
//         registrationComplete={registrationComplete}
//       />

//       <ScrollView
//         style={styles.container}
//         contentContainerStyle={styles.content}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//       >
//         {registrationComplete ? (
//           // ✅ After registration, show completion message with login prompt
//           <View style={styles.completionCard}>
//             <View style={styles.successIcon}>
//               <Text style={{ fontSize: 64 }}>✅</Text>
//             </View>
//             <Text style={styles.completionTitle}>Registration Submitted!</Text>
//             <Text style={styles.completionSubtitle}>
//               Your seller application has been successfully submitted for review.
//             </Text>
//             <View style={styles.completionDetails}>
//               <Text style={styles.detailText}>📧 Confirmation email sent to:</Text>
//               <Text style={styles.detailValue}>{personal.email}</Text>
//               <Text style={styles.detailText} style={{ marginTop: 14 }}>
//                 ⏳ Admin Review Time
//               </Text>
//               <Text style={styles.detailValue}>1-2 business days</Text>
//               <Text style={styles.detailText} style={{ marginTop: 14 }}>
//                 🔔 You will be notified
//               </Text>
//               <Text style={styles.detailValue}>
//                 via email and in-app notification
//               </Text>
//             </View>
//             <View style={styles.infoCard}>
//               <Text style={styles.infoTitle}>What Happens Next?</Text>
//               <Text style={styles.infoPoint}>
//                 • Your documents will be verified by our admin team
//               </Text>
//               <Text style={styles.infoPoint}>
//                 • We'll check your business details and compliance
//               </Text>
//               <Text style={styles.infoPoint}>
//                 • You'll receive an approval email with login instructions
//               </Text>
//               <Text style={styles.infoPoint}>
//                 • Start selling once your account is active!
//               </Text>
//             </View>
//             <TouchableOpacity
//               activeOpacity={0.85}
//               onPress={handleLoginPress}
//               style={styles.continueBtn}
//             >
//               <LinearGradient
//                 colors={[C.primary, C.primaryDark]}
//                 style={styles.continueBtnGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//               >
//                 <Text style={styles.continueBtnText}>Back to Role Selection</Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <>
//             <Steps step={step} />

//             {step === 1 && (
//               <View style={styles.card}>
//                 <Text style={styles.title}>Create Account</Text>
//                 <Text style={styles.subTitle}>Enter your personal details</Text>
//                 <Input label="Full Name" placeholder="Enter full name" value={personal.fullName} onChangeText={(v) => updatePersonal("fullName", v)} />
//                 <Input label="Email" placeholder="Enter email" keyboardType="email-address" value={personal.email} onChangeText={(v) => updatePersonal("email", v)} />
//                 <Input label="Phone Number" placeholder="Enter 10-digit phone" keyboardType="phone-pad" maxLength={10} value={personal.phone} onChangeText={(v) => updatePersonal("phone", v)} />
//                 <Input label="Password" placeholder="Enter password" secureTextEntry value={personal.password} onChangeText={(v) => updatePersonal("password", v)} />
//                 <Input label="Confirm Password" placeholder="Re-enter password" secureTextEntry value={personal.confirmPassword} onChangeText={(v) => updatePersonal("confirmPassword", v)} />
//               </View>
//             )}

//             {step === 2 && (
//               <View style={styles.card}>
//                 <Text style={styles.title}>Business Details</Text>
//                 <Text style={styles.subTitle}>Setup your seller shop</Text>
//                 <Input label="Shop Name" placeholder="Enter shop name" value={business.shopName} onChangeText={(v) => updateBusiness("shopName", v)} />
//                 <Dropdown label="Business Type" value={business.businessType} options={businessTypes} onSelect={(v) => updateBusiness("businessType", v)} />
//                 <Input label="GST Number (Optional)" placeholder="Enter GST number" value={business.gst} onChangeText={(v) => updateBusiness("gst", v)} />
//                 <Input label="Business Description" placeholder="Describe your business" multiline value={business.description} onChangeText={(v) => updateBusiness("description", v)} />
//               </View>
//             )}

//             {step === 3 && (
//               <View style={styles.card}>
//                 <Text style={styles.title}>Upload Documents</Text>
//                 <Text style={styles.subTitle}>Choose images from gallery</Text>
//                 <UploadCard title="Aadhar Card" file={docs.aadhar} onPick={() => pickDoc("aadhar")} />
//                 <UploadCard title="PAN Card" file={docs.pan} onPick={() => pickDoc("pan")} />
//                 <UploadCard title="Business Proof" file={docs.businessProof} onPick={() => pickDoc("businessProof")} />
//                 <UploadCard title="Bank Details" file={docs.bankDetails} onPick={() => pickDoc("bankDetails")} />
//               </View>
//             )}

//             {step === 4 && (
//               <View style={styles.card}>
//                 <Text style={styles.title}>Address Details</Text>
//                 <Text style={styles.subTitle}>Enter your business address</Text>
//                 <Input label="Address Line 1" placeholder="House no, street" value={address.address1} onChangeText={(v) => updateAddress("address1", v)} />
//                 <Input label="Address Line 2 (Optional)" placeholder="Landmark, area" value={address.address2} onChangeText={(v) => updateAddress("address2", v)} />
//                 <Input label="City" placeholder="Enter city" value={address.city} onChangeText={(v) => updateAddress("city", v)} />
//                 <Dropdown label="State" value={address.state} options={indianStates} onSelect={(v) => updateAddress("state", v)} />
//                 <Input label="PIN Code" placeholder="Enter 6-digit PIN" keyboardType="number-pad" maxLength={6} value={address.pin} onChangeText={(v) => updateAddress("pin", v)} />
//               </View>
//             )}

//             {step === 5 && (
//               <View style={styles.card}>
//                 <Text style={styles.title}>Review Details</Text>
//                 <Text style={styles.subTitle}>Check once before submit</Text>
//                 <Review label="Name" value={personal.fullName} />
//                 <Review label="Email" value={personal.email} />
//                 <Review label="Phone" value={personal.phone} />
//                 <Review label="Shop" value={business.shopName} />
//                 <Review label="Business Type" value={business.businessType} />
//                 <Review label="City" value={address.city} />
//                 <Review label="State" value={address.state} />
//                 <Review label="PIN" value={address.pin} />
//                 <Text style={styles.docsTitle}>Uploaded Documents</Text>
//                 <Review label="Aadhar" value={docs.aadhar ? "✅ Uploaded" : "❌ Missing"} />
//                 <Review label="PAN" value={docs.pan ? "✅ Uploaded" : "❌ Missing"} />
//                 <Review label="Business Proof" value={docs.businessProof ? "✅ Uploaded" : "❌ Missing"} />
//                 <Review label="Bank Details" value={docs.bankDetails ? "✅ Uploaded" : "❌ Missing"} />

//                 {/* ✅ Info note about approval process */}
//                 <View style={styles.infoBox}>
//                   <Text style={styles.infoText}>
//                     ⏳ After submitting, your application will be reviewed by the admin. You will receive a notification once approved.
//                   </Text>
//                 </View>
//               </View>
//             )}

//             <PrimaryButton
//               title={step === 5 ? "Submit Registration" : "Continue"}
//               onPress={handleNext}
//               loading={loading}
//             />
//           </>
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// function Review({ label, value }) {
//   return (
//     <View style={styles.reviewRow}>
//       <Text style={styles.reviewLabel}>{label}</Text>
//       <Text style={styles.reviewValue}>{value || "-"}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: C.white },
//   header: {
//     backgroundColor: C.white,
//     paddingTop: Platform.OS === "android" ? 36 : 50,
//     paddingHorizontal: 16,
//     paddingBottom: 14,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     borderBottomWidth: 1,
//     borderBottomColor: "#F4E4EC",
//   },
//   backBtn: {
//     width: 42, height: 42, borderRadius: 21,
//     backgroundColor: "#FFF5F9", alignItems: "center", justifyContent: "center",
//     borderWidth: 1, borderColor: C.border,
//   },
//   backText: { fontSize: 34, color: C.primary, marginTop: -4, fontWeight: "600" },
//   headerTitle: { fontSize: 18, fontWeight: "900", color: C.text },
//   // ✅ New: Login button in header
//   loginBtn: {
//     paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12,
//     backgroundColor: C.primary, borderWidth: 1, borderColor: C.primary,
//   },
//   loginBtnText: { color: C.white, fontSize: 13, fontWeight: "900" },
//   container: { flex: 1, backgroundColor: C.white },
//   content: { padding: 18, paddingBottom: 40 },
//   steps: { flexDirection: "row", justifyContent: "space-between", marginBottom: 18 },
//   stepItem: { alignItems: "center", flex: 1 },
//   stepCircle: {
//     width: 34, height: 34, borderRadius: 17, backgroundColor: "#F3F4F6",
//     alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#E5E7EB",
//   },
//   stepActive: { backgroundColor: C.primary, borderColor: C.primary },
//   stepDone: { backgroundColor: C.success, borderColor: C.success },
//   stepNo: { color: C.white, fontWeight: "900", fontSize: 12 },
//   stepLabel: { fontSize: 10, color: C.hint, marginTop: 5, fontWeight: "800" },
//   card: {
//     backgroundColor: C.card, borderRadius: 22, padding: 18,
//     borderWidth: 1, borderColor: C.border, marginBottom: 18,
//     elevation: 2, shadowColor: "#000", shadowOpacity: 0.05,
//     shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
//   },
//   title: { fontSize: 22, fontWeight: "900", color: C.text },
//   subTitle: { fontSize: 13, color: C.muted, marginTop: 4, marginBottom: 18 },
//   field: { marginBottom: 14 },
//   label: { fontSize: 13, fontWeight: "800", color: C.text, marginBottom: 7 },
//   input: {
//     minHeight: 52, borderWidth: 1.4, borderColor: C.border,
//     borderRadius: 14, paddingHorizontal: 14, color: C.text,
//     backgroundColor: C.white, fontSize: 14,
//   },
//   textArea: { minHeight: 105, paddingTop: 12, textAlignVertical: "top" },
//   dropdownBox: {
//     minHeight: 52, borderWidth: 1.4, borderColor: C.border,
//     borderRadius: 14, paddingHorizontal: 14, backgroundColor: C.white,
//     flexDirection: "row", alignItems: "center",
//   },
//   dropdownText: { flex: 1, fontSize: 14, color: C.text, fontWeight: "600" },
//   arrow: { fontSize: 11, color: C.primary, fontWeight: "900" },
//   dropdownList: {
//     backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
//     borderRadius: 14, marginTop: 6, overflow: "hidden", elevation: 8,
//   },
//   dropdownItem: {
//     paddingVertical: 13, paddingHorizontal: 14,
//     borderBottomWidth: 1, borderBottomColor: "#F8EAF1",
//     flexDirection: "row", justifyContent: "space-between",
//   },
//   dropdownItemText: { fontSize: 14, color: C.text, fontWeight: "600" },
//   uploadCard: {
//     minHeight: 82, borderWidth: 1.4, borderColor: C.border,
//     backgroundColor: C.white, borderRadius: 16, marginBottom: 12,
//     padding: 12, flexDirection: "row", alignItems: "center",
//   },
//   uploadDone: { borderColor: "#86EFAC", backgroundColor: C.successBg },
//   uploadIcon: {
//     width: 56, height: 56, borderRadius: 14,
//     backgroundColor: "#FFF2F7", alignItems: "center", justifyContent: "center", marginRight: 12,
//   },
//   uploadImage: { width: 56, height: 56, borderRadius: 14, marginRight: 12, backgroundColor: "#eee" },
//   uploadTitle: { fontSize: 14, fontWeight: "900", color: C.text },
//   uploadSub: { fontSize: 12, color: C.muted, marginTop: 3 },
//   uploadStatus: { fontSize: 12, color: C.primary, fontWeight: "900" },
//   docsTitle: { marginTop: 16, marginBottom: 8, fontSize: 15, fontWeight: "900", color: C.primary },
//   reviewRow: {
//     paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: "#F3E6EC",
//     flexDirection: "row", justifyContent: "space-between", gap: 12,
//   },
//   reviewLabel: { fontSize: 13, color: C.muted, fontWeight: "700" },
//   reviewValue: { fontSize: 13, color: C.text, fontWeight: "900", flex: 1, textAlign: "right" },
//   infoBox: {
//     backgroundColor: "#EFF6FF", borderRadius: 14, padding: 12,
//     marginTop: 14, borderWidth: 1, borderColor: "#BFDBFE",
//   },
//   infoText: { color: "#1E40AF", fontSize: 12, fontWeight: "700", lineHeight: 18 },
//   btnWrap: { borderRadius: 16, overflow: "hidden", marginTop: 4, elevation: 5 },
//   btn: { minHeight: 56, alignItems: "center", justifyContent: "center" },
//   btnText: { color: C.white, fontSize: 16, fontWeight: "900" },
//   // ✅ New: Completion card styles
//   completionCard: {
//     backgroundColor: C.card, borderRadius: 22, padding: 24,
//     borderWidth: 1, borderColor: C.border, marginTop: 12,
//     elevation: 2, shadowColor: "#000", shadowOpacity: 0.05,
//     shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
//     alignItems: "center",
//   },
//   successIcon: {
//     width: 80, height: 80, borderRadius: 40,
//     backgroundColor: C.successBg, alignItems: "center", justifyContent: "center",
//     marginBottom: 18,
//   },
//   completionTitle: {
//     fontSize: 24, fontWeight: "900", color: C.success, textAlign: "center",
//     marginBottom: 8,
//   },
//   completionSubtitle: {
//     fontSize: 14, color: C.muted, textAlign: "center", marginBottom: 20,
//   },
//   completionDetails: {
//     width: "100%", backgroundColor: "#F9FAFB", borderRadius: 16,
//     padding: 16, marginBottom: 18,
//   },
//   detailText: {
//     fontSize: 13, color: C.muted, fontWeight: "700",
//   },
//   detailValue: {
//     fontSize: 14, color: C.text, fontWeight: "900", marginTop: 4,
//   },
//   infoCard: {
//     width: "100%", backgroundColor: "#FFF7ED", borderRadius: 16,
//     padding: 16, marginBottom: 20, borderWidth: 1, borderColor: "#FED7AA",
//   },
//   infoTitle: {
//     fontSize: 14, fontWeight: "900", color: "#92400E", marginBottom: 10,
//   },
//   infoPoint: {
//     fontSize: 12, color: "#92400E", marginBottom: 6, lineHeight: 18,
//   },
//   continueBtn: { borderRadius: 16, overflow: "hidden", width: "100%", elevation: 5 },
//   continueBtnGradient: { minHeight: 56, alignItems: "center", justifyContent: "center" },
//   continueBtnText: { color: C.white, fontSize: 16, fontWeight: "900" },
// });











































// src/screens/seller/SellerRegistrationScreen.js
// FULLY UPDATED:
//   - Sends structured documents (title, type, uri) to registerSeller
//   - Sends full address object
//   - 10-second loading spinner on submit
//   - Admin notified automatically via ShopContext
//   - Login button in header after successful registration
//   - Navigates to RoleSelectionScreen on login button click

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  StatusBar,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { registerSellerAPI } from "../../api/sellerApi";
import { useShop } from "../../context/ShopContext";
import { showAlert } from "../../utils/showAlert";

const C = {
  primary: "#0e3243",
  primaryDark: "#0e3243",
  white: "#FFFFFF",
  bg: "#FFFFFF",
  card: "#FFFFFF",
  border: "#F1D5E1",
  text: "#171827",
  muted: "#6B7280",
  hint: "#A1A1AA",
  success: "#16A34A",
  successBg: "#ECFDF5",
  danger: "#EF4444",
};

const businessTypes = [
  "Handmade Products",
  "Artisan Crafts",
  "Textile & Fabric",
  "Pottery & Ceramics",
  "Jewellery",
  "Paintings & Art",
  "Woodcraft",
  "Leather Goods",
  "Candles & Soaps",
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Beauty & Health",
  "Sports",
  "Other",
];

const indianStates = [
  "Andhra Pradesh",
  "Telangana",
  "Tamil Nadu",
  "Kerala",
  "Karnataka",
  "Maharashtra",
  "Delhi",
  "Goa",
  "Gujarat",
  "Rajasthan",
  "Punjab",
  "Uttar Pradesh",
  "West Bengal",
  "Odisha",
  "Madhya Pradesh",
  "Bihar",
  "Assam",
];

// Document definitions — each has a key, title, and type shown in admin view
const DOC_FIELDS = [
  { key: "aadhar", title: "Aadhar Card", type: "Identity Proof" },
  { key: "pan", title: "PAN Card", type: "Identity Proof" },
  { key: "businessProof", title: "Business Proof", type: "Business Document" },
  { key: "bankDetails", title: "Bank Details", type: "Bank Proof" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function PrimaryButton({ title, onPress, loading }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={loading}
      style={styles.btnWrap}
    >
      <LinearGradient
        colors={[C.primary, C.primaryDark]}
        style={styles.btn}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {loading ? (
          <View style={{ alignItems: "center" }}>
            <ActivityIndicator color="#fff" />
            <Text style={[styles.btnText, { marginTop: 6, fontSize: 12 }]}>
              Submitting… Please wait
            </Text>
          </View>
        ) : (
          <Text style={styles.btnText}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

function Header({ title, onBack, showLoginBtn, onLoginPress, registrationComplete }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      {registrationComplete && showLoginBtn ? (
        <TouchableOpacity onPress={onLoginPress} style={styles.loginBtn}>
          <Text style={styles.loginBtnText}>Login</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ width: 42 }} />
      )}
    </View>
  );
}

function Input({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  multiline,
  maxLength,
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.hint}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        maxLength={maxLength}
        style={[styles.input, multiline && styles.textArea]}
      />
    </View>
  );
}

function Dropdown({ label, value, options, onSelect }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={[styles.field, { zIndex: open ? 1000 : 1 }]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.dropdownBox}
        onPress={() => setOpen(!open)}
      >
        <Text style={[styles.dropdownText, !value && { color: C.hint }]}>
          {value || `Select ${label}`}
        </Text>
        <Text style={styles.arrow}>{open ? "▲" : "▼"}</Text>
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdownList}>
          <ScrollView nestedScrollEnabled style={{ maxHeight: 190 }}>
            {options.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.dropdownItem}
                onPress={() => {
                  onSelect(item);
                  setOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    value === item && { color: C.primary, fontWeight: "900" },
                  ]}
                >
                  {item}
                </Text>
                {value === item && (
                  <Text style={{ color: C.primary }}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

function Steps({ step }) {
  const items = ["Basic", "Business", "Docs", "Address", "Review"];
  return (
    <View style={styles.steps}>
      {items.map((item, index) => {
        const no = index + 1;
        const active = no === step;
        const done = no < step;
        return (
          <View key={item} style={styles.stepItem}>
            <View
              style={[
                styles.stepCircle,
                active && styles.stepActive,
                done && styles.stepDone,
              ]}
            >
              <Text style={styles.stepNo}>{done ? "✓" : no}</Text>
            </View>
            <Text
              style={[
                styles.stepLabel,
                active && { color: C.primary },
                done && { color: C.success },
              ]}
            >
              {item}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

async function pickFromGallery() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    showAlert("Permission Needed", "Please allow gallery access.");
    return null;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
    allowsEditing: false,
  });
  if (result.canceled) return null;
  return result.assets?.[0] || null;
}

function UploadCard({ title, file, onPick }) {
  return (
    <TouchableOpacity
      activeOpacity={0.86}
      style={[styles.uploadCard, file && styles.uploadDone]}
      onPress={onPick}
    >
      {file?.uri ? (
        <Image source={{ uri: file.uri }} style={styles.uploadImage} />
      ) : (
        <View style={styles.uploadIcon}>
          <Text style={{ fontSize: 24 }}>📁</Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.uploadTitle}>{title}</Text>
        <Text style={styles.uploadSub}>
          {file ? "Uploaded successfully" : "Tap to choose from gallery"}
        </Text>
      </View>
      <Text style={[styles.uploadStatus, file && { color: C.success }]}>
        {file ? "Done" : "Upload"}
      </Text>
    </TouchableOpacity>
  );
}

function Review({ label, value }) {
  return (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text style={styles.reviewValue}>{value || "—"}</Text>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function SellerRegistrationScreen({ navigation }) {
  const { reloadSellers } = useShop();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const [personal, setPersonal] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [business, setBusiness] = useState({
    shopName: "",
    businessType: "",
    gst: "",
    description: "",
  });

  // docs: { aadhar: null|asset, pan: null|asset, businessProof: null|asset, bankDetails: null|asset }
  const [docs, setDocs] = useState({
    aadhar: null,
    pan: null,
    businessProof: null,
    bankDetails: null,
  });

  const [address, setAddress] = useState({
    address1: "",
    address2: "",
    city: "",
    state: "",
    pin: "",
  });

  const updatePersonal = (k, v) => setPersonal((p) => ({ ...p, [k]: v }));
  const updateBusiness = (k, v) => setBusiness((b) => ({ ...b, [k]: v }));
  const updateAddress = (k, v) => setAddress((a) => ({ ...a, [k]: v }));

  const goBack = () => {
    if (step > 1) setStep(step - 1);
    else if (navigation?.canGoBack?.()) navigation.goBack();
    else navigation.navigate("SellerOnboardingScreen");
  };

  const handleLoginPress = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "RoleSelectionScreen" }],
    });
  };

  const validateStep = () => {
    if (step === 1) {
      if (!personal.fullName.trim()) return "Enter full name.";
      if (!/\S+@\S+\.\S+/.test(personal.email)) return "Enter a valid email.";
      if (personal.phone.length < 10) return "Enter a valid 10-digit phone number.";
      if (personal.password.length < 6) return "Password must be at least 6 characters.";
      if (personal.password !== personal.confirmPassword)
        return "Passwords do not match.";
    }
    if (step === 2) {
      if (!business.shopName.trim()) return "Enter shop name.";
      if (!business.businessType) return "Select business type.";
    }
    if (step === 3) {
      if (!docs.aadhar) return "Please upload your Aadhar card.";
      if (!docs.pan) return "Please upload your PAN card.";
      if (!docs.businessProof) return "Please upload business proof.";
      if (!docs.bankDetails) return "Please upload bank details.";
    }
    if (step === 4) {
      if (!address.address1.trim()) return "Enter address line 1.";
      if (!address.city.trim()) return "Enter city.";
      if (!address.state) return "Select state.";
      if (address.pin.length !== 6) return "Enter a valid 6-digit PIN code.";
    }
    return null;
  };

  const handleNext = async () => {
    const err = validateStep();
    if (err) {
      showAlert("Required", err);
      return;
    }
    if (step < 5) {
      setStep(step + 1);
      return;
    }

    // Step 5 — Submit
    setLoading(true);

    try {
      const structuredDocs = DOC_FIELDS.map((field) => ({
        ...(docs[field.key] || {}),
        title: field.title,
        type: field.type,
        uri: docs[field.key]?.uri || null,
        fileName: docs[field.key]?.fileName || docs[field.key]?.name || null,
        mimeType: docs[field.key]?.mimeType || docs[field.key]?.type || null,
        verified: false,
      })).filter((d) => d.uri !== null);

      const result = await registerSellerAPI(
        {
          name: personal.fullName.trim(),
          shopName: business.shopName.trim(),
          email: personal.email.trim().toLowerCase(),
          phone: personal.phone.trim(),
          password: personal.password,
          category: business.businessType,
          gst: business.gst.trim(),
          description: business.description.trim(),
          address: {
            address1: address.address1.trim(),
            address2: address.address2.trim(),
            city: address.city.trim(),
            state: address.state,
            pin: address.pin.trim(),
          },
        },
        structuredDocs
      );

      if (!result?.success) {
        throw new Error(result?.message || "Registration failed");
      }

      await reloadSellers?.();
      setRegistrationComplete(true);
      showAlert(
        "Registration Submitted!",
        "Your application has been sent to the admin for review.\n\nYou will be notified once your account is approved. This usually takes 1-2 business days.",
        [{ text: "OK" }]
      );
    } catch (error) {
      showAlert("Error", error?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pickDoc = async (key) => {
    const file = await pickFromGallery();
    if (file) setDocs((prev) => ({ ...prev, [key]: file }));
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />
      <Header
        title="Seller Registration"
        onBack={goBack}
        showLoginBtn={true}
        onLoginPress={handleLoginPress}
        registrationComplete={registrationComplete}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {registrationComplete ? (
          // ── Success screen ──────────────────────────────────────────────
          <View style={styles.completionCard}>
            <View style={styles.successIcon}>
              <Text style={{ fontSize: 64 }}>✅</Text>
            </View>
            <Text style={styles.completionTitle}>Registration Submitted!</Text>
            <Text style={styles.completionSubtitle}>
              Your seller application has been successfully submitted for review.
            </Text>
            <View style={styles.completionDetails}>
              <Text style={styles.detailText}>📧 Confirmation sent to:</Text>
              <Text style={styles.detailValue}>{personal.email}</Text>
              <Text style={[styles.detailText, { marginTop: 14 }]}>
                ⏳ Admin Review Time
              </Text>
              <Text style={styles.detailValue}>1–2 business days</Text>
              <Text style={[styles.detailText, { marginTop: 14 }]}>
                🔔 You will be notified
              </Text>
              <Text style={styles.detailValue}>via email and in-app notification</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>What Happens Next?</Text>
              <Text style={styles.infoPoint}>
                • Your documents will be verified by our admin team
              </Text>
              <Text style={styles.infoPoint}>
                • We'll check your business details and compliance
              </Text>
              <Text style={styles.infoPoint}>
                • You'll receive an approval notification with login access
              </Text>
              <Text style={styles.infoPoint}>
                • Start selling once your account is active!
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleLoginPress}
              style={styles.continueBtn}
            >
              <LinearGradient
                colors={[C.primary, C.primaryDark]}
                style={styles.continueBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.continueBtnText}>Back to Role Selection</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Steps step={step} />

            {/* ── Step 1: Personal ── */}
            {step === 1 && (
              <View style={styles.card}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subTitle}>Enter your personal details</Text>
                <Input
                  label="Full Name"
                  placeholder="Enter full name"
                  value={personal.fullName}
                  onChangeText={(v) => updatePersonal("fullName", v)}
                />
                <Input
                  label="Email"
                  placeholder="Enter email address"
                  keyboardType="email-address"
                  value={personal.email}
                  onChangeText={(v) => updatePersonal("email", v)}
                />
                <Input
                  label="Phone Number"
                  placeholder="Enter 10-digit phone number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={personal.phone}
                  onChangeText={(v) => updatePersonal("phone", v)}
                />
                <Input
                  label="Password"
                  placeholder="Minimum 6 characters"
                  secureTextEntry
                  value={personal.password}
                  onChangeText={(v) => updatePersonal("password", v)}
                />
                <Input
                  label="Confirm Password"
                  placeholder="Re-enter password"
                  secureTextEntry
                  value={personal.confirmPassword}
                  onChangeText={(v) => updatePersonal("confirmPassword", v)}
                />
              </View>
            )}

            {/* ── Step 2: Business ── */}
            {step === 2 && (
              <View style={styles.card}>
                <Text style={styles.title}>Business Details</Text>
                <Text style={styles.subTitle}>Set up your seller shop</Text>
                <Input
                  label="Shop Name"
                  placeholder="Enter shop name"
                  value={business.shopName}
                  onChangeText={(v) => updateBusiness("shopName", v)}
                />
                <Dropdown
                  label="Business Type"
                  value={business.businessType}
                  options={businessTypes}
                  onSelect={(v) => updateBusiness("businessType", v)}
                />
                <Input
                  label="GST Number (Optional)"
                  placeholder="Enter GST number"
                  value={business.gst}
                  onChangeText={(v) => updateBusiness("gst", v)}
                />
                <Input
                  label="Business Description"
                  placeholder="Describe your business"
                  multiline
                  value={business.description}
                  onChangeText={(v) => updateBusiness("description", v)}
                />
              </View>
            )}

            {/* ── Step 3: Documents ── */}
            {step === 3 && (
              <View style={styles.card}>
                <Text style={styles.title}>Upload Documents</Text>
                <Text style={styles.subTitle}>Choose images from your gallery</Text>
                {DOC_FIELDS.map((field) => (
                  <UploadCard
                    key={field.key}
                    title={field.title}
                    file={docs[field.key]}
                    onPick={() => pickDoc(field.key)}
                  />
                ))}
              </View>
            )}

            {/* ── Step 4: Address ── */}
            {step === 4 && (
              <View style={styles.card}>
                <Text style={styles.title}>Address Details</Text>
                <Text style={styles.subTitle}>Enter your business address</Text>
                <Input
                  label="Address Line 1"
                  placeholder="House no, street name"
                  value={address.address1}
                  onChangeText={(v) => updateAddress("address1", v)}
                />
                <Input
                  label="Address Line 2 (Optional)"
                  placeholder="Landmark, area"
                  value={address.address2}
                  onChangeText={(v) => updateAddress("address2", v)}
                />
                <Input
                  label="City"
                  placeholder="Enter city"
                  value={address.city}
                  onChangeText={(v) => updateAddress("city", v)}
                />
                <Dropdown
                  label="State"
                  value={address.state}
                  options={indianStates}
                  onSelect={(v) => updateAddress("state", v)}
                />
                <Input
                  label="PIN Code"
                  placeholder="Enter 6-digit PIN code"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={address.pin}
                  onChangeText={(v) => updateAddress("pin", v)}
                />
              </View>
            )}

            {/* ── Step 5: Review ── */}
            {step === 5 && (
              <View style={styles.card}>
                <Text style={styles.title}>Review Details</Text>
                <Text style={styles.subTitle}>Check everything before submitting</Text>
                <Review label="Full Name" value={personal.fullName} />
                <Review label="Email" value={personal.email} />
                <Review label="Phone" value={personal.phone} />
                <Review label="Shop Name" value={business.shopName} />
                <Review label="Business Type" value={business.businessType} />
                <Review label="GST" value={business.gst || "Not provided"} />
                <Review label="City" value={address.city} />
                <Review label="State" value={address.state} />
                <Review label="PIN Code" value={address.pin} />
                <Text style={styles.docsTitle}>Uploaded Documents</Text>
                {DOC_FIELDS.map((field) => (
                  <Review
                    key={field.key}
                    label={field.title}
                    value={docs[field.key] ? "✅ Uploaded" : "❌ Missing"}
                  />
                ))}
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>
                    ⏳ After submitting, your application will be reviewed by the
                    admin. You will receive a notification once approved.
                  </Text>
                </View>
              </View>
            )}

            <PrimaryButton
              title={step === 5 ? "Submit Registration" : "Continue"}
              onPress={handleNext}
              loading={loading}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.white },
  header: {
    backgroundColor: C.white,
    paddingTop: Platform.OS === "android" ? 36 : 50,
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F4E4EC",
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFF5F9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.border,
  },
  backText: { fontSize: 34, color: C.primary, marginTop: -4, fontWeight: "600" },
  headerTitle: { fontSize: 18, fontWeight: "900", color: C.text },
  loginBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: C.primary,
  },
  loginBtnText: { color: C.white, fontSize: 13, fontWeight: "900" },
  container: { flex: 1, backgroundColor: C.white },
  content: { padding: 18, paddingBottom: 40 },
  steps: { flexDirection: "row", justifyContent: "space-between", marginBottom: 18 },
  stepItem: { alignItems: "center", flex: 1 },
  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  stepActive: { backgroundColor: C.primary, borderColor: C.primary },
  stepDone: { backgroundColor: C.success, borderColor: C.success },
  stepNo: { color: C.white, fontWeight: "900", fontSize: 12 },
  stepLabel: { fontSize: 10, color: C.hint, marginTop: 5, fontWeight: "800" },
  card: {
    backgroundColor: C.card,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 18,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  title: { fontSize: 22, fontWeight: "900", color: C.text },
  subTitle: { fontSize: 13, color: C.muted, marginTop: 4, marginBottom: 18 },
  field: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "800", color: C.text, marginBottom: 7 },
  input: {
    minHeight: 52,
    borderWidth: 1.4,
    borderColor: C.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    color: C.text,
    backgroundColor: C.white,
    fontSize: 14,
  },
  textArea: { minHeight: 105, paddingTop: 12, textAlignVertical: "top" },
  dropdownBox: {
    minHeight: 52,
    borderWidth: 1.4,
    borderColor: C.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: C.white,
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownText: { flex: 1, fontSize: 14, color: C.text, fontWeight: "600" },
  arrow: { fontSize: 11, color: C.primary, fontWeight: "900" },
  dropdownList: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    marginTop: 6,
    overflow: "hidden",
    elevation: 8,
  },
  dropdownItem: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F8EAF1",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdownItemText: { fontSize: 14, color: C.text, fontWeight: "600" },
  uploadCard: {
    minHeight: 82,
    borderWidth: 1.4,
    borderColor: C.border,
    backgroundColor: C.white,
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  uploadDone: { borderColor: "#86EFAC", backgroundColor: C.successBg },
  uploadIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#FFF2F7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  uploadImage: {
    width: 56,
    height: 56,
    borderRadius: 14,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  uploadTitle: { fontSize: 14, fontWeight: "900", color: C.text },
  uploadSub: { fontSize: 12, color: C.muted, marginTop: 3 },
  uploadStatus: { fontSize: 12, color: C.primary, fontWeight: "900" },
  docsTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: "900",
    color: C.primary,
  },
  reviewRow: {
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#F3E6EC",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  reviewLabel: { fontSize: 13, color: C.muted, fontWeight: "700" },
  reviewValue: {
    fontSize: 13,
    color: C.text,
    fontWeight: "900",
    flex: 1,
    textAlign: "right",
  },
  infoBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  infoText: { color: "#1E40AF", fontSize: 12, fontWeight: "700", lineHeight: 18 },
  btnWrap: { borderRadius: 16, overflow: "hidden", marginTop: 4, elevation: 5 },
  btn: { minHeight: 56, alignItems: "center", justifyContent: "center" },
  btnText: { color: C.white, fontSize: 16, fontWeight: "900" },
  completionCard: {
    backgroundColor: C.card,
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: C.border,
    marginTop: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    alignItems: "center",
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: C.successBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: C.success,
    textAlign: "center",
    marginBottom: 8,
  },
  completionSubtitle: {
    fontSize: 14,
    color: C.muted,
    textAlign: "center",
    marginBottom: 20,
  },
  completionDetails: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },
  detailText: { fontSize: 13, color: C.muted, fontWeight: "700" },
  detailValue: { fontSize: 14, color: C.text, fontWeight: "900", marginTop: 4 },
  infoCard: {
    width: "100%",
    backgroundColor: "#FFF7ED",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FED7AA",
  },
  infoTitle: { fontSize: 14, fontWeight: "900", color: "#92400E", marginBottom: 10 },
  infoPoint: { fontSize: 12, color: "#92400E", marginBottom: 6, lineHeight: 18 },
  continueBtn: { borderRadius: 16, overflow: "hidden", width: "100%", elevation: 5 },
  continueBtnGradient: {
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  continueBtnText: { color: C.white, fontSize: 16, fontWeight: "900" },
});
