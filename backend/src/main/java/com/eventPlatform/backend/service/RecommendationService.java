package com.eventPlatform.backend.service;

import com.eventPlatform.backend.DTO.RecommendationFlag;
import com.eventPlatform.backend.DTO.RecommendationResponse;
import com.eventPlatform.backend.DTO.ScoredEvent;
import com.eventPlatform.backend.entity.Booking;
import com.eventPlatform.backend.entity.Event;
import com.eventPlatform.backend.repository.BookingRepository;
import com.eventPlatform.backend.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RecommendationService {
    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final MatrixFactorizationService matrixFactorizationService;
    private final ColdStartService coldStartService;

    private int N =10; //top events

    public RecommendationService(BookingRepository bookingRepository,
                                 EventRepository eventRepository,
                                 MatrixFactorizationService matrixFactorizationService,
                                 ColdStartService coldStartService) {
        this.bookingRepository = bookingRepository;
        this.eventRepository = eventRepository;
        this.matrixFactorizationService = matrixFactorizationService;
        this.coldStartService = coldStartService;
    }

    public List<RecommendationResponse> getRecommendations(Long userId) {
        List<Event> candidateEvents = getCandidateEvents(userId);
        List<ScoredEvent> scoredEvents = calculateScores(userId,candidateEvents);

        return createRecommendations(scoredEvents);
    }

    public List<Event> getUserHistory(Long userId){
        List<Booking> userBookings = bookingRepository.findByAttendeeId(userId);
        List<Event> visitedEvents = new ArrayList<>();

        for (Booking booking : userBookings) {
            visitedEvents.add(booking.getEvent());
        }

        return visitedEvents;
    }

    public List<Event> getCandidateEvents(Long userId) {
        List<Event> allEvents = eventRepository.findAll();
        List<Event> visitedEvents = getUserHistory(userId);
        List<Event> candidateEvents = new ArrayList<>();

        for (Event event : allEvents) {
            boolean visited = false;

            for (Event visitedEvent : visitedEvents) {
                if (event.getId().equals(visitedEvent.getId())) {
                    visited = true;
                    break;
                }
            }
            if (!visited) {
                candidateEvents.add(event);
            }
        }
        return candidateEvents;
    }

    public List<ScoredEvent> calculateScores(Long userId, List<Event> candidateEvents) {

        List<ScoredEvent> scores = new ArrayList<>();

        RecommendationFlag userProfile = coldStartService.createUserProfile(userId);
        int flag = userProfile.getFlag();
        List<Long> coldStartEventIds = new ArrayList<>();

        for (Event event : candidateEvents) {
            if (!matrixFactorizationService.hasEvent(event.getId())) {
                coldStartEventIds.add(event.getId());
            }
        }

        Map<Long, List<Double>> coldStartFeatures = matrixFactorizationService.getEventFeatures(coldStartEventIds);

        List<Long> allCandidateEventIds = new ArrayList<>();

        for (Event event : candidateEvents) {
            allCandidateEventIds.add(event.getId());
        }

        Map<Long, List<Double>> allCandidateFeatures = matrixFactorizationService.getEventFeatures(allCandidateEventIds);

        for (Event event : candidateEvents) {
            double score;

            if(flag  ==1) {
                //has bookings
                if (matrixFactorizationService.hasEvent(event.getId())&& matrixFactorizationService.hasUser(userId)) {
                    double mfScore = matrixFactorizationService.predict(userId, event.getId());
                    score = mfScore;
                }else {
                    List<Double> eventFeatures = allCandidateFeatures.get(event.getId());
                    score = coldStartService.calculateColdStartScore(userProfile.getUserProfile(), eventFeatures);
                }

            }else if(flag ==2){
                //has event visits
                List<Double> eventFeatures = allCandidateFeatures.get(event.getId());
                score = coldStartService.calculateColdStartScore(userProfile.getUserProfile(), eventFeatures);
            }else if(flag ==3){
                //has none
                if (matrixFactorizationService.hasEvent(event.getId())&& matrixFactorizationService.hasUser(userId)) {
                    score = matrixFactorizationService.predict(userId, event.getId());
                } else {
                    List<Double> eventFeatures = coldStartFeatures.get(event.getId());
                    score = coldStartService.calculateColdStartScore(userProfile.getUserProfile(), eventFeatures);
                }

            }else{
                //error case
                if (matrixFactorizationService.hasEvent(event.getId())&& matrixFactorizationService.hasUser(userId) ) {
                    score = matrixFactorizationService.predict(userId, event.getId());
                } else {
                    List<Double> eventFeatures = coldStartFeatures.get(event.getId());
                    score = coldStartService.calculateColdStartScore(userProfile.getUserProfile(), eventFeatures);
                }

            }

            ScoredEvent temp = new ScoredEvent(event, score);
            scores.add(temp);
        }

        return scores;
    }

    public List<RecommendationResponse> createRecommendations(List<ScoredEvent>scoredEvents){
        scoredEvents.sort(Comparator.comparing((ScoredEvent scoredEvent) ->scoredEvent.getScore()).reversed());
        List<RecommendationResponse> recommendationResponses = new ArrayList<>();
        for(int i=0;i < N && i < scoredEvents.size();i++){
            RecommendationResponse temp = new RecommendationResponse(scoredEvents.get(i).getEvent().getId(),scoredEvents.get(i).getEvent().getTitle(), scoredEvents.get(i).getScore());
            recommendationResponses.add(temp);

        }
        return recommendationResponses;
    }
}
