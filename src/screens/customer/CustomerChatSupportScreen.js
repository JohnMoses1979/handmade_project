

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

// ─── Auto-response Bot Logic ─────────────────────────────────────────────────
const BOT_RESPONSES = {
  "track my order": "Sure! Please share your Order ID and I'll fetch the live tracking status for you. 📦",
  "return": "We accept returns within 30 days of delivery. Please go to My Orders → Select Item → Request Return. Need help with a specific order?",
  "refund": "Refunds are processed within 5–7 business days after we receive the returned item. Would you like me to check the status of a refund?",
  "cancel": "You can cancel an order before it's shipped. Go to My Orders → Select Order → Cancel. Want me to cancel a specific order for you?",
  "payment": "Sorry to hear about the payment issue! Could you tell me more — was it a failed transaction or an incorrect charge?",
  "address": "Address changes are allowed before the order is dispatched. Share your Order ID and the new address, and I'll update it right away.",
  default: "Thank you for reaching out! 😊 Our support team will review this and get back to you within 2 hours. Is there anything else I can help with?",
};

function getBotReply(msg) {
  const lower = msg.toLowerCase();
  for (const key of Object.keys(BOT_RESPONSES)) {
    if (key !== "default" && lower.includes(key)) return BOT_RESPONSES[key];
  }
  return BOT_RESPONSES.default;
}

// ─── Typing Dots Animation ───────────────────────────────────────────────────
function TypingIndicator() {
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const anims = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      )
    );
    anims.forEach((a) => a.start());
    return () => anims.forEach((a) => a.stop());
  }, []);

  return (
    <View style={styles.typingBubble}>
      <View style={styles.agentAvatar}>
        <Ionicons name="headset" size={12} color="#fff" />
      </View>
      <View style={styles.typingDots}>
        {dots.map((dot, i) => (
          <Animated.View key={i} style={[styles.dot, { transform: [{ translateY: dot }] }]} />
        ))}
      </View>
    </View>
  );
}

