import { Alert, Platform } from "react-native";

function runButtonHandler(button) {
  if (typeof button?.onPress === "function") {
    button.onPress();
  }
}

export function showAlert(title, message = "", buttons = [{ text: "OK" }], options) {
  const normalizedButtons =
    Array.isArray(buttons) && buttons.length > 0 ? buttons : [{ text: "OK" }];

  if (Platform.OS !== "web" || typeof globalThis?.window === "undefined") {
    return Alert.alert(title, message, normalizedButtons, options);
  }

  const combinedMessage = [title, message].filter(Boolean).join("\n\n") || "Alert";

  if (normalizedButtons.length === 1) {
    globalThis.window.alert(combinedMessage);
    runButtonHandler(normalizedButtons[0]);
    return;
  }

  const cancelButton =
    normalizedButtons.find((button) => button?.style === "cancel") ??
    normalizedButtons[normalizedButtons.length - 1];
  const confirmButton =
    normalizedButtons.find((button) => button?.style === "destructive") ??
    normalizedButtons.find((button) => button !== cancelButton) ??
    normalizedButtons[0];

  const confirmed = globalThis.window.confirm(combinedMessage);
  runButtonHandler(confirmed ? confirmButton : cancelButton);
}

export default showAlert;
