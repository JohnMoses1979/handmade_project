package com.example.seller.repository;

import com.example.seller.entity.AiChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AiChatMessageRepository extends JpaRepository<AiChatMessage, Long> {
    List<AiChatMessage> findBySession_SessionIdOrderByCreatedAtAsc(String sessionId);
}
