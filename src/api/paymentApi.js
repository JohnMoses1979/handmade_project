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

export const createRazorpayOrderAPI = async ({ amount, receipt }) => {
  try {
    const response = await fetch(`${BASE_URL}/payments/razorpay/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, receipt }),
    });
    const data = await parseResponse(response);

    if (!response.ok) {
      return { success: false, message: data.message || `Server Error: ${response.status}` };
    }

    return data;
  } catch (error) {
    console.error("Create Razorpay order error:", error);
    return { success: false, message: "Unable to create Razorpay order." };
  }
};

export const createRazorpayPaymentLinkAPI = async ({ amount, receipt, description, customer }) => {
  try {
    const response = await fetch(`${BASE_URL}/payments/razorpay/payment-link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, receipt, description, customer }),
    });
    const data = await parseResponse(response);

    if (!response.ok) {
      return { success: false, message: data.message || `Server Error: ${response.status}` };
    }

    return data;
  } catch (error) {
    console.error("Create Razorpay payment link error:", error);
    return { success: false, message: "Unable to create Razorpay payment link." };
  }
};

export const createRazorpayMobileSessionAPI = async ({ amount, receipt, description, customer }) => {
  try {
    const response = await fetch(`${BASE_URL}/payments/razorpay/mobile-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, receipt, description, customer }),
    });
    const data = await parseResponse(response);

    if (!response.ok) {
      return { success: false, message: data.message || `Server Error: ${response.status}` };
    }

    return data;
  } catch (error) {
    console.error("Create Razorpay mobile session error:", error);
    return { success: false, message: "Unable to create mobile payment session." };
  }
};

export const fetchRazorpayMobileSessionAPI = async (sessionId) => {
  try {
    const response = await fetch(`${BASE_URL}/payments/razorpay/mobile-status/${encodeURIComponent(sessionId)}`);
    const data = await parseResponse(response);

    if (!response.ok) {
      return { success: false, message: data.message || `Server Error: ${response.status}` };
    }

    return data;
  } catch (error) {
    console.error("Fetch Razorpay mobile session error:", error);
    return { success: false, message: "Unable to fetch mobile payment session." };
  }
};

export const fetchRazorpayPaymentLinkAPI = async (paymentLinkId) => {
  try {
    const response = await fetch(`${BASE_URL}/payments/razorpay/payment-link/${encodeURIComponent(paymentLinkId)}`);
    const data = await parseResponse(response);

    if (!response.ok) {
      return { success: false, message: data.message || `Server Error: ${response.status}` };
    }

    return data;
  } catch (error) {
    console.error("Fetch Razorpay payment link error:", error);
    return { success: false, message: "Unable to fetch Razorpay payment link." };
  }
};

export const verifyRazorpayPaymentAPI = async (paymentResponse) => {
  try {
    const response = await fetch(`${BASE_URL}/payments/razorpay/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentResponse),
    });
    const data = await parseResponse(response);

    if (!response.ok) {
      return { success: false, message: data.message || `Server Error: ${response.status}` };
    }

    return data;
  } catch (error) {
    console.error("Verify Razorpay payment error:", error);
    return { success: false, message: "Unable to verify Razorpay payment." };
  }
};

export const createRazorpayRefundAPI = async ({
  paymentId,
  amount,
  receipt,
  sellerId,
  sellerName,
  orderId,
  orderCode,
  productId,
  productName,
  customerEmail,
  customerName,
}) => {
  try {
    const response = await fetch(
      `${BASE_URL}/payments/razorpay/payments/${encodeURIComponent(paymentId)}/refund`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          receipt,
          sellerId,
          sellerName,
          orderId,
          orderCode,
          productId,
          productName,
          customerEmail,
          customerName,
        }),
      }
    );
    const data = await parseResponse(response);

    if (!response.ok) {
      return { success: false, message: data.message || `Server Error: ${response.status}` };
    }

    return data;
  } catch (error) {
    console.error("Create Razorpay refund error:", error);
    return { success: false, message: "Unable to create Razorpay refund." };
  }
};

export const getSellerPayoutSummaryAPI = async (sellerId) => {
  try {
    const response = await fetch(`${BASE_URL}/seller/payouts/${sellerId}`);
    const data = await parseResponse(response);
    if (!response.ok) {
      return { success: false, message: data.message || `Server Error: ${response.status}` };
    }
    return data;
  } catch (error) {
    console.error("Get seller payout summary error:", error);
    return { success: false, message: "Unable to fetch seller payout details." };
  }
};

export const withdrawSellerPayoutAPI = async ({ sellerId, amount }) => {
  try {
    const response = await fetch(`${BASE_URL}/seller/payouts/${sellerId}/withdraw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    const data = await parseResponse(response);
    if (!response.ok) {
      return { success: false, message: data.message || `Server Error: ${response.status}` };
    }
    return data;
  } catch (error) {
    console.error("Withdraw seller payout error:", error);
    return { success: false, message: "Unable to withdraw payout." };
  }
};
