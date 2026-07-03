import { BASE_URL, SERVER_URL } from "./config";
import { Platform } from "react-native";

const parseResponse = async (response) => {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { success: false, message: text.slice(0, 160) };
  }
};

export const registerSellerAPI = async (sellerData, docs) => {
  try {
    const formData = new FormData();

    // Add text fields
    Object.keys(sellerData).forEach((key) => {
      if (key === "address" && typeof sellerData[key] === "object") {
        formData.append(key, JSON.stringify(sellerData[key]));
      } else if (sellerData[key] !== undefined && sellerData[key] !== null) {
        formData.append(key, String(sellerData[key]));
      }
    });

    // Add documents
    const normalizedDocs = Array.isArray(docs)
      ? docs
      : docs
      ? Object.keys(docs).map((key) => ({ ...docs[key], fileName: docs[key]?.fileName || `${key}.jpg` }))
      : [];

    for (let idx = 0; idx < normalizedDocs.length; idx += 1) {
      const doc = normalizedDocs[idx];
      if (!doc?.uri) continue;

      const uriParts = doc.uri.split(".");
      const fileExtension = uriParts[uriParts.length - 1] || "jpg";
      const fileName = doc.fileName || doc.name || `document_${idx}.${fileExtension}`;
      const mimeType =
        doc.mimeType?.includes?.("/")
          ? doc.mimeType
          : doc.type?.includes?.("/")
          ? doc.type
          : fileExtension.toLowerCase() === "png"
          ? "image/png"
          : fileExtension.toLowerCase() === "jpg" || fileExtension.toLowerCase() === "jpeg"
          ? "image/jpeg"
          : "application/octet-stream";

      if (Platform.OS === "web") {
        const blob =
          doc.file instanceof Blob
            ? doc.file
            : await fetch(doc.uri).then((blobResponse) => blobResponse.blob());
        formData.append("documents", blob, fileName);
      } else {
        formData.append("documents", {
          uri: Platform.OS === "android" ? doc.uri : doc.uri.replace("file://", ""),
          name: fileName,
          type: mimeType,
        });
      }
    }

    const response = await fetch(`${BASE_URL}/seller/register`, {
      method: "POST",
      body: formData,
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return { success: false, message: data.message || `Server Error: ${response.status}` };
    }

    return data;
  } catch (error) {
    console.error("registerSellerAPI error:", error);
    return { success: false, message: error.message || "Registration request failed" };
  }
};

export const loginSellerAPI = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/seller/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await parseResponse(response);
    return data;
  } catch (error) {
    console.error("loginSellerAPI error:", error);
    return { success: false, message: error.message || "Login request failed" };
  }
};

export const forgotPasswordAPI = async (email) => {
  try {
    const response = await fetch(`${BASE_URL}/seller/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await parseResponse(response);
    return data;
  } catch (error) {
    console.error("forgotPasswordAPI error:", error);
    return { success: false, message: error.message || "Forgot password request failed" };
  }
};

export const verifyOtpAPI = async (email, otp) => {
  try {
    const response = await fetch(`${BASE_URL}/seller/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });
    const data = await parseResponse(response);
    return data;
  } catch (error) {
    console.error("verifyOtpAPI error:", error);
    return { success: false, message: error.message || "OTP verification request failed" };
  }
};

export const resetPasswordAPI = async (email, otp, newPassword) => {
  try {
    const response = await fetch(`${BASE_URL}/seller/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp, newPassword }),
    });
    const data = await parseResponse(response);
    return data;
  } catch (error) {
    console.error("resetPasswordAPI error:", error);
    return { success: false, message: error.message || "Password reset request failed" };
  }
};

const formatSeller = (s) => {
  let addressObj = s.address;
  if (typeof s.address === "string") {
    try {
      addressObj = JSON.parse(s.address);
    } catch (e) {
      addressObj = { address1: s.address };
    }
  }

  let formattedDocs = [];
  if (s.documentPaths && Array.isArray(s.documentPaths)) {
    // Generate base URL without /api
    const serverUrl = SERVER_URL;
    formattedDocs = s.documentPaths.map((path, index) => {
      const fileName = path.split("/").pop().split("\\").pop();
      return {
        title: `Document ${index + 1}`,
        uri: `${serverUrl}/uploads/${fileName}`, 
        fileName: fileName,
        type: "Uploaded Document",
        verified: false
      };
    });
  }

  return {
    ...s,
    address: addressObj,
    documents: formattedDocs
  };
};

export const getPendingSellersAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/admin/sellers/pending`);
    const data = await parseResponse(response);
    return Array.isArray(data) ? data.map(formatSeller) : [];
  } catch (error) {
    console.error("getPendingSellersAPI error:", error);
    return [];
  }
};

export const getAllSellersAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/admin/sellers`);
    const data = await parseResponse(response);
    return Array.isArray(data) ? data.map(formatSeller) : [];
  } catch (error) {
    console.error("getAllSellersAPI error:", error);
    return [];
  }
};

export const approveSellerAPI = async (sellerId) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/sellers/${sellerId}/approve`, {
      method: "POST",
    });
    const data = await parseResponse(response);
    return data;
  } catch (error) {
    console.error("approveSellerAPI error:", error);
    return { success: false, message: error.message || "Approval request failed" };
  }
};

export const rejectSellerAPI = async (sellerId, reason) => {
  try {
    const response = await fetch(
      `${BASE_URL}/admin/sellers/${sellerId}/reject?reason=${encodeURIComponent(reason)}`,
      {
        method: "POST",
      }
    );
    const data = await parseResponse(response);
    return data;
  } catch (error) {
    console.error("rejectSellerAPI error:", error);
    return { success: false, message: error.message || "Rejection request failed" };
  }
};

export const getSellerByIdAPI = async (sellerId) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/sellers/${sellerId}`);
    const data = await parseResponse(response);
    return data ? formatSeller(data) : null;
  } catch (error) {
    console.error("getSellerByIdAPI error:", error);
    return null;
  }
};

export const getSellerProfileAPI = async (sellerId) => {
  try {
    const response = await fetch(`${BASE_URL}/seller/profile/${encodeURIComponent(sellerId)}`);
    return await parseResponse(response);
  } catch (error) {
    console.error("getSellerProfileAPI error:", error);
    return { success: false, message: error.message || "Unable to load seller profile" };
  }
};

export const updateSellerProfileAPI = async (sellerId, payload) => {
  try {
    const response = await fetch(`${BASE_URL}/seller/profile/${encodeURIComponent(sellerId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error("updateSellerProfileAPI error:", error);
    return { success: false, message: error.message || "Unable to update seller profile" };
  }
};

export const getSellerSettingsAPI = async (sellerId) => {
  try {
    const response = await fetch(`${BASE_URL}/seller/settings/${encodeURIComponent(sellerId)}`);
    return await parseResponse(response);
  } catch (error) {
    console.error("getSellerSettingsAPI error:", error);
    return { success: false, message: error.message || "Unable to load seller settings" };
  }
};

export const updateSellerSettingsAPI = async (sellerId, payload) => {
  try {
    const response = await fetch(`${BASE_URL}/seller/settings/${encodeURIComponent(sellerId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error("updateSellerSettingsAPI error:", error);
    return { success: false, message: error.message || "Unable to update seller settings" };
  }
};

export const getSellerSupportContentAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/seller/support`);
    return await parseResponse(response);
  } catch (error) {
    console.error("getSellerSupportContentAPI error:", error);
    return { success: false, message: error.message || "Unable to load support content" };
  }
};
