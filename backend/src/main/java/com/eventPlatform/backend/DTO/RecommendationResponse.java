package com.eventPlatform.backend.DTO;

public class RecommendationResponse {

    private Long  eventId;
    private String title;
    private Double score;

    public RecommendationResponse(Long eventId, String title, Double score) {
        this.eventId = eventId;
        this.title = title;
        this.score = score;
    }

    public  Long getEventId() {
        return eventId;
    }
    public void setEventId(Long eventId) {
       this.eventId = eventId;
    }
    public String getTitle() {
       return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public Double getScore() {
        return score;
    }
    public void setScore(Double score) {
        this.score = score;
    }
}
