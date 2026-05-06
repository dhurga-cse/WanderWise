package com.wanderwise.service;

import com.wanderwise.dto.TripDto;
import com.wanderwise.model.Trip;
import com.wanderwise.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Map;

@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    @Value("${unsplash.access.key}")
    private String unsplashKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<Trip> getAllTrips(Long userId) {
        return tripRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Trip getTripById(Long id, Long userId) {
        return tripRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));
    }

    public Trip createTrip(TripDto.CreateTripRequest request, Long userId) {
        String imageUrl = fetchUnsplashImage(request.getDestination());
        String itinerary = generateItinerary(request.getDestination(), request.getDays(), request.getTravelType());

        Trip trip = new Trip();
        trip.setUserId(userId);
        trip.setDestination(request.getDestination());
        trip.setDays(request.getDays());
        trip.setBudget(request.getBudget());
        trip.setTravelDate(request.getTravelDate());
        trip.setTravelType(request.getTravelType() != null ? request.getTravelType() : Trip.TravelType.Solo);
        trip.setItinerary(itinerary);
        trip.setImage(imageUrl);

        return tripRepository.save(trip);
    }

    public Trip updateTrip(Long id, Long userId, Map<String, Object> updates) {
        Trip trip = getTripById(id, userId);
        if (updates.containsKey("destination")) trip.setDestination((String) updates.get("destination"));
        if (updates.containsKey("days")) trip.setDays((Integer) updates.get("days"));
        if (updates.containsKey("budget")) trip.setBudget(((Number) updates.get("budget")).doubleValue());
        return tripRepository.save(trip);
    }

    public void deleteTrip(Long id, Long userId) {
        Trip trip = getTripById(id, userId);
        tripRepository.delete(trip);
    }

    // Fetch destination image from Unsplash
    private String fetchUnsplashImage(String destination) {
        try {
            String url = "https://api.unsplash.com/search/photos?query=" + destination + "&per_page=1&orientation=landscape";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Client-ID " + unsplashKey);
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            if (response.getBody() != null) {
                List results = (List) response.getBody().get("results");
                if (results != null && !results.isEmpty()) {
                    Map urls = (Map) ((Map) results.get(0)).get("urls");
                    return (String) urls.get("regular");
                }
            }
        } catch (Exception e) {
            System.out.println("Unsplash error: " + e.getMessage());
        }
        return "";
    }

    // Generate itinerary based on travel type
    private String generateItinerary(String destination, int days, Trip.TravelType travelType) {
        String[] activities;
        switch (travelType != null ? travelType : Trip.TravelType.Solo) {
            case Family:   activities = new String[]{"Visit theme parks", "Beach activities", "Family restaurants", "Cultural sites"}; break;
            case Friends:  activities = new String[]{"Adventure sports", "Nightlife", "Group tours", "Local experiences"}; break;
            case Couple:   activities = new String[]{"Romantic dinners", "Sunset views", "Spa & wellness", "Scenic walks"}; break;
            case Business: activities = new String[]{"Business meetings", "Networking events", "Conference centers", "Professional dining"}; break;
            default:       activities = new String[]{"Explore local markets", "Visit museums", "Try street food", "Photography walks"}; break;
        }

        StringBuilder itinerary = new StringBuilder(days + "-Day Trip to " + destination + "\n\n");
        for (int i = 1; i <= days; i++) {
            String activity = activities[(i - 1) % activities.length];
            itinerary.append("Day ").append(i).append(":\n");
            itinerary.append("- Morning: ").append(activity).append("\n");
            itinerary.append("- Afternoon: Explore ").append(destination).append(" attractions\n");
            itinerary.append("- Evening: Local cuisine experience\n\n");
        }
        return itinerary.toString();
    }
}
