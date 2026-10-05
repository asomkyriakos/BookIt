package com.eventPlatform.backend.service;

import com.eventPlatform.backend.DTO.MessageRequest;
import com.eventPlatform.backend.entity.Messages;
import com.eventPlatform.backend.repository.MessagesRepository;
import com.eventPlatform.backend.repository.UserRepository;
import java.time.LocalDate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessagesService {

    private final UserRepository userRepository;
    private final UserService userService;
    private MessagesRepository messagesRepository;

    public MessagesService(MessagesRepository messagesRepository, UserRepository userRepository, UserService userService) {
        this.messagesRepository = messagesRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    public List<Messages> getMessagesBySenderId(Long userId) {
        return messagesRepository.findBySenderId(userId);
    }
    public List<Messages> getMessagesByRecipientId(Long userId) {
        return messagesRepository.findByRecipientId(userId);
    }

    public Messages saveMessages(MessageRequest messageRequest , Long userId) {
        Messages messages = new Messages();
        String date = (LocalDate.now()).toString();

        messages.setSender(userService.findById(userId));
        messages.setRecipient(userService.findById(messageRequest.getReceiverId()));
        messages.setSubject(messageRequest.getSubject());
        messages.setMessage(messageRequest.getBody());
        messages.setStatus(false);
        messages.setCreatedAt(date);

        return messagesRepository.save(messages);
    }
    public List<Messages> getMessagesByRecipientIdAndStatus(Long userId,boolean status) {return messagesRepository.findByRecipientIdAndStatus(userId,status);}

    public void deleteMessage(Long id) {
        messagesRepository.deleteById(id);
    }

    public void markMessagesAsRead(Long messageId) {
        Messages messages = messagesRepository.findById(messageId).orElse(null);
        if (messages != null) {
            messages.setStatus(true);
            messagesRepository.save(messages);
        }
        

    }
}
