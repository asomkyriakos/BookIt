package com.eventPlatform.backend.service;

import com.eventPlatform.backend.DTO.Interaction;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Random;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MatrixFactorizationService {

    private Map<Long, Integer> userIndex = new HashMap<>();
    private Map<Long, Integer> eventIndex = new HashMap<>();

    private int factors = 20;

    private double[][] userFactors;
    private double[][] eventFactors;

    private double[] userBias;
    private double[] eventBias;

    private Map<Long, List<Interaction>> userInteractions = new HashMap<>();

    private double globalBias;

    @PostConstruct
    public void initialize() {
        trainModel();
    }

    public boolean hasUser(Long userId) {
        return userIndex.containsKey(userId);
    }

    private void createIndexes(List<Interaction> interactions) {

        int userCounter = 0;
        int eventCounter = 0;

        for (Interaction interaction : interactions) {

            Long userId = interaction.getUserId();
            Long eventId = interaction.getEventId();

            if (!userIndex.containsKey(userId)) {
                userIndex.put(userId, userCounter);
                userCounter++;
            }

            if (!eventIndex.containsKey(eventId)) {
                eventIndex.put(eventId, eventCounter);
                eventCounter++;
            }
        }
    } //περναω ολα τα interactions και δημιουργω maps

    public List<Interaction> loadTrainingData() {

        List<Interaction> interactions = new ArrayList<>();

        try {
            InputStream inputStream = getClass()
                    .getClassLoader()
                    .getResourceAsStream("recommender/event_interest.csv");

            if (inputStream == null) {
                throw new RuntimeException("event_interest.csv not found");
            }

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(inputStream)
            );
            reader.readLine();
            String line;
            while ((line = reader.readLine()) != null) {

                String[] values = line.split(",", -1);

                if (values.length < 6) {
                    continue;
                }

                if (values[0].isEmpty() || values[1].isEmpty()) {
                    continue;
                }

                Long userId = Long.parseLong(values[0]);
                Long eventId = Long.parseLong(values[1]);

                int interested = Integer.parseInt(values[4]);
                int notInterested = Integer.parseInt(values[5]);

                double preference;

                if (interested == 1) {
                    preference = 1.0;
                }
                else if (notInterested == 1) {
                    preference = -1.0;
                }
                else {
                    continue;
                }

                Interaction interaction = new Interaction();
                interaction.setUserId(userId);
                interaction.setEventId(eventId);
                interaction.setPreference(preference);

                interactions.add(interaction);
            }

            reader.close();

        } catch (IOException e) {
            throw new RuntimeException("Error loading training data", e);
        }

        return interactions;
    } //περναω τα data απο τα csv σε List με Interactions DTO

    public boolean hasEvent(Long eventId) {
        return eventIndex.containsKey(eventId);
    }

    private void initializeModel() {

        int numberOfUsers = userIndex.size();
        int numberOfEvents = eventIndex.size();

        userFactors = new double[numberOfUsers][factors];
        eventFactors = new double[numberOfEvents][factors];

        userBias = new double[numberOfUsers];
        eventBias = new double[numberOfEvents];

        Random random = new Random();

        for (int u = 0; u < numberOfUsers; u++) {
            for (int k = 0; k < factors; k++) {
                userFactors[u][k] = random.nextDouble() * 0.1;
            }
        }

        for (int i = 0; i < numberOfEvents; i++) {
            for (int k = 0; k < factors; k++) {
                eventFactors[i][k] = random.nextDouble() * 0.1;
            }
        }
    }
    
    public double calculateGlobalBias(List<Interaction> interactions){
        double N = interactions.size();
        double sum = 0;
        for  (Interaction interaction : interactions) {
            sum += interaction.getPreference();
        }

        return sum/N;
    }

    public void train(List<Interaction> interactions){
        double learningRate = 0.01;  //α
        double regularization = 0.02; //λ
        int epochs = 20;
        globalBias = calculateGlobalBias(interactions);
        for (int v = 0; v < epochs; v++) {

            for (Interaction interaction : interactions) {
                Long curUserId = interaction.getUserId();
                Long curEventId = interaction.getEventId();

                int u = userIndex.get(curUserId);
                int i = eventIndex.get(curEventId);
                Double r = interaction.getPreference(); //preference

                double notR = predict(interaction.getUserId(), interaction.getEventId()); //prediction
                double error = r - notR;

                userBias[u] += learningRate*(error - regularization*userBias[u]);
                eventBias[i] += learningRate*(error - regularization*eventBias[i]);
                for (int k = 0; k < factors; k++) {
                    double oldUserFactor = userFactors[u][k];
                    double oldEventFactor = eventFactors[i][k];
                    userFactors[u][k] += learningRate*(error*oldEventFactor- regularization*oldUserFactor);
                    eventFactors[i][k] += learningRate*(error*oldUserFactor - regularization*oldEventFactor);
                }

            }
        }

    }

    public double predict(Long userId, Long eventId){
        double prediction = 0.0;

        double μ= globalBias;
        double dotProduct = 0.0;
        //int u = userIndex.get(userId);
        //int i = eventIndex.get(eventId);

        Integer uIndex = userIndex.get(userId);
        if (uIndex == null) {
            return 0.0;
        }
        int u= uIndex;

        Integer iIndex = eventIndex.get(eventId);
        if (iIndex == null) {
            return 0.0;
        }
        int i = iIndex;

        double bu = userBias[u];
        double bi = eventBias[i];

        for (int k=0;k < factors;k++){
            dotProduct += userFactors[u][k] * eventFactors[i][k];
        }
        prediction = μ + bu + bi + dotProduct;
        return prediction;
    }

    public void trainModel() {

        List<Interaction> interactions = loadTrainingData();

        createIndexes(interactions);

        for (Interaction interaction : interactions) {
            userInteractions.computeIfAbsent(interaction.getUserId(), k -> new ArrayList<>()).add(interaction);
        }

        initializeModel();

        train(interactions);
    }

    public List<Double> getEventFeatures(Long eventId) {

        List<Double> features = new ArrayList<>();

        try {
            InputStream inputStream = getClass()
                    .getClassLoader()
                    .getResourceAsStream("recommender/events.csv");

            if (inputStream == null) {
                throw new RuntimeException("events.csv not found");
            }

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(inputStream)
            );

            reader.readLine();

            String line;

            while ((line = reader.readLine()) != null) {

                String[] values = line.split(",", -1);

                if (values.length < 109) {
                    continue;
                }

                if (values[0].isEmpty()) {
                    continue;
                }

                Long currentEventId;

                try {
                    currentEventId = Long.parseLong(values[0]);
                } catch (NumberFormatException e) {
                    continue;
                }

                if (!currentEventId.equals(eventId)) {
                    continue;
                }

                for (int i = 9; i <= 108; i++) {

                    if (values[i].isEmpty()) {
                        features.add(0.0);
                    } else {
                        features.add(Double.parseDouble(values[i]));
                    }
                }

                break;
            }

            reader.close();

        } catch (IOException e) {
            throw new RuntimeException(
                    "Error loading event features",
                    e
            );
        }

        return features;
    }

    public Map<Long, List<Double>> getEventFeatures(List<Long> eventIds) {

        Map<Long, List<Double>> eventFeaturesMap = new HashMap<>();

        if (eventIds == null || eventIds.isEmpty()) {
            return eventFeaturesMap;
        }

        for (Long eventId : eventIds) {
            eventFeaturesMap.put(eventId, new ArrayList<>());
        }

        try {
            InputStream inputStream = getClass()
                    .getClassLoader()
                    .getResourceAsStream("recommender/events.csv");

            if (inputStream == null) {
                throw new RuntimeException("events.csv not found");
            }

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(inputStream)
            );

            reader.readLine();

            String line;

            while ((line = reader.readLine()) != null) {

                String[] values = line.split(",", -1);

                if (values.length < 109) {
                    continue;
                }

                if (values[0].isEmpty()) {
                    continue;
                }

                Long currentEventId;

                try {
                    currentEventId = Long.parseLong(values[0]);
                } catch (NumberFormatException e) {
                    continue;
                }

                if (!eventFeaturesMap.containsKey(currentEventId)) {
                    continue;
                }

                List<Double> features = new ArrayList<>();

                for (int i = 9; i <= 108; i++) {

                    if (values[i].isEmpty()) {
                        features.add(0.0);
                    } else {
                        features.add(Double.parseDouble(values[i]));
                    }
                }

                eventFeaturesMap.put(currentEventId, features);

                boolean allFound = true;

                for (List<Double> eventFeatures : eventFeaturesMap.values()) {
                    if (eventFeatures.isEmpty()) {
                        allFound = false;
                        break;
                    }
                }

                if (allFound) {
                    break;
                }
            }

            reader.close();

        } catch (IOException e) {
            throw new RuntimeException(
                    "Error loading event features",
                    e
            );
        }

        return eventFeaturesMap;
    }

    public List<Interaction> getUserInteractions(Long userId) {
        return userInteractions.getOrDefault(userId, new ArrayList<>());
    }

    //  public buildInteractions(){}
}

