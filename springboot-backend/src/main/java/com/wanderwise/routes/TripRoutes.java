package com.wanderwise.routes;

import com.wanderwise.database.TripTable;
import com.wanderwise.helpers.UnsplashHelper;
import com.wanderwise.helpers.ItineraryHelper;
import com.wanderwise.models.Trip;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips")
public class TripRoutes {

    @Autowired
    private TripTable tripTable;

    @Autowired
    private UnsplashHelper unsplashHelper;

    @Autowired
    private ItineraryHelper itineraryHelper;

    // Get all trips for logged in user
    @GetMapping
    public ResponseEntity<List<Trip>> getAllTrips(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(tripTable.findByUserIdOrderByCreatedAtDesc(userId));
    }

    // Get one trip by id
    @GetMapping("/{id}")
    public ResponseEntity<?> getTrip(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        Trip trip = tripTable.findByIdAndUserId(id, userId).orElse(null);
        if (trip == null) return ResponseEntity.status(404).body(Map.of("message", "Trip not found"));
        return ResponseEntity.ok(trip);
    }

    // Create new trip
    @PostMapping
    public ResponseEntity<?> createTrip(@RequestBody Map<String, Object> body, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();

        String destination = (String) body.get("destination");
        Integer days = (Integer) body.get("days");
        Double budget = ((Number) body.get("budget")).doubleValue();
        LocalDate travelDate = LocalDate.parse((String) body.get("travelDate"));
        String travelTypeStr = (String) body.get("travelType");
        Trip.TravelType travelType = travelTypeStr != null
                ? Trip.TravelType.valueOf(travelTypeStr) : Trip.TravelType.Solo;

        // Fetch image from Unsplash
        String image = unsplashHelper.getImage(destination);

        // Generate itinerary
        String itinerary = itineraryHelper.generate(destination, days, travelType);

        Trip trip = new Trip();
        trip.setUserId(userId);
        trip.setDestination(destination);
        trip.setDays(days);
        trip.setBudget(budget);
        trip.setTravelDate(travelDate);
        trip.setTravelType(travelType);
        trip.setItinerary(itinerary);
        trip.setImage(image);

        return ResponseEntity.status(201).body(tripTable.save(trip));
    }

    // Update trip
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTrip(@PathVariable Long id,
                                        @RequestBody Map<String, Object> body,
                                        Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        Trip trip = tripTable.findByIdAndUserId(id, userId).orElse(null);
        if (trip == null) return ResponseEntity.status(404).body(Map.of("message", "Trip not found"));

        if (body.containsKey("destination")) trip.setDestination((String) body.get("destination"));
        if (body.containsKey("days")) trip.setDays((Integer) body.get("days"));
        if (body.containsKey("budget")) trip.setBudget(((Number) body.get("budget")).doubleValue());

        return ResponseEntity.ok(tripTable.save(trip));
    }

    // Delete trip
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        Trip trip = tripTable.findByIdAndUserId(id, userId).orElse(null);
        if (trip == null) return ResponseEntity.status(404).body(Map.of("message", "Trip not found"));
        tripTable.delete(trip);
        return ResponseEntity.ok(Map.of("message", "Trip deleted successfully"));
    }
}
