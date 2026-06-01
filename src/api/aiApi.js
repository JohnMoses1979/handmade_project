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

export const createAiChatSessionAPI = async ({ sessionId, title } = {}) => {
  try {
    const response = await fetch(`${BASE_URL}/ai/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId, title }),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error("createAiChatSessionAPI error:", error);
    return { success: false, message: "Unable to create chat session." };
  }
};

export const fetchAiChatSessionsAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/ai/sessions`);
    return await parseResponse(response);
  } catch (error) {
    console.error("fetchAiChatSessionsAPI error:", error);
    return { success: false, message: "Unable to load chat history." };
  }
};

export const fetchAiChatSessionMessagesAPI = async (sessionId) => {
  try {
    const response = await fetch(`${BASE_URL}/ai/sessions/${sessionId}/messages`);
    return await parseResponse(response);
  } catch (error) {
    console.error("fetchAiChatSessionMessagesAPI error:", error);
    return { success: false, message: "Unable to load chat messages." };
  }
};

export const sendAiChatAPI = async ({ sessionId, message, messages = [] } = {}) => {
  try {
    const response = await fetch(`${BASE_URL}/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId, message, messages }),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error("sendAiChatAPI error:", error);
    return { success: false, message: "Unable to connect to AI chat." };
  }
};

export const transcribeAiVoiceAPI = async ({ uri, name, type } = {}) => {
  try {
    const formData = new FormData();

    if (!uri) {
      return { success: false, message: "Audio file is required." };
    }

    if (typeof window !== "undefined" && uri.startsWith("blob:")) {
      const audioResponse = await fetch(uri);
      const audioBlob = await audioResponse.blob();
      formData.append("file", audioBlob, name || "voice-note.webm");
    } else {
      formData.append("file", {
        uri,
        name: name || "voice-note.m4a",
        type: type || "audio/m4a",
      });
    }

    const response = await fetch(`${BASE_URL}/ai/transcribe`, {
      method: "POST",
      body: formData,
    });

    return await parseResponse(response);
  } catch (error) {
    console.error("transcribeAiVoiceAPI error:", error);
    return { success: false, message: "Unable to transcribe audio." };
  }
};
