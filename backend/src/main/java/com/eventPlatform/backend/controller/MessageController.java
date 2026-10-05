package com.eventPlatform.backend.controller;

import com.eventPlatform.backend.DTO.MessageRequest;
import com.eventPlatform.backend.DTO.MessageResponse;
import com.eventPlatform.backend.DTO.UserResponse;
import com.eventPlatform.backend.entity.Messages;
import com.eventPlatform.backend.entity.User;
import com.eventPlatform.backend.service.BookingService;
import com.eventPlatform.backend.service.EventService;
import com.eventPlatform.backend.service.MessagesService;
import com.eventPlatform.backend.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController

@RequestMapping("/api/messages")
public class MessageController {

    private final EventService eventService;
    private final MessagesService messagesService;
    private final UserService userService;

    public MessageController(EventService eventService , MessagesService messagesService , UserService userService) {
        this.eventService = eventService;
        this.messagesService = messagesService;
        this.userService = userService;
    }

    @PostMapping
    public Messages createMessages(@RequestBody MessageRequest messageRequest,Authentication authentication) {
        if(authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Not logged in");
        }
        Long userId = Long.parseLong(authentication.getName());
        return messagesService.saveMessages(messageRequest, userId);
    }

    @GetMapping("/sentMessages")
    public List<MessageResponse> getSentMessages(Authentication authentication) {

        Long userId = Long.parseLong(authentication.getName());
        List<Messages> messages = messagesService.getMessagesBySenderId(userId);
        List<MessageResponse> messageResponse = new ArrayList<>();
        for (Messages u : messages) {
            messageResponse.add(new MessageResponse(
                    u.getId(),
                    u.getSender().getId(),
                    u.getSender().getFirstName() + " " + u.getSender().getLastName(),
                    u.getRecipient().getId(),
                    u.getRecipient().getFirstName() + " " + u.getRecipient().getLastName(),
                    u.getSubject(),
                    u.getMessage(),
                    u.getStatus(),
                    u.getCreatedAt()
            ));
        }
        return messageResponse;
    }


    @GetMapping("/receivedMessages")
    public List<MessageResponse> getReceivedMessages(Authentication authentication) {
        if(authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Not logged in");
        }
        Long userId = Long.parseLong(authentication.getName());
        List<Messages> messages = messagesService.getMessagesByRecipientId(userId);
        List<MessageResponse> messageResponse = new ArrayList<>();
        for (Messages u : messages) {
            messageResponse.add(new MessageResponse(
                    u.getId(),
                    u.getSender().getId(),
                    u.getSender().getFirstName() + " " + u.getSender().getLastName(),
                    u.getRecipient().getId(),
                    u.getRecipient().getFirstName() + " " + u.getRecipient().getLastName(),
                    u.getSubject(),
                    u.getMessage(),
                    u.getStatus(),
                    u.getCreatedAt()
            ));
        }
        return messageResponse;
    }

    @GetMapping("/getAllReadMessages")
    public List<Messages> getAllReadMessages(Authentication authentication) {
        if(authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Not logged in");
        }
        Long userId = Long.parseLong(authentication.getName());
        return messagesService.getMessagesByRecipientIdAndStatus(userId , true);
    }

    @DeleteMapping("/deleteMessage/{id}")
    public void deleteMessages(Authentication authentication,@PathVariable Long id) {
        if(authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Not logged in");
        }
        messagesService.deleteMessage(id);
    }

    @PatchMapping("/{id}/read")
    public String  readMessages(Authentication authentication,@PathVariable Long id) {
        if(authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Not logged in");
        }
        messagesService.markMessagesAsRead(id);
        return "Message read";
    }

}
