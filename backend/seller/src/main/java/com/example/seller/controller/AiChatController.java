package com.example.seller.controller;

import com.example.seller.service.AiChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiChatController {

    private final AiChatService aiChatService;

    public AiChatController(AiChatService aiChatService) {
        this.aiChatService = aiChatService;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(aiChatService.chat(request));
    }

    @PostMapping("/sessions")
    public ResponseEntity<Map<String, Object>> createSession(@RequestBody(required = false) Map<String, Object> request) {
        return ResponseEntity.ok(aiChatService.createSession(request == null ? Map.of() : request));
    }

    @GetMapping("/sessions")
    public ResponseEntity<Map<String, Object>> listSessions() {
        return ResponseEntity.ok(aiChatService.listSessions());
    }

    @GetMapping("/sessions/{sessionId}")
    public ResponseEntity<Map<String, Object>> getSession(@PathVariable String sessionId) {
        return ResponseEntity.ok(aiChatService.getSession(sessionId));
    }

    @GetMapping("/sessions/{sessionId}/messages")
    public ResponseEntity<Map<String, Object>> getSessionMessages(@PathVariable String sessionId) {
        return ResponseEntity.ok(aiChatService.getSessionMessages(sessionId));
    }

    @PostMapping(value = "/transcribe", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, Object>> transcribe(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(aiChatService.transcribe(file));
    }
}
