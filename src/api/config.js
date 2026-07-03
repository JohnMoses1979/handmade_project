import { NativeModules, Platform } from "react-native";

const trimTrailingSlash = (value) => String(value || "").trim().replace(/\/+$/, "");
const isHttpUrl = (value) => /^https?:\/\//i.test(String(value || "").trim());

const resolveServerBaseUrl = (apiBaseUrl) => {
  const base = trimTrailingSlash(apiBaseUrl);
  if (!base) return "";

  try {
    if (base.startsWith("/")) {
      if (Platform.OS === "web" && typeof window !== "undefined") {
        return trimTrailingSlash(window.location.origin);
      }
      return "";
    }

    const parsed = new URL(base);
    const pathname = parsed.pathname.replace(/\/api\/?$/, "").replace(/\/+$/, "");
    return `${parsed.origin}${pathname}`;
  } catch {
    return base.replace(/\/api\/?$/, "");
  }
};

const resolveApiBaseUrl = () => {
  const configuredUrl =
    globalThis?.process?.env?.EXPO_PUBLIC_API_URL?.trim() ||
    globalThis?.process?.env?.REACT_NATIVE_API_URL?.trim();

  const isWeb = Platform.OS === "web" && typeof window !== "undefined";
  const isSecureWebOrigin = isWeb && window.location?.protocol === "https:";

  if (configuredUrl) {
    const normalized = trimTrailingSlash(configuredUrl);
    if (isHttpUrl(normalized)) {
      if (isSecureWebOrigin && normalized.startsWith("http://")) {
        return "/api";
      }
      return normalized;
    }

    if (!isWeb) {
      return `http://${normalized}:8080/api`;
    }
  }

  if (isWeb) {
    if (isSecureWebOrigin) {
      return "/api";
    }
    const port = window.location.port || "";
    if (!["8081", "19006"].includes(port)) {
      return "/api";
    }
    const host = window.location.hostname || "localhost";
    return `http://${host}:8080/api`;
  }

  const scriptUrl =
    NativeModules?.SourceCode?.scriptURL ||
    globalThis?.__DEV__?.scriptURL ||
    "";
  if (typeof scriptUrl === "string" && scriptUrl.trim()) {
    try {
      const parsed = new URL(scriptUrl);
      const host = parsed.hostname?.trim();
      if (host) {
        return `http://${host}:8080/api`;
      }
    } catch {
      // Fall through to the explicit local fallback below.
    }
  }

  return "http://16.112.231.38:8080/api";
};

export const BASE_URL = resolveApiBaseUrl();
export const SERVER_URL = resolveServerBaseUrl(BASE_URL);

export default BASE_URL;
