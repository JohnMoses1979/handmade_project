import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  createAiChatSessionAPI,
  fetchAiChatSessionMessagesAPI,
  fetchAiChatSessionsAPI,
  sendAiChatAPI,
  transcribeAiVoiceAPI,
} from "../../api/aiApi";

const Audio = Platform.OS === "web" ? null : require("expo-av").Audio;

const C = {
  primary: "#082843",
  white: "#FFFFFF",
  bg: "#F6F8FB",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  blue: "#2563EB",
  green: "#10B981",
  softBlue: "#EFF6FF",
  userBg: "#082843",
};

const INITIAL_MESSAGES = [
  {
    id: "welcome",
    role: "assistant",
    text: "Hi! I'm your shopping assistant. Ask me about products, orders, returns, complaints, payouts, or anything about the app.",
    time: currentTime(),
  },
];

const WELCOME_MESSAGE = INITIAL_MESSAGES[0];

function formatChatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMessageTime(value) {
  if (!value) return currentTime();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return currentTime();
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function mapApiMessage(message) {
  return {
    id: String(message?.id || `${Date.now()}-${Math.random()}`),
    role: message?.role === "assistant" ? "assistant" : "user",
    text: String(message?.content || ""),
    time: formatMessageTime(message?.createdAt),
  };
}

function currentTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function Bubble({ item, onSpeak }) {
  const isUser = item.role === "user";

  return (
    <View style={[styles.row, isUser ? styles.rowRight : styles.rowLeft]}>
      {!isUser ? (
        <View style={styles.botAvatar}>
          <MaterialCommunityIcons name="robot-outline" size={16} color={C.white} />
        </View>
      ) : null}

      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <Text style={[styles.bubbleText, isUser && styles.userText]}>{item.text}</Text>
        <View style={styles.metaRow}>
          <Text style={[styles.timeText, isUser && styles.userTimeText]}>{item.time}</Text>
          {!isUser ? (
            <TouchableOpacity onPress={() => onSpeak?.(item.text)} style={styles.speakerBtn}>
              <Ionicons name="volume-high-outline" size={14} color={C.blue} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

    </View>
  );
}

function TypingDots() {
  return (
    <View style={[styles.row, styles.rowLeft]}>
      <View style={styles.botAvatar}>
        <MaterialCommunityIcons name="robot-outline" size={16} color={C.white} />
      </View>
      <View style={styles.typingBubble}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

export default function CustomerAIChatScreen({ navigation }) {
  const scrollRef = useRef(null);
  const recordingRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const busyRef = useRef({ loading: false, transcribing: false, isRecording: false });
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [loadingSessionId, setLoadingSessionId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  function clearRecordingTimer() {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  }

  function startRecordingTimer() {
    clearRecordingTimer();
    setRecordingSeconds(0);
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((value) => value + 1);
    }, 1000);
  }

  function formatRecordingTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  const speakText = useCallback((text) => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, []);

  const loadSessionMessages = useCallback(async (sessionId) => {
    if (busyRef.current.loading || busyRef.current.transcribing || busyRef.current.isRecording) {
      return;
    }
    if (!sessionId) return;
    setLoadingSessionId(sessionId);
    try {
      const result = await fetchAiChatSessionMessagesAPI(sessionId);
      const apiMessages = Array.isArray(result?.messages) ? result.messages : [];
      const mappedMessages = apiMessages.map(mapApiMessage);

      setActiveSessionId(sessionId);
      setMessages([
        WELCOME_MESSAGE,
        ...mappedMessages,
      ]);
      setInput("");
      setHistoryVisible(false);
    } catch (error) {
      Alert.alert("Chat history", error?.message || "Unable to open this chat.");
    } finally {
      setLoadingSessionId(null);
    }
  }, []);

  const startNewChat = useCallback(async () => {
    if (busyRef.current.loading || busyRef.current.transcribing || busyRef.current.isRecording) {
      Alert.alert("Busy", "Please wait until the current response finishes.");
      return;
    }
    try {
      const result = await createAiChatSessionAPI({ title: "New chat" });
      const session = result?.session;
      if (!session?.sessionId) {
        throw new Error("Unable to create a new chat.");
      }

      setActiveSessionId(session.sessionId);
      setMessages(INITIAL_MESSAGES);
      setInput("");
      setHistoryVisible(false);
      setSessions((prev) => [session, ...prev.filter((item) => item.sessionId !== session.sessionId)]);
    } catch (error) {
      Alert.alert("New chat", error?.message || "Unable to create a new chat.");
    }
  }, []);

  const loadSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const result = await fetchAiChatSessionsAPI();
      const remoteSessions = Array.isArray(result?.sessions) ? result.sessions : [];
      setSessions(remoteSessions);
    } catch (error) {
      console.warn("Unable to load AI chat sessions:", error?.message || error);
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollToEnd?.({ animated: true });
  }, [messages, loading]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    busyRef.current = { loading, transcribing, isRecording };
  }, [loading, transcribing, isRecording]);

  useEffect(() => {
    return () => {
      try {
        clearRecordingTimer();
        recordingRef.current?.stopAndUnloadAsync?.().catch(() => {});
      } catch {}
    };
  }, []);

  useEffect(() => {
    if (!isRecording && recordingRef.current) {
      recordingRef.current = null;
    }
  }, [isRecording]);

  const sendMessage = useCallback(
    async (value = input) => {
      const trimmed = String(value || "").trim();
      if (!trimmed || loading || transcribing || isRecording) return;

      let sessionIdToUse = activeSessionId;
      if (!sessionIdToUse) {
        try {
          const created = await createAiChatSessionAPI({ title: "New chat" });
          sessionIdToUse = created?.session?.sessionId || null;
          if (sessionIdToUse && created?.session) {
            setActiveSessionId(sessionIdToUse);
            setSessions((prev) => [
              created.session,
              ...prev.filter((item) => item.sessionId !== sessionIdToUse),
            ]);
          }
        } catch (error) {
          console.warn("Unable to create chat session before sending:", error?.message || error);
        }
      }

      const userMessage = {
        id: `${Date.now()}-user`,
        role: "user",
        text: trimmed,
        time: currentTime(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setLoading(true);

      try {
        const result = await sendAiChatAPI({
          sessionId: sessionIdToUse,
          message: trimmed,
        });

        const replyText =
          result?.success && result?.reply
            ? result.reply
            : result?.message || "I'm unable to answer right now. Please try again in a moment.";

        if (result?.sessionId) {
          setActiveSessionId(result.sessionId);
        }
        if (result?.session) {
          setSessions((prev) => [
            result.session,
            ...prev.filter((item) => item.sessionId !== result.session.sessionId),
          ]);
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-assistant`,
            role: "assistant",
            text: replyText,
            time: currentTime(),
          },
        ]);

        speakText(replyText);
      } catch (error) {
        Alert.alert("AI Chat", error?.message || "Unable to send your message.");
      } finally {
        setLoading(false);
      }
    },
    [activeSessionId, input, isRecording, loading, speakText, transcribing]
  );

  const startRecording = useCallback(async () => {
    if (loading || transcribing || isRecording) return;
    if (!Audio) {
      Alert.alert("Voice input", "Voice recording is not available in the web preview.");
      return;
    }

    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Microphone permission",
          "Please allow microphone access so we can record your question."
        );
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      setIsRecording(true);
      startRecordingTimer();
    } catch (error) {
      Alert.alert("Recording error", error?.message || "Unable to start recording.");
      setIsRecording(false);
      clearRecordingTimer();
    }
  }, [isRecording, loading, transcribing]);

  const stopRecording = useCallback(async () => {
    if (!recordingRef.current) return;
    if (!Audio) return;

    try {
      const recording = recordingRef.current;
      setIsRecording(false);
      clearRecordingTimer();

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      recordingRef.current = null;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      }).catch(() => {});

      if (!uri) {
        Alert.alert("Voice input", "Could not read the recorded audio.");
        return;
      }

      setTranscribing(true);
      const fileName = `voice-question-${Date.now()}.m4a`;
      const result = await transcribeAiVoiceAPI({
        uri,
        name: fileName,
        type: "audio/m4a",
      });

      const transcript = result?.success ? String(result?.text || "").trim() : "";
      if (!transcript) {
        const message =
          result?.message || "I could not understand the voice clearly. Please try again.";
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-assistant-error`,
            role: "assistant",
            text: message,
            time: currentTime(),
          },
        ]);
        return;
      }

      setInput(transcript);
      setTranscribing(false);
      await sendMessage(transcript);
    } catch (error) {
      Alert.alert("Voice input", error?.message || "Unable to send voice question.");
    } finally {
      setTranscribing(false);
      clearRecordingTimer();
    }
  }, [sendMessage]);

  const handleMicPress = useCallback(async () => {
    if (isRecording) {
      await stopRecording();
      return;
    }
    await startRecording();
  }, [isRecording, startRecording, stopRecording]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={C.text} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>AI Chat</Text>
          <Text style={styles.headerSub}>Ask anything about your shop, orders or support</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.glassIconBtn}
            onPress={() => setHistoryVisible(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="time-outline" size={18} color={C.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.glassIconBtn, (loading || transcribing || isRecording) && styles.glassIconBtnDisabled]}
            onPress={startNewChat}
            activeOpacity={0.85}
            disabled={loading || transcribing || isRecording}
          >
            <Ionicons name="add" size={18} color={C.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={historyVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setHistoryVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <TouchableOpacity
            style={styles.modalScrim}
            activeOpacity={1}
            onPress={() => setHistoryVisible(false)}
          />

          <View style={styles.historySheet}>
            <View style={styles.historyTopRow}>
              <View>
                <Text style={styles.historyTitle}>Chat History</Text>
                <Text style={styles.historySub}>Open older conversations or start fresh.</Text>
              </View>
              <TouchableOpacity
                style={styles.historyClose}
                onPress={() => setHistoryVisible(false)}
              >
                <Ionicons name="close" size={18} color={C.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.newChatCard, (loading || transcribing || isRecording) && styles.disabledCard]}
              onPress={startNewChat}
              activeOpacity={0.9}
              disabled={loading || transcribing || isRecording}
            >
              <View style={styles.newChatIcon}>
                <Ionicons name="chatbubble-ellipses-outline" size={18} color={C.white} />
              </View>
              <View style={styles.newChatTextWrap}>
                <Text style={styles.newChatTitle}>Start new chat</Text>
                <Text style={styles.newChatSub}>Create a fresh conversation thread.</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={C.muted} />
            </TouchableOpacity>

            <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
              {sessionsLoading ? (
                <View style={styles.historyLoading}>
                  <ActivityIndicator color={C.primary} />
                </View>
              ) : sessions.length > 0 ? (
                sessions.map((session) => {
                  const active = session.sessionId === activeSessionId;
                  const loadingSession = loadingSessionId === session.sessionId;
                  return (
                    <TouchableOpacity
                      key={session.sessionId}
                      style={[styles.historyItem, active && styles.historyItemActive]}
                      onPress={() => loadSessionMessages(session.sessionId)}
                      activeOpacity={0.9}
                      disabled={loadingSession || loading || transcribing || isRecording}
                    >
                      <View style={styles.historyItemIcon}>
                        <Ionicons name="time-outline" size={16} color={C.primary} />
                      </View>
                      <View style={styles.historyItemBody}>
                        <View style={styles.historyItemTop}>
                          <Text style={styles.historyItemTitle} numberOfLines={1}>
                            {session.title || "New chat"}
                          </Text>
                          {loadingSession ? <ActivityIndicator size="small" color={C.primary} /> : null}
                        </View>
                        <Text style={styles.historyItemPreview} numberOfLines={2}>
                          {session.lastMessagePreview || "No messages yet."}
                        </Text>
                        <Text style={styles.historyItemMeta}>
                          {formatChatDate(session.updatedAt)}
                          {session.messageCount ? ` • ${session.messageCount} msgs` : ""}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View style={styles.historyEmpty}>
                  <Ionicons name="chatbubbles-outline" size={24} color={C.muted} />
                  <Text style={styles.historyEmptyTitle}>No history yet</Text>
                  <Text style={styles.historyEmptySub}>
                    Your chat sessions will appear here after you send a message.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.hero}>
            <View style={styles.heroIcon}>
              <Ionicons name="sparkles-outline" size={30} color={C.white} />
            </View>
            <Text style={styles.heroTitle}>How can I help you today?</Text>
            <Text style={styles.heroSub}>
              Ask anything about the app or any general topic, or record your voice.
            </Text>
          </View>

          <Text style={styles.sectionLabel}>Chat</Text>
          <View style={styles.chatCard}>
            {messages.map((item) => (
              <Bubble key={item.id} item={item} onSpeak={speakText} />
            ))}
            {loading ? <TypingDots /> : null}
          </View>
        </ScrollView>

        <View style={styles.inputWrap}>
          {isRecording ? (
            <View style={styles.recordingBar}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>
                Recording {formatRecordingTime(recordingSeconds)} • Tap mic to stop
              </Text>
            </View>
          ) : null}

          {transcribing ? (
            <View style={styles.transcribingBar}>
              <Text style={styles.transcribingText}>Converting voice to text...</Text>
            </View>
          ) : null}

          <View style={styles.inputBar}>
            <TouchableOpacity style={styles.micBtn} onPress={handleMicPress} activeOpacity={0.85}>
              <Ionicons
                name={isRecording ? "stop" : "mic-outline"}
                size={20}
                color={isRecording ? C.white : C.primary}
              />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Type your question..."
              placeholderTextColor={C.muted}
              value={input}
              onChangeText={setInput}
              multiline
              editable={!loading && !transcribing && !isRecording}
            />

            <TouchableOpacity
              style={[
                styles.sendBtn,
                (!input.trim() || loading || transcribing || isRecording) &&
                  styles.sendBtnDisabled,
              ]}
              onPress={() => sendMessage()}
              disabled={!input.trim() || loading || transcribing || isRecording}
              activeOpacity={0.9}
            >
              <Ionicons name="send" size={18} color={C.white} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  flex: {
    flex: 1,
  },
  header: {
    backgroundColor: C.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: Platform.OS === "android" ? 42 : 58,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: C.text,
    textAlign: "center",
  },
  headerSub: {
    fontSize: 11.5,
    color: C.muted,
    textAlign: "center",
    marginTop: 2,
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  glassIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.62)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.86)",
    elevation: 4,
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0px 8px 12px rgba(148,163,184,0.16)",
        }
      : {
          shadowColor: "#94A3B8",
          shadowOpacity: 0.16,
          shadowOffset: { width: 0, height: 8 },
          shadowRadius: 12,
        }),
  },
  glassIconBtnDisabled: {
    opacity: 0.55,
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 110,
  },
  hero: {
    backgroundColor: C.primary,
    borderRadius: 26,
    padding: 22,
    alignItems: "center",
    marginBottom: 16,
  },
  heroIcon: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.13)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  heroTitle: {
    color: C.white,
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },
  heroSub: {
    color: "rgba(255,255,255,0.82)",
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    fontWeight: "600",
  },
  sectionLabel: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginLeft: 4,
    marginBottom: 10,
  },
  chatCard: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 22,
    padding: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  rowLeft: {
    alignSelf: "flex-start",
  },
  rowRight: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  botAvatar: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  bubble: {
    maxWidth: "82%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  assistantBubble: {
    backgroundColor: C.softBlue,
    borderTopLeftRadius: 6,
  },
  userBubble: {
    backgroundColor: C.userBg,
    borderTopRightRadius: 6,
  },
  bubbleText: {
    color: C.text,
    fontSize: 14.5,
    lineHeight: 21,
    fontWeight: "600",
  },
  userText: {
    color: C.white,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 5,
  },
  timeText: {
    color: C.muted,
    fontSize: 10.5,
    fontWeight: "600",
  },
  userTimeText: {
    color: "rgba(255,255,255,0.72)",
  },
  speakerBtn: {
    marginLeft: 8,
    padding: 4,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.softBlue,
    borderRadius: 18,
    borderTopLeftRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.blue,
    marginRight: 5,
    opacity: 0.75,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  inputWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 26 : 14,
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  recordingBar: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#FFF1F2",
    borderWidth: 1,
    borderColor: "#FECDD3",
    marginBottom: 8,
  },
  recordingDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#E11D48",
    marginRight: 8,
  },
  recordingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#BE123C",
  },
  transcribingBar: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
    marginBottom: 8,
  },
  transcribingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1D4ED8",
  },
  micBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    minHeight: 46,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: C.text,
    backgroundColor: "#FBFCFE",
    fontSize: 14,
    fontWeight: "600",
  },
  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    opacity: 0.45,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.35)",
  },
  modalScrim: {
    ...StyleSheet.absoluteFillObject,
  },
  historySheet: {
    backgroundColor: "rgba(255,255,255,0.96)",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: Platform.OS === "ios" ? 24 : 16,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    maxHeight: "82%",
  },
  historyTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 12,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: C.text,
  },
  historySub: {
    marginTop: 4,
    color: C.muted,
    fontSize: 12.5,
    fontWeight: "600",
  },
  historyClose: {
    width: 36,
    height: 36,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
  },
  newChatCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
  },
  disabledCard: {
    opacity: 0.65,
  },
  newChatIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.primary,
    marginRight: 12,
  },
  newChatTextWrap: {
    flex: 1,
    paddingRight: 10,
  },
  newChatTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: C.text,
  },
  newChatSub: {
    marginTop: 2,
    color: C.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  historyList: {
    maxHeight: 420,
  },
  historyLoading: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    marginBottom: 10,
  },
  historyItemActive: {
    borderColor: "rgba(8,40,67,0.22)",
    backgroundColor: "#F8FBFF",
  },
  historyItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    marginRight: 10,
  },
  historyItemBody: {
    flex: 1,
  },
  historyItemTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  historyItemTitle: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: "800",
    color: C.text,
  },
  historyItemPreview: {
    marginTop: 4,
    color: C.muted,
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: "600",
  },
  historyItemMeta: {
    marginTop: 6,
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "700",
  },
  historyEmpty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    paddingHorizontal: 12,
  },
  historyEmptyTitle: {
    marginTop: 8,
    color: C.text,
    fontSize: 15,
    fontWeight: "800",
  },
  historyEmptySub: {
    marginTop: 6,
    textAlign: "center",
    color: C.muted,
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: "600",
  },
});
