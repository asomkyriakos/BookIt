package com.eventPlatform.backend.DTO;

public class Interaction {
    private Long userId;
    private Long eventId;
    private Double preference;

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public Long getEventId() {
        return eventId;
    }
    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }
    public Double getPreference() {
        return preference;
    }
    public void setPreference(Double preference) {
        this.preference = preference;
    }

}
