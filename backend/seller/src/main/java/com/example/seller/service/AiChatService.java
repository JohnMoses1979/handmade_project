package com.example.seller.service;

import com.example.seller.entity.AiChatMessage;
import com.example.seller.entity.AiChatSession;
import com.example.seller.repository.AiChatMessageRepository;
import com.example.seller.repository.AiChatSessionRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AiChatService {

    @Value("${groq.api.key:}")
    private String groqApiKey;

    @Value("${groq.chat.model:llama-3.3-70b-versatile}")
    private String groqModel;

    @Value("${groq.transcription.model:whisper-large-v3-turbo}")
    private String groqTranscriptionModel;

    private final AiChatSessionRepository chatSessionRepository;
    private final AiChatMessageRepository chatMessageRepository;
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public AiChatService(AiChatSessionRepository chatSessionRepository,
                         AiChatMessageRepository chatMessageRepository) {
        this.chatSessionRepository = chatSessionRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    public Map<String, Object> createSession(Map<String, Object> request) {
        String requestedSessionId = trimToNull(request.get("sessionId"));
        String title = trimToNull(request.get("title"));

        AiChatSession session = requestedSessionId == null
                ? new AiChatSession()
                : chatSessionRepository.findBySessionId(requestedSessionId).orElseGet(AiChatSession::new);

        if (session.getSessionId() == null || session.getSessionId().isBlank()) {
            session.setSessionId(requestedSessionId != null ? requestedSessionId : UUID.randomUUID().toString());
            session.setTitle(title == null ? "New chat" : title);
            session.setMessageCount(0);
            session.setLastMessagePreview(null);
            session.setCreatedAt(LocalDateTime.now());
        } else if (title != null) {
            session.setTitle(title);
        }

        session.touch();
        AiChatSession saved = chatSessionRepository.save(session);
        return Map.of(
                "success", true,
                "session", toSessionSummary(saved)
        );
    }

    public Map<String, Object> listSessions() {
        List<Map<String, Object>> sessions = chatSessionRepository.findAllByOrderByUpdatedAtDesc()
                .stream()
                .map(this::toSessionSummary)
                .toList();

        return Map.of(
                "success", true,
                "sessions", sessions
        );
    }

    public Map<String, Object> getSession(String sessionId) {
        Optional<AiChatSession> session = chatSessionRepository.findBySessionId(trimToEmpty(sessionId));
        if (session.isEmpty()) {
            return Map.of(
                    "success", false,
                    "message", "Chat session not found."
            );
        }

        return Map.of(
                "success", true,
                "session", toSessionSummary(session.get())
        );
    }

    public Map<String, Object> getSessionMessages(String sessionId) {
        String normalizedSessionId = trimToEmpty(sessionId);
        Optional<AiChatSession> session = chatSessionRepository.findBySessionId(normalizedSessionId);
        if (session.isEmpty()) {
            return Map.of(
                    "success", false,
                    "message", "Chat session not found."
            );
        }

        List<Map<String, Object>> messages = chatMessageRepository
                .findBySession_SessionIdOrderByCreatedAtAsc(normalizedSessionId)
                .stream()
                .map(this::toMessageMap)
                .toList();

        return Map.of(
                "success", true,
                "session", toSessionSummary(session.get()),
                "messages", messages
        );
    }

    public Map<String, Object> chat(Map<String, Object> request) {
        try {
            String message = extractUserMessage(request);
            if (message == null || message.isBlank()) {
                return Map.of(
                        "success", false,
                        "message", "A message is required."
                );
            }

            String sessionId = trimToNull(request.get("sessionId"));
            AiChatSession session = getOrCreateSession(sessionId, message);

            storeMessage(session, "user", message);
            session.touch();
            session.setMessageCount((session.getMessageCount() == null ? 0 : session.getMessageCount()) + 1);
            session.setLastMessagePreview(message);
            chatSessionRepository.save(session);

            if (groqApiKey == null || groqApiKey.isBlank()) {
                return Map.of(
                        "success", false,
                        "message", "Groq API key is not configured.",
                        "sessionId", session.getSessionId()
                );
            }

            List<Map<String, String>> finalMessages = new ArrayList<>();
            finalMessages.add(Map.of(
                    "role", "system",
                    "content",
                    """
                    You are a helpful ChatGPT-style assistant inside a shopping app.
                    Be warm, accurate, and practical.
                    Answer both app-related and general questions naturally.
                    Match the user's language: if they ask in Telugu, reply in Telugu; if they ask in English, reply in English.
                    If the question is about the app, help with products, orders, returns, refunds, complaints, payouts, addresses, sellers, and support.
                    If the question is unrelated to the app, still answer it helpfully instead of refusing.
                    If you do not know something, say so honestly and suggest the next best step.
                    Keep responses concise by default, but provide detail when the user asks for it.
                    """
            ));

            finalMessages.addAll(loadStoredConversation(session.getSessionId()));
            if (finalMessages.size() == 1) {
                finalMessages.add(Map.of("role", "user", "content", message));
            }

            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("model", groqModel);
            payload.put("messages", finalMessages);
            payload.put("temperature", 0.4);
            payload.put("max_completion_tokens", 600);

            HttpRequest requestObject = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.groq.com/openai/v1/chat/completions"))
                    .header("Authorization", "Bearer " + groqApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                    .build();

            HttpResponse<String> response = httpClient.send(requestObject, HttpResponse.BodyHandlers.ofString());
            Map<String, Object> responseBody = parseBody(response.body());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return Map.of(
                        "success", false,
                        "message", String.valueOf(responseBody.getOrDefault("error", responseBody.getOrDefault("message", "Groq chat failed")))
                );
            }

            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.getOrDefault("choices", List.of());
            Map<String, Object> firstChoice = choices.isEmpty() ? Map.of() : choices.get(0);
            Map<String, Object> choiceMessage = (Map<String, Object>) firstChoice.getOrDefault("message", Map.of());
            String content = String.valueOf(choiceMessage.getOrDefault("content", "")).trim();

            if (content.isBlank()) {
                content = "I'm unable to answer right now. Please try again in a moment.";
            }

            storeMessage(session, "assistant", content);
            session.touch();
            session.setMessageCount((session.getMessageCount() == null ? 0 : session.getMessageCount()) + 1);
            session.setLastMessagePreview(content);
            if (session.getTitle() == null || "New chat".equals(session.getTitle())) {
                session.setTitle(buildTitle(message));
            }
            chatSessionRepository.save(session);

            return Map.of(
                    "success", true,
                    "reply", content,
                    "model", groqModel,
                    "sessionId", session.getSessionId(),
                    "session", toSessionSummary(session)
            );
        } catch (Exception exception) {
            return Map.of(
                    "success", false,
                    "message", exception.getMessage() == null ? "Unable to chat right now." : exception.getMessage()
            );
        }
    }

    public Map<String, Object> transcribe(MultipartFile file) {
        try {
            if (groqApiKey == null || groqApiKey.isBlank()) {
                return Map.of(
                        "success", false,
                        "message", "Groq API key is not configured."
                );
            }
            if (file == null || file.isEmpty()) {
                return Map.of(
                        "success", false,
                        "message", "Audio file is required."
                );
            }

            String originalName = file.getOriginalFilename();
            String extension = resolveExtension(originalName, file.getContentType());
            String boundary = "----GroqBoundary" + UUID.randomUUID().toString().replace("-", "");
            byte[] multipartBody = buildMultipartBody(file, boundary, extension);

            HttpRequest requestObject = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.groq.com/openai/v1/audio/transcriptions"))
                    .header("Authorization", "Bearer " + groqApiKey)
                    .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                    .POST(HttpRequest.BodyPublishers.ofByteArray(multipartBody))
                    .build();

            HttpResponse<String> response = httpClient.send(requestObject, HttpResponse.BodyHandlers.ofString());
            Map<String, Object> responseBody = parseBody(response.body());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return Map.of(
                        "success", false,
                        "message", String.valueOf(responseBody.getOrDefault("error", responseBody.getOrDefault("message", "Audio transcription failed")))
                );
            }

            String text = String.valueOf(responseBody.getOrDefault("text", "")).trim();
            return Map.of(
                    "success", true,
                    "text", text,
                    "model", groqTranscriptionModel
            );
        } catch (Exception exception) {
            return Map.of(
                    "success", false,
                    "message", exception.getMessage() == null ? "Unable to transcribe audio right now." : exception.getMessage()
            );
        }
    }

    private List<Map<String, String>> normalizeMessages(Object rawMessages) {
        List<Map<String, String>> normalized = new ArrayList<>();
        if (!(rawMessages instanceof List<?> list)) {
            return normalized;
        }

        for (Object item : list) {
            if (!(item instanceof Map<?, ?> map)) {
                continue;
            }

            String role = String.valueOf(map.get("role")).trim();
            String content = String.valueOf(map.get("content")).trim();
            if (role.isBlank() || content.isBlank()) {
                continue;
            }
            if (!"user".equals(role) && !"assistant".equals(role) && !"system".equals(role)) {
                continue;
            }

            normalized.add(Map.of("role", role, "content", content));
        }

        return normalized;
    }

    private List<Map<String, String>> loadStoredConversation(String sessionId) {
        return chatMessageRepository.findBySession_SessionIdOrderByCreatedAtAsc(sessionId)
                .stream()
                .sorted(Comparator.comparing(AiChatMessage::getCreatedAt))
                .map(message -> Map.of(
                        "role", message.getRole(),
                        "content", message.getContent()
                ))
                .toList();
    }

    private AiChatSession getOrCreateSession(String sessionId, String firstMessage) {
        if (sessionId != null) {
            Optional<AiChatSession> existing = chatSessionRepository.findBySessionId(sessionId);
            if (existing.isPresent()) {
                return existing.get();
            }
        }

        AiChatSession session = new AiChatSession();
        session.setSessionId(sessionId != null ? sessionId : UUID.randomUUID().toString());
        session.setTitle(buildTitle(firstMessage));
        session.setMessageCount(0);
        session.setLastMessagePreview(null);
        session.setCreatedAt(LocalDateTime.now());
        session.touch();
        return chatSessionRepository.save(session);
    }

    private AiChatMessage storeMessage(AiChatSession session, String role, String content) {
        AiChatMessage chatMessage = new AiChatMessage();
        chatMessage.setSession(session);
        chatMessage.setRole(role);
        chatMessage.setContent(content);
        return chatMessageRepository.save(chatMessage);
    }

    private String extractUserMessage(Map<String, Object> request) {
        String directMessage = trimToNull(request.get("message"));
        if (directMessage != null) {
            return directMessage;
        }

        List<Map<String, String>> messages = normalizeMessages(request.get("messages"));
        for (int index = messages.size() - 1; index >= 0; index--) {
            Map<String, String> item = messages.get(index);
            if ("user".equals(item.get("role"))) {
                return trimToNull(item.get("content"));
            }
        }

        return null;
    }

    private Map<String, Object> toSessionSummary(AiChatSession session) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", session.getId());
        map.put("sessionId", session.getSessionId());
        map.put("title", session.getTitle());
        map.put("lastMessagePreview", session.getLastMessagePreview());
        map.put("messageCount", session.getMessageCount());
        map.put("createdAt", session.getCreatedAt());
        map.put("updatedAt", session.getUpdatedAt());
        return map;
    }

    private Map<String, Object> toMessageMap(AiChatMessage message) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", message.getId());
        map.put("role", message.getRole());
        map.put("content", message.getContent());
        map.put("createdAt", message.getCreatedAt());
        return map;
    }

    private String buildTitle(String message) {
        String trimmed = trimToEmpty(message);
        if (trimmed.isBlank()) {
            return "New chat";
        }
        String cleaned = trimmed.replaceAll("\\s+", " ");
        return cleaned.length() <= 36 ? cleaned : cleaned.substring(0, 36).trim() + "...";
    }

    private String trimToNull(Object value) {
        String text = trimToEmpty(value);
        return text.isBlank() ? null : text;
    }

    private String trimToEmpty(Object value) {
        return value == null ? "" : String.valueOf(value).trim();
    }

    private Map<String, Object> parseBody(String body) {
        try {
            return objectMapper.readValue(body, new TypeReference<Map<String, Object>>() {});
        } catch (Exception exception) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("message", body == null ? "" : body);
            return map;
        }
    }

    private byte[] buildMultipartBody(MultipartFile file, String boundary, String extension) throws IOException {
        String lineBreak = "\r\n";
        String fileName = sanitizeFileName(file.getOriginalFilename(), extension);
        String contentType = file.getContentType();
        if (contentType == null || contentType.isBlank()) {
            contentType = defaultContentType(extension);
        }

        byte[] fileBytes = file.getBytes();
        byte[] prefix = (
                "--" + boundary + lineBreak +
                "Content-Disposition: form-data; name=\"file\"; filename=\"" + fileName + "\"" + lineBreak +
                "Content-Type: " + contentType + lineBreak + lineBreak
        ).getBytes(StandardCharsets.UTF_8);

        byte[] modelPart = (
                lineBreak +
                "--" + boundary + lineBreak +
                "Content-Disposition: form-data; name=\"model\"" + lineBreak + lineBreak +
                groqTranscriptionModel + lineBreak +
                "--" + boundary + lineBreak +
                "Content-Disposition: form-data; name=\"response_format\"" + lineBreak + lineBreak +
                "json" + lineBreak +
                "--" + boundary + "--" + lineBreak
        ).getBytes(StandardCharsets.UTF_8);

        byte[] body = new byte[prefix.length + fileBytes.length + modelPart.length];
        System.arraycopy(prefix, 0, body, 0, prefix.length);
        System.arraycopy(fileBytes, 0, body, prefix.length, fileBytes.length);
        System.arraycopy(modelPart, 0, body, prefix.length + fileBytes.length, modelPart.length);
        return body;
    }

    private String resolveExtension(String fileName, String contentType) {
        if (fileName != null && fileName.contains(".")) {
            return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
        }
        if (contentType != null) {
            if (contentType.contains("webm")) return "webm";
            if (contentType.contains("mpeg")) return "mp3";
            if (contentType.contains("wav")) return "wav";
            if (contentType.contains("mp4")) return "mp4";
            if (contentType.contains("aac")) return "aac";
            if (contentType.contains("3gpp")) return "3gp";
            if (contentType.contains("caf")) return "caf";
        }
        return "m4a";
    }

    private String sanitizeFileName(String fileName, String extension) {
        String fallback = "voice-note." + extension;
        if (fileName == null || fileName.isBlank()) {
            return fallback;
        }
        String normalized = fileName.replaceAll("[\\r\\n\\t\"]", "_");
        return normalized.contains(".") ? normalized : normalized + "." + extension;
    }

    private String defaultContentType(String extension) {
        return switch (extension) {
            case "webm" -> "audio/webm";
            case "wav" -> "audio/wav";
            case "mp3" -> "audio/mpeg";
            case "mp4", "m4a" -> "audio/mp4";
            case "aac" -> "audio/aac";
            case "caf" -> "audio/x-caf";
            case "3gp" -> "audio/3gpp";
            default -> "application/octet-stream";
        };
    }
}
