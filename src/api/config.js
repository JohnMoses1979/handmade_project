import { Platform } from "react-native";

const EC2_IP = "16.112.231.38";

const trimTrailingSlash = (url) => url.replace(/\/+$/, "");

const resolveBaseUrl = () => {
  const configuredUrl =
    globalThis?.process?.env?.EXPO_PUBLIC_API_URL?.trim() ||
    globalThis?.process?.env?.REACT_NATIVE_API_URL?.trim();

  if (configuredUrl) {
    const cleanUrl = trimTrailingSlash(configuredUrl);
    return cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;
  }

  // Web deployment
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return "/api";
  }

  // Production APK fallback
  return `http://${EC2_IP}/api`;
};

export const BASE_URL = "http://16.112.231.38/api";
export default BASE_URL;
