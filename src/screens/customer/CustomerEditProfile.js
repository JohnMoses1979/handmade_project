
// src/screens/customer/CustomerEditProfile.js

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useShop } from "../../context/ShopContext";
import { showAlert } from "../../utils/showAlert";

const COLORS = {
  primary: "#062B67",
  secondary: "#0F172A",
  bg: "#F4F7FC",
  white: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  border: "#E2E8F0",
  light: "#F8FAFC",
};

export default function CustomerEditProfile({
  navigation,
  route,
}) {
  const { updateCustomerProfile } = useShop();
  const profileData =
    route?.params?.profileData || {};

  const [profileImage, setProfileImage] =
    useState(profileData?.avatar || null);

  const [formData, setFormData] = useState({
    fullName: profileData?.name || "",
    email: profileData?.email || "",
    phone: profileData?.phone || "",
    location: profileData?.location || "",
    bio: profileData?.bio || "",
  });

  /* PICK IMAGE */
  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        showAlert(
          "Permission Required",
          "Please allow gallery access."
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes:
            ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

      if (
        !result.canceled &&
        result.assets &&
        result.assets.length > 0
      ) {
        setProfileImage(
          result.assets[0].uri
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* REMOVE IMAGE */
  const removeImage = () => {
    setProfileImage(null);
  };

  /* HANDLE INPUT */
  const handleChange = (
    key,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* SAVE */
  const handleSave = () => {
    const updatedProfile = {
      name: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      location: formData.location.trim(),
      bio: formData.bio.trim(),
      avatar: profileImage,
    };

    updateCustomerProfile?.(updatedProfile);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={COLORS.bg}
        barStyle="dark-content"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBtn}
            activeOpacity={0.8}
            onPress={() =>
              navigation.goBack()
            }
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={COLORS.text}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Edit Profile
          </Text>

          <View style={{ width: 46 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.scrollContent
          }
        >
          {/* PROFILE */}
          <View style={styles.profileSection}>
            <View style={styles.imageWrapper}>
              {profileImage ? (
                <Image
                  source={{
                    uri: profileImage,
                  }}
                  style={styles.profileImage}
                />
              ) : (
                <View
                  style={
                    styles.emptyProfileImage
                  }
                >
                  <Ionicons
                    name="person"
                    size={62}
                    color="#94A3B8"
                  />
                </View>
              )}

              <TouchableOpacity
                style={styles.cameraBtn}
                activeOpacity={0.9}
                onPress={pickImage}
              >
                <Ionicons
                  name="camera"
                  size={18}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>

            {profileImage ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={removeImage}
              >
                <Text
                  style={
                    styles.removePhotoText
                  }
                >
                  Remove Photo
                </Text>
              </TouchableOpacity>
            ) : (
              <Text
                style={
                  styles.changePhotoText
                }
              >
                Upload Profile Photo
              </Text>
            )}
          </View>

          {/* FORM */}
          <View style={styles.formCard}>
            {/* NAME */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Full Name
              </Text>

              <View
                style={styles.inputWrapper}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.primary}
                />

                <TextInput
                  value={formData.fullName}
                  onChangeText={(text) =>
                    handleChange(
                      "fullName",
                      text
                    )
                  }
                  placeholder="Enter full name"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                />
              </View>
            </View>

            {/* EMAIL */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Email Address
              </Text>

              <View
                style={styles.inputWrapper}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={COLORS.primary}
                />

                <TextInput
                  value={formData.email}
                  onChangeText={(text) =>
                    handleChange(
                      "email",
                      text
                    )
                  }
                  placeholder="Enter email"
                  keyboardType="email-address"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                />
              </View>
            </View>

            {/* PHONE */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Phone Number
              </Text>

              <View
                style={styles.inputWrapper}
              >
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={COLORS.primary}
                />

                <TextInput
                  value={formData.phone}
                  onChangeText={(text) =>
                    handleChange(
                      "phone",
                      text
                    )
                  }
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                />
              </View>
            </View>

            {/* LOCATION */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Location
              </Text>

              <View
                style={styles.inputWrapper}
              >
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={COLORS.primary}
                />

                <TextInput
                  value={formData.location}
                  onChangeText={(text) =>
                    handleChange(
                      "location",
                      text
                    )
                  }
                  placeholder="Enter location"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                />
              </View>
            </View>

            {/* BIO */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Bio
              </Text>

              <View style={styles.bioWrapper}>
                <TextInput
                  value={formData.bio}
                  onChangeText={(text) =>
                    handleChange(
                      "bio",
                      text
                    )
                  }
                  placeholder="Write something..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  textAlignVertical="top"
                  style={styles.bioInput}
                />
              </View>
            </View>
          </View>

          {/* SAVE */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text
              style={styles.saveButtonText}
            >
              Save Changes
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  scrollContent: {
    paddingBottom: 120,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 20,
    paddingTop:
      Platform.OS === "android"
        ? 12
        : 5,
    paddingBottom: 18,
  },

  headerBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.primary,
  },

  /* PROFILE */
  profileSection: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 28,
  },

  imageWrapper: {
    position: "relative",
  },

  profileImage: {
    width: 135,
    height: 135,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: COLORS.white,
  },

  emptyProfileImage: {
    width: 135,
    height: 135,
    borderRadius: 70,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },

  cameraBtn: {
    position: "absolute",
    bottom: 4,
    right: 4,

    width: 42,
    height: 42,
    borderRadius: 21,

    backgroundColor: COLORS.primary,

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 3,
    borderColor: COLORS.white,
  },

  changePhotoText: {
    marginTop: 15,
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.primary,
  },

  removePhotoText: {
    marginTop: 15,
    fontSize: 14,
    fontWeight: "800",
    color: "#EF4444",
  },

  /* FORM */
  formCard: {
    marginHorizontal: 18,
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 20,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 10,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",

    minHeight: 58,

    borderRadius: 18,
    backgroundColor: COLORS.light,

    paddingHorizontal: 16,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "600",
  },

  bioWrapper: {
    borderRadius: 18,
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 130,
  },

  bioInput: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "500",
    minHeight: 100,
  },

  /* SAVE BUTTON */
  saveButton: {
    marginTop: 30,
    marginHorizontal: 18,

    height: 60,
    borderRadius: 20,

    backgroundColor: COLORS.primary,

    justifyContent: "center",
    alignItems: "center",

    shadowColor: COLORS.primary,
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 6,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
});
