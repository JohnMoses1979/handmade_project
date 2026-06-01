import { Platform } from "react-native";

const resolveApiHost = () => {
  const configuredUrl =
    globalThis?.process?.env?.EXPO_PUBLIC_API_URL?.trim() ||
    globalThis?.process?.env?.REACT_NATIVE_API_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, "");
  }

  if (Platform.OS === "web" && typeof window !== "undefined") {
    const host = window.location.hostname?.trim();
    if (host) {
      return host;
    }
  }

  return "192.168.1.6";
};

const resolvedApiHost = resolveApiHost();
export const BASE_URL = resolvedApiHost.startsWith("http")
  ? `${resolvedApiHost}/api`
  : `http://${resolvedApiHost}:8080/api`;

export default BASE_URL;
