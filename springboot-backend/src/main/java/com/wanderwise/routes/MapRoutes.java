package com.wanderwise.routes;

import com.wanderwise.helpers.MapHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/routes")
public class MapRoutes {

    @Autowired
    private MapHelper mapHelper;

    // Get optimized route between two places
    @PostMapping("/optimize")
    public ResponseEntity<?> getRoute(@RequestBody Map<String, Object> body) {
        try {
            String source = (String) body.get("source");
            String destination = (String) body.get("destination");

            Map<String, Object> sourceCoords = (Map<String, Object>) body.get("sourceCoords");
            Map<String, Object> destCoords = (Map<String, Object>) body.get("destCoords");

            return ResponseEntity.ok(mapHelper.getRoute(source, destination, sourceCoords, destCoords));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }
}
