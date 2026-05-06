package com.wanderwise.service;

import com.wanderwise.dto.RouteDto;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class RouteService {

    private final RestTemplate restTemplate = new RestTemplate();

    // Geocode location using Nominatim
    private RouteDto.Coords geocode(String location) {
        try {
            Thread.sleep(1000); // Respect rate limits
            String url = "https://nominatim.openstreetmap.org/search?q=" +
                    location.replace(" ", "+") + "&format=json&limit=1&addressdetails=1";
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "WanderWise-TravelApp/1.0");
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, entity, List.class);
            if (response.getBody() != null && !response.getBody().isEmpty()) {
                Map place = (Map) response.getBody().get(0);
                return new RouteDto.Coords(
                        Double.parseDouble((String) place.get("lat")),
                        Double.parseDouble((String) place.get("lon"))
                );
            }
        } catch (Exception e) {
            System.out.println("Geocoding error: " + e.getMessage());
        }
        return null;
    }

    // Calculate Haversine distance
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    public RouteDto.RouteResponse getOptimizedRoute(RouteDto.RouteRequest request) {
        // Use provided coords or geocode
        RouteDto.Coords sourceCoords = request.getSourceCoords() != null
                ? request.getSourceCoords() : geocode(request.getSource());
        RouteDto.Coords destCoords = request.getDestCoords() != null
                ? request.getDestCoords() : geocode(request.getDestination());

        if (sourceCoords == null || destCoords == null) {
            throw new RuntimeException("Unable to find locations");
        }

        // Try OSRM for real road route
        try {
            String osrmUrl = String.format(
                "https://router.project-osrm.org/route/v1/driving/%f,%f;%f,%f?overview=full&geometries=geojson",
                sourceCoords.getLng(), sourceCoords.getLat(),
                destCoords.getLng(), destCoords.getLat()
            );
            ResponseEntity<Map> response = restTemplate.getForEntity(osrmUrl, Map.class);
            if (response.getBody() != null && "Ok".equals(response.getBody().get("code"))) {
                List routes = (List) response.getBody().get("routes");
                if (routes != null && !routes.isEmpty()) {
                    Map route = (Map) routes.get(0);
                    Map geometry = (Map) route.get("geometry");
                    List<List<Double>> rawCoords = (List<List<Double>>) geometry.get("coordinates");

                    // Convert [lng, lat] to [lat, lng] for Leaflet
                    List<double[]> coordinates = new ArrayList<>();
                    for (List<Double> coord : rawCoords) {
                        coordinates.add(new double[]{coord.get(1), coord.get(0)});
                    }

                    double distanceKm = ((Number) route.get("distance")).doubleValue() / 1000;
                    int durationMin = (int) (((Number) route.get("duration")).doubleValue() / 60);

                    return new RouteDto.RouteResponse(
                            coordinates,
                            String.format("%.2f", distanceKm),
                            durationMin,
                            new RouteDto.LocationInfo(request.getSource(), sourceCoords),
                            new RouteDto.LocationInfo(request.getDestination(), destCoords)
                    );
                }
            }
        } catch (Exception e) {
            System.out.println("OSRM error: " + e.getMessage());
        }

        // Fallback: straight line
        double distance = calculateDistance(sourceCoords.getLat(), sourceCoords.getLng(),
                destCoords.getLat(), destCoords.getLng());
        List<double[]> coordinates = List.of(
                new double[]{sourceCoords.getLat(), sourceCoords.getLng()},
                new double[]{destCoords.getLat(), destCoords.getLng()}
        );
        return new RouteDto.RouteResponse(
                coordinates,
                String.format("%.2f", distance),
                (int) (distance / 60 * 60),
                new RouteDto.LocationInfo(request.getSource(), sourceCoords),
                new RouteDto.LocationInfo(request.getDestination(), destCoords)
        );
    }
}
