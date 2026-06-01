let memorySession = null;
let memoryCustomerAccount = null;

const STORAGE_KEY = "selfbusiness_auth_session";
const CUSTOMER_ACCOUNT_KEY = "selfbusiness_customer_account";

function hasLocalStorage() {
  return typeof globalThis !== "undefined" && !!globalThis.localStorage;
}

export function getAuthSession() {
  if (hasLocalStorage()) {
    try {
      const raw = globalThis.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error("getAuthSession error:", error);
    }
  }

  return memorySession;
}

export function setAuthSession(session) {
  memorySession = session;

  if (hasLocalStorage()) {
    try {
      globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
      console.error("setAuthSession error:", error);
    }
  }
}

export function clearAuthSession() {
  memorySession = null;

  if (hasLocalStorage()) {
    try {
      globalThis.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("clearAuthSession error:", error);
    }
  }
}

export function getCustomerAccount() {
  if (hasLocalStorage()) {
    try {
      const raw = globalThis.localStorage.getItem(CUSTOMER_ACCOUNT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error("getCustomerAccount error:", error);
    }
  }

  return memoryCustomerAccount;
}

export function setCustomerAccount(account) {
  memoryCustomerAccount = account;

  if (hasLocalStorage()) {
    try {
      globalThis.localStorage.setItem(CUSTOMER_ACCOUNT_KEY, JSON.stringify(account));
    } catch (error) {
      console.error("setCustomerAccount error:", error);
    }
  }
}

export function clearCustomerAccount() {
  memoryCustomerAccount = null;

  if (hasLocalStorage()) {
    try {
      globalThis.localStorage.removeItem(CUSTOMER_ACCOUNT_KEY);
    } catch (error) {
      console.error("clearCustomerAccount error:", error);
    }
  }
}
