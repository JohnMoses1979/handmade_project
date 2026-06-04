import { BASE_URL } from "./config";
import { Platform } from "react-native";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const parseResponse = async (response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { success: false, message: text.slice(0, 160) };
  }
};

/**
 * Returns { success: false, message } when the HTTP status is not 2xx,
 * otherwise returns the parsed body.
 */
const parseChecked = async (response) => {
  const data = await parseResponse(response);
  if (!response.ok) {
    return { success: false, message: data.message || `Server error: ${response.status}` };
  }
  return data;
};

/**
 * Build a stable server-root URL by stripping a trailing "/api" segment
 * (and any trailing slash) from BASE_URL.
 */
const serverRoot = () => BASE_URL.replace(/\/api\/?$/, "").replace(/\/$/, "");

/**
 * Retrieve the stored auth token (adapt this to wherever your app stores it).
 * Returns an object ready to spread into a `headers` object.
 */
const authHeader = () => {
  // e.g. from AsyncStorage, a global store, SecureStore, etc.
  // Replace with your actual token retrieval logic.
  // import { getToken } from "../utils/auth";
  // const token = getToken();
  // return token ? { Authorization: `Bearer ${token}` } : {};
  return {};
};

// ---------------------------------------------------------------------------
// Document formatter
// ---------------------------------------------------------------------------

const formatSeller = (s) => {
  // Normalise address
  let addressObj = s.address;
  if (typeof s.address === "string") {
    try {
      addressObj = JSON.parse(s.address);
    } catch {
      addressObj = { address1: s.address };
    }
  }

  // Normalise document paths
  let formattedDocs = [];
  if (Array.isArray(s.documentPaths)) {
    const root = serverRoot();
    formattedDocs = s.documentPaths.map((path, index) => {
      // Support both forward-slash and back-slash separators (Windows uploads)
      const fileName = path.split(/[\\/]/).pop();
      return {
        title: `Document ${index + 1}`,
        uri: `${root}/uploads/${fileName}`,
        fileName,
        type: "Uploaded Document",
        verified: false,
      };
    });
  }

  return { ...s, address: addressObj, documents: formattedDocs };
};

// ---------------------------------------------------------------------------
// Auth APIs (seller-facing)
// ---------------------------------------------------------------------------

