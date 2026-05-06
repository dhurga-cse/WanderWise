package com.wanderwise.dto;

import com.wanderwise.model.Trip;
import java.time.LocalDate;

public class TripDto {

    public static class CreateTripRequest {
        private String destination;
        private Integer days;
        private Double budget;
        private LocalDate travelDate;
        private Trip.TravelType travelType;

        public String getDestination() { return destination; }
        public void setDestination(String destination) { this.destination = destination; }
        public Integer getDays() { return days; }
        public void setDays(Integer days) { this.days = days; }
        public Double getBudget() { return budget; }
        public void setBudget(Double budget) { this.budget = budget; }
        public LocalDate getTravelDate() { return travelDate; }
        public void setTravelDate(LocalDate travelDate) { this.travelDate = travelDate; }
        public Trip.TravelType getTravelType() { return travelType; }
        public void setTravelType(Trip.TravelType travelType) { this.travelType = travelType; }
    }
}
