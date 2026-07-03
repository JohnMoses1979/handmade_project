// import { BASE_URL } from "./config";

// const parseJsonSafe = async (response) => {
//   const text = await response.text();
//   if (!text) return {};
//   try {
//     return JSON.parse(text);
//   } catch {
//     return { success: false, message: text.slice(0, 160) };
//   }
// };

// export const loginCustomerAPI = async (email, password) => {
//   try {
//     const response = await fetch(`${BASE_URL}/auth/customer/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         email,
//         password,
//       }),
//     });
//     return await parseJsonSafe(response);
//   } catch (error) {
//     console.error("loginCustomerAPI error:", error);
//     return { success: false, message: "Unable to login right now." };
//   }
// };

// export const syncCustomerAccountAPI = async (payload = {}) => {
//   try {
//     const response = await fetch(`${BASE_URL}/auth/customer/sync-account`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
//     return await parseJsonSafe(response);
//   } catch (error) {
//     console.error("syncCustomerAccountAPI error:", error);
//     return { success: false, message: "Unable to sync customer account." };
//   }
// };

// export const forgotCustomerPasswordAPI = async (email) => {
//   try {
//     const response = await fetch(`${BASE_URL}/auth/customer/forgot-password`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email }),
//     });
//     return await parseJsonSafe(response);
//   } catch (error) {
//     console.error("forgotCustomerPasswordAPI error:", error);
//     return { success: false, message: "Unable to send OTP." };
//   }
// };

// export const verifyCustomerOtpAPI = async (email, otp) => {
//   try {
//     const response = await fetch(`${BASE_URL}/auth/customer/verify-otp`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, otp }),
//     });
//     return await parseJsonSafe(response);
//   } catch (error) {
//     console.error("verifyCustomerOtpAPI error:", error);
//     return { success: false, message: "Unable to verify OTP." };
//   }
// };

// export const resetCustomerPasswordAPI = async (email, otp, newPassword) => {
//   try {
//     const response = await fetch(`${BASE_URL}/auth/customer/reset-password`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         email,
//         otp,
//         newPassword,
//       }),
//     });
//     return await parseJsonSafe(response);
//   } catch (error) {
//     console.error("resetCustomerPasswordAPI error:", error);
//     return { success: false, message: "Unable to update password." };
//   }
// };

// export const markCustomerOnboardingSeenAPI = async (email) => {
//   try {
//     const response = await fetch(`${BASE_URL}/auth/customer/mark-onboarding-seen`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email }),
//     });
//     return await parseJsonSafe(response);
//   } catch (error) {
//     console.error("markCustomerOnboardingSeenAPI error:", error);
//     return { success: false, message: "Unable to save onboarding status." };
//   }
// };   



























import { BASE_URL } from "./config";

const parseJsonSafe = async (response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { success: false, message: text.slice(0, 160) };
  }
};

export const loginCustomerAPI = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/customer/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    return await parseJsonSafe(response);
  } catch (error) {
    console.error("loginCustomerAPI error:", error);
    return { success: false, message: "Unable to login right now." };
  }
};

export const signupCustomerAPI = async ({ name, email, password, confirmPassword }) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/customer/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        confirmPassword,
      }),
    });
    return await parseJsonSafe(response);
  } catch (error) {
    console.error("signupCustomerAPI error:", error);
    return { success: false, message: "Unable to sign up right now." };
  }
};

export const syncCustomerAccountAPI = async (payload = {}) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/customer/sync-account`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await parseJsonSafe(response);
  } catch (error) {
    console.error("syncCustomerAccountAPI error:", error);
    return { success: false, message: "Unable to sync customer account." };
  }
};

export const forgotCustomerPasswordAPI = async (email) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/customer/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await parseJsonSafe(response);
  } catch (error) {
    console.error("forgotCustomerPasswordAPI error:", error);
    return { success: false, message: "Unable to send OTP." };
  }
};

export const verifyCustomerOtpAPI = async (email, otp) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/customer/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    return await parseJsonSafe(response);
  } catch (error) {
    console.error("verifyCustomerOtpAPI error:", error);
    return { success: false, message: "Unable to verify OTP." };
  }
};

export const resetCustomerPasswordAPI = async (email, otp, newPassword) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/customer/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        otp,
        newPassword,
      }),
    });
    return await parseJsonSafe(response);
  } catch (error) {
    console.error("resetCustomerPasswordAPI error:", error);
    return { success: false, message: "Unable to update password." };
  }
};

export const markCustomerOnboardingSeenAPI = async (email) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/customer/mark-onboarding-seen`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await parseJsonSafe(response);
  } catch (error) {
    console.error("markCustomerOnboardingSeenAPI error:", error);
    return { success: false, message: "Unable to save onboarding status." };
  }
};
