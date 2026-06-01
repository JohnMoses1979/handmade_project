import { Platform } from "react-native";
import { BASE_URL } from "./config";

const serverUrl = BASE_URL.replace("/api", "");

const parseResponse = async (response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { success: false, message: text.slice(0, 160) };
  }
};

const toServerImageUrl = (value) => {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("file://")) {
    return trimmed;
  }

  const normalizedPath = trimmed.replace(/\\/g, "/");
  const fileName = normalizedPath
    .split("?")[0]
    .split("#")[0]
    .split("/")
    .pop();

  if (!fileName) return null;

  return `${serverUrl}/uploads/complaints/${encodeURIComponent(fileName)}`;
};

const normalizeComplaint = (complaint = {}) => ({
  ...complaint,
  images: Array.isArray(complaint.images)
    ? complaint.images.map(toServerImageUrl).filter(Boolean)
    : [],
});

const normalizeComplaintList = (items = []) =>
  Array.isArray(items) ? items.map(normalizeComplaint) : [];

const buildComplaintFormData = async (payload = {}) => {
  const formData = new FormData();
  formData.append("title", payload.title ?? "Customer Complaint");
  formData.append("description", payload.description ?? "");
  formData.append("complaintType", payload.complaintType ?? "");
  formData.append("orderId", payload.orderId ?? "");
  formData.append("productId", payload.productId ?? "");
  formData.append("productName", payload.productName ?? "");
  formData.append("customer", payload.customer ?? payload.customerName ?? "Customer");
  formData.append("customerEmail", payload.customerEmail ?? "");
  formData.append("sellerId", payload.sellerId ?? "");
  formData.append("sellerName", payload.sellerName ?? "");
  formData.append("status", payload.status ?? "Pending");

  const images = Array.isArray(payload.images) ? payload.images : [];
  for (let index = 0; index < images.length; index += 1) {
    const image = images[index];
    if (!image) continue;

    if (Platform.OS === "web") {
      try {
        const blob = await fetch(image).then((res) => res.blob());
        formData.append("images", blob, `complaint_${index}.jpg`);
      } catch (error) {
        console.warn("Unable to attach complaint image", error);
      }
      continue;
    }

    formData.append("images", {
      uri: Platform.OS === "android" ? image : image.replace("file://", ""),
      type: "image/jpeg",
      name: `complaint_${index}.jpg`,
    });
  }

  return formData;
};

export const createComplaintAPI = async (payload) => {
  try {
    const formData = await buildComplaintFormData(payload);
    const response = await fetch(`${BASE_URL}/complaints`, {
      method: "POST",
      body: formData,
    });
    const data = await parseResponse(response);
    return data?.complaint
      ? { ...data, complaint: normalizeComplaint(data.complaint) }
      : data;
  } catch (error) {
    console.error("createComplaintAPI error:", error);
    return { success: false, message: "Unable to submit complaint." };
  }
};

export const getAdminComplaintsAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/complaints/admin`);
    const data = await parseResponse(response);
    return normalizeComplaintList(data);
  } catch (error) {
    console.error("getAdminComplaintsAPI error:", error);
    return [];
  }
};

export const getSellerComplaintsAPI = async (sellerId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/complaints/seller?sellerId=${encodeURIComponent(sellerId)}`
    );
    const data = await parseResponse(response);
    return normalizeComplaintList(data);
  } catch (error) {
    console.error("getSellerComplaintsAPI error:", error);
    return [];
  }
};

export const resolveComplaintAPI = async (complaintId, resolution) => {
  try {
    const response = await fetch(
      `${BASE_URL}/complaints/${encodeURIComponent(complaintId)}/resolve`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolution }),
      }
    );
    const data = await parseResponse(response);
    return data?.complaint
      ? { ...data, complaint: normalizeComplaint(data.complaint) }
      : data;
  } catch (error) {
    console.error("resolveComplaintAPI error:", error);
    return { success: false, message: "Unable to resolve complaint." };
  }
};

export const markComplaintReadAPI = async (complaintId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/complaints/${encodeURIComponent(complaintId)}/read`,
      {
        method: "POST",
      }
    );
    const data = await parseResponse(response);
    return data?.complaint
      ? { ...data, complaint: normalizeComplaint(data.complaint) }
      : data;
  } catch (error) {
    console.error("markComplaintReadAPI error:", error);
    return { success: false, message: "Unable to mark complaint as read." };
  }
};
