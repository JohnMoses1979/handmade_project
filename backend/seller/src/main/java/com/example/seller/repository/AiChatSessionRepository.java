package com.example.seller.repository;

import com.example.seller.entity.AiChatSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AiChatSessionRepository extends JpaRepository<AiChatSession, Long> {
    Optional<AiChatSession> findBySessionId(String sessionId);
    List<AiChatSession> findAllByOrderByUpdatedAtDesc();
}
