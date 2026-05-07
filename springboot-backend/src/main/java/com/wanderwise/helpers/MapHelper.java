package com.wanderwise.helpers;

import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Component
public class MapHelper {

    private final RestTemplate http = new RestTemplate();

    // Convert city name to coordinates using Nominatim
    private double[] geocode(String location) {
        try {
            Thread.sleep(1000);
            String url = "https://nominatim.openstreetmap.org/search?q="
                    + location.replace(" ", "+") + "&format=json&limit=1";

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "WanderWise-TravelApp/1.0");
            HttpEntity<String> request = new HttpEntity<>(headers);

            ResponseEntity<List> response = http.exchange(url, HttpMethod.GET, request, List.class);
            if (response.getBody() != null && !response.getBody().isEmpty()) {
                Map place = (Map) response.getBody().get(0);
                return new double[]{
                    Double.parseDouble((String) place.get("lat")),
                    Double.parseDouble((String) place.get("lon"))
                };
            }
        } catch (Exception e) {
            System.out.println("Geocode error: " + e.getMessage());
        }
        return null;
    }

    // Haversine distance between two points
    private double distance(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    public Map<String, Object> getRoute(String source, String destination,
                                         Map<String, Object> sourceCoordsMap,
                                         Map<String, Object> destCoordsMap) throws Exception {
        // Use provided coords or geocode
        double[] srcCoords = sourceCoordsMap != null
                ? new double[]{((Number) sourceCoordsMap.get("lat")).doubleValue(),
                               ((Number) sourceCoordsMap.get("lng")).doubleValue()}
                : geocode(source);

        double[] dstCoords = destCoordsMap != null
                ? new double[]{((Number) destCoordsMap.get("lat")).doubleValue(),
                               ((Number) destCoordsMap.get("lng")).doubleValue()}
                : geocode(destination);

        if (srcCoords == null || dstCoords == null) {
            throw new Exception("Unable to find locations");
        }

        // Try OSRM for real road route
        try {
            String osrmUrl = String.format(
                "https://router.project-osrm.org/route/v1/driving/%f,%f;%f,%f?overview=full&geometries=geojson",
                srcCoords[1], srcCoords[0], dstCoords[1], dstCoords[0]
            );

            ResponseEntity<Map> response = http.getForEntity(osrmUrl, Map.class);

            if (response.getBody() != null && "Ok".equals(response.getBody().get("code"))) {
                List routes = (List) response.getBody().get("routes");
                if (routes != null && !routes.isEmpty()) {
                    Map route = (Map) routes.get(0);
                    Map geometry = (Map) route.get("geometry");
                    List<List<Double>> rawCoords = (List<List<Double>>) geometry.get("coordinates");

                    // Swap lng,lat to lat,lng for Leaflet
                    List<double[]> coordinates = new ArrayList<>();
                    for (List<Double> coord : rawCoords) {
                        coordinates.add(new double[]{coord.get(1), coord.get(0)});
                    }

                    double distKm = ((Number) route.get("distance")).doubleValue() / 1000;
                    int durationMin = (int) (((Number) route.get("duration")).doubleValue() / 60);

                    Map<String, Object> result = new HashMap<>();
                    result.put("coordinates", coordinates);
                    result.put("distance", String.format("%.2f", distKm));
                    result.put("duration", durationMin);
                    result.put("source", Map.of("name", source, "coords",
                            Map.of("lat", srcCoords[0], "lng", srcCoords[1])));
                    result.put("destination", Map.of("name", destination, "coords",
                            Map.of("lat", dstCoords[0], "lng", dstCoords[1])));
                    return result;
                }
            }
        } catch (Exception e) {
            System.out.println("OSRM error: " + e.getMessage());
        }

        // Fallback straight line
        double dist = distance(srcCoords[0], srcCoords[1], dstCoords[0], dstCoords[1]);
        List<double[]> coordinates = List.of(
                new double[]{srcCoords[0], srcCoords[1]},
                new double[]{dstCoords[0], dstCoords[1]}
        );

        Map<String, Object> result = new HashMap<>();
        result.put("coordinates", coordinates);
        result.put("distance", String.format("%.2f", dist));
        result.put("duration", (int) (dist / 60 * 60));
        result.put("source", Map.of("name", source, "coords",
                Map.of("lat", srcCoords[0], "lng", srcCoords[1])));
        result.put("destination", Map.of("name", destination, "coords",
                Map.of("lat", dstCoords[0], "lng", dstCoords[1])));
        return result;
    }
}
