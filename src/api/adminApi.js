import { BASE_URL } from "./config";

const parseResponse = async (response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { success: false, message: text.slice(0, 200) };
  }
};

export const adminLoginAPI = async ({ email, password } = {}) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error("adminLoginAPI error:", error);
    return { success: false, message: "Unable to connect to admin login." };
  }
};
