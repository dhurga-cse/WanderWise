package com.wanderwise.controller;

import com.wanderwise.dto.TripDto;
import com.wanderwise.model.Trip;
import com.wanderwise.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    @Autowired
    private TripService tripService;

    @GetMapping
    public ResponseEntity<List<Trip>> getAllTrips(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(tripService.getAllTrips(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTrip(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(tripService.getTripById(id, userId));
    }

    @PostMapping
    public ResponseEntity<Trip> createTrip(@RequestBody TripDto.CreateTripRequest request, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.status(201).body(tripService.createTrip(request, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Trip> updateTrip(@PathVariable Long id,
                                           @RequestBody Map<String, Object> updates,
                                           Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(tripService.updateTrip(id, userId, updates));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTrip(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        tripService.deleteTrip(id, userId);
        return ResponseEntity.ok(Map.of("message", "Trip deleted successfully"));
    }
}
