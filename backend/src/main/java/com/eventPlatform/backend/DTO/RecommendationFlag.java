
package com.eventPlatform.backend.DTO;

import java.util.List;

public class RecommendationFlag {

    private List<Double> userProfile;
    private int flag;

    public RecommendationFlag(List<Double> userProfile, int flag) {
        this.userProfile = userProfile;
        this.flag = flag;
    }

    public List<Double> getUserProfile() {
        return userProfile;
    }

    public void setUserProfile(List<Double> userProfile) {
        this.userProfile = userProfile;
    }

    public int getFlag() {
        return flag;
    }

    public void setFlag(int flag) {
        this.flag = flag;
    }
}