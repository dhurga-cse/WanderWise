package com.wanderwise.controller;

import com.wanderwise.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @GetMapping("/hotels/{destination}")
    public ResponseEntity<List<Map<String, Object>>> getHotels(@PathVariable String destination) {
        return ResponseEntity.ok(recommendationService.getHotels(destination));
    }

    @GetMapping("/food/{destination}")
    public ResponseEntity<List<Map<String, Object>>> getRestaurants(@PathVariable String destination) {
        return ResponseEntity.ok(recommendationService.getRestaurants(destination));
    }
}
