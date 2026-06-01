import { BASE_URL } from "./config";

const parseResponse = async (response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { success: false, message: text.slice(0, 160) };
  }
};

export const createNotificationAPI = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error("createNotificationAPI error:", error);
    return { success: false, message: "Unable to create notification." };
  }
};

export const getAdminNotificationsAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/notifications/admin`);
    const data = await parseResponse(response);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("getAdminNotificationsAPI error:", error);
    return [];
  }
};

export const getSellerNotificationsAPI = async (sellerId) => {
  try {
    const response = await fetch(`${BASE_URL}/notifications/seller?sellerId=${encodeURIComponent(sellerId)}`);
    const data = await parseResponse(response);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("getSellerNotificationsAPI error:", error);
    return [];
  }
};

export const getCustomerNotificationsAPI = async (customerEmail) => {
  try {
    const response = await fetch(`${BASE_URL}/notifications/customer?customerEmail=${encodeURIComponent(customerEmail)}`);
    const data = await parseResponse(response);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("getCustomerNotificationsAPI error:", error);
    return [];
  }
};

export const markNotificationReadAPI = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/notifications/${encodeURIComponent(id)}/read`, {
      method: "POST",
    });
    return await parseResponse(response);
  } catch (error) {
    console.error("markNotificationReadAPI error:", error);
    return { success: false, message: "Unable to mark notification." };
  }
};

export const markAllNotificationsReadAPI = async ({ audience, audienceKey = "" }) => {
  try {
    const response = await fetch(`${BASE_URL}/notifications/read-all`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audience, audienceKey }),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error("markAllNotificationsReadAPI error:", error);
    return { success: false, message: "Unable to mark notifications." };
  }
};
