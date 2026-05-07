package com.wanderwise.helpers;

import com.wanderwise.models.Trip;
import org.springframework.stereotype.Component;

@Component
public class ItineraryHelper {

    public String generate(String destination, int days, Trip.TravelType travelType) {
        String[] activities;

        switch (travelType != null ? travelType : Trip.TravelType.Solo) {
            case Family:   activities = new String[]{"Visit theme parks", "Beach activities", "Family restaurants", "Cultural sites"}; break;
            case Friends:  activities = new String[]{"Adventure sports", "Nightlife", "Group tours", "Local experiences"}; break;
            case Couple:   activities = new String[]{"Romantic dinners", "Sunset views", "Spa & wellness", "Scenic walks"}; break;
            case Business: activities = new String[]{"Business meetings", "Networking events", "Conference centers", "Professional dining"}; break;
            default:       activities = new String[]{"Explore local markets", "Visit museums", "Try street food", "Photography walks"}; break;
        }

        StringBuilder plan = new StringBuilder(days + "-Day Trip to " + destination + "\n\n");

        for (int i = 1; i <= days; i++) {
            String activity = activities[(i - 1) % activities.length];
            plan.append("Day ").append(i).append(":\n");
            plan.append("- Morning: ").append(activity).append("\n");
            plan.append("- Afternoon: Explore ").append(destination).append(" attractions\n");
            plan.append("- Evening: Local cuisine experience\n\n");
        }

        return plan.toString();
    }
}
