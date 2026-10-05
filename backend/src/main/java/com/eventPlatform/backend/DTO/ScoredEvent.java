package com.eventPlatform.backend.DTO;

import com.eventPlatform.backend.entity.Event;

public class ScoredEvent {
    private Event event;
    private double score;
    public ScoredEvent(Event event, double score) {
        this.event = event;
        this.score = score;
    }
    public Event getEvent() {
        return event;
    }
    public void setEvent(Event event) {
        this.event = event;
    }
    public double getScore() {
        return score;
    }
    public void setScore(double score) {
        this.score = score;
    }
}
