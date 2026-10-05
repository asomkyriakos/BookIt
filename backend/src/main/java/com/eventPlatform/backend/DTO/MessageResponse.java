package com.eventPlatform.backend.DTO;
import com.fasterxml.jackson.annotation.JsonProperty;

public class MessageResponse {
    private Long id;
    private Long senderId;
    private String senderName;
    private Long receiverId;
    private String receiverName;
    private String subject;
    private String body;
    @JsonProperty("isRead")
    private boolean isRead;
    private String createdAt;

    public MessageResponse(
            Long id,
            Long senderId,
            String senderName,
            Long receiverId,
            String receiverName,
            String subject,
            String body,
            boolean isRead,
            String createdAt
    ) {
        this.id = id;
        this.senderId = senderId;
        this.senderName = senderName;
        this.receiverId = receiverId;
        this.receiverName = receiverName;
        this.subject = subject;
        this.body = body;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public void setBody(String body) {
        this.body = body;
    }
    @JsonProperty("isRead")
    public void setRead(boolean read) {
        isRead = read;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getSenderId() {
        return senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public String getSubject() {
        return subject;
    }

    public String getBody() {
        return body;
    }
    @JsonProperty("isRead")
    public boolean isRead() {
        return isRead;
    }

    public String getCreatedAt() {
        return createdAt;
    }
}
