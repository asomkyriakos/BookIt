package com.eventPlatform.backend.controller;

import com.eventPlatform.backend.DTO.RecommendationResponse;
import com.eventPlatform.backend.service.RecommendationService;
import com.eventPlatform.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/recommendation")
public class RecommendationController {
    private final UserService userService;
    private final RecommendationService recommendationService;
    public RecommendationController(UserService userService, RecommendationService recommendationService) {
        this.userService = userService;
        this.recommendationService = recommendationService;
    }

    @GetMapping("/recommendations")
    public List<RecommendationResponse> getRecommendations(Authentication authentication) {
        if(authentication == null || !authentication.isAuthenticated()){
            throw new RuntimeException("Not logged in");
        }

        Long userId = Long.parseLong(authentication.getName());

        return recommendationService.getRecommendations(userId);
    }
}