export const registerSellerAPI = async (sellerData, docs) => {
  try {
    const formData = new FormData();

    // Append scalar / address fields.
    // Backend reads address as a single @RequestParam String address,
    // so the object is JSON-stringified into one field.
    Object.keys(sellerData).forEach((key) => {
      const value = sellerData[key];
      if (value === undefined || value === null) return;

      if (key === "address" && typeof value === "object") {
        formData.append("address", JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    // Normalise docs to an array
    const normalizedDocs = Array.isArray(docs)
      ? docs
      : docs
      ? Object.keys(docs).map((key) => ({
          ...docs[key],
          fileName: docs[key]?.fileName || `${key}.jpg`,
        }))
      : [];

    for (let idx = 0; idx < normalizedDocs.length; idx += 1) {
      const doc = normalizedDocs[idx];
      if (!doc?.uri) continue;

      const uriParts = doc.uri.split(".");
      const fileExtension = (uriParts[uriParts.length - 1] || "jpg").toLowerCase();
      const fileName =
        doc.fileName || doc.name || `document_${idx}.${fileExtension}`;

      const mimeType = doc.mimeType?.includes("/")
        ? doc.mimeType
        : doc.type?.includes("/")
        ? doc.type
        : fileExtension === "png"
        ? "image/png"
        : fileExtension === "jpg" || fileExtension === "jpeg"
        ? "image/jpeg"
        : "application/octet-stream";

      if (Platform.OS === "web") {
        const blob =
          doc.file instanceof Blob
            ? doc.file
            : await fetch(doc.uri).then((r) => r.blob());
        formData.append("documents", blob, fileName);
      } else {
        formData.append("documents", {
          uri:
            Platform.OS === "android"
              ? doc.uri
              : doc.uri.replace("file://", ""),
          name: fileName,
          type: mimeType,
        });
      }
    }

    const response = await fetch(`${BASE_URL}/seller/register`, {
      method: "POST",
      body: formData,
      // NOTE: do NOT set Content-Type here — the browser/RN sets it with the
      // correct multipart boundary automatically.
    });

    return await parseChecked(response);
  } catch (error) {
    console.error("registerSellerAPI error:", error);
    return { success: false, message: error.message || "Registration request failed" };
  }
};

export const loginSellerAPI = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/seller/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await parseChecked(response);
  } catch (error) {
    console.error("loginSellerAPI error:", error);
    return { success: false, message: error.message || "Login request failed" };
  }
};

export const forgotPasswordAPI = async (email) => {
  try {
    const response = await fetch(`${BASE_URL}/seller/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await parseChecked(response);
  } catch (error) {
    console.error("forgotPasswordAPI error:", error);
    return { success: false, message: error.message || "Forgot password request failed" };
  }
};

export const verifyOtpAPI = async (email, otp) => {
  try {
    const response = await fetch(`${BASE_URL}/seller/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    return await parseChecked(response);
  } catch (error) {
    console.error("verifyOtpAPI error:", error);
    return { success: false, message: error.message || "OTP verification request failed" };
  }
};

export const resetPasswordAPI = async (email, otp, newPassword) => {
  try {
    const response = await fetch(`${BASE_URL}/seller/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    });
    return await parseChecked(response);
  } catch (error) {
    console.error("resetPasswordAPI error:", error);
    return { success: false, message: error.message || "Password reset request failed" };
  }
};

// ---------------------------------------------------------------------------
// Seller profile / settings / support (seller-facing)
// ---------------------------------------------------------------------------

export const getSellerProfileAPI = async (sellerId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/seller/profile/${encodeURIComponent(sellerId)}`,
      { headers: authHeader() }
    );
    return await parseChecked(response);
  } catch (error) {
    console.error("getSellerProfileAPI error:", error);
    return { success: false, message: error.message || "Unable to load seller profile" };
  }
};

export const updateSellerProfileAPI = async (sellerId, payload) => {
  try {
    const response = await fetch(
      `${BASE_URL}/seller/profile/${encodeURIComponent(sellerId)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(payload),
      }
    );
    return await parseChecked(response);
  } catch (error) {
    console.error("updateSellerProfileAPI error:", error);
    return { success: false, message: error.message || "Unable to update seller profile" };
  }
};

export const getSellerSettingsAPI = async (sellerId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/seller/settings/${encodeURIComponent(sellerId)}`,
      { headers: authHeader() }
    );
    return await parseChecked(response);
  } catch (error) {
    console.error("getSellerSettingsAPI error:", error);
    return { success: false, message: error.message || "Unable to load seller settings" };
  }
};

export const updateSellerSettingsAPI = async (sellerId, payload) => {
  try {
    const response = await fetch(
      `${BASE_URL}/seller/settings/${encodeURIComponent(sellerId)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(payload),
      }
    );
    return await parseChecked(response);
  } catch (error) {
    console.error("updateSellerSettingsAPI error:", error);
    return { success: false, message: error.message || "Unable to update seller settings" };
  }
};

export const getSellerSupportContentAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/seller/support`, {
      headers: authHeader(),
    });
    return await parseChecked(response);
  } catch (error) {
    console.error("getSellerSupportContentAPI error:", error);
    return { success: false, message: error.message || "Unable to load support content" };
  }
};

// ---------------------------------------------------------------------------
// Admin APIs
// ---------------------------------------------------------------------------

export const getPendingSellersAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/admin/sellers/pending`, {
      headers: authHeader(),
    });
    if (!response.ok) {
      console.error("getPendingSellersAPI — bad status:", response.status);
      return [];
    }
    const data = await response.json();
    return Array.isArray(data) ? data.map(formatSeller) : [];
  } catch (error) {
    console.error("getPendingSellersAPI error:", error);
    return [];
  }
};

export const getAllSellersAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/admin/sellers`, {
      headers: authHeader(),
    });
    if (!response.ok) {
      console.error("getAllSellersAPI — bad status:", response.status);
      return [];
    }
    const data = await response.json();
    return Array.isArray(data) ? data.map(formatSeller) : [];
  } catch (error) {
    console.error("getAllSellersAPI error:", error);
    return [];
  }
};

export const approveSellerAPI = async (sellerId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/admin/sellers/${encodeURIComponent(sellerId)}/approve`,
      { method: "POST", headers: authHeader() }
    );
    return await parseChecked(response);
  } catch (error) {
    console.error("approveSellerAPI error:", error);
    return { success: false, message: error.message || "Approval request failed" };
  }
};

export const rejectSellerAPI = async (sellerId, reason) => {
  try {
    const response = await fetch(
      `${BASE_URL}/admin/sellers/${encodeURIComponent(sellerId)}/reject?reason=${encodeURIComponent(reason)}`,
      { method: "POST", headers: authHeader() }
    );
    return await parseChecked(response);
  } catch (error) {
    console.error("rejectSellerAPI error:", error);
    return { success: false, message: error.message || "Rejection request failed" };
  }
};

export const getSellerByIdAPI = async (sellerId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/admin/sellers/${encodeURIComponent(sellerId)}`,
      { headers: authHeader() }
    );
    if (!response.ok) {
      console.error("getSellerByIdAPI — bad status:", response.status);
      return null;
    }
    const data = await response.json();
    return data ? formatSeller(data) : null;
  } catch (error) {
    console.error("getSellerByIdAPI error:", error);
    return null;
  }
};
