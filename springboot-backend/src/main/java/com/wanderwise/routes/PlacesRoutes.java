package com.wanderwise.routes;

import com.wanderwise.helpers.PlacesHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
public class PlacesRoutes {

    @Autowired
    private PlacesHelper placesHelper;

    // Get hotels near destination
    @GetMapping("/hotels/{destination}")
    public ResponseEntity<List<Map<String, Object>>> getHotels(@PathVariable String destination) {
        return ResponseEntity.ok(placesHelper.findHotels(destination));
    }

    // Get restaurants near destination
    @GetMapping("/food/{destination}")
    public ResponseEntity<List<Map<String, Object>>> getRestaurants(@PathVariable String destination) {
        return ResponseEntity.ok(placesHelper.findRestaurants(destination));
    }
}