// ─── Chat Message Bubble ─────────────────────────────────────────────────────
function MessageBubble({ chat }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.messageRow,
        chat.isCustomer ? styles.messageRowRight : styles.messageRowLeft,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {!chat.isCustomer && (
        <View style={styles.agentAvatar}>
          <Ionicons name="headset" size={14} color="#fff" />
        </View>
      )}
      <View style={[styles.chatBubble, chat.isCustomer ? styles.customerBubble : styles.supportBubble]}>
        {!chat.isCustomer && <Text style={styles.agentName}>Support Agent</Text>}
        <Text style={[styles.chatText, chat.isCustomer && styles.customerChatText]}>{chat.text}</Text>
        <View style={styles.messageFooter}>
          <Text style={[styles.timeText, chat.isCustomer && styles.customerTimeText]}>{chat.time}</Text>
          {chat.isCustomer && (
            <Ionicons
              name={chat.read ? "checkmark-done" : "checkmark"}
              size={14}
              color={chat.read ? "#4FC3F7" : "rgba(255,255,255,0.6)"}
              style={{ marginLeft: 4 }}
            />
          )}
        </View>
      </View>
      {chat.isCustomer && (
        <View style={styles.customerAvatar}>
          <Ionicons name="person" size={14} color="#fff" />
        </View>
      )}
    </Animated.View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function CustomerChatSupportScreen({ navigation }) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline] = useState(true);
  const scrollRef = useRef(null);

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! Welcome to ShopEase Support. How can I assist you today?",
      isCustomer: false,
      time: formatTime(new Date()),
      read: true,
    },
  ]);

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const sendMessage = (text = message) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg = {
      id: Date.now(),
      text: trimmed,
      isCustomer: true,
      time: formatTime(new Date()),
      read: false,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setIsTyping(true);

    // Mark as delivered after 1s
    setTimeout(() => {
      setChatMessages((prev) =>
        prev.map((m) => (m.id === userMsg.id ? { ...m, read: true } : m))
      );
    }, 1000);

    // Bot reply after 2s
    setTimeout(() => {
      setIsTyping(false);
      const reply = getBotReply(trimmed);
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: reply,
          isCustomer: false,
          time: formatTime(new Date()),
          read: true,
        },
      ]);
    }, 2200);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#B01863" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        {/* Back + Agent Info */}
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.agentInfo}>
            <View style={styles.headerAvatarWrap}>
              <View style={styles.headerAvatar}>
                <Ionicons name="headset" size={20} color="#fff" />
              </View>
              {isOnline && <View style={styles.onlineDot} />}
            </View>
            <View>
              <Text style={styles.headerAgentName}>Support Team</Text>
              <Text style={styles.headerStatus}>
                {isOnline ? "🟢 Online · Typically replies in 2 min" : "⚫ Offline"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── CHAT AREA ── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {chatMessages.map((chat) => (
            <MessageBubble key={chat.id} chat={chat} />
          ))}

          {isTyping && <TypingIndicator />}
        </ScrollView>

        {/* ── QUICK REPLIES ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickRepliesContainer}
          contentContainerStyle={styles.quickRepliesContent}
        >
          {["Track my order", "Return & Refund", "Cancel order", "Payment issue", "Change address"].map((qr) => (
            <TouchableOpacity
              key={qr}
              style={styles.quickReplyChip}
              onPress={() => sendMessage(qr)}
            >
              <Text style={styles.quickReplyText}>{qr}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── INPUT BAR ── */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message..."
            placeholderTextColor="#aaa"
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage()}
          />
          <TouchableOpacity
            onPress={() => sendMessage()}
            style={[styles.sendBtn, message.trim() ? styles.sendBtnActive : styles.sendBtnInactive]}
            disabled={!message.trim()}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: "#0e3243",
    elevation: 6,
    shadowColor: "#0e3243",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerLeft: { marginTop:30,flexDirection: "row", alignItems: "center", flex: 1 },
  backBtn: { padding: 6, marginRight: 6 },
  agentInfo: { flexDirection: "row", alignItems: "center" },
  headerAvatarWrap: { marginRight: 10 },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
  },
  onlineDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#0e3243",
  },
  headerAgentName: { fontSize: 15, fontWeight: "700", color: "#fff" },
  headerStatus: { fontSize: 11, color: "rgba(255,255,255,0.85)", marginTop: 1 },

  // Chat
  chatArea: { flex: 1, backgroundColor: "#FFFFFF" },
  chatContent: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 8 },

 
  dateSeparator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  dateLine: { flex: 1, height: 1, backgroundColor: "#FFFFFF" },
  dateText: {
    marginHorizontal: 10,
    fontSize: 11,
    color: "#999",
    fontWeight: "600",
  },

  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  messageRowLeft: { alignSelf: "flex-start" },
  messageRowRight: { alignSelf: "flex-end", flexDirection: "row-reverse" },

  agentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#0e3243",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
    marginBottom: 2,
  },
  customerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#4A4A8A",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
    marginBottom: 2,
  },

  chatBubble: {
    maxWidth: "72%",
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 18,
  },
  supportBubble: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 4,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  customerBubble: {
    backgroundColor: "#0e3243",
    borderTopRightRadius: 4,
    elevation: 2,
    shadowColor: "#0e3243",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  agentName: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0e3243",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  chatText: { fontSize: 14.5, color: "#222", lineHeight: 21 },
  customerChatText: { color: "#fff" },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  timeText: { fontSize: 10, color: "#aaa" },
  customerTimeText: { color: "rgba(255,255,255,0.65)" },

  // Typing indicator
  typingBubble: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  typingDots: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    borderTopLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 4,
    elevation: 1,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#0e3243",
    opacity: 0.7,
  },

  // Quick Replies
  quickRepliesContainer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#EEE4EA",
    maxHeight: 50,
  },
  quickRepliesContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  quickReplyChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#0e3243",
    marginRight: 8,
    backgroundColor: "#FFFFFF",
  },
  quickReplyText: { fontSize: 12.5, color: "#0e3243", fontWeight: "600" },

  // Input Bar
  inputBar: {
    marginBottom:120,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#EEE4EA",
    gap: 8,
  },
  attachBtn: { padding: 6, marginBottom: 4 },
  textInput: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#E8D0DC",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14.5,
    color: "#222",
    backgroundColor: "#FFFFFF",
    maxHeight: 100,
    lineHeight: 20,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 1,
  },
  sendBtnActive: { backgroundColor: "#0e3243" },
  sendBtnInactive: { backgroundColor: "#D0B0BE" },

  // Bottom Actions
  bottomActions: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: "#EEE4EA",
    paddingBottom: Platform.OS === "ios" ? 24 : 10,
  },
  bottomActionBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  bottomActionText: {
    fontSize: 10.5,
    color: "#0e3243",
    fontWeight: "600",
    marginTop: 2,
  },
  dividerV: {
    width: 1,
    height: 28,
    backgroundColor: "#EEE4EA",
    alignSelf: "center",
  },
});



