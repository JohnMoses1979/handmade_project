import { Platform } from "react-native";

if (Platform.OS === "web") {
  try {
    const ReactNative = require("react-native");
    const { SafeAreaView } = require("react-native-safe-area-context");

    if (ReactNative?.SafeAreaView && SafeAreaView) {
      ReactNative.SafeAreaView = SafeAreaView;
    }
  } catch {
    // Keep web startup resilient if the shim cannot be applied.
  }
}
