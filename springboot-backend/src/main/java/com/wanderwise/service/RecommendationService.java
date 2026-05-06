package com.wanderwise.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class RecommendationService {

    private final RestTemplate restTemplate = new RestTemplate();

    private final String[] hotelPhotos = {
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400"
    };

    private final String[] foodPhotos = {
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400"
    };

    // Search places using Nominatim (free, no API key)
    private List<Map> searchPlaces(String destination, String type) {
        try {
            String query = type.equals("hotel") ? "hotel in " + destination : "restaurant in " + destination;
            String url = "https://nominatim.openstreetmap.org/search?q=" +
                    query.replace(" ", "+") +
                    "&format=json&limit=10&addressdetails=1&extratags=1";

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "WanderWise-TravelApp/1.0");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, entity, List.class);
            return response.getBody() != null ? response.getBody() : new ArrayList<>();
        } catch (Exception e) {
            System.out.println("Nominatim error: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    private String buildAddress(Map address, String destination) {
        List<String> parts = new ArrayList<>();
        if (address.get("road") != null) parts.add((String) address.get("road"));
        if (address.get("suburb") != null) parts.add((String) address.get("suburb"));
        else if (address.get("county") != null) parts.add((String) address.get("county"));
        if (address.get("city") != null) parts.add((String) address.get("city"));
        else if (address.get("state_district") != null) parts.add((String) address.get("state_district"));
        if (address.get("postcode") != null) parts.add((String) address.get("postcode"));
        return parts.isEmpty() ? destination : String.join(", ", parts);
    }

    public List<Map<String, Object>> getHotels(String destination) {
        List<Map> places = searchPlaces(destination, "hotel");
        List<Map<String, Object>> hotels = new ArrayList<>();
        int idx = 0;
        for (Map place : places) {
            String name = (String) place.get("name");
            if (name == null || name.trim().isEmpty()) continue;
            Map address = (Map) place.get("address");
            Map<String, Object> hotel = new HashMap<>();
            hotel.put("name", name);
            hotel.put("address", address != null ? buildAddress(address, destination) : destination);
            hotel.put("rating", Math.round((3.5 + (idx % 5) * 0.3) * 10.0) / 10.0);
            hotel.put("priceLevel", (idx % 3) + 2);
            hotel.put("photo", hotelPhotos[idx % hotelPhotos.length]);
            hotel.put("coords", Map.of("lat", Double.parseDouble((String) place.get("lat")),
                                       "lng", Double.parseDouble((String) place.get("lon"))));
            hotel.put("placeId", "nom_" + place.get("place_id"));
            hotels.add(hotel);
            if (++idx >= 6) break;
        }
        return hotels;
    }

    public List<Map<String, Object>> getRestaurants(String destination) {
        List<Map> places = searchPlaces(destination, "restaurant");
        List<Map<String, Object>> restaurants = new ArrayList<>();
        int idx = 0;
        for (Map place : places) {
            String name = (String) place.get("name");
            if (name == null || name.trim().isEmpty()) continue;
            Map address = (Map) place.get("address");
            Map extratags = (Map) place.get("extratags");
            String cuisine = extratags != null && extratags.get("cuisine") != null
                    ? ((String) extratags.get("cuisine")).replace("_", " ").replace(";", ", ")
                    : "Restaurant";
            Map<String, Object> restaurant = new HashMap<>();
            restaurant.put("name", name);
            restaurant.put("address", address != null ? buildAddress(address, destination) : destination);
            restaurant.put("rating", Math.round((3.5 + (idx % 5) * 0.3) * 10.0) / 10.0);
            restaurant.put("cuisineType", cuisine);
            restaurant.put("photo", foodPhotos[idx % foodPhotos.length]);
            restaurant.put("coords", Map.of("lat", Double.parseDouble((String) place.get("lat")),
                                            "lng", Double.parseDouble((String) place.get("lon"))));
            restaurant.put("placeId", "nom_" + place.get("place_id"));
            restaurants.add(restaurant);
            if (++idx >= 6) break;
        }
        return restaurants;
    }
}
