package com.eventPlatform.backend.repository;

import com.eventPlatform.backend.entity.Messages;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessagesRepository  extends JpaRepository<Messages, Long> {
    List<Messages> findByRecipientId(Long RecipientId);
    List<Messages> findBySenderId(Long SenderId);
    List<Messages> findByRecipientIdAndStatus(Long RecipientId, boolean Status);
}
