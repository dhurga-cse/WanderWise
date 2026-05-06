package com.wanderwise.controller;

import com.wanderwise.dto.RouteDto;
import com.wanderwise.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    @Autowired
    private RouteService routeService;

    @PostMapping("/optimize")
    public ResponseEntity<?> optimizeRoute(@RequestBody RouteDto.RouteRequest request) {
        try {
            return ResponseEntity.ok(routeService.getOptimizedRoute(request));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }
}
