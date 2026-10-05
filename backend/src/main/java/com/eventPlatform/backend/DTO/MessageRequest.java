package com.eventPlatform.backend.DTO;

public class MessageRequest {
    private Long receiverId;
    private String subject;
    private String body;

    public Long getReceiverId() {
        return receiverId;
    }

    public String getSubject() {
        return subject;
    }

    public String getBody() {
        return body;
    }
}
