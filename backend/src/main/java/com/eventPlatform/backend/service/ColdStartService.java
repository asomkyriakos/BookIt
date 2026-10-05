package com.eventPlatform.backend.service;

import com.eventPlatform.backend.DTO.Interaction;
import com.eventPlatform.backend.DTO.RecommendationFlag;
import com.eventPlatform.backend.entity.EventView;
import com.eventPlatform.backend.entity.Booking;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.lang.Math.sqrt;

//a service worth killing myself for
@Service
public class ColdStartService {

    private final MatrixFactorizationService matrixFactorizationService;
    private final EventViewService eventViewService;
    private final BookingService bookingService;

    public ColdStartService(MatrixFactorizationService matrixFactorizationService,  EventViewService eventViewService, BookingService bookingService) {
        this.matrixFactorizationService = matrixFactorizationService;
        this.eventViewService = eventViewService;
        this.bookingService = bookingService;
    }

    public RecommendationFlag createUserProfile(Long userId) {

        List<Double> userProfile = new ArrayList<>();
        RecommendationFlag userProfileAnswer= new RecommendationFlag(null,0);

        for (int i = 0; i < 100; i++) {
            userProfile.add(0.0);
        }
        int flag=0;
        List<EventView> eventViews = eventViewService.findByUserId(userId);

        List<Booking> userBookings = bookingService.getBookingsByUser(userId);

        //has bookings
        if(!(userBookings.isEmpty())){
            flag=1;
            List<Long> eventIds = new ArrayList<>();


            for (Booking userBooking : userBookings) {
                eventIds.add(userBooking.getEvent().getId());
            }

            Map<Long, List<Double>> eventFeaturesMap = matrixFactorizationService.getEventFeatures(eventIds);

            int totalBookings = 0;

            for (Booking userBooking : userBookings) {

                Long eventId = userBooking.getEvent().getId();
                int bookingCount = 1;

                List<Double> eventFeatures = eventFeaturesMap.get(eventId);

                if (eventFeatures == null || eventFeatures.size() != 100) {
                    continue;
                }

                for (int i = 0; i < 100; i++) {
                    userProfile.set(i, userProfile.get(i) + bookingCount * eventFeatures.get(i));
                }

                totalBookings += bookingCount;
            }

            userProfileAnswer.setUserProfile(userProfile);
            userProfileAnswer.setFlag(flag);

            if (totalBookings == 0) {
                return userProfileAnswer;
            }

            for (int i = 0; i < 100; i++) {
                userProfile.set(i, userProfile.get(i) / totalBookings);
            }
            userProfileAnswer.setUserProfile(userProfile);

            return userProfileAnswer;

        }else {
            //visits δεν υπαρχουν
            flag=2;
            if (eventViews.isEmpty()) {
                flag =3;
                List<Interaction> interactions = matrixFactorizationService.getUserInteractions(userId);

                List<Long> eventIds = new ArrayList<>();

                for (Interaction interaction : interactions) {
                    eventIds.add(interaction.getEventId());
                }

                Map<Long, List<Double>> eventFeaturesMap = matrixFactorizationService.getEventFeatures(eventIds);

                int interactionCount = 0;

                for (Interaction interaction : interactions) {

                    Long eventId = interaction.getEventId();
                    double weight = interaction.getPreference();

                    List<Double> eventFeatures = eventFeaturesMap.get(eventId);

                    if (eventFeatures == null || eventFeatures.size() != 100) {
                        continue;
                    }

                    for (int i = 0; i < 100; i++) {
                        userProfile.set(i, userProfile.get(i) + weight * eventFeatures.get(i));
                    }

                    interactionCount++;
                }

                userProfileAnswer.setUserProfile(userProfile);
                userProfileAnswer.setFlag(flag);

                if (interactionCount == 0) {
                    return userProfileAnswer;
                }

                for (int i = 0; i < 100; i++) {
                    userProfile.set(i, userProfile.get(i) / interactionCount);
                }

                userProfileAnswer.setUserProfile(userProfile);

                return userProfileAnswer;
            }

            //visits υπαρχουν
            flag=2;
            List<Long> eventIds = new ArrayList<>();

            for (EventView eventView : eventViews) {
                eventIds.add(eventView.getEvent().getId());
            }

            Map<Long, List<Double>> eventFeaturesMap = matrixFactorizationService.getEventFeatures(eventIds);

            int totalVisits = 0;

            for (EventView eventView : eventViews) {

                Long eventId = eventView.getEvent().getId();
                int visitCount = eventView.getVisitCount();

                List<Double> eventFeatures = eventFeaturesMap.get(eventId);

                if (eventFeatures == null || eventFeatures.size() != 100) {
                    continue;
                }

                for (int i = 0; i < 100; i++) {
                    userProfile.set(i, userProfile.get(i) + visitCount * eventFeatures.get(i));
                }

                totalVisits += visitCount;
            }

            userProfileAnswer.setUserProfile(userProfile);
            userProfileAnswer.setFlag(flag);

            if (totalVisits == 0) {
                return userProfileAnswer;
            }

            for (int i = 0; i < 100; i++) {
                userProfile.set(i, userProfile.get(i) / totalVisits);
            }

            userProfileAnswer.setUserProfile(userProfile);
            return userProfileAnswer;
        }
    }

    public List<Double> getEventFeatures(Long eventId) {
        return matrixFactorizationService.getEventFeatures(eventId);
    }


    public double calculateColdStartScore(List<Double> userProfile, List<Double> eventFeatures) {

        if (eventFeatures.size() != 100) {
            return 0.0;
        }

        double dotProduct = 0.0;
        double userMagnitude = 0.0;
        double eventMagnitude = 0.0;

        for (int i = 0; i < 100; i++) {
            dotProduct += userProfile.get(i) * eventFeatures.get(i);
            userMagnitude += userProfile.get(i) * userProfile.get(i);
            eventMagnitude += eventFeatures.get(i) * eventFeatures.get(i);
        }

        userMagnitude = Math.sqrt(userMagnitude);
        eventMagnitude = Math.sqrt(eventMagnitude);


        if (userMagnitude == 0.0 || eventMagnitude == 0.0) {
            return 0.0;
        }

        return dotProduct / (userMagnitude * eventMagnitude);
    }


}
